import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <nav>
        <Link to="/admin">Dashboard</Link> |{" "}
        <Link to="/admin/analysis">Analysis</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
