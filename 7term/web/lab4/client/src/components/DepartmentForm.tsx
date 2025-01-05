import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "./Input";
import { toast } from "sonner";

export const DepartmentForm: React.FC = () => {
  const [name, setName] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDepartment(parseInt(id));
    }
  }, [id]);

  const fetchDepartment = async (departmentId: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/departments/${departmentId}`);
      setName(response.data.name);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/departments/${id}`, { name });
      } else {
        await axios.post("http://localhost:3000/api/departments", { name });
      }
      navigate("/departments");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        toast.error(error.response.data.error);
      } else {
        console.error("Error deleting department:", error);
      }
    }
  };

  return (
    <>
      <h1 className="text-xl font-bold">{id ? "Edit Department" : "Add Department"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-screen-sm">
        <Input
          label="Name:"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          {id ? "Update" : "Add"} Department
        </button>
      </form>
    </>
  );
};
