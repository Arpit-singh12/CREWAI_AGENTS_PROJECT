from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from .client import PyObjectId

class Payment(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    order_id: PyObjectId
    client_id: PyObjectId
    amount: float = Field(..., gt=0)
    currency: str = Field(default="INR")
    payment_method: str = Field(..., pattern=r'^(cash|card|upi|bank_transfer|online)$')
    transaction_id: Optional[str] = None
    gateway_response: Optional[Dict[str, Any]] = None
    status: str = Field(default="pending", pattern=r'^(pending|completed|failed|refunded)$')
    payment_date: datetime = Field(default_factory=datetime.utcnow)
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PaymentCreate(BaseModel):
    order_id: str
    amount: float = Field(..., gt=0)
    payment_method: str = Field(..., pattern=r'^(cash|card|upi|bank_transfer|online)$')
    transaction_id: Optional[str] = None
    notes: Optional[str] = None