from typing import Optional

from pydantic import BaseModel

from .computer_specs import ComputerSpecsRead, ComputerSpecsCreate, ComputerSpecsUpdate


class EmployeeBase(BaseModel):
    name: str
    email: str

    class Config:
        orm_mode = True


class Employee(EmployeeBase):
    id: int
    department_id: int
    computer_specs_id: int


class EmployeeRead(EmployeeBase):
    id: int
    department_id: int
    computer_specs: ComputerSpecsRead


class EmployeeCreate(EmployeeBase):
    department_id: int
    computer_specs: ComputerSpecsCreate


class EmployeeUpdate(EmployeeBase):
    name: Optional[str] = None
    email: Optional[str] = None
    department_id: Optional[int] = None
    computer_specs: Optional[ComputerSpecsUpdate] = None
