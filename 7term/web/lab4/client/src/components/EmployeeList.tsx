import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableColumns, TableData } from "./Table";
import { Link } from "react-router-dom";

type Employee = {
  id: number;
  name: string;
  email: string;
  department: { id: number; name: string };
  computerSpecs: { id: number; cpu: string; ram: string; storage: string };
};

type EmployeeTableData = {
  id: number;
  name: Employee["name"];
  email: string;
  department: Employee["department"]["name"];
  cpu: Employee["computerSpecs"]["cpu"];
  ram: Employee["computerSpecs"]["ram"];
  storage: Employee["computerSpecs"]["storage"];
};

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>("http://localhost:3000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const tableColumns: TableColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
    { header: "CPU", accessor: "cpu" },
    { header: "RAM", accessor: "ram" },
    { header: "Storage", accessor: "storage" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData: TableData<EmployeeTableData> = employees.map(
    (employee) =>
      ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department.name,
        cpu: employee.computerSpecs.cpu,
        ram: employee.computerSpecs.ram,
        storage: employee.computerSpecs.storage,
      } satisfies EmployeeTableData)
  );

  const renderActions = (employee: EmployeeTableData) => (
    <div className="space-x-2">
      <Link
        to={`/employees/edit/${employee.id}`}
        className="inline-block rounded bg-indigo-600 px-4 py-1 text-xs font-medium text-white hover:bg-indigo-700"
      >
        Edit
      </Link>
      <button
        className="inline-block rounded bg-red-600 px-4 py-1 text-xs font-medium text-white hover:bg-red-700"
        onClick={() => deleteEmployee(employee.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <>
      <h1 className="text-xl font-bold">Employees</h1>
      <Table columns={tableColumns} data={tableData} renderActions={renderActions} />
    </>
  );
};
