import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Table, TableColumns, TableData } from "./Table";

type Department = {
  id: number;
  name: string;
};

export const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get<Department[]>("http://localhost:3000/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error(error.response.data.error);
      } else {
        console.error("Error deleting department:", error);
      }
    }
  };

  const tableColumns: TableColumns = [
    { header: "Name", accessor: "name" },
    { header: "Actions", accessor: "actions" },
  ];

  const tableData: TableData<Department> = departments.map(
    (department) =>
      ({
        id: department.id,
        name: department.name,
      } satisfies Department)
  );

  const renderActions = (department: Department) => (
    <div className="space-x-2">
      <Link
        to={`/departments/edit/${department.id}`}
        className="inline-block rounded bg-indigo-600 px-4 py-1 text-xs font-medium text-white hover:bg-indigo-700"
      >
        Edit
      </Link>
      <button
        className="inline-block rounded bg-red-600 px-4 py-1 text-xs font-medium text-white hover:bg-red-700"
        onClick={() => deleteDepartment(department.id)}
      >
        Delete
      </button>
    </div>
  );

  return (
    <>
      <h1 className="text-xl font-bold">Departments</h1>
      <Table columns={tableColumns} data={tableData} renderActions={renderActions} />
    </>
  );
};
