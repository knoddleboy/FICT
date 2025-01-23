from task1.generators import DelayGenerator
from .clinic_process import ClinicProcess
from .patient import Patient


class Attendant(ClinicProcess):
    def __init__(self, name: str, generator: DelayGenerator, n_attendants: int = 1):
        super().__init__(name, generator, n_attendants)

        self.quantity_finished = 0
        self.total_time_in_clinic = 0

    def processed_job(self, job: Patient | None):
        if job is None:
            raise ValueError(f"Patient is None.")

        self.quantity_finished += 1
        self.total_time_in_clinic += self.tcurr - job.time_in

    def get_avg_time_in_clinic(self):
        return self.total_time_in_clinic / self.quantity_finished
