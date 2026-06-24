from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.database.base import Base
from app.models.user import User
from app.models.department import Department
from app.models.employee import Employee
from sqlalchemy import text
from app.api import department
from app.api import employee
from app.api import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(department.router)
app.include_router(employee.router)
app.include_router(auth.router)

@app.on_event("startup")
def test_db_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ Database connected successfully!")
    except Exception as e:
        print("❌ Database connection failed!")
        print(e)

@app.get("/")
def root():
    return {"message": "Employee Management API"}