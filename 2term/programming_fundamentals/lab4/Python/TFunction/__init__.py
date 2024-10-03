from abc import ABC, abstractmethod


class TFunction(ABC):
    def __init__(self):
        self._point = None
        self._point_evaluated = None

    @abstractmethod
    def increase_coefficients(self, scalar: float):
        pass

    @abstractmethod
    def decrease_coefficients(self, scalar: float):
        pass

    @abstractmethod
    def evaluate_point(self, x_value: float):
        pass

    @property
    def get_evaluated_value(self):
        return self._point_evaluated

    @property
    def show_evaluated_value(self):
        return f"f({self._point}) = {self._point_evaluated:.2f}"
