import random
from task1.create import Create as BaseCreate
from task1.generators import ExponentialGenerator
from .patient import Patient, PatientType


class Create(BaseCreate):
    def create_job(self):
        patient_data: dict[PatientType, dict[str, int | float]] = {
            1: {"rel_freq": 0.5, "delay": 15},
            2: {"rel_freq": 0.1, "delay": 40},
            3: {"rel_freq": 0.4, "delay": 30},  # 20
        }

        random_value = random.uniform(0, 1)
        cumulative_probability = 0

        for patient_type, data in patient_data.items():
            cumulative_probability += data["rel_freq"]
            if random_value <= cumulative_probability:
                return Patient(patient_type, ExponentialGenerator(mean=data["delay"]), self.tcurr)

        raise ValueError("No matching patient found.")
