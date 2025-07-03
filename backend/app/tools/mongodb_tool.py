from crewai.tools import BaseTool  # or from crewai.tools import BaseTool if that's where it's available
from pydantic import PrivateAttr
from typing import Dict, Any
import aiohttp
import asyncio
from app.core.config import settings
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime

class MongoDBTool(BaseTool):
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
    
    # Specialized query methods
    async def find_client_by_email(self, email: str) -> Dict[str, Any]:
        """Find a client by email address"""
        return await self._execute_query("find_one", "clients", {"email": email})
    
    async def find_client_by_phone(self, phone: str) -> Dict[str, Any]:
        """Find a client by phone number"""
        return await self._execute_query("find_one", "clients", {"phone": phone})
    
    async def get_order_by_id(self, order_id: str) -> Dict[str, Any]:
        """Get order details by ID"""
        return await self._execute_query("find_one", "orders", {"_id": ObjectId(order_id)})
    
    async def get_orders_by_client(self, client_id: str) -> Dict[str, Any]:
        """Get all orders for a specific client"""
        return await self._execute_query("find", "orders", {"client_id": ObjectId(client_id)})
    
    async def get_pending_payments(self) -> Dict[str, Any]:
        """Get all pending payments"""
        return await self._execute_query("find", "payments", {"status": "pending"})
    
    async def get_revenue_metrics(self, start_date: datetime = None, end_date: datetime = None) -> Dict[str, Any]:
        """Calculate revenue metrics for a date range"""
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        if not end_date:
            end_date = datetime.utcnow()
        
        pipeline = [
            {
                "$match": {
                    "status": "completed",
                    "payment_date": {"$gte": start_date, "$lte": end_date}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "total_revenue": {"$sum": "$amount"},
                    "total_transactions": {"$sum": 1},
                    "average_transaction": {"$avg": "$amount"}
                }
            }
        ]
        return await self._execute_query("aggregate", "payments", aggregation_pipeline=pipeline)
    
    async def get_client_analytics(self) -> Dict[str, Any]:
        """Get comprehensive client analytics"""
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        return await self._execute_query("aggregate", "clients", aggregation_pipeline=pipeline)
    
    async def get_course_performance(self) -> Dict[str, Any]:
        """Get course performance metrics"""
        pipeline = [
            {
                "$lookup": {
                    "from": "orders",
                    "localField": "_id",
                    "foreignField": "course_id",
                    "as": "enrollments"
                }
            },
            {
                "$project": {
                    "name": 1,
                    "instructor": 1,
                    "enrollment_count": {"$size": "$enrollments"},
                    "total_revenue": {
                        "$sum": {
                            "$map": {
                                "input": "$enrollments",
                                "as": "order",
                                "in": "$$order.final_amount"
                            }
                        }
                    }
                }
            },
            {"$sort": {"enrollment_count": -1}}
        ]
        return await self._execute_query("aggregate", "courses", aggregation_pipeline=pipeline)
    
    async def get_attendance_stats(self, course_id: str = None) -> Dict[str, Any]:
        """Get attendance statistics"""
        match_filter = {}
        if course_id:
            match_filter["course_id"] = ObjectId(course_id)
        
        pipeline = [
            {"$match": match_filter},
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        return await self._execute_query("aggregate", "attendance", aggregation_pipeline=pipeline)