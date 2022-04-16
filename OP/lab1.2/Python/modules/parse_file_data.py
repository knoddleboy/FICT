from io import TextIOWrapper


def parse_file_data(file: TextIOWrapper) -> list[list[str]]:
    file.seek(0)  # return pointer to the beginning of the file
    file_content = []

    # Read every line and save one splitted by commas into a list
    for line in file.readlines():
        file_content.append(line.strip().split(b','))

    return file_content
