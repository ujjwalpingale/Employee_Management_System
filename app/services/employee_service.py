from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.employee import Employee
from app.models.department import Department
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
import math

class EmployeeService:
    @staticmethod
    def get_all(
        db: Session, 
        search: str | None = None,
        department_id: int | None = None,
        designation: str | None = None,
        min_salary: float | None = None,
        max_salary: float | None = None,
        page: int = 1,
        size: int = 10
    ):
        query = db.query(Employee)
        if search:
            query = query.filter(Employee.name.ilike(f"%{search}%"))
        if department_id is not None:
            query = query.filter(Employee.department_id == department_id)
        if designation:
            query = query.filter(Employee.designation == designation)
        if min_salary is not None:
            query = query.filter(Employee.salary >= min_salary)
        if max_salary is not None:
            query = query.filter(Employee.salary <= max_salary)
            
        total_records = query.count()
        total_pages = math.ceil(total_records / size) if size > 0 else 0
        
        items = query.offset((page - 1) * size).limit(size).all()
        
        return {
            "items": items,
            "page": page,
            "size": size,
            "total_records": total_records,
            "total_pages": total_pages
        }

    @staticmethod
    def get_by_id(db: Session, emp_id: int):
        employee = db.query(Employee).filter(Employee.id == emp_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return employee

    @staticmethod
    def create(db: Session, employee_in: EmployeeCreate):
        # Validate department exists
        department = db.query(Department).filter(Department.id == employee_in.department_id).first()
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
            
        # Validate email is unique
        existing_email = db.query(Employee).filter(Employee.email == employee_in.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
            
        new_employee = Employee(**employee_in.model_dump())
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return new_employee

    @staticmethod
    def update(db: Session, emp_id: int, employee_in: EmployeeUpdate):
        employee = EmployeeService.get_by_id(db, emp_id)
        
        update_data = employee_in.model_dump(exclude_unset=True)
        
        if "department_id" in update_data:
            department = db.query(Department).filter(Department.id == update_data["department_id"]).first()
            if not department:
                raise HTTPException(status_code=404, detail="Department not found")
                
        if "email" in update_data:
            existing_email = db.query(Employee).filter(Employee.email == update_data["email"], Employee.id != emp_id).first()
            if existing_email:
                raise HTTPException(status_code=400, detail="Email already registered")

        for key, value in update_data.items():
            setattr(employee, key, value)
            
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def delete(db: Session, emp_id: int):
        employee = EmployeeService.get_by_id(db, emp_id)
        db.delete(employee)
        db.commit()
        return {"detail": "Employee deleted successfully"}
