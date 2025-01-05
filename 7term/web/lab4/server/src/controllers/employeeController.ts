import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { Department } from "../entities/Department";
import { ComputerSpecs } from "../entities/ComputerSpecs";
import { isQueryFailedError } from "../errors/isQueryFailedError";

const employeeRepository = AppDataSource.getRepository(Employee);
const departmentRepository = AppDataSource.getRepository(Department);
const computerSpecsRepository = AppDataSource.getRepository(ComputerSpecs);

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await employeeRepository.find({
      relations: {
        department: true,
        computerSpecs: true,
      },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const employee = await employeeRepository.findOne({
      where: { id },
      relations: {
        department: true,
        computerSpecs: true,
      },
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  const { name, email, departmentId, computerSpecs } = req.body;

  try {
    const department = await departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const newComputerSpecs = await computerSpecsRepository.save(
      computerSpecsRepository.create(computerSpecs as ComputerSpecs)
    );

    const employee = employeeRepository.create({
      name,
      email,
      department,
      computerSpecs: newComputerSpecs,
    });

    await employeeRepository.save(employee);
    res.status(201).json(employee);
  } catch (error) {
    if (isQueryFailedError(error) && error.code === "23505") {
      return res.status(409).json({ error: "Employee with this email already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, departmentId, computerSpecs } = req.body;

  try {
    const employee = await employeeRepository.findOne({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    employee.name = name;
    employee.email = email;

    if (departmentId) {
      const department = await departmentRepository.findOne({ where: { id: departmentId } });
      if (!department) {
        return res.status(404).json({ error: "Department not found" });
      }
      employee.department = department;
    }

    if (computerSpecs) {
      employee.computerSpecs = computerSpecs;
    }

    await employeeRepository.save(employee);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const employee = await employeeRepository.findOne({ where: { id } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await employeeRepository.remove(employee);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
