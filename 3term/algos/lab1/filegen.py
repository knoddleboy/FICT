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

    with open(file_path, "w", encoding='utf-8') as f:
        start = time()
        np.random.randint(n_min, n_max, size=int(file_size/int(log10(n_max)+1))
                          ).tofile(f, sep='\n', format='%s')                        # 0.094 * file_size^0.987

        print(f"--- {file_path} filled in {time() - start:.6f} seconds ---")


if __name__ == "__main__":
    main()
