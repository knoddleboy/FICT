import { Entity, PrimaryGeneratedColumn, Column, Check } from "typeorm";

@Entity()
@Check(`"ram" > 0`)
@Check(`"storage" > 0`)
export class ComputerSpecs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpu: string;

  @Column()
  ram: number;

  @Column()
  storage: number;
}
