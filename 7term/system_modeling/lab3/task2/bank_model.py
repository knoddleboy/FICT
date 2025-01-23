from task1.element import Element
from task1.model import Model
from .cashier import Cashier


class BankModel(Model):
    def __init__(self, *elements: Element):
        super().__init__(*elements)
        self.total_clients = 0

    def print_result(self):
        super().print_result()

        print(f"average number of customers in bank = {self._get_avg_customers()}")
        print(f"average time interval between departures = {self._get_departure_interval()}")
        print(f"average customer time in bank = {self._get_avg_time_in_bank()}")
        print(f"percentage of customers denied service = {self._get_failure_prob()*100}%")
        print(f"queue changes = {self._get_queue_changes()}")

    def _get_avg_customers(self):
        total_clients = sum(el.total_clients for el in self.elements if isinstance(el, Cashier))
        return total_clients / self.tcurr

    def _get_departure_interval(self):
        total_processed = sum(el.quantity for el in self.elements if isinstance(el, Cashier))
        return self.tcurr / total_processed

    def _get_avg_time_in_bank(self):
        total_time = sum(
            (el.get_mean_queue() + el.get_avg_workload()) for el in self.elements if isinstance(el, Cashier)
        )
        rate = 1 / (self.elements[0].generator.mean or 1.0)  # type: ignore
        return total_time / rate

    def _get_failure_prob(self):
        total_failures = sum(el.failures for el in self.elements if isinstance(el, Cashier))
        total_quantity = sum(el.quantity for el in self.elements if isinstance(el, Cashier))
        return total_failures / (total_quantity + total_failures)

    def _get_queue_changes(self):
        return sum(el.queue_changes for el in self.elements if isinstance(el, Cashier))
