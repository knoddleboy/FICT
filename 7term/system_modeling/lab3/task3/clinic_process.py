from task1.generators import DelayGenerator
from task1.process import Process
from .patient import Patient


class ClinicProcess(Process[Patient]):
    def __init__(self, name: str, generator: DelayGenerator, n_channels: int = 1):
        super().__init__(name, generator, n_channels)
        self.set_queue_maxsize(None)

    def try_enqueue_job(self, job: Patient):
        self.queue.append(job)

    def get_delay(self, patient: Patient | None = None):
        if patient is not None:
            return patient.get_delay()
        return super().get_delay()

    def print_result(self):
        print(f"{self.name}: quantity = {self.quantity} workload = {self.get_avg_workload()}")
