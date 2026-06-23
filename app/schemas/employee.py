from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import date, datetime

class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    salary: float = Field(..., gt=0)
    designation: str = Field(..., min_length=2, max_length=100)
    joining_date: date
    department_id: int

    @field_validator('joining_date')
    @classmethod
    def check_joining_date(cls, v: date):
        if v > date.today():
            raise ValueError('joining_date cannot be in the future')
        return v

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    salary: Optional[float] = Field(None, gt=0)
    designation: Optional[str] = Field(None, max_length=100)
    joining_date: Optional[date] = None
    department_id: Optional[int] = None

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

from typing import List

class PaginatedEmployeeResponse(BaseModel):
    items: List[EmployeeResponse]
    page: int
    size: int
    total_records: int
    total_pages: int
