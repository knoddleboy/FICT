import os.path
from modules.date_to_years import date_to_years


def remove_less_than_year(file_content: list[list[str]], filepath: str):
    try:
        with open(os.path.dirname(__file__) + filepath, "wb") as f:

            # Iterate over each line: if found one with work years less than 1 – skip
            for idx, line in enumerate(file_content):
                if date_to_years(file_content, idx, 2) >= 1:
                    f.write(b",".join(line) + b"\n")
    finally:
        print(f"\n[ {filepath} ] is successfully overwritted!")
