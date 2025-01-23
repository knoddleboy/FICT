import random
import math
from abc import ABC, abstractmethod
from dataclasses import dataclass


class DelayGenerator(ABC):
    @abstractmethod
    def generate(self) -> float | int: ...

    def nonzero_random(self):
        a = 0
        while a == 0:
            a = random.random()
        return a


@dataclass(frozen=True)
class ExponentialGenerator(DelayGenerator):
    mean: float

    def generate(self):
        a = self.nonzero_random()
        a = -self.mean * math.log(a)
        return a


@dataclass(frozen=True)
class NormalGenerator(DelayGenerator):
    mean: float
    dev: float

    def generate(self):
        a = self.mean + self.dev * random.gauss()
        return a


@dataclass(frozen=True)
class UniformGenerator(DelayGenerator):
    min: float
    max: float

    def generate(self):
        a = self.nonzero_random()
        a = self.max + a * (self.max - self.min)
        return a


@dataclass(frozen=True)
class ErlangGenerator(DelayGenerator):
    mean: float
    k: int

    def generate(self):
        lambda_ = self.k / self.mean
        sum_unifs = sum(math.log(random.random()) for _ in range(self.k))
        return (-1 / lambda_) * sum_unifs
