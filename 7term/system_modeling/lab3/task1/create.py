from .element import Element, J
from .generators import DelayGenerator
from .job import Job


class Create(Element[J]):
    def __init__(self, name: str, generator: DelayGenerator):
        super().__init__(name, generator)

    def out_act(self):
        self.quantity += 1
        self.tnext = self.tcurr + self.get_delay()
        next_element = self.get_next_element()
        job = self.create_job()
        if next_element and job:
            next_element.in_act(job)

    def create_job(self):
        return Job(time_in=self.tcurr)
