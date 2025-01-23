from task1.process import Process
from task1.generators import DelayGenerator
from task1.element import State


class Cashier(Process):
    def __init__(self, name: str, generator: DelayGenerator, n_channels: int = 1):
        super().__init__(name, generator, n_channels)
        self.adjacent_lines: list[Process] | None = None
        self.queue_change_threshold = 2

        self.total_clients = 0
        self.queue_changes = 0

    def out_act(self):
        self.try_change_line()
        super().out_act()

    def try_change_line(self):
        if self.adjacent_lines is None:
            raise ValueError("'adjacent_lines' must be set to change between lines.")

        # Only consider changing lines if a client is last in the queue
        if not self.queue.full():
            return False

        for line in self.adjacent_lines:
            queues_diff = len(self.queue) - len(line.queue)
            if queues_diff >= self.queue_change_threshold:
                self.queue_changes += 1
                job = self.queue.popleft()
                line.in_act(job)
                return True

        return False

    def do_statistics(self, delta: float):
        super().do_statistics(delta)
        sum_devices_states = sum(device.get_state().value for device in self.channels)
        self.total_clients += len(self.queue) * delta + sum_devices_states * delta

    def set_initial_tnext(self, tnext: float):
        self.tnext = tnext
        for device in self.channels:
            device.tnext = tnext

    def set_initial_state(self, state: State):
        self.channels[0].state = state
