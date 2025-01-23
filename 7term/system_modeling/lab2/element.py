from random import choice
from enum import Enum
from generators import DelayGenerator


class State(Enum):
    FREE = 0
    BUSY = 1


class Element:
    def __init__(self, name: str, generator: DelayGenerator):
        self.name: str = name
        self.generator = generator

        self.state = State.FREE
        self.tcurr: float = 0.0
        self.tnext: float = 0.0

        self.next_elements: list[Element] = []

        self.quantity: int = 0

    def get_delay(self):
        return self.generator.generate()

    def get_next_element(self):
        if len(self.next_elements) == 0:
            return None

        return choice(self.next_elements)

    def set_tcurr(self, tcurr: float):
        self.tcurr = tcurr

    def in_act(self):
        pass

    def out_act(self):
        pass

    def do_statistics(self, delta: float):
        pass

    def print_info(self):
        print(f"{self.name}: {self.state=} {self.quantity=} {self.tnext=}")

    def print_result(self):
        print(f"{self.name}: {self.quantity=}")
