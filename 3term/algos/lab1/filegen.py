from math import log10
import numpy as np
from sys import argv


def main():
    if (len(argv) != 3):
        print("Wrong number of arguments.\n    Usage: filegen.py <output_file_path> <output_size_bytes>")
        quit(1)

    file_path, file_size = argv[1], eval(argv[2])

    f = open(file_path, "a")

    num_max = 10000

    np.random.randint(0, num_max, size=int(file_size/int(log10(num_max)))
                      ).tofile(f, sep='\n', format='%s')

    print("Done!")

    f.close()


if __name__ == "__main__":
    main()
