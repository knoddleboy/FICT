from create import Create
from process import Process
from generators import ExponentialGenerator
from model import Model


def task_1_2():
    create = Create("Create", ExponentialGenerator(mean=2.0))
    process = Process("Process", ExponentialGenerator(mean=1.0))

    process.max_queue = 5
    create.next_elements = [process]

    model = Model([create, process])
    model.simulate(1000.0)


def task_3_4():
    create = Create("Create", ExponentialGenerator(mean=2.0))
    process1 = Process("Process #1", ExponentialGenerator(mean=1.0))
    process2 = Process("Process #2", ExponentialGenerator(mean=1.0))
    process3 = Process("Process #3", ExponentialGenerator(mean=1.0))

    process1.max_queue = 5
    process2.max_queue = 10
    process3.max_queue = 5

    create.next_elements = [process1]
    process1.next_elements = [process2]
    process2.next_elements = [process3]

    model = Model([create, process1, process2, process3])
    model.simulate(1000.0)


def task_5_6():
    create = Create("Create", ExponentialGenerator(mean=2.0))
    process1 = Process("Process #1", ExponentialGenerator(mean=1.0))
    process2 = Process("Process #2", ExponentialGenerator(mean=1.0), n_channels=2)
    process3 = Process("Process #3", ExponentialGenerator(mean=1.0))

    process1.max_queue = 10
    process2.max_queue = 5
    process3.max_queue = 5

    create.next_elements = [process1]
    process1.next_elements = [process2]
    process2.next_elements = [process1]
    process2.next_elements = [process3]

    model = Model([create, process1, process2, process3])
    model.simulate(1000.0)


if __name__ == "__main__":
    # task_1_2()
    # task_3_4()
    task_5_6()
