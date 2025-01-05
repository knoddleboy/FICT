import express from "express";
import * as departmentController from "../controllers/departmentController";

const router = express.Router();

router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartment);
router.post("/", departmentController.createDepartment);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

export default router;
