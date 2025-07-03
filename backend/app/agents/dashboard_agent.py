from crewai import Agent, Task, Crew
from app.tools.mongodb_tool import MongoDBTool
from typing import Dict, Any
import asyncio

class DashboardAgent:
    def __init__(self):
        self.mongodb_tool = MongoDBTool()
        
        # Define the dashboard agent with CrewAI
        self.agent = Agent(
            role='Business Analytics Specialist',
            goal='Provide comprehensive business insights, analytics, and metrics to help business owners make data-driven decisions',
            backstory="""You are a skilled business analyst with expertise in fitness and wellness industry metrics.
            You have access to comprehensive business data including revenue, client information, course performance, and attendance records.
            Your role is to analyze data, identify trends, and provide actionable insights that help the business grow and improve client satisfaction.
            You excel at creating clear, understandable reports and highlighting key performance indicators.""",
            tools=[self.mongodb_tool],
            verbose=True,
            allow_delegation=False,
            max_iter=3
        )
    
    async def process_query(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Process an analytics query using the CrewAI agent"""
        try:
            # Create a task for the agent
            task = Task(
                description=f"""
                Analyze the following business analytics query: {query}
                
                Context: {context or {}}
                
                You should:
                1. Understand what business metric or insight is being requested
                2. Use MongoDB aggregation queries to gather relevant data
                3. Calculate appropriate metrics and KPIs
                4. Identify trends and patterns in the data
                5. Provide actionable insights and recommendations
                6. Format the response with clear numbers, percentages, and explanations
                
                Focus on providing accurate, data-driven insights that help the business owner understand their performance.
                """,
                agent=self.agent,
                expected_output="A comprehensive analytics report with relevant metrics, trends, and actionable business insights."
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
                "agent": "dashboard",
                "query": query
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "agent": "dashboard", 
                "query": query
            }
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return the capabilities of the dashboard agent"""
        return {
            "name": "Dashboard Agent",
            "description": "AI-powered business analytics and insights generator",
            "capabilities": [
                "Revenue analysis and financial metrics",
                "Client behavior and retention analytics",
                "Course performance and enrollment trends", 
                "Attendance tracking and completion rates",
                "Outstanding payments and collections analysis",
                "Business growth and KPI monitoring",
                "Predictive analytics and forecasting",
                "Custom report generation"
            ],
            "metrics_provided": [
                "Total and monthly revenue",
                "Active vs inactive client counts",
                "New client acquisition rates",
                "Course completion percentages",
                "Average attendance rates",
                "Payment collection efficiency",
                "Top performing courses and instructors",
                "Client lifetime value analysis"
            ],
            "sample_queries": [
                "How much revenue did we generate this month?",
                "Which course has the highest enrollment?",
                "What is the attendance percentage for Pilates classes?",
                "How many inactive clients do we have?",
                "Show me the top 5 clients by revenue contribution",
                "What's our client retention rate for the past 6 months?"
            ]
        }