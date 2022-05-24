from TFunction import TFunction
from Utils import rand_range


class QuadraticFunction(TFunction):
    def __init__(self):
        super().__init__()

        self.__quadratic_coeff = rand_range()
        self.__linear_coeff = rand_range()
        self.__free_term = rand_range()

    def decrease_coefficients(self, scalar: float):
        self.__quadratic_coeff -= scalar
        self.__linear_coeff -= scalar
        self.__free_term -= scalar

    def increase_coefficients(self, scalar: float):
        return super().increase_coefficients(scalar)

    def evaluate_point(self, x_value: float):
        self._point = x_value
        self._point_evaluated = self.__quadratic_coeff * x_value ** 2 + self.__linear_coeff * x_value + self.__free_term

    def __str__(self):
        return f"f(x) = {self.__quadratic_coeff:.2f}x^2{self.__linear_coeff:+g}x{self.__free_term:+g}"

    def __repr__(self):
        return self.__str__
