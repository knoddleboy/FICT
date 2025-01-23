from typing import Callable
from time import perf_counter
import matplotlib.pyplot as plt
from .model import Model


def analyse_model(model_factory_method: Callable[[int], Model]):
    modeling_time = 1000
    n_runs = 3

    n_processes_list = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]

    execution_times = []

    for n_processes in n_processes_list:
        total_execution_time = 0

        for _ in range(n_runs):
            model = model_factory_method(n_processes)
            start_time = perf_counter()
            model.simulate(modeling_time)
            end_time = perf_counter()
            total_execution_time += end_time - start_time

        execution_times.append(total_execution_time / n_runs)

    print(f"{model_factory_method}:\n{execution_times}")

    plt.plot(n_processes_list, execution_times, marker="o")
    plt.xlabel("Model complexity (no. events)")
    plt.ylabel("Modeling time (seconds)")
    plt.grid(True)
    plt.show()
