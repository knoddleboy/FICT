from element import Element
from process import Process


class Model:
    def __init__(self, elements: list[Element]):
        self.elements = elements
        self.tcurr = 0.0

    def simulate(self, time: float):
        while self.tcurr < time:
            tnext = float("inf")

            for el in self.elements:
                if el.tnext < tnext:
                    tnext = el.tnext

            print(f"\n{self.tcurr=}")

            for el in self.elements:
                el.do_statistics(tnext - self.tcurr)

            self.tcurr = tnext
            for el in self.elements:
                el.set_tcurr(self.tcurr)

            for el in self.elements:
                if el.tnext == self.tcurr:
                    el.out_act()

            self.print_info()
        self.print_result()

    def print_info(self):
        for el in self.elements:
            el.print_info()

    def print_result(self):
        print("\n--------RESULTS--------")
        for el in self.elements:
            el.print_result()
            if isinstance(el, Process):
                print(
                    f"\tmean queue length = {el.cumulative_queue / self.tcurr} "
                    f"\n\tmean work time = {el.cumulative_worktime / self.tcurr} "
                    f"\n\tfailure probability = {el.failures / (el.quantity + el.failures)}"
                )
