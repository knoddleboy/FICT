from modules.MaterialPoint import MaterialPoint


def show_coords_table(points: list[MaterialPoint], header_title: str):
    """Displays a table of points' coordinates and vectors.
    Args:
        points (list[MaterialPoint]): vector of points
        header_title (str): table title
    """

    print(f"\n+--+{header_title.center(26, '-')}+")

    for idx, point in enumerate(points):
        print(f"|{idx+1:>2}| ({point.coords[0]:>6}, {point.coords[1]:>6}, {point.coords[2]:>6}) |")

    print("+--+--------------------------+")
