from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # basic profile fields
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height_cm = Column(Integer, nullable=True)
    weight_kg = Column(Integer, nullable=True)
    bmi = Column(String, nullable=True)
    diet_pref = Column(String, nullable=True)
    diet_type = Column(String, nullable=True)
    lifestyle = Column(String, nullable=True)
    workout_routine = Column(String, nullable=True)
    daily_steps_target = Column(Integer, nullable=True)

    plans = relationship("DietPlan", back_populates="user", cascade="all, delete-orphan")
    chats = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")


class DietPlan(Base):
    __tablename__ = "diet_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="Personalized Plan")
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="plans")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="user")  # user or assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chats")
