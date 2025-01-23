from task1.generators import DelayGenerator
from .clinic_process import ClinicProcess


class Hallway(ClinicProcess):
    def __init__(self, name: str, generator: DelayGenerator):
        self.capacity = 20
        super().__init__(name, generator, self.capacity)
        self.set_queue_maxsize(0)
