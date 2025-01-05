from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..core.db.database import Base


class Department(Base):
    __tablename__ = "department"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    employees = relationship("Employee", back_populates="department")
