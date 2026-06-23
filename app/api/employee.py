from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.dependencies import get_db
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse, PaginatedEmployeeResponse
from app.services.employee_service import EmployeeService
from app.core.security import get_current_user, get_admin_user

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/", response_model=EmployeeResponse, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return EmployeeService.create(db, employee)

@router.get("/", response_model=PaginatedEmployeeResponse)
def get_employees(
    search: str | None = None,
    department_id: int | None = None,
    designation: str | None = None,
    min_salary: float | None = None,
    max_salary: float | None = None,
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return EmployeeService.get_all(
        db, 
        search=search,
        department_id=department_id,
        designation=designation,
        min_salary=min_salary,
        max_salary=max_salary,
        page=page,
        size=size
    )

@router.get("/{id}", response_model=EmployeeResponse)
def get_employee(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return EmployeeService.get_by_id(db, id)

@router.put("/{id}", response_model=EmployeeResponse)
def update_employee(id: int, employee: EmployeeUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return EmployeeService.update(db, id, employee)

@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return EmployeeService.delete(db, id)
