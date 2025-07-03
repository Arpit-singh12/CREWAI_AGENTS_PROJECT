from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
from app.agents.support_agent import SupportAgent
from app.agents.dashboard_agent import DashboardAgent
from app.core.database import get_database
from app.models import *
from datetime import datetime
from bson import ObjectId

router = APIRouter()

# Initialize agents
support_agent = SupportAgent()
dashboard_agent = DashboardAgent()

# Agent endpoints
@router.post("/agents/support/query")
async def query_support_agent(query_data: Dict[str, Any]):
    """Send a query to the Support Agent"""
    query = query_data.get("query", "")
    context = query_data.get("context", {})
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    if len(query) > 1000:  # Limit query length
        raise HTTPException(status_code=400, detail="Query too long")
    
    result = await support_agent.process_query(query, context)
    return result

@router.post("/agents/dashboard/query") 
async def query_dashboard_agent(query_data: Dict[str, Any]):
    """Send a query to the Dashboard Agent"""
    query = query_data.get("query", "")
    context = query_data.get("context", {})
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    if len(query) > 1000:  # Limit query length
        raise HTTPException(status_code=400, detail="Query too long")
    
    result = await dashboard_agent.process_query(query, context)
    return result

@router.get("/agents/status")
async def get_agent_status():
    """Get status and capabilities of both agents"""
    return {
        "support_agent": {
            "status": "active",
            "capabilities": support_agent.get_capabilities()
        },
        "dashboard_agent": {
            "status": "active", 
            "capabilities": dashboard_agent.get_capabilities()
        }
    }

# Client management endpoints
@router.get("/clients")
async def list_clients(skip: int = 0, limit: int = 100, status: Optional[str] = None):
    """List all clients with optional filtering"""
    db = get_database()
    
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    clients = await db.clients.find(filter_query).skip(skip).limit(limit).to_list(length=limit)
    total = await db.clients.count_documents(filter_query)
    
    return {
        "clients": clients,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.post("/clients")
async def create_client(client_data: ClientCreate):
    """Create a new client"""
    db = get_database()
    
    # Check if email already exists
    existing_client = await db.clients.find_one({"email": client_data.email})
    if existing_client:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    client_dict = client_data.dict()
    client_dict["created_at"] = datetime.utcnow()
    client_dict["updated_at"] = datetime.utcnow()
    client_dict["status"] = "active"
    client_dict["enrolled_courses"] = []
    
    result = await db.clients.insert_one(client_dict)
    
    return {
        "message": "Client created successfully",
        "client_id": str(result.inserted_id)
    }

@router.get("/clients/{client_id}")
async def get_client(client_id: str):
    """Get client details by ID"""
    db = get_database()
    
    try:
        client = await db.clients.find_one({"_id": ObjectId(client_id)})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Get client's orders and payments
        orders = await db.orders.find({"client_id": ObjectId(client_id)}).to_list(length=None)
        payments = await db.payments.find({"client_id": ObjectId(client_id)}).to_list(length=None)
        
        return {
            "client": client,
            "orders": orders,
            "payments": payments
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid client ID")

# Order management endpoints
@router.get("/orders")
async def list_orders(skip: int = 0, limit: int = 100, status: Optional[str] = None):
    """List all orders with optional filtering"""
    db = get_database()
    
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    orders = await db.orders.find(filter_query).skip(skip).limit(limit).to_list(length=limit)
    total = await db.orders.count_documents(filter_query)
    
    return {
        "orders": orders,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.post("/orders")
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    db = get_database()
    
    try:
        # Validate client exists
        client = await db.clients.find_one({"_id": ObjectId(order_data.client_id)})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Validate course exists
        course = await db.courses.find_one({"_id": ObjectId(order_data.course_id)})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Generate order number
        order_count = await db.orders.count_documents({})
        order_number = f"ORD-{order_count + 1:06d}"
        
        order_dict = order_data.dict()
        order_dict["order_number"] = order_number
        order_dict["client_id"] = ObjectId(order_data.client_id)
        order_dict["course_id"] = ObjectId(order_data.course_id)
        order_dict["currency"] = "INR"
        order_dict["status"] = "pending"
        order_dict["payment_status"] = "unpaid"
        order_dict["final_amount"] = order_data.amount - order_data.discount_applied
        order_dict["created_at"] = datetime.utcnow()
        order_dict["updated_at"] = datetime.utcnow()
        
        result = await db.orders.insert_one(order_dict)
        
        return {
            "message": "Order created successfully",
            "order_id": str(result.inserted_id),
            "order_number": order_number
        }
        
    except Exception as e:
        if "not found" in str(e):
            raise e
        raise HTTPException(status_code=400, detail="Invalid order data")

# Analytics endpoints
@router.get("/analytics/revenue")
async def get_revenue_analytics():
    """Get revenue analytics"""
    db = get_database()
    
    # Monthly revenue
    pipeline = [
        {
            "$match": {
                "status": "completed",
                "payment_date": {
                    "$gte": datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                }
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
    
    revenue_data = await db.payments.aggregate(pipeline).to_list(length=None)
    
    # Outstanding payments
    outstanding_pipeline = [
        {
            "$match": {"status": "pending"}
        },
        {
            "$group": {
                "_id": None,
                "total_outstanding": {"$sum": "$amount"},
                "count": {"$sum": 1}
            }
        }
    ]
    
    outstanding_data = await db.payments.aggregate(outstanding_pipeline).to_list(length=None)
    
    return {
        "current_month_revenue": revenue_data[0] if revenue_data else {"total_revenue": 0, "total_transactions": 0, "average_transaction": 0},
        "outstanding_payments": outstanding_data[0] if outstanding_data else {"total_outstanding": 0, "count": 0}
    }

@router.get("/analytics/clients")
async def get_client_analytics():
    """Get client analytics"""
    db = get_database()
    
    # Client status distribution
    pipeline = [
        {
            "$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }
        }
    ]
    
    status_data = await db.clients.aggregate(pipeline).to_list(length=None)
    
    # New clients this month
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    new_clients_count = await db.clients.count_documents({
        "created_at": {"$gte": start_of_month}
    })
    
    return {
        "status_distribution": status_data,
        "new_clients_this_month": new_clients_count,
        "total_clients": await db.clients.count_documents({})
    }

@router.get("/analytics/courses")
async def get_course_analytics():
    """Get course performance analytics"""
    db = get_database()
    
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
    
    course_data = await db.courses.aggregate(pipeline).to_list(length=None)
    
    return {"course_performance": course_data}