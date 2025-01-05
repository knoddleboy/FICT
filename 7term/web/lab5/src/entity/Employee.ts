import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Department } from "./Department";
import { ComputerSpecs } from "./ComputerSpecs";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @OneToOne(() => ComputerSpecs, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  computerSpecs: ComputerSpecs;
}
