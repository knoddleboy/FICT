from .create import Create
from .process import Process
from .generators import ExponentialGenerator, NormalGenerator
from .routing import Routes, Route, RoutingMethod
from .model import Model


create = Create("Create", ExponentialGenerator(mean=1.0))
process1 = Process("Process #1", ExponentialGenerator(mean=2.0), n_channels=3)
process2 = Process("Process #2", NormalGenerator(mean=4.0, dev=1.0), n_channels=4)
process3 = Process("Process #3", ExponentialGenerator(mean=1.0))

process1.set_queue_maxsize(2)
process3.set_queue_maxsize(5)

create.next_elements = Routes(
    Route(process1, 3), Route(process2, 1), Route(process3, 1), routing_method=RoutingMethod.PRIOR
)
process1.next_elements = Routes(Route(process2, 0.7), Route(process3, 0.3))
process2.next_elements = Routes(Route(None, 0.8), Route(process3, 0.2))
process3.next_elements = Routes(Route(None))

model = Model(create, process1, process2, process3)
model.simulate(1000)
