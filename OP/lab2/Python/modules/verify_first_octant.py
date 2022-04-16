from modules.MaterialPoint import MaterialPoint


def verify_first_octant(point: list[MaterialPoint]) -> bool:
    """Defines whether the provided point is in the first octant i.e. x, y and z are all positive.

    Args:
        point (list[MaterialPoint]): material point with defined coordinates

    Returns:
        bool: in the first octant or not
    """
    point_coords = point.coords
    return True if point_coords[0] >= 0 and point_coords[1] >= 0 and point_coords[2] >= 0 else False
