from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from .client import PyObjectId

class Order(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    order_number: str = Field(..., pattern=r'^ORD-\d{6}$')
    client_id: PyObjectId
    course_id: PyObjectId
    service_name: str
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR")
    status: str = Field(default="pending", pattern=r'^(pending|confirmed|cancelled|refunded)$')
    payment_status: str = Field(default="unpaid", pattern=r'^(unpaid|paid|partial|refunded)$')
    payment_method: Optional[str] = None
    discount_applied: float = Field(default=0.0, ge=0)
    final_amount: float = Field(..., gt=0)
    notes: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class OrderCreate(BaseModel):
    client_id: str
    course_id: str
    service_name: str
    amount: float = Field(..., gt=0)
    discount_applied: Optional[float] = Field(default=0.0, ge=0)
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class OrderUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern=r'^(pending|confirmed|cancelled|refunded)$')
    payment_status: Optional[str] = Field(None, pattern=r'^(unpaid|paid|partial|refunded)$')
    payment_method: Optional[str] = None
    notes: Optional[str] = None