from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from bson import ObjectId
from .client import PyObjectId

class Course(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    instructor: str = Field(..., min_length=2, max_length=100)
    category: str = Field(default="fitness")
    level: str = Field(default="beginner", pattern=r'^(beginner|intermediate|advanced)$')
    duration_minutes: int = Field(..., gt=0, le=240)
    capacity: int = Field(default=20, gt=0)
    price_per_session: float = Field(..., gt=0)
    package_options: List[Dict[str, Any]] = Field(default_factory=list)
    schedule: List[Dict[str, Any]] = Field(default_factory=list)  # Day, time, etc.
    requirements: List[str] = Field(default_factory=list)
    status: str = Field(default="active", pattern=r'^(active|inactive|coming_soon)$')
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CourseCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    instructor: str = Field(..., min_length=2, max_length=100)
    category: Optional[str] = Field(default="fitness")
    level: Optional[str] = Field(default="beginner", pattern=r'^(beginner|intermediate|advanced)$')
    duration_minutes: int = Field(..., gt=0, le=240)
    capacity: Optional[int] = Field(default=20, gt=0)
    price_per_session: float = Field(..., gt=0)
    package_options: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    schedule: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    requirements: Optional[List[str]] = Field(default_factory=list)
    tags: Optional[List[str]] = Field(default_factory=list)

class CourseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    instructor: Optional[str] = Field(None, min_length=2, max_length=100)
    level: Optional[str] = Field(None, pattern=r'^(beginner|intermediate|advanced)$')
    duration_minutes: Optional[int] = Field(None, gt=0, le=240)
    capacity: Optional[int] = Field(None, gt=0)
    price_per_session: Optional[float] = Field(None, gt=0)
    status: Optional[str] = Field(None, pattern=r'^(active|inactive|coming_soon)$')