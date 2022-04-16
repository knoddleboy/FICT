from random import uniform


class MaterialPoint:
    def __init__(self):
        self._coords = [round(uniform(-20.0, 20.0), 2) for _ in range(3)]
        self._vectors = [round(uniform(-20.0, 20.0), 2) for _ in range(3)]

    @property
    def coords(self):
        return self._coords

    def update_point_position(self, time: float):
        for i in range(3):
            self._coords[i] = round(self._coords[i] + self._vectors[i] * time, 2)
