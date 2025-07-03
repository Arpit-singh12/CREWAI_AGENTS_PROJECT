from crewai import Agent, Task, Crew
from app.tools.mongodb_tool import MongoDBTool
from app.tools.external_api_tool import ExternalAPITool
from typing import Dict, Any
import asyncio

class SupportAgent:
    def __init__(self):
        self.mongodb_tool = MongoDBTool()
        self.external_api_tool = ExternalAPITool()
        
        # Define the support agent with CrewAI
        self.agent = Agent(
            role='Customer Support Specialist',
            goal='Provide excellent customer support by handling client queries, managing orders, and facilitating service enrollments',
            backstory="""You are an experienced customer support specialist working for a fitness and wellness business. 
            You have access to client databases, order management systems, and external APIs for creating new orders and enquiries.
            Your primary focus is to help clients with their questions about services, orders, payments, and class schedules.
            You are empathetic, efficient, and always strive to provide accurate and helpful information.""",
            tools=[self.mongodb_tool, self.external_api_tool],
            verbose=True,
            allow_delegation=False,
            max_iter=3
        )
    
    async def process_query(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process a support query using the CrewAI agent"""
        try:
            # Create a task for the agent
            task = Task(
                description=f"""
                Process the following customer support query: {query}
                
                Context: {context or {}}
                
                You should:
                1. Understand what the customer is asking for
                2. Use the appropriate tools to gather information from the database
                3. If needed, create new records using external APIs
                4. Provide a comprehensive and helpful response
                5. Include relevant details like order numbers, payment status, class schedules, etc.
                
                Always be polite, professional, and thorough in your response.
                """,
                agent=self.agent,
                expected_output="A comprehensive response addressing the customer's query with relevant information and next steps if applicable."
            )
            
            # Create and run the crew
            crew = Crew(
                agents=[self.agent],
                tasks=[task],
                verbose=True
            )
            
            # Execute the task
            result = crew.kickoff()
            
            return {
                "status": "success",
                "response": result,
                "agent": "support",
                "query": query
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "support",
                "query": query
            }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return the capabilities of the support agent"""
        return {
            "name": "Support Agent",
            "description": "AI-powered customer support for client queries and order management",
            "capabilities": [
                "Client information search and retrieval",
                "Order status tracking and management", 
                "Payment information and pending dues calculation",
                "Course and class schedule information",
                "New client enquiry creation",
                "Order creation from client and service information",
                "Multi-language query processing",
                "Context-aware conversations"
            ],
            "tools": [
                "MongoDB Database Access",
                "External API Integration",
                "Email Service",
                "SMS Notifications"
            ],
            "sample_queries": [
                "What classes are available this week?",
                "Has order #12345 been paid?", 
                "Create an order for Yoga Beginner for client Priya Sharma",
                "Find client by email priya@example.com",
                "Show me all pending payments for this month"
            ]
        }