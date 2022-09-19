from random import uniform


def rand_range(min: float = -20.0, max: float = 20.0, precision: int = 2):
    return round(uniform(min, max), precision)
