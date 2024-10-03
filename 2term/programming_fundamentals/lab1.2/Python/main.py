from modules.touch_file import touch_file
from modules.input_into_file import input_into_file
from modules.parse_file_data import parse_file_data
from modules.workers_list_conditionally import workers_list_conditionally
from modules.print_results import print_results
from modules.remove_less_than_year import remove_less_than_year


def main():
    file_path = "../../../assets/companyData.dat"

    # Extract content from input into the file
    file_origin = input_into_file(touch_file(file_path, "w+b"))

    # Extract words from each line of the file into a list of structs
    file_content = parse_file_data(file_origin)

    # Get the number of workers over 40 years
    workers_over_40_years = workers_list_conditionally(file_content, 1)
    print_results(workers_over_40_years, 1)

    # Get the number of workers who work 20 and more years
    workers_working_20_years = workers_list_conditionally(file_content, 2)
    print_results(workers_working_20_years, 2)

    file_origin.close()

    # Remove info about workers working less than a year
    remove_less_than_year(file_content, file_path)

    input()


if __name__ == '__main__':
    main()
