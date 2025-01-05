from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...core.db.database import get_db
from ...core.exceptions.http_exceptions import NotFoundException, DuplicateValueException
from ... import models
from ...schemas import employee_schema

router = APIRouter(tags=["employees"])


@router.get("/employees", response_model=list[employee_schema.EmployeeRead])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Employee).offset(skip).limit(limit).all()


@router.get("/employees/{id}", response_model=employee_schema.EmployeeRead)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter_by(id=employee_id).first()

    if db_employee is None:
        raise NotFoundException("Employee not found")

    return db_employee


@router.post("/employees", response_model=employee_schema.EmployeeRead)
def create_employee(employee: employee_schema.EmployeeCreate, db: Session = Depends(get_db)):
    existing_employee = db.query(models.Employee).filter_by(email=employee.email).first()

    if existing_employee:
        raise DuplicateValueException("Email is already registered")

    existing_department = db.query(models.Department).filter_by(id=employee.department_id).first()

    if existing_department is None:
        raise NotFoundException("Department not found")

    db_computer_specs = models.ComputerSpecs(**employee.computer_specs.__dict__)
    db.add(db_computer_specs)
    db.flush()

    db_employee = models.Employee(
        name=employee.name,
        email=employee.email,
        department_id=employee.department_id,
        computer_specs_id=db_computer_specs.id,
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return db_employee


@router.patch("/employees/{id}", response_model=employee_schema.EmployeeRead)
def update_employee(
    employee_id: int, employee: employee_schema.EmployeeUpdate, db: Session = Depends(get_db)
):
    db_employee = db.query(models.Employee).filter_by(id=employee_id).first()

    if db_employee is None:
        raise NotFoundException("Employee not found")

    db_employee.name = employee.name or db_employee.name

    if employee.email:
        existing_employee = db.query(models.Employee).filter_by(email=employee.email).first()

        if existing_employee:
            raise DuplicateValueException("Email is already registered")

        db_employee.email = employee.email or db_employee.email

    if employee.department_id:
        existing_department = (
            db.query(models.Department).filter_by(id=employee.department_id).first()
        )

        if existing_department is None:
            raise NotFoundException("Department not found")

        db_employee.department_id = existing_department.id

    if employee.computer_specs:
        db_computer_specs = (
            db.query(models.ComputerSpecs).filter_by(id=db_employee.computer_specs_id).first()
        )

        db_computer_specs.cpu = employee.computer_specs.cpu or db_computer_specs.cpu
        db_computer_specs.ram = employee.computer_specs.ram or db_computer_specs.ram
        db_computer_specs.storage = employee.computer_specs.storage or db_computer_specs.storage

    db.commit()
    db.refresh(db_employee)
    return db_employee


@router.delete("/employees/{id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(models.Employee).filter_by(id=employee_id).first()

    if db_employee is None:
        raise NotFoundException("Employee not found")

    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}
