import { Link, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { EmployeeList } from "./components/EmployeeList";
import { EmployeeForm } from "./components/EmployeeForm";
import { DepartmentList } from "./components/DepartmentList";
import { DepartmentForm } from "./components/DepartmentForm";
import { Toaster } from "sonner";

const paths = [
  { path: "/", title: "Employees" },
  { path: "/employees/new", title: "Add Employee" },
  { path: "/departments", title: "Departments" },
  { path: "/departments/new", title: "Add Department" },
];

function NavLinks() {
  const location = useLocation();

  return (
    <ul className="space-y-1">
      {paths.map(({ path, title }) => (
        <li key={path}>
          <Link
            to={path}
            className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 ${
              location.pathname === path
                ? "bg-gray-100 text-gray-700"
                : "hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="h-full flex gap-8">
          <nav className="w-56 p-4">
            <NavLinks />
          </nav>

          <div className="flex-1 p-4 space-y-4">
            <Routes>
              <Route path="/" element={<EmployeeList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
              <Route path="/departments" element={<DepartmentList />} />
              <Route path="/departments/new" element={<DepartmentForm />} />
              <Route path="/departments/edit/:id" element={<DepartmentForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
