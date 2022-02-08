from io import TextIOWrapper


def display_files(original_file: TextIOWrapper, output_file: TextIOWrapper):
    original_file.seek(0)
    output_file.seek(0)

    print(f"\n[ Original file ]\n{original_file.read()}")
    print(f"\n[ Output file ]\n{output_file.read()}")
