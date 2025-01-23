from typing import Generic, Deque, Iterable, Optional
from .element import Element, State, J
from .generators import DelayGenerator


class Channel(Element[J]):
    def __init__(self, name: str, generator: DelayGenerator):
        super().__init__(name, generator)
        self.tnext = float("inf")
        self.current_job: Optional[J] = None

    def set_job(self, job: J):
        self.current_job = job

    def take_job(self):
        self.current_job, job = None, self.current_job
        return job


class ProcessQueue(Generic[J], Deque[J]):
    def __init__(self, iterable: Optional[Iterable[J]] = None, maxsize: Optional[int] = None):
        super().__init__(iterable or (), maxlen=maxsize)

    def empty(self):
        return len(self) == 0

    def full(self):
        return self.maxlen is not None and len(self) >= self.maxlen


class Process(Generic[J], Element[J]):
    def __init__(self, name: str, generator: DelayGenerator, n_channels: int = 1):
        super().__init__(name, generator)
        self.tnext = float("inf")

        self.channels = [Channel[J](f"{name}-{i}", generator) for i in range(n_channels)]

        self.queue: ProcessQueue[J] = ProcessQueue(maxsize=0)

        self.cumulative_queue = 0
        self.cumulative_workload = 0
        self.failures = 0

    def in_act(self, job: J):
        for channel in self.channels:
            if channel.state == State.FREE:
                channel.set_job(job)
                channel.state = State.BUSY
                channel.tnext = self.tcurr + self.get_delay()
                self.tnext = min(channel.tnext for channel in self.channels)
                return

        self.try_enqueue_job(job)

    def try_enqueue_job(self, job: J):
        if not self.queue.full():
            self.queue.append(job)
        else:
            self.failures += 1

    def out_act(self):
        job_out: Optional[J] = None

        for channel in self.channels:
            if channel.tnext <= self.tcurr and channel.state == State.BUSY:
                job_out = channel.take_job()
                channel.state = State.FREE
                channel.tnext = float("inf")
                channel.quantity += 1
                self.quantity += 1

                if not self.queue.empty():
                    channel.set_job(self.queue.pop())
                    channel.state = State.BUSY
                    channel.tnext = self.tcurr + self.get_delay()

                self.tnext = min(channel.tnext for channel in self.channels)

                self.processed_job(job_out)

    def processed_job(self, job: Optional[J]):
        next_element = self.get_next_element()
        if next_element and job:
            next_element.in_act(job)

    def set_tcurr(self, tcurr: float):
        self.tcurr = tcurr
        for channel in self.channels:
            channel.tcurr = tcurr

    def set_queue_maxsize(self, maxsize: Optional[int]):
        self.queue = ProcessQueue[J](self.queue, maxsize)

    def get_state(self):
        return State.FREE if not all(channel.state != State.FREE for channel in self.channels) else State.BUSY

    def do_statistics(self, delta: float):
        self.cumulative_queue += len(self.queue) * delta
        self.cumulative_workload += self.get_state().value * delta

    def get_mean_queue(self):
        return self.cumulative_queue / self.tcurr

    def get_avg_workload(self):
        return self.cumulative_workload / self.tcurr

    def get_failure_prob(self):
        return self.failures / (self.quantity + self.failures)

    def print_info(self):
        print(f"{self.name}: {self.queue=} {self.failures=} {self.tnext=}")
        for channel in self.channels:
            channel.print_info()

    def print_result(self):
        print(f"{self.name}: quantity = {self.quantity} failures = {self.failures}")
