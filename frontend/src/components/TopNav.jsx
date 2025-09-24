import { NavLink } from "react-router-dom";

export default function TopNav() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between">
      <h1 className="font-bold text-lg">InterviewLab</h1>
      <div className="space-x-4">
        <NavLink to="/" className={({ isActive }) => (isActive ? "underline" : "")}>
          Home
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => (isActive ? "underline" : "")}>
          Upload
        </NavLink>
        <NavLink to="/setup" className={({ isActive }) => (isActive ? "underline" : "")}>
          Setup
        </NavLink>
        <NavLink to="/interview" className={({ isActive }) => (isActive ? "underline" : "")}>
          Interview
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => (isActive ? "underline" : "")}>
          Feedback
        </NavLink>
      </div>
    </nav>
  );
}
