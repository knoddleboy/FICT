from task1.generators import DelayGenerator
from .clinic_process import ClinicProcess
from .patient import Patient, PatientType
from .hallway import Hallway
from numpy import mean, diff


class LabTechnician(ClinicProcess):
    def __init__(self, name: str, generator: DelayGenerator, n_techs: int = 1):
        super().__init__(name, generator, n_techs)
        self.set_queue_maxsize(None)

        self.quantity_finished = 0
        self.total_time_in_clinic = 0

        self.arrival_times: list[float] = []

    def processed_job(self, job: Patient | None):
        if job is None:
            raise ValueError(f"Patient is None.")

        if job.type == 2:
            job.type = 1

        next_element = self.get_next_element(job.type)
        if next_element and job:
            next_element.in_act(job)
        else:
            self.quantity_finished += 1
            self.total_time_in_clinic += self.tcurr - job.time_in

        self.arrival_times.append(self.tcurr)

    def get_next_element(self, patient_type: PatientType):
        if self.next_elements is None:
            raise ValueError("Lab assistant routes are not set.")

        routes = self.next_elements.routes

        for route in routes:
            element = route.element
            if patient_type == 1 and isinstance(element, Hallway):
                return element
            elif patient_type != 1 and element is None:
                return element

        raise ValueError("No suitable lab assistant routes were found.")

    def get_avg_time_in_clinic(self):
        return self.total_time_in_clinic / self.quantity_finished

    def get_avg_arrival_interval(self):
        return mean(diff(self.arrival_times))
