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
