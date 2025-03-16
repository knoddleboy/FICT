def nth_kleene_star(set, n):
    if n <= 0:
        return []

    sorted(set)
    queue = [""]
    result = []

    while len(result) < n:
        curr = queue.pop(0)
        result.append(curr)

        for symbol in set:
            queue.append(curr + symbol)

    return result


print(nth_kleene_star(["aba", "ba"], 13))
