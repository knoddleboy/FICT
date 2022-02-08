from io import TextIOWrapper


def copy_original_file_data(original_file: TextIOWrapper, output_file: TextIOWrapper):
    original_file.seek(0)  # return pointer to the beginning of the original_file

    for line in original_file:
        last_char = line.split(" ", 1)[0][-1]  # Get last character of the first word in a line
        output_file.write(f"{line[:-1]}{last_char}\n")
