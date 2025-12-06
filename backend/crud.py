from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, data: schemas.SignupIn):
    hashed = auth.hash_password(data.password)
    user = models.User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_profile(db: Session, user: models.User, upd: schemas.ProfileUpdate):
    for k, v in upd.dict(exclude_unset=True).items():
        setattr(user, k, v)
    # optional: compute BMI
    if user.height_cm and user.weight_kg:
        try:
            h_m = (user.height_cm / 100.0)
            bmi = user.weight_kg / (h_m*h_m)
            user.bmi = f"{bmi:.1f}"
        except:
            user.bmi = None
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_email(db, username)
    if not user:
        return None
    if not auth.verify_password(password, user.password_hash):
        return None
    return user

def save_plan(db: Session, user_id: int, title: str, content: str):
    plan = models.DietPlan(user_id=user_id, title=title, content=content)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

def list_plans(db: Session, user_id: int):
    return db.query(models.DietPlan).filter(models.DietPlan.user_id == user_id).order_by(models.DietPlan.created_at.desc()).all()

def save_chat(db: Session, user_id: int, role: str, content: str):
    msg = models.ChatMessage(user_id=user_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
