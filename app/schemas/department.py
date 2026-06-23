from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = Field(None, max_length=100)

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
