import { Outlet, Link } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <nav>
        <Link to="/user">Home</Link> |{" "}
        <Link to="/user/report">Report Issue</Link>
        <Link to="/user/community">Community</Link> {/* New link */}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
