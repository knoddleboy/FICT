from task1.generators import ExponentialGenerator, NormalGenerator
from task1.element import State
from task1.routing import Routes, Route, RoutingMethod
from task1.job import Job
from .create import Create
from .cashier import Cashier
from .bank_model import BankModel


create = Create("Create", ExponentialGenerator(mean=0.5))
cashier1 = Cashier("Cashier #1", ExponentialGenerator(mean=0.3))
cashier2 = Cashier("Cashier #2", ExponentialGenerator(mean=0.3))

cashier1.adjacent_lines = [cashier2]
cashier2.adjacent_lines = [cashier1]

cashier1.set_queue_maxsize(3)
cashier2.set_queue_maxsize(3)

initial_duration = NormalGenerator(mean=1, dev=0.3).generate()
cashier1.set_initial_tnext(initial_duration)
cashier2.set_initial_tnext(initial_duration)
cashier1.set_initial_state(State.BUSY)
cashier2.set_initial_state(State.BUSY)

create.tnext = 0.1

cashier1.queue.extend([Job(0), Job(0)])
cashier2.queue.extend([Job(0), Job(0)])

create.next_elements = Routes(Route(cashier1, 2), Route(cashier2, 1), routing_method=RoutingMethod.PRIOR)

model = BankModel(create, cashier1, cashier2)
model.simulate(2000)
