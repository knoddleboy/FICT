import numpy as np
from scipy.stats import norm


class RandomNumberGenerator:
    def generate(self):
        raise NotImplementedError("Subclasses should implement this method")

    def cdf(self):
        raise NotImplementedError("Subclasses should implement this method")


class ExponentialGenerator(RandomNumberGenerator):
    def __init__(self, lambda_: float) -> None:
        if lambda_ == 0:
            raise ValueError("Lambda cannot be 0")

        self.lambda_ = lambda_
        self.rng = np.random.default_rng()

    def generate(self):
        while True:
            u = self.rng.random()
            yield -np.log(u) / self.lambda_

    def cdf(self, x: float):
        return 1 - np.exp(-self.lambda_ * x)


class NormalGenerator(RandomNumberGenerator):
    def __init__(self, a: float, sigma: float) -> None:
        self.a = a
        self.sigma = sigma
        self.rng = np.random.default_rng()

    def generate(self):
        while True:
            mu_i = np.sum(self.rng.random(12))
            yield self.sigma * (mu_i - 6) + self.a

    def cdf(self, x: float):
        return norm.cdf(x, loc=self.a, scale=self.sigma)


class LinearCongruentialGenerator(RandomNumberGenerator):
    def __init__(self, a: int, c: int, seed: int = 42) -> None:
        self.a = a
        self.c = c
        self.z = seed
        self.rng = np.random.default_rng()

    def generate(self):
        while True:
            self.z = (self.a * self.z) % self.c
            yield self.z / self.c  # normalize to the range [0, 1)

    def cdf(self, x: float):
        return min(max(x, 0), 1)
