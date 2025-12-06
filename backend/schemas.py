from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class SignupIn(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginIn(BaseModel):
    username: str
    password: str

class ProfileOut(BaseModel):
    first_name: str
    last_name: Optional[str]
    email: EmailStr
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[int]
    weight_kg: Optional[int]
    bmi: Optional[str]
    diet_pref: Optional[str]
    diet_type: Optional[str]
    lifestyle: Optional[str]
    workout_routine: Optional[str]
    daily_steps_target: Optional[int]
    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[int]
    weight_kg: Optional[int]
    diet_pref: Optional[str]
    diet_type: Optional[str]
    lifestyle: Optional[str]
    workout_routine: Optional[str]
    daily_steps_target: Optional[int]

class DietRequest(BaseModel):
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[int]
    weight_kg: Optional[int]
    activity_level: Optional[str]
    goal: str
    preferences: Optional[str]

class DietPlanOut(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    created_at: datetime
    class Config:
        orm_mode = True

class ChatIn(BaseModel):
    message: str
