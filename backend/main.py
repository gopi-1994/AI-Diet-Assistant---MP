import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from . import models, schemas, crud, auth
import openai

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aidiet.db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Diet Assistant")

# CORS for frontend dev; restrict in production
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    try:
        payload = auth.decode_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/auth/signup", response_model=schemas.ProfileOut)
def signup(payload: schemas.SignupIn, db=Depends(get_db)):
    if crud.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, payload)
    return user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/profile/me", response_model=schemas.ProfileOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/profile/me", response_model=schemas.ProfileOut)
def update_profile(upd: schemas.ProfileUpdate, db=Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user = crud.update_profile(db, current_user, upd)
    return user

@app.post("/diet/generate", response_model=schemas.DietPlanOut)
def generate_diet(req: schemas.DietRequest, db=Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Build prompt
    prompt = (
        f"Act as a certified dietician. Create a short, structured {req.goal} meal plan for a person "
        f"{req.age or ''} years, {req.gender or ''}, height {req.height_cm or 'N/A'} cm, weight {req.weight_kg or 'N/A'} kg. "
        f"Activity level: {req.activity_level or 'moderate'}. Preferences: {req.preferences or 'none'}. "
        "Output: breakfast, lunch, dinner, snacks, total calories approx, macronutrient split, hydration & simple workout guidance."
    )
    plan_text = None
    if OPENAI_API_KEY:
        try:
            resp = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful, concise dietician."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=700,
                temperature=0.6
            )
            plan_text = resp["choices"][0]["message"]["content"].strip()
        except Exception as e:
            plan_text = f"(OpenAI error) Unable to generate: {e}\n\nFallback sample plan: Breakfast - Oatmeal..."
    else:
        plan_text = "OpenAI API key not configured. Here is a fallback sample plan: Breakfast - Oats..."

    plan = crud.save_plan(db, current_user.id, f"{req.goal.title()} Plan", plan_text)
    return plan

@app.get("/diet/myplans", response_model=list[schemas.DietPlanOut])
def my_plans(db=Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.list_plans(db, current_user.id)

@app.post("/chat/ask")
def chat_message(payload: schemas.ChatIn, db=Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # store user message
    crud.save_chat(db, current_user.id, "user", payload.message)
    # forward to OpenAI
    if OPENAI_API_KEY:
        try:
            messages = [
                {"role": "system", "content": "You are an AI health coach giving practical diet and habit advice."},
                {"role": "user", "content": payload.message}
            ]
            resp = openai.ChatCompletion.create(model="gpt-4", messages=messages, max_tokens=500, temperature=0.7)
            answer = resp["choices"][0]["message"]["content"].strip()
        except Exception as e:
            answer = f"Error contacting AI: {e}"
    else:
        answer = "OpenAI not configured. Provide your question and we'll answer later."
    crud.save_chat(db, current_user.id, "assistant", answer)
    return {"answer": answer}
