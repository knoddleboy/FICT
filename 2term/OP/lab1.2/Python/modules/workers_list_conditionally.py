from modules.date_to_years import date_to_years


def workers_list_conditionally(file_content: list[list[str]], condition: int) -> list[str]:
    workers_list = []

    for idx, worker in enumerate(file_content):

        # condition 1 represents amount of workers over 40 years, 2 – working over 20 years
        if condition == 1:
            if date_to_years(file_content, idx, condition) > 40:
                workers_list.append(worker[0].decode('utf-8'))

        elif condition == 2:
            if date_to_years(file_content, idx, condition) >= 20:
                workers_list.append(worker[0].decode('utf-8'))

    return workers_list
