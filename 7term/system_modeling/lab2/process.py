from element import Element, State
from generators import DelayGenerator


class Process(Element):
    def __init__(self, name: str, generator: DelayGenerator, n_channels: int = 1):
        super().__init__(name, generator)
        self.channels = [Element(f"{name}-{i}", generator) for i in range(n_channels)]

        self.tnext = float("inf")
        for channel in self.channels:
            channel.tnext = float("inf")

        self.queue = 0
        self.max_queue = 0

        self.cumulative_queue = 0
        self.cumulative_worktime = 0
        self.failures = 0

    def in_act(self):
        for channel in self.channels:
            if channel.state == State.FREE:
                channel.state = State.BUSY
                channel.tnext = self.tcurr + self.get_delay()
                self.tnext = min(channel.tnext for channel in self.channels)
                return

        if self.queue < self.max_queue:
            self.queue += 1
        else:
            self.failures += 1

        # if self.state == State.FREE:
        #     self.state = State.BUSY
        #     self.tnext = self.tcurr + self.get_delay()
        # else:
        #     if self.queue < self.max_queue:
        #         self.queue += 1
        #     else:
        #         self.failures += 1

    def out_act(self):
        for channel in self.channels:
            if channel.tnext <= self.tcurr and channel.state == State.BUSY:
                channel.state = State.FREE
                channel.tnext = float("inf")
                channel.quantity += 1
                self.quantity += 1

                if self.queue > 0:
                    self.queue -= 1
                    channel.state = State.BUSY
                    channel.tnext = self.tcurr + self.get_delay()

                self.tnext = min(channel.tnext for channel in self.channels)

                next_element = self.get_next_element()
                if next_element:
                    next_element.in_act()

        # self.quantity += 1
        # self.tnext = float("inf")
        # self.state = State.FREE

        # if self.queue > 0:
        #     self.queue -= 1
        #     self.state = State.BUSY
        #     self.tnext = self.tcurr + self.get_delay()

        # next_element = self.get_next_element()
        # if next_element:
        #     next_element.in_act()

    def set_tcurr(self, tcurr: float):
        self.tcurr = tcurr
        for channel in self.channels:
            channel.tcurr = tcurr

    def get_state(self):
        return State.FREE if not all(channel.state != State.FREE for channel in self.channels) else State.BUSY

    def do_statistics(self, delta: float):
        self.cumulative_queue += self.queue * delta
        self.cumulative_worktime += self.get_state().value * delta

    def print_info(self):
        print(f"{self.name}: {self.queue=} {self.failures=} {self.tnext=}")
        for channel in self.channels:
            channel.print_info()

    def print_result(self):
        print(f"{self.name}: {self.quantity=} {self.failures=}")
