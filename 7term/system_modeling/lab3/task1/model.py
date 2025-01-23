from .element import Element
from .process import Process


class Model:
    def __init__(self, *elements: Element):
        self.elements = elements
        self.tcurr = 0.0

    def simulate(self, time: float):
        while self.tcurr < time:
            closest_event_time = float("inf")

            for el in self.elements:
                if el.tnext < closest_event_time:
                    closest_event_time = el.tnext

            # print(f"\n{self.tcurr=}")

            delta = closest_event_time - self.tcurr
            self.do_statistics(delta)
            for el in self.elements:
                el.do_statistics(delta)

            self.tcurr = closest_event_time
            for el in self.elements:
                el.set_tcurr(self.tcurr)

            for el in self.elements:
                if el.tnext == self.tcurr:
                    el.out_act()

            # self.print_info()
        self.print_result()

    def do_statistics(self, delta: float):
        pass

    def print_info(self):
        for el in self.elements:
            el.print_info()

    def print_result(self):
        print("\n--------RESULTS--------")
        for el in self.elements:
            el.print_result()
            if isinstance(el, Process):
                print(
                    f"\tmean queue length = {el.get_mean_queue()} "
                    f"\n\taverage work load = {el.get_avg_workload()} "
                    f"\n\tfailure probability = {el.get_failure_prob()}"
                )
            print()
