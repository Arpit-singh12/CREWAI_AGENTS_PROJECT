from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .client import PyObjectId

class Attendance(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    client_id: PyObjectId
    class_id: PyObjectId
    course_id: PyObjectId
    date: datetime
    status: str = Field(default="present", pattern=r'^(present|absent|cancelled|makeup)$')
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = None
    instructor_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AttendanceCreate(BaseModel):
    client_id: str
    class_id: str
    course_id: str
    date: datetime
    status: Optional[str] = Field(default="present", pattern=r'^(present|absent|cancelled|makeup)$')
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = None
    instructor_notes: Optional[str] = None