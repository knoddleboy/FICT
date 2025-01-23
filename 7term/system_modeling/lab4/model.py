from lab3.task1.model import Model as BaseModel
from lab3.task1.create import Create
from lab3.task1.generators import ExponentialGenerator
from lab3.task1.element import Element
from lab3.task1.routing import Routes, Route
from .process import Process


class Model(BaseModel):
    @classmethod
    def create_simple(cls, n_processes: int):
        assert n_processes > 0

        create = Create("Create", ExponentialGenerator(mean=2.0))

        elements: list[Element] = [create]

        for i in range(n_processes):
            p = Process(n_channels=1 if i < n_processes - 1 else 2)
            elements[-1].next_elements = Routes(Route(p))
            elements.append(p)

        return cls(*elements)

    @classmethod
    def create_complex(cls, n_processes: int):
        assert n_processes > 0

        create = Create("Create", ExponentialGenerator(mean=2.0))

        elements: list[Element] = [create]

        n_iter = n_processes - int(n_processes / 4)
        for i in range(n_iter):
            if (i + 1) % 3 == 0 and n_iter - i >= 2:
                p1 = Process()
                p2 = Process()
                elements[-1].next_elements = Routes(Route(p1, 0.7), Route(p2, 0.3))
                elements.extend([p1, p2])
            else:
                p = Process(n_channels=1 if i < n_processes - 1 else 2)

                if i % 3 == 0 and i > 0:
                    elements[-1].next_elements = Routes(Route(p))
                    elements[-2].next_elements = Routes(Route(p))
                else:
                    elements[-1].next_elements = Routes(Route(p))

                elements.append(p)

        return cls(*elements)

    def print_info(self): ...
    def print_result(self): ...
