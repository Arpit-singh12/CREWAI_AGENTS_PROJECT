from crewai.tools import BaseTool  # or from crewai.tools import BaseTool if that's where it's available
from pydantic import PrivateAttr
from typing import Dict, Any
import aiohttp
import asyncio
from app.core.config import settings
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime

class ExternalAPITool(BaseTool):
    name: str = "External API Integration Tool"
    description: str = """
    A tool for integrating with external APIs including payment processors, email services, SMS services, and CRM systems.
    Supports creating orders, sending notifications, processing payments, and managing client enquiries.
    """

    _db: Any = PrivateAttr(default=None)

    def _get_db(self):
        if not self._db:
            self._db = get_database()
        return self._db

    def _run(self, action: str, **kwargs) -> str:
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                result = loop.run_until_complete(self._execute_action(action, **kwargs))
                return str(result)
            finally:
                loop.close()
        except Exception as e:
            return f"External API error: {str(e)}"

    async def _execute_action(self, action: str, **kwargs) -> Dict[str, Any]:
        if action == "create_order":
            return await self._create_order(**kwargs)
        elif action == "create_client_enquiry":
            return await self._create_client_enquiry(**kwargs)
        elif action == "send_email":
            return await self._send_email(**kwargs)
        elif action == "send_sms":
            return await self._send_sms(**kwargs)
        elif action == "process_payment":
            return await self._process_payment(**kwargs)
        else:
            raise ValueError(f"Unsupported action: {action}")

    # ...rest of your async methods (_create_order, _create_client_enquiry, etc.) remain unchanged...
    
    async def _create_order(self, client_name: str, client_email: str, service_name: str, amount: float, **kwargs) -> Dict[str, Any]:
        """Create a new order in the system"""
        try:
            db = self._get_db()
            
            # Find or create client
            client = await db.clients.find_one({"email": client_email})
            if not client:
                # Create new client
                client_data = {
                    "name": client_name,
                    "email": client_email,
                    "phone": kwargs.get("phone", ""),
                    "status": "active",
                    "enrolled_courses": [],
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                client_result = await db.clients.insert_one(client_data)
                client_id = client_result.inserted_id
            else:
                client_id = client["_id"]
            
            # Find course
            course = await db.courses.find_one({"name": {"$regex": service_name, "$options": "i"}})
            if not course:
                return {"status": "error", "message": f"Course '{service_name}' not found"}
            
            # Generate order number
            order_count = await db.orders.count_documents({})
            order_number = f"ORD-{order_count + 1:06d}"
            
            # Create order
            order_data = {
                "order_number": order_number,
                "client_id": client_id,
                "course_id": course["_id"],
                "service_name": service_name,
                "amount": amount,
                "currency": "INR",
                "status": "pending",
                "payment_status": "unpaid",
                "discount_applied": kwargs.get("discount", 0.0),
                "final_amount": amount - kwargs.get("discount", 0.0),
                "notes": kwargs.get("notes", ""),
                "metadata": kwargs.get("metadata", {}),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            order_result = await db.orders.insert_one(order_data)
            
            # Send confirmation email (mock)
            await self._send_email(
                to_email=client_email,
                subject=f"Order Confirmation - {order_number}",
                content=f"Your order for {service_name} has been created successfully."
            )
            
            return {
                "status": "success",
                "message": "Order created successfully",
                "order_id": str(order_result.inserted_id),
                "order_number": order_number,
                "client_id": str(client_id),
                "amount": order_data["final_amount"]
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _create_client_enquiry(self, name: str, email: str, phone: str, 
                                   enquiry_type: str, message: str, **kwargs) -> Dict[str, Any]:
        """Create a new client enquiry"""
        try:
            db = self._get_db()
            
            enquiry_data = {
                "name": name,
                "email": email,
                "phone": phone,
                "enquiry_type": enquiry_type,
                "message": message,
                "status": "new",
                "source": kwargs.get("source", "website"),
                "assigned_to": None,
                "follow_up_date": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await db.enquiries.insert_one(enquiry_data)
            
            # Send acknowledgment email
            await self._send_email(
                to_email=email,
                subject="Thank you for your enquiry",
                content=f"Hi {name}, we have received your enquiry and will get back to you soon."
            )
            
            # Notify staff (mock)
            await self._send_email(
                to_email="staff@fitness.com",
                subject="New Client Enquiry",
                content=f"New enquiry from {name} ({email}) about {enquiry_type}"
            )
            
            return {
                "status": "success",
                "message": "Enquiry created successfully",
                "enquiry_id": str(result.inserted_id)
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _send_email(self, to_email: str, subject: str, content: str, **kwargs) -> Dict[str, Any]:
        """Send email using external email service (mock implementation)"""
        try:
            # In a real implementation, you would integrate with SendGrid, Mailgun, etc.
            # For now, we'll just log the email
            print(f"EMAIL: To: {to_email}, Subject: {subject}, Content: {content}")
            
            return {
                "status": "success",
                "message": "Email sent successfully",
                "email_id": f"mock_email_{datetime.utcnow().timestamp()}"
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _send_sms(self, to_phone: str, message: str, **kwargs) -> Dict[str, Any]:
        """Send SMS using external SMS service (mock implementation)"""
        try:
            # In a real implementation, you would integrate with Twilio, etc.
            print(f"SMS: To: {to_phone}, Message: {message}")
            
            return {
                "status": "success",
                "message": "SMS sent successfully",
                "sms_id": f"mock_sms_{datetime.utcnow().timestamp()}"
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def _process_payment(self, order_id: str, amount: float, payment_method: str, **kwargs) -> Dict[str, Any]:
        """Process payment using external payment gateway (mock implementation)"""
        try:
            db = self._get_db()
            
            # In a real implementation, you would integrate with Stripe, Razorpay, etc.
            transaction_id = f"txn_{datetime.utcnow().timestamp()}"
            
            # Create payment record
            payment_data = {
                "order_id": ObjectId(order_id),
                "amount": amount,
                "currency": "INR",
                "payment_method": payment_method,
                "transaction_id": transaction_id,
                "status": "completed",
                "payment_date": datetime.utcnow(),
                "gateway_response": {"mock": True, "status": "success"},
                "created_at": datetime.utcnow()
            }
            
            await db.payments.insert_one(payment_data)
            
            # Update order status
            await db.orders.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "payment_status": "paid",
                        "status": "confirmed",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return {
                "status": "success",
                "message": "Payment processed successfully",
                "transaction_id": transaction_id,
                "amount": amount
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}