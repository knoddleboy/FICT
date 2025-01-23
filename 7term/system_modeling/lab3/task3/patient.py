from typing import Literal
from task1.generators import DelayGenerator
from task1.job import Job


PatientType = Literal[1, 2, 3]


class Patient(Job):
    def __init__(self, type: PatientType, generator: DelayGenerator, time_in: float):
        super().__init__(time_in)
        self.type: PatientType = type
        self.generator = generator

    def get_delay(self):
        return self.generator.generate()

    def __repr__(self) -> str:
        return f"Patient(type={self.type}, time_in={self.time_in})"
