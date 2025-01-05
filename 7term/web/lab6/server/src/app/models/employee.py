from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.db.database import Base


class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("department.id"), nullable=False)
    computer_specs_id = Column(Integer, ForeignKey("computer_specs.id"), nullable=False)

    department = relationship("Department", back_populates="employees")
    computer_specs = relationship("ComputerSpecs", cascade="all, delete")
