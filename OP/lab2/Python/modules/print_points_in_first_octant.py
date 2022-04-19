from modules.verify_first_octant import verify_first_octant
from modules.MaterialPoint import MaterialPoint


def print_points_in_first_octant(points: list[MaterialPoint]):
    """Prints indices of the points in vector that moved into
    the first octant after position changing.
    Args:
        points (list[MaterialPoint]): vector of points
    """

    print("\nPoints that moved into the first octant:", end="")

    in_first_octant = 0  # Total points in the first octant

    for idx, point in enumerate(points):
        if (verify_first_octant(point)):
            print(f" {idx + 1},", end="")
            in_first_octant += 1

    if (in_first_octant):
        print("\b.")
    else:
        print(" none.")
