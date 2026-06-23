from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate

class DepartmentService:
    @staticmethod
    def get_all(db: Session):
        return db.query(Department).all()

    @staticmethod
    def get_by_id(db: Session, dept_id: int):
        department = db.query(Department).filter(Department.id == dept_id).first()
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
        return department

    @staticmethod
    def create(db: Session, department_in: DepartmentCreate):
        existing = db.query(Department).filter(Department.name == department_in.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Department with this name already exists")
        new_department = Department(**department_in.model_dump())
        db.add(new_department)
        db.commit()
        db.refresh(new_department)
        return new_department

    @staticmethod
    def update(db: Session, dept_id: int, department_in: DepartmentUpdate):
        department = DepartmentService.get_by_id(db, dept_id)
        update_data = department_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(department, key, value)
        db.commit()
        db.refresh(department)
        return department

    @staticmethod
    def delete(db: Session, dept_id: int):
        department = DepartmentService.get_by_id(db, dept_id)
        db.delete(department)
        db.commit()
        return {"detail": "Department deleted successfully"}
