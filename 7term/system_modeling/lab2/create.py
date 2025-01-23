from element import Element
from generators import DelayGenerator


class Create(Element):
    def __init__(self, name: str, generator: DelayGenerator):
        super().__init__(name, generator)

    def out_act(self):
        self.quantity += 1
        self.tnext = self.tcurr + self.get_delay()
        next_element = self.get_next_element()
        if next_element:
            next_element.in_act()
