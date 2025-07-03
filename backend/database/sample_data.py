"""
Sample data for MongoDB collections
This script populates the database with realistic sample data for testing and development
"""

from datetime import datetime, timedelta
from bson import ObjectId
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import random

# Database connection
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "multi_agent_db"

async def populate_sample_data():
    """Populate the database with sample data"""
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    # Clear existing data
    collections = ["clients", "courses", "orders", "payments", "classes", "attendance", "enquiries"]
    for collection in collections:
        await db[collection].delete_many({})
    
    print("Populating sample data...")
    
    # Sample clients
    clients_data = [
        {
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "phone": "+91 9876543210",
            "date_of_birth": datetime(1990, 5, 15),
            "address": "123 MG Road, Bangalore",
            "emergency_contact": "+91 9876543211",
            "status": "active",
            "enrolled_courses": [],
            "created_at": datetime.utcnow() - timedelta(days=60),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Rahul Kumar",
            "email": "rahul@example.com", 
            "phone": "+91 9876543220",
            "date_of_birth": datetime(1985, 8, 22),
            "address": "456 Park Street, Mumbai",
            "emergency_contact": "+91 9876543221",
            "status": "active",
            "enrolled_courses": [],
            "created_at": datetime.utcnow() - timedelta(days=45),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Kartik singh",
            "email": "Kartik@example.com",
            "phone": "+91 9876543230", 
            "date_of_birth": datetime(1992, 12, 10),
            "address": "789 Brigade Road, Bangalore",
            "emergency_contact": "+91 9876543231",
            "status": "active",
            "enrolled_courses": [],
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Roy",
            "email": "roy@example.com",
            "phone": "+91 9876543240",
            "date_of_birth": datetime(1988, 3, 25),
            "address": "321 Linking Road, Mumbai",
            "status": "inactive",
            "enrolled_courses": [],
            "created_at": datetime.utcnow() - timedelta(days=90),
            "updated_at": datetime.utcnow() - timedelta(days=30)
        },
        {
            "name": "Avii",
            "email": "avii@example.com",
            "phone": "+91 9876543250",
            "date_of_birth": datetime(1995, 7, 18),
            "address": "654 Commercial Street, Bangalore",
            "status": "active", 
            "enrolled_courses": [],
            "created_at": datetime.utcnow() - timedelta(days=15),
            "updated_at": datetime.utcnow()
        }
    ]
    
    client_result = await db.clients.insert_many(clients_data)
    client_ids = client_result.inserted_ids
    print(f"Inserted {len(client_ids)} clients")
    
    # Sample courses
    courses_data = [
        {
            "name": "Yoga Beginner",
            "description": "Basic yoga poses and breathing techniques for beginners",
            "instructor": "Sarah Johnson",
            "category": "yoga",
            "level": "beginner",
            "duration_minutes": 60,
            "capacity": 20,
            "price_per_session": 1500,
            "package_options": [
                {"name": "Monthly", "sessions": 12, "price": 15000, "validity_days": 30},
                {"name": "Quarterly", "sessions": 36, "price": 40500, "validity_days": 90}
            ],
            "schedule": [
                {"day": "Monday", "time": "09:00", "duration": 60},
                {"day": "Wednesday", "time": "09:00", "duration": 60},
                {"day": "Friday", "time": "09:00", "duration": 60}
            ],
            "requirements": ["Yoga mat", "Comfortable clothing"],
            "status": "active",
            "tags": ["yoga", "beginner", "flexibility"],
            "created_at": datetime.utcnow() - timedelta(days=100),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Pilates Advanced",
            "description": "Advanced pilates techniques for strength and flexibility",
            "instructor": "Mike Chen",
            "category": "pilates",
            "level": "advanced",
            "duration_minutes": 75,
            "capacity": 15,
            "price_per_session": 2000,
            "package_options": [
                {"name": "Monthly", "sessions": 8, "price": 14400, "validity_days": 30}
            ],
            "schedule": [
                {"day": "Tuesday", "time": "11:00", "duration": 75},
                {"day": "Thursday", "time": "11:00", "duration": 75}
            ],
            "status": "active",
            "tags": ["pilates", "advanced", "strength"],
            "created_at": datetime.utcnow() - timedelta(days=80),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Meditation",
            "description": "Mindfulness and meditation practices for stress relief",
            "instructor": "Lisa Wang",
            "category": "meditation",
            "level": "beginner",
            "duration_minutes": 45,
            "capacity": 25,  
            "price_per_session": 1000,
            "schedule": [
                {"day": "Daily", "time": "18:00", "duration": 45}
            ],
            "status": "active",
            "tags": ["meditation", "mindfulness", "stress-relief"],
            "created_at": datetime.utcnow() - timedelta(days=70),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Dance Fitness",
            "description": "High-energy dance workout combining cardio and fun",
            "instructor": "Priya Sharma",
            "category": "dance",
            "level": "intermediate",
            "duration_minutes": 60,
            "capacity": 30,
            "price_per_session": 1200,
            "schedule": [
                {"day": "Saturday", "time": "10:00", "duration": 60},
                {"day": "Sunday", "time": "10:00", "duration": 60}
            ],
            "status": "active",
            "tags": ["dance", "cardio", "fun"],
            "created_at": datetime.utcnow() - timedelta(days=50),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Strength Training",
            "description": "Weight training and muscle building exercises",
            "instructor": "Rahul Kumar", 
            "category": "strength",
            "level": "intermediate",
            "duration_minutes": 90,
            "capacity": 12,
            "price_per_session": 2500,
            "schedule": [
                {"day": "Monday", "time": "17:00", "duration": 90},
                {"day": "Wednesday", "time": "17:00", "duration": 90},
                {"day": "Friday", "time": "17:00", "duration": 90}
            ],
            "status": "active",
            "tags": ["strength", "weights", "muscle-building"],
            "created_at": datetime.utcnow() - timedelta(days=40),
            "updated_at": datetime.utcnow()
        }
    ]
    
    course_result = await db.courses.insert_many(courses_data)
    course_ids = course_result.inserted_ids
    print(f"Inserted {len(course_ids)} courses")
    
    # Sample orders
    orders_data = []
    for i in range(20):
        client_id = random.choice(client_ids)
        course_id = random.choice(course_ids)
        course = next(c for c in courses_data if str(c.get("_id", course_ids[courses_data.index(c)])) == str(course_id))
        amount = course["price_per_session"] * random.randint(1, 12)
        
        order = {
            "order_number": f"ORD-{i+1:06d}",
            "client_id": client_id,
            "course_id": course_id,
            "service_name": course["name"],
            "amount": amount,
            "currency": "INR",
            "status": random.choice(["pending", "confirmed", "cancelled"]),
            "payment_status": random.choice(["unpaid", "paid", "partial"]),
            "payment_method": random.choice(["cash", "card", "upi", "bank_transfer"]) if random.random() > 0.3 else None,
            "discount_applied": random.randint(0, 500) if random.random() > 0.7 else 0,
            "final_amount": amount - (random.randint(0, 500) if random.random() > 0.7 else 0),
            "notes": f"Order for {course['name']} - {random.choice(['Monthly package', 'Quarterly package', 'Single session'])}",
            "metadata": {"source": "website", "campaign": random.choice(["summer", "new_year", "referral", None])},
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 60)),
            "updated_at": datetime.utcnow() - timedelta(days=random.randint(0, 30))
        }
        orders_data.append(order)
    
    order_result = await db.orders.insert_many(orders_data)
    order_ids = order_result.inserted_ids
    print(f"Inserted {len(order_ids)} orders")
    
    # Sample payments
    payments_data = []
    for i, order in enumerate(orders_data):
        if order["payment_status"] in ["paid", "partial"]:
            payment = {
                "order_id": order_ids[i],
                "client_id": order["client_id"],
                "amount": order["final_amount"] if order["payment_status"] == "paid" else order["final_amount"] * 0.5,
                "currency": "INR",
                "payment_method": order["payment_method"],
                "transaction_id": f"TXN{random.randint(100000, 999999)}",
                "gateway_response": {"status": "success", "gateway": "razorpay"},
                "status": "completed",
                "payment_date": order["created_at"] + timedelta(days=random.randint(0, 5)),
                "notes": "Payment processed successfully",
                "created_at": order["created_at"] + timedelta(days=random.randint(0, 5))
            }
            payments_data.append(payment)
    
    # Add some pending payments
    for order in orders_data[:5]:
        if order["payment_status"] == "unpaid":
            payment = {
                "order_id": order_ids[orders_data.index(order)],
                "client_id": order["client_id"],
                "amount": order["final_amount"],
                "currency": "INR",
                "payment_method": "pending",
                "status": "pending",
                "payment_date": None,
                "created_at": order["created_at"]
            }
            payments_data.append(payment)
    
    if payments_data:
        payment_result = await db.payments.insert_many(payments_data)
        print(f"Inserted {len(payment_result.inserted_ids)} payments")
    
    # Sample classes (individual sessions)
    classes_data = []
    for course_id, course in zip(course_ids, courses_data):
        for week in range(4):  # 4 weeks of classes
            for schedule_item in course["schedule"]:
                if schedule_item["day"] != "Daily":
                    class_date = datetime.utcnow() - timedelta(days=28-week*7) + timedelta(days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].index(schedule_item["day"]))
                else:
                    class_date = datetime.utcnow() - timedelta(days=week*7)
                
                class_session = {
                    "course_id": course_id,
                    "name": f"{course['name']} - {schedule_item['day']}",
                    "instructor": course["instructor"],
                    "date": class_date,
                    "start_time": schedule_item["time"],
                    "duration_minutes": schedule_item["duration"],
                    "capacity": course["capacity"],
                    "enrolled_count": random.randint(5, course["capacity"]),
                    "status": "completed" if class_date < datetime.utcnow() else "scheduled",
                    "created_at": class_date - timedelta(days=7),
                    "updated_at": class_date
                }
                classes_data.append(class_session)
    
    class_result = await db.classes.insert_many(classes_data)
    class_ids = class_result.inserted_ids
    print(f"Inserted {len(class_ids)} classes")
    
    # Sample attendance
    attendance_data = []
    for class_id, class_session in zip(class_ids, classes_data):
        if class_session["status"] == "completed":
            # Generate attendance for some clients
            attending_clients = random.sample(client_ids, min(len(client_ids), class_session["enrolled_count"]))
            for client_id in attending_clients:
                attendance = {
                    "client_id": client_id,
                    "class_id": class_id,
                    "course_id": class_session["course_id"],
                    "date": class_session["date"],
                    "status": random.choice(["present", "absent", "cancelled"]) if random.random() > 0.1 else "present",
                    "check_in_time": class_session["date"] + timedelta(minutes=random.randint(-5, 15)),
                    "check_out_time": class_session["date"] + timedelta(minutes=class_session["duration_minutes"] + random.randint(-10, 20)) if random.random() > 0.2 else None,
                    "notes": random.choice(["Great session!", "Felt challenging", "Enjoyed the class", ""]),
                    "created_at": class_session["date"]
                }
                attendance_data.append(attendance)
    
    if attendance_data:
        attendance_result = await db.attendance.insert_many(attendance_data)
        print(f"Inserted {len(attendance_result.inserted_ids)} attendance records")
    
    # Sample enquiries
    enquiries_data = [
        {
            "name": "John Smith",
            "email": "john@example.com",
            "phone": "+91 9876543260",
            "enquiry_type": "course_info",
            "message": "I'm interested in yoga classes for beginners. What are the timings?",
            "status": "new",
            "source": "website",
            "assigned_to": None,
            "follow_up_date": None,
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "name": "Emma Davis",
            "email": "emma@example.com", 
            "phone": "+91 9876543270",
            "enquiry_type": "pricing",
            "message": "Can you provide pricing details for pilates classes?",
            "status": "contacted",
            "source": "referral",
            "assigned_to": "staff@fitness.com",
            "follow_up_date": datetime.utcnow() + timedelta(days=1),
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow() - timedelta(days=3)
        }
    ]
    
    enquiry_result = await db.enquiries.insert_many(enquiries_data)
    print(f"Inserted {len(enquiry_result.inserted_ids)} enquiries")
    
    print("Sample data population completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(populate_sample_data())