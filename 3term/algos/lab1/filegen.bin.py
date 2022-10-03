import numpy as np
from sys import argv
from math import log10
from time import time


def main():
    if (len(argv) != 4):
        print(
            f"Wrong number of arguments.\n    Usage: {argv[0]} <output_file_path> <output_size_bytes> <range:min-max>")
        quit(1)

    file_path, file_size = argv[1], eval(argv[2])
    n_min, n_max = list(map(int, argv[3].split('-')))

    with open(file_path, "wb") as f:
        start = time()

        # 0.094(file_size)^0.987
        b = np.random.randint(
            n_min,
            n_max,
            size=int(file_size/8)
        ).tobytes()

        f.write(b)

        print(f"--- {file_path} filled in {time() - start:.6f} seconds ---")


if __name__ == "__main__":
    main()
