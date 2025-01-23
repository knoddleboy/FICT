import random
from lab3.task1.generators import ExponentialGenerator
from lab3.task1.process import Process as BaseProcess


class Process(BaseProcess):
    next_id = 0

    def __init__(self, n_channels: int = 1):
        mean = random.uniform(0.1, 2.0)
        super().__init__(f"Process {Process.next_id}", ExponentialGenerator(mean), n_channels)
        Process.next_id += 1
        self.set_queue_maxsize(None)
