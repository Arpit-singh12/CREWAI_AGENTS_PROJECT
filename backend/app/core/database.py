from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

mongodb = MongoDB()

async def init_db():
    """Initialize database connection"""
    try:
        mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongodb.database = mongodb.client[settings.DATABASE_NAME]
        
        # Test connection
        await mongodb.client.admin.command('ping')
        logging.info("Successfully connected to MongoDB")
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def create_indexes():
    """Create database indexes for optimal performance"""
    db = mongodb.database
    
    # Clients collection indexes
    await db.clients.create_index("email", unique=True)
    await db.clients.create_index("phone")
    await db.clients.create_index("created_at")
    
    # Orders collection indexes
    await db.orders.create_index("client_id")
    await db.orders.create_index("status")
    await db.orders.create_index("created_at")
    
    # Payments collection indexes
    await db.payments.create_index("order_id")
    await db.payments.create_index("status")
    await db.payments.create_index("payment_date")
    
    # Courses collection indexes
    await db.courses.create_index("name")
    await db.courses.create_index("instructor")
    await db.courses.create_index("status")
    
    # Classes collection indexes
    await db.classes.create_index("course_id")
    await db.classes.create_index("date")
    await db.classes.create_index("instructor")
    
    # Attendance collection indexes
    await db.attendance.create_index(["client_id", "class_id"], unique=True)
    await db.attendance.create_index("date")

async def close_db():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()

def get_database():
    """Get database instance"""
    return mongodb.database