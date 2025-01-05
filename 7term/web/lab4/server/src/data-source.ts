import { DataSource } from "typeorm";
import { Employee } from "./entities/Employee";
import { Department } from "./entities/Department";
import { ComputerSpecs } from "./entities/ComputerSpecs";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Employee, Department, ComputerSpecs],
  synchronize: true,
  logging: false,
});
