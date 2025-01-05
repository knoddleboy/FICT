from typing import Optional

from pydantic import BaseModel

from .employee import Employee


class DepartmentBase(BaseModel):
    name: str

    class Config:
        orm_mode = True


class Department(DepartmentBase):
    id: int
    employees: list[Employee] = []


class DepartmentRead(DepartmentBase):
    id: int


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None
