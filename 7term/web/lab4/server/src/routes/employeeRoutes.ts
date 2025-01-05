import express from "express";
import * as employeeController from "../controllers/employeeController";

const router = express.Router();

router.get("/", employeeController.getAllEmployees);
router.get("/:id", employeeController.getEmployee);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
