from typing import Optional

from pydantic import BaseModel


class ComputerSpecsBase(BaseModel):
    cpu: str
    ram: int
    storage: int

    class Config:
        orm_mode = True


class ComputerSpecs(ComputerSpecsBase):
    id: int


class ComputerSpecsRead(ComputerSpecsBase):
    pass


class ComputerSpecsCreate(ComputerSpecsBase):
    pass


class ComputerSpecsUpdate(ComputerSpecsBase):
    cpu: Optional[str] = None
    ram: Optional[int] = None
    storage: Optional[int] = None
