import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "./Input";
import { Select } from "./Select";
import { toast } from "sonner";

interface Department {
  id: number;
  name: string;
}

export const EmployeeForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get<Department[]>("http://localhost:3000/api/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
    if (id) {
      fetchEmployee(parseInt(id));
    }
  }, [id]);

  const fetchEmployee = async (employeeId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/employees/${employeeId}`);
      const employee = response.data;

      setName(employee.name);
      setEmail(employee.email);
      setDepartmentId(employee.department.id.toString());
      setCpu(employee.computerSpecs.cpu);
      setRam(employee.computerSpecs.ram);
      setStorage(employee.computerSpecs.storage);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData = {
      name,
      email,
      departmentId: parseInt(departmentId),
      computerSpecs: { cpu, ram, storage },
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/employees/${id}`, employeeData);
      } else {
        await axios.post("http://localhost:3000/api/employees", employeeData);
      }
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error(error.response.data.error);
      }

      console.error("Error saving employee:", error);
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">{id ? "Edit Employee" : "Add Employee"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-screen-sm">
        <Input
          label="Name:"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email:"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Select
          label="Department:"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        >
          <option value="">Please select</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id.toString()}>
              {department.name}
            </option>
          ))}
        </Select>
        <Input
          label="CPU:"
          type="text"
          placeholder="CPU"
          value={cpu}
          onChange={(e) => setCpu(e.target.value)}
          required
        />
        <Input
          label="RAM:"
          type="number"
          min={1}
          placeholder="RAM"
          value={ram}
          onChange={(e) => setRam(e.target.value)}
          required
        />
        <Input
          label="Storage:"
          type="number"
          min={1}
          placeholder="Storage"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          {id ? "Update" : "Add"} Employee
        </button>
      </form>
    </>
  );
};
