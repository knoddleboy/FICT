from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from psycopg2.errors import NotNullViolation

from ...core.db.database import get_db
from ...core.exceptions.http_exceptions import (
    NotFoundException,
    DuplicateValueException,
    BadRequestError,
    InternalServerException,
)
from ... import models
from ...schemas import department_schema

router = APIRouter(tags=["departments"])


@router.get("/departments", response_model=list[department_schema.DepartmentRead])
def get_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Department).offset(skip).limit(limit).all()


@router.get("/departments/{id}", response_model=department_schema.DepartmentRead)
def get_department(department_id: int, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter_by(id=department_id).first()

    if db_department is None:
        raise NotFoundException("Department not found")

    return db_department


@router.post("/departments", response_model=department_schema.DepartmentRead)
def create_department(
    department: department_schema.DepartmentCreate, db: Session = Depends(get_db)
):
    existing_department = db.query(models.Department).filter_by(name=department.name).first()

    if existing_department:
        raise DuplicateValueException("Name is already registered")

    db_department = models.Department(name=department.name)

    db.add(db_department)
    db.commit()
    db.refresh(db_department)

    return db_department


@router.patch("/departments/{id}", response_model=department_schema.DepartmentRead)
def update_department(
    department_id: int,
    department: department_schema.DepartmentUpdate,
    db: Session = Depends(get_db),
):
    db_department = db.query(models.Department).filter_by(id=department_id).first()

    if db_department is None:
        raise NotFoundException("Department not found")

    if department.name:
        existing_department = db.query(models.Department).filter_by(name=department.name).first()

        if existing_department:
            raise DuplicateValueException("Name is already registered")

        db_department.name = department.name or db_department.name

    db.commit()
    db.refresh(db_department)
    return db_department


@router.delete("/departments/{id}")
def delete_department(department_id: int, db: Session = Depends(get_db)):
    db_department = db.query(models.Department).filter_by(id=department_id).first()

    if db_department is None:
        raise NotFoundException("Department not found")

    try:
        db.delete(db_department)
        db.commit()
        return {"message": "Employee deleted successfully"}
    except IntegrityError as e:
        db.rollback()

        if isinstance(e.orig, NotNullViolation):
            raise BadRequestError(
                "You cannot delete this department because it has more than one employee"
            )

        raise InternalServerException("An unknown error occurred.")
