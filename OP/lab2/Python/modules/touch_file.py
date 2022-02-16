import os.path
from io import TextIOWrapper


def touch_file(filepath: str, mode: str) -> TextIOWrapper:
    try:
        f = open(os.path.dirname(__file__) + filepath, mode)
        return f

    except (OSError, IOError) as e:
        print(e)
        exit(1)
