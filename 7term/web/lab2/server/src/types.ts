import type { JwtPayload } from "jsonwebtoken";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export type User = {
  username: string;
  password: string;
  role: Role;
};

export interface UserPayload extends JwtPayload {
  username: string;
  role: Role;
}
