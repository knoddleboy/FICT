import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./config";
import type { Role, UserPayload } from "./types";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
    if (error) {
      return res.status(403).json({ message: error.message });
    }

    const user = payload as UserPayload;

    req.user = {
      username: user.username,
      role: user.role,
    };

    next();
  });
};

export const authorizeRole =
  (requiredRole: Role) => (req: Request, res: Response, next: NextFunction) => {
    const role = req.user.role;

    if (role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "You do not have the required role for this resource" });
    }

    next();
  };
