import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Department } from "../entities/Department";
import { isQueryFailedError } from "../errors/isQueryFailedError";

const departmentRepository = AppDataSource.getRepository(Department);

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await departmentRepository.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const department = await departmentRepository.findOne({ where: { id } });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const department = departmentRepository.create({ name });
    await departmentRepository.save(department);
    res.status(201).json(department);
  } catch (error) {
    if (isQueryFailedError(error) && error.code === "23505") {
      return res.status(409).json({ error: "Department with this name already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  try {
    const department = await departmentRepository.findOne({ where: { id } });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    department.name = name;
    await departmentRepository.save(department);
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const department = await departmentRepository.findOne({ where: { id } });
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    await departmentRepository.remove(department);
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    if (isQueryFailedError(error) && error.code === "23503") {
      return res
        .status(409)
        .json({ error: "You cannot delete this department because it has more than one employee" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
