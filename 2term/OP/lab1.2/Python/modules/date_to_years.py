from datetime import datetime as dt


def date_to_years(file_content: list[list[str]], file_line_idx: int, date_idx: int) -> int:
    today = dt.today()  # today's date
    data_obj = dt.strptime(file_content[file_line_idx][date_idx].decode("utf-8").replace('.', ''), "%d%m%Y").date()

    # Considering (True) is 1 and (False) is 0 day-month corrention can be made like this:
    return today.year - data_obj.year - ((today.month, today.day) < (data_obj.month, data_obj.day))
