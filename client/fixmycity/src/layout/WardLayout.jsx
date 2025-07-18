import { Outlet, Link, useNavigate } from "react-router-dom";

export default function WardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/ward" className="text-xl font-bold text-blue-600">
                Ward Officer
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                to="/ward"
                className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Reports
              </Link>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 inline-flex items-center text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
