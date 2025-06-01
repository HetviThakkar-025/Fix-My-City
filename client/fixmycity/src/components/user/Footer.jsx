// const Footer = () => {
//   return (
//     <footer className="bg-gray-100 text-center py-4 mt-10 border-t">
//       <p className="text-sm text-gray-500">
//         © {new Date().getFullYear()} Fix My City. All rights reserved.
//       </p>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/user" className="text-xl font-bold text-blue-600">
              Fix My City
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Empowering citizens to improve their communities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/user"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/report"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Report Issue
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/community"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    support@fixmycity.com
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fix My City. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
