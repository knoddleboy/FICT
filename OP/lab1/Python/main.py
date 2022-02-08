from os import system

from modules.fill_original_file import fill_original_file
from modules.touch_file import touch_file
from modules.copy_original_file_data import copy_original_file_data
from modules.display_files import display_files


def main():
    original_file_path = "../../../assets/original.txt"
    output_file_path = "../../../assets/output.txt"

    # Create original file in read-write mode and fill it
    original_file = fill_original_file(touch_file(original_file_path, "w+"))

    # Create output file in read-write mode
    output_file = touch_file(output_file_path, "w+")

    # Copy all the data to the `output_file`
    copy_original_file_data(original_file, output_file)

    # Display files' content
    display_files(original_file, output_file)

    output_file.close()
    original_file.close()

    system("pause")


if __name__ == '__main__':
    main()
