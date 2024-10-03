from modules.MaterialPoint import MaterialPoint
from modules.show_coords_table import show_coords_table
from modules.print_points_in_first_octant import print_points_in_first_octant

if __name__ == "__main__":
    time = float(input("Time in seconds: "))
    number_of_points = int(input("The number of points: "))

    # Create list of points
    material_points = [MaterialPoint() for _ in range(number_of_points)]

    # Print points after initialization
    show_coords_table(material_points, "Points")

    # Change points position
    for point in material_points:
        point.update_point_position(time)

    # Print points after updating their position
    show_coords_table(material_points, "Moved points")

    # Print points that moved into the first octant
    print_points_in_first_octant(material_points)
