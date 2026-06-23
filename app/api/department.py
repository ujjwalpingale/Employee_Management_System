from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.dependencies import get_db
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.services.department_service import DepartmentService
from app.core.security import get_current_user, get_admin_user

router = APIRouter(prefix="/departments", tags=["Departments"])

@router.post("/", response_model=DepartmentResponse, status_code=201)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return DepartmentService.create(db, department)

@router.get("/", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return DepartmentService.get_all(db)

@router.get("/{id}", response_model=DepartmentResponse)
def get_department(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return DepartmentService.get_by_id(db, id)

@router.put("/{id}", response_model=DepartmentResponse)
def update_department(id: int, department: DepartmentUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return DepartmentService.update(db, id, department)

@router.delete("/{id}")
def delete_department(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_admin_user)):
    return DepartmentService.delete(db, id)
