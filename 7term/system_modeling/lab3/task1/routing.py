from __future__ import annotations
from enum import Enum
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .element import Element


class RoutingMethod(Enum):
    PROB = "probabilistic"
    PRIOR = "priority"


class Route:
    def __init__(self, element: Optional[Element], weight: Optional[int | float] = None):
        self.element = element
        self.weight = weight or 1.0
        self.routing_method = RoutingMethod.PROB


class Routes:
    def __init__(self, *routes: Route, routing_method: RoutingMethod = RoutingMethod.PROB):
        self.routes = routes
        self.routing_method = routing_method

        if not self.routes:
            raise ValueError("At least one route must be provided.")

        for route in self.routes:
            route.routing_method = self.routing_method

            if self.routing_method == RoutingMethod.PROB and isinstance(route.weight, int):
                raise ValueError(f"'weight' must be a float between 0 and 1 for {RoutingMethod.PROB.value} routing.")
            elif self.routing_method == RoutingMethod.PRIOR and isinstance(route.weight, float):
                raise ValueError(f"'weight' must be an integer for {RoutingMethod.PRIOR.value} routing.")

        if self.routing_method == RoutingMethod.PROB:
            sum_probs = sum(route.weight for route in self.routes)
            if sum_probs > 1:
                raise ValueError(
                    f"Total probability exceeds 1.0 (current total: {sum_probs}). Ensure the sum of probabilities for all routes is <= 1.0."
                )

    def __iter__(self):
        return iter(self.routes)
