from TFunction import TFunction
from Utils import rand_range


class LinearFunction(TFunction):
    def __init__(self):
        super().__init__()

        self.__linear_coeff = rand_range()
        self.__free_term = rand_range()

    def increase_coefficients(self, scalar: float):
        self.__linear_coeff += scalar
        self.__free_term += scalar

    def decrease_coefficients(self, scalar: float):
        return super().decrease_coefficients(scalar)

    def evaluate_point(self, x_value: float):
        self._point = x_value
        self._point_evaluated = self.__linear_coeff * x_value + self.__free_term

    def __str__(self):
        return f"f(x) = {self.__linear_coeff:.2f}x{self.__free_term:+g}"

    def __repr__(self):
        return self.__str__
