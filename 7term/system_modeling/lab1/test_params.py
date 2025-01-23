import numpy as np
from constants import SAMPLE_SIZE, N_TESTS
from stats import Stats


class TestParams:
    def __init__(
        self, generator_class, params_list, n_tests=N_TESTS, sample_size=SAMPLE_SIZE
    ) -> None:
        self.generator_class = generator_class
        self.params_list = params_list
        self.n_tests = n_tests
        self.sample_size = sample_size
        self.results = {}

    def run(self):
        for params in self.params_list:
            success_count = 0
            gen = self.generator_class(**params)

            for _ in range(self.n_tests):
                data = np.array([next(gen.generate()) for _ in range(self.sample_size)])
                stats = Stats(data, generator_class=gen)
                chi_stat, chi_crit = stats.chi_squared_test()

                if chi_stat < chi_crit:
                    success_count += 1

            percent_good_outcomes = (success_count / self.n_tests) * 100
            self.results[str(params)] = percent_good_outcomes

        return self.results

    def print(self):
        print("\n".join(f"{key}: {value}" for key, value in self.results.items()))
