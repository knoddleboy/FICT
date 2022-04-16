from io import TextIOWrapper


def fill_original_file(file: TextIOWrapper) -> TextIOWrapper:
    print("Enter the text:")
    while True:
        try:
            line = input()

        # EOF reaction
        except EOFError:
            break

        file.write(line)
        file.write("\n")

    return file
