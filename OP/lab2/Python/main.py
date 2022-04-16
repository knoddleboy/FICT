from modules.MaterialPoint import MaterialPoint
from modules.show_coords_table import show_coords_table
from modules.print_points_in_first_octant import print_points_in_first_octant

if __name__ == "__main__":
    time = float(input("Time in seconds: "))
    number_of_points = int(input("The number of points: "))

    material_points = [MaterialPoint() for _ in range(number_of_points)]

    show_coords_table(material_points, "Points")

    for point in material_points:
        point.update_point_position(time)

    show_coords_table(material_points, "Points over time")

    print_points_in_first_octant(material_points)
