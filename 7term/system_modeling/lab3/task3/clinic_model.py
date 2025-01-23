from task1.model import Model
from .attendant import Attendant
from .lab_technician import LabTechnician
from .patient import PatientType


class ClinicModel(Model):
    def print_result(self):
        print("\n--------RESULTS--------")
        for el in self.elements:
            el.print_result()

        print(f"\ntime spent in clinic by patients of type 1 and 2 = {self._get_time_in_clinic(1, 2)}")
        print(f"time spent in clinic by patients of type 3 = {self._get_time_in_clinic(3)}")
        print(f"time interval between patients arrival to the lab = {self._get_lab_arrival_interval()}")

    def _get_time_in_clinic(self, *patient_types: PatientType):
        if 3 not in patient_types:
            return sum(el.get_avg_time_in_clinic() for el in self.elements if isinstance(el, Attendant))
        else:
            return sum(el.get_avg_time_in_clinic() for el in self.elements if isinstance(el, LabTechnician))

    def _get_lab_arrival_interval(self):
        return sum(el.get_avg_arrival_interval() for el in self.elements if isinstance(el, LabTechnician))
