from typing import Optional
from task1.generators import ExponentialGenerator
from task1.process import ProcessQueue
from task1.element import State
from .patient import Patient, PatientType
from .clinic_process import ClinicProcess
from .attendant import Attendant
from .hallway import Hallway


class DoctorQueue(ProcessQueue[Patient]):
    def pop_by_type(self, type: PatientType):
        for i, patient in enumerate(self):
            if patient.type == type:
                del self[i]
                return patient
        return self.pop()


class DoctorProcess(ClinicProcess):
    def __init__(self, name: str, n_doctors: int = 1):
        _generator = ExponentialGenerator(mean=0)  # arbitrary generator since it's not used here
        super().__init__(name, _generator, n_doctors)
        self.queue: DoctorQueue = DoctorQueue(maxsize=None)  # type: ignore

    def in_act(self, job: Patient):
        for channel in self.channels:
            if channel.state == State.FREE:
                channel.set_job(job)
                channel.state = State.BUSY
                channel.tnext = self.tcurr + self.get_delay(job)
                self.tnext = min(channel.tnext for channel in self.channels)
                return

        self.try_enqueue_job(job)

    def out_act(self):
        patient_out: Optional[Patient] = None

        for channel in self.channels:
            if channel.tnext <= self.tcurr and channel.state == State.BUSY:
                patient_out = channel.take_job()
                channel.state = State.FREE
                channel.tnext = float("inf")
                channel.quantity += 1
                self.quantity += 1

                if not self.queue.empty():
                    patient = self.queue.pop_by_type(type=1)
                    channel.set_job(patient)
                    channel.state = State.BUSY
                    channel.tnext = self.tcurr + self.get_delay(patient)

                self.tnext = min(channel.tnext for channel in self.channels)

                self.processed_job(patient_out)

    def processed_job(self, job: Optional[Patient]):
        if job is None:
            raise ValueError(f"Patient is None.")

        next_element = self.get_next_element(job.type)
        if next_element:
            next_element.in_act(job)

    def get_next_element(self, patient_type: PatientType):
        if self.next_elements is None:
            raise ValueError("Doctor routes are not set.")

        routes = self.next_elements.routes

        for route in routes:
            element = route.element
            if patient_type == 1 and isinstance(element, Attendant):
                return element
            elif patient_type != 1 and isinstance(element, Hallway):
                return element

        raise ValueError("No suitable doctor routes were found.")
