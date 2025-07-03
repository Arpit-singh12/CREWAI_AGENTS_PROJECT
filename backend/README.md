# Multi-Agent Assignment System Backend

## Overview
This backend implements two CrewAI agents for business management: a Support Agent for client queries and a Dashboard Agent for analytics. Built with FastAPI and MongoDB.

## Architecture

### Agents
1. **Support Agent** - Handles client queries, order management, and service enrollment
2. **Dashboard Agent** - Provides analytics, metrics, and business intelligence

### Tech Stack
- **Framework**: FastAPI
- **Database**: MongoDB
- **Agent Framework**: CrewAI
- **API Documentation**: Swagger/OpenAPI
- **Authentication**: JWT tokens

## Project Structure
```
backend/
├── app/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── support_agent.py
│   │   └── dashboard_agent.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── mongodb_tool.py
│   │   └── external_api_tool.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── client.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── course.py
│   │   └── attendance.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── dependencies.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── database.py
│   └── main.py
├── requirements.txt
└── README.md
```

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file with:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=multi_agent_db
OPENAI_API_KEY=your_openai_key_here
JWT_SECRET_KEY=your_jwt_secret_here
```

### 3. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

### 4. Run the Application
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Agent Endpoints
- `POST /api/agents/support/query` - Send query to Support Agent
- `POST /api/agents/dashboard/query` - Send query to Dashboard Agent
- `GET /api/agents/status` - Get agent status and metrics

### Client Management
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/{client_id}` - Get client details
- `PUT /api/clients/{client_id}` - Update client
- `DELETE /api/clients/{client_id}` - Delete client

### Order Management
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{order_id}` - Get order details
- `PUT /api/orders/{order_id}` - Update order status

### Payment Management
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record new payment
- `GET /api/payments/pending` - Get pending payments

### Analytics Endpoints
- `GET /api/analytics/revenue` - Revenue metrics
- `GET /api/analytics/clients` - Client insights
- `GET /api/analytics/courses` - Course performance
- `GET /api/analytics/attendance` - Attendance reports

## Agent Configurations

### Support Agent Goals
- Process client queries with natural language understanding
- Search and retrieve client information from MongoDB
- Manage orders and payment status
- Provide course and class information
- Create new client enquiries and orders via external APIs

### Dashboard Agent Goals
- Generate business analytics and KPIs
- Provide revenue and financial metrics
- Analyze client behavior and retention
- Track course performance and enrollment trends
- Monitor attendance and completion rates

## Sample Queries

### Support Agent Queries
```python
# Client search
"Find client by email priya@example.com"

# Order status
"What is the status of order #12345?"

# Course information
"What classes are available this week?"

# Create order
"Create an order for Yoga Beginner for client Priya Sharma"

# Payment inquiry
"Show me all pending payments"
```

### Dashboard Agent Queries
```python
# Revenue analysis
"How much revenue did we generate this month?"

# Client insights
"How many new clients joined this month?"

# Course performance
"Which course has the highest enrollment?"

# Attendance metrics
"What is the attendance percentage for Pilates classes?"

# Client retention
"How many inactive clients do we have?"
```

## Database Collections

### Clients Collection
- Stores client personal information
- Enrollment history and status
- Contact details and preferences

### Orders Collection
- Order details and status
- Client and service associations
- Payment tracking

### Payments Collection
- Payment records and methods
- Transaction history
- Outstanding balances

### Courses Collection
- Course catalog and descriptions
- Instructor assignments
- Scheduling information

### Classes Collection
- Individual class sessions
- Attendance tracking
- Instructor notes

### Attendance Collection
- Student attendance records
- Completion tracking
- Progress monitoring

## External API Integration

The system integrates with external services for:
- **Payment Processing**: Stripe/Razorpay integration
- **Email Service**: SendGrid for notifications
- **SMS Service**: Twilio for alerts
- **Calendar API**: Google Calendar for scheduling

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting on API endpoints
- MongoDB connection security
- Encrypted sensitive data storage

## Monitoring and Logging

- Agent performance metrics tracking
- Query response time monitoring
- Error logging and alerting
- Database query optimization
- API usage analytics

## Future Enhancements

- Multi-language support for queries
- Advanced ML models for better query understanding
- Real-time notifications and webhooks
- Mobile app API support
- Advanced reporting and dashboard features
- Integration with more external services