from io import TextIOWrapper


def input_into_file(file: TextIOWrapper) -> TextIOWrapper:
    print("Enter file data:")
    while True:
        try:
            line = input()

        # EOF reaction
        except EOFError:
            break

        file.write(line.encode() + b"\n")

    return file
