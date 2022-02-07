from io import TextIOWrapper
import os.path
from datetime import datetime as dt
from sys import exit
from os import system


def remove_less_than_year(csv_content: list[list[str]], path: str):
    try:
        with open(os.path.dirname(__file__) + path, "w+t") as f:
            for idx, line in enumerate(csv_content):
                if date_to_years(csv_content, idx, 2) >= 1:
                    f.write(",".join(map(str, line)) + "\n")
    finally:
        print(f"\n[ {path} ] is successfully overwritted!")


def print_results(chosen_workers: list[str], condition: int):

    def print_workers(chosen_workers: list[str]):
        total_amount = 0

        for worker in chosen_workers:
            print(f"| {worker:<25} |")
            total_amount += 1

        print(f"| In total:{total_amount:>16} |")
        print("+---------------------------+")

    if condition == 1:
        print("\n+---------------------------+\n| Workers over 40 years:    |\n+---------------------------+")
        print_workers(chosen_workers)

    elif condition == 2:
        print("\n+---------------------------+\n| Work 20 and more years:   |\n+---------------------------+")
        print_workers(chosen_workers)


def date_to_years(csv_content: list[list[str]], file_line_idx: int, date_idx: int) -> int:
    today = dt.today()
    data_obj = dt.strptime(csv_content[file_line_idx][date_idx].replace('.', ''), "%d%m%Y").date()

    return today.year - data_obj.year - ((today.month, today.day) < (data_obj.month, data_obj.day))


def workers_list_conditionally(csv_content: list[list[str]], condition: int) -> list[str]:
    workers_list = []

    for idx, worker in enumerate(csv_content):
        if condition == 1:
            if date_to_years(csv_content, idx, condition) > 40:
                workers_list.append(worker[0])

        elif condition == 2:
            if date_to_years(csv_content, idx, condition) >= 20:
                workers_list.append(worker[0])

    return workers_list


def parse_csv_data(path: str) -> list[list[str]] | TextIOWrapper:
    try:
        with open(os.path.dirname(__file__) + path, "rt") as f:
            file_data = list(map(lambda x: x.strip().split(','), f.readlines()))
            return file_data, f

    except (OSError, IOError) as e:
        print(e)
        exit(1)


def main():
    file_path = "/../assets/companyData.csv"

    csv_file_content, file_origin = parse_csv_data(file_path)

    workers_over_40_years = workers_list_conditionally(csv_file_content, 1)
    print_results(workers_over_40_years, 1)

    workers_working_20_years = workers_list_conditionally(csv_file_content, 2)
    print_results(workers_working_20_years, 2)

    remove_less_than_year(csv_file_content, file_path)

    file_origin.close()
    system("pause")


if __name__ == '__main__':
    main()
