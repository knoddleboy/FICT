from generator import ExponentialGenerator, NormalGenerator, LinearCongruentialGenerator
from constants import SAMPLE_SIZE
from stats import Stats
from test_params import TestParams


def test_exponential_params():
    params = [
        {"lambda_": 0.1},
        {"lambda_": 0.2},
        {"lambda_": 0.5},
        {"lambda_": 1.0},
        {"lambda_": 1.5},
        {"lambda_": 2.0},
        {"lambda_": 5.0},
        {"lambda_": 10.0},
        {"lambda_": 20.0},
    ]
    test_runner = TestParams(ExponentialGenerator, params)
    test_runner.run()
    test_runner.print()


def test_normal_params():
    params = [
        {"a": 0.0, "sigma": 1.0},
        {"a": 0.0, "sigma": 2.0},
        {"a": 0.0, "sigma": 5.0},
        {"a": 5.0, "sigma": 1.0},
        {"a": 5.0, "sigma": 2.0},
        {"a": 5.0, "sigma": 5.0},
        {"a": 10.0, "sigma": 1.0},
        {"a": 10.0, "sigma": 2.0},
        {"a": 10.0, "sigma": 5.0},
    ]
    test_runner = TestParams(NormalGenerator, params)
    test_runner.run()
    test_runner.print()


def test_lincon_params():
    params = [
        {"a": 3**13, "c": 2**31},
        {"a": 3**13, "c": 2**64},
        {"a": 3**15, "c": 2**31},
        {"a": 3**15, "c": 2**64},
        {"a": 5**13, "c": 2**31},
        {"a": 5**13, "c": 2**64},
        {"a": 5**15, "c": 2**31},
        {"a": 5**15, "c": 2**64},
        {"a": 6**13, "c": 2**31},  # 0 success rate example
    ]
    test_runner = TestParams(LinearCongruentialGenerator, params)
    test_runner.run()
    test_runner.print()


def main():
    gens = [
        ExponentialGenerator(lambda_=0.5),
        NormalGenerator(a=5, sigma=1),
        LinearCongruentialGenerator(a=5**13, c=2**31),
    ]

    for gen in gens:
        data = [next(gen.generate()) for _ in range(SAMPLE_SIZE)]
        stats = Stats(data, generator_class=gen)
        stats.plot_histogram()


#   test_exponential_params()
#   test_normal_params()
#   test_lincon_params()


if __name__ == "__main__":
    main()
