import { User } from "./types";

declare global {
  namespace Express {
    interface Request {
      user: Omit<User, "password">;
    }
  }
}
