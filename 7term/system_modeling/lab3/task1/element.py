import random
from enum import Enum
from typing import TypeVar, Generic, Optional
from .generators import DelayGenerator
from .routing import Routes, RoutingMethod
from .job import Job


J = TypeVar("J", bound="Job")


class State(Enum):
    FREE = 0
    BUSY = 1


class Element(Generic[J]):
    def __init__(self, name: str, generator: DelayGenerator):
        self.name: str = name
        self.generator = generator

        self.state = State.FREE
        self.tcurr: float = 0.0
        self.tnext: float = 0.0

        self.next_elements: Optional[Routes] = None

        self.quantity: int = 0

    def get_delay(self):
        return self.generator.generate()

    def get_next_element(self):
        if self.next_elements is None:
            return None

        routes = self.next_elements.routes
        routing_method = self.next_elements.routing_method

        if len(routes) == 1:
            return routes[0].element

        if routing_method == RoutingMethod.PROB:
            random_value = random.uniform(0, 1)
            cumulative_weight = 0.0

            for route in routes:
                cumulative_weight += route.weight
                if random_value <= cumulative_weight:
                    return route.element

        elif routing_method == RoutingMethod.PRIOR:
            routes_prior_desc = sorted(routes, key=lambda r: r.weight, reverse=True)

            for route in routes_prior_desc:
                element = route.element

                if not element or element.get_state() == State.FREE or not element.queue.full():  # type: ignore
                    return element

            return routes_prior_desc[0].element

    def set_tcurr(self, tcurr: float):
        self.tcurr = tcurr

    def get_state(self):
        return self.state

    def in_act(self, job: J):
        pass

    def out_act(self):
        pass

    def do_statistics(self, delta: float):
        pass

    def print_info(self):
        print(f"{self.name}: {self.state=} {self.quantity=} {self.tnext=}")

    def print_result(self):
        print(f"{self.name}: quantity = {self.quantity}")
