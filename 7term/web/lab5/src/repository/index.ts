import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Department } from "../entity/Department";
import { ComputerSpecs } from "../entity/ComputerSpecs";

const employeeRepository = AppDataSource.getRepository(Employee);
const departmentRepository = AppDataSource.getRepository(Department);
const computerSpecsRepository = AppDataSource.getRepository(ComputerSpecs);

export default {
  employeeRepository,
  departmentRepository,
  computerSpecsRepository,
};
