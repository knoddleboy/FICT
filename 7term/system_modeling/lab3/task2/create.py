from task1.create import Create as BaseCreate


class Create(BaseCreate):
    def get_next_element(self):
        if self.next_elements is None:
            raise ValueError("Cashier routes are not set.")

        routes = self.next_elements.routes
        cashier1 = routes[0].element
        cashier2 = routes[1].element

        if cashier1.queue == cashier2.queue:  # type: ignore
            return cashier1

        route_min_queue = min(routes, key=lambda r: len(r.element.queue))  # type: ignore
        return route_min_queue.element
