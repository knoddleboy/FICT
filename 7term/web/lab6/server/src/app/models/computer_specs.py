from sqlalchemy import Column, Integer, String, CheckConstraint

from ..core.db.database import Base


class ComputerSpecs(Base):
    __tablename__ = "computer_specs"

    id = Column(Integer, primary_key=True, index=True)
    cpu = Column(String, nullable=False)
    ram = Column(Integer, nullable=False)
    storage = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint("ram > 0", name="check_ram_positive"),
        CheckConstraint("storage > 0", name="check_storage_positive"),
    )
