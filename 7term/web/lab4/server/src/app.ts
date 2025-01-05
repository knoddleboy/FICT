import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import employeeRoutes from "./routes/employeeRoutes";
import departmentRoutes from "./routes/departmentRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
