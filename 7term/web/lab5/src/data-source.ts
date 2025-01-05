import { DataSource } from "typeorm";
import { Employee } from "./entity/Employee";
import { Department } from "./entity/Department";
import { ComputerSpecs } from "./entity/ComputerSpecs";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Employee, Department, ComputerSpecs],
  synchronize: true,
  logging: false,
});
