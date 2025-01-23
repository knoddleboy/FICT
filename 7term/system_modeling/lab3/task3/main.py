from task1.generators import ExponentialGenerator, UniformGenerator, ErlangGenerator
from task1.routing import Routes, Route, RoutingMethod
from .create import Create
from .doctor import DoctorProcess
from .attendant import Attendant
from .lab_registry import LabRegistry
from .lab_technician import LabTechnician
from .hallway import Hallway
from .clinic_model import ClinicModel

create = Create("Patient admissions", ExponentialGenerator(mean=15))

doctors = DoctorProcess("On-call doctors", n_doctors=2)
attendants = Attendant("Attendants", UniformGenerator(min=3, max=8), n_attendants=3)  # 1
lab_registry = LabRegistry("Lab registry", ErlangGenerator(mean=4.5, k=3))
lab_technicians = LabTechnician("Lab technicians", ErlangGenerator(mean=4, k=2), n_techs=2)  # 1

hallway_dist = UniformGenerator(min=2, max=5)
hallway_doctors_lab = Hallway("Hallway from doctors to lab", hallway_dist)
hallway_lab_doctors = Hallway("Hallway from lab to doctors", hallway_dist)

create.next_elements = Routes(Route(doctors))
doctors.next_elements = Routes(Route(hallway_doctors_lab, 2), Route(attendants, 1), routing_method=RoutingMethod.PRIOR)
hallway_doctors_lab.next_elements = Routes(Route(lab_registry))
lab_registry.next_elements = Routes(Route(lab_technicians))
lab_technicians.next_elements = Routes(
    Route(hallway_lab_doctors, 2), Route(None, 1), routing_method=RoutingMethod.PRIOR
)
hallway_lab_doctors.next_elements = Routes(Route(doctors))

model = ClinicModel(
    create, doctors, attendants, hallway_doctors_lab, lab_registry, lab_technicians, hallway_lab_doctors
)
model.simulate(10000)
