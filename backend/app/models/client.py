from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class Client(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?1?\d{9,15}$')
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    status: str = Field(default="active", pattern=r'^(active|inactive|suspended)$')
    enrolled_courses: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ClientCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?1?\d{9,15}$')
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None

class ClientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    date_of_birth: Optional[datetime] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    status: Optional[str] = Field(None, pattern=r'^(active|inactive|suspended)$')