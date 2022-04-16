def print_results(chosen_workers: list[str], condition: int):

    def print_workers(chosen_workers: list[str]):
        total_amount = 0

        # Formatting...
        for worker in chosen_workers:
            print(f"| {worker:<25} |")
            total_amount += 1

        print(f"| In total:{total_amount:>16} |")
        print("+---------------------------+")

    # Print workers over 40 years
    if condition == 1:
        print("\n+---------------------------+\n| Workers over 40 years:    |\n+---------------------------+")
        print_workers(chosen_workers)

    # Print workers working over 20 years
    elif condition == 2:
        print("\n+---------------------------+\n| Work 20 and more years:   |\n+---------------------------+")
        print_workers(chosen_workers)
