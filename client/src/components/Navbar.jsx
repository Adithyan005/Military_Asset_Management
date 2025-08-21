import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (location.pathname === "/") return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/resource-management', label: 'Resources', roles: ['Admin'] },
    { to: '/purchases', label: 'Purchases', roles: ['Admin', 'Logistics'] },
    { to: '/transfers', label: 'Transfers', roles: ['Admin', 'Logistics'] },
    { to: '/assignments', label: 'Assignments & Expenditures', roles: ['Admin', 'Commander'] },
    { to: '/auditlog', label: 'Audit Log', roles: ['Admin'] }
  ];

  function logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <nav className="bg-emerald-700 p-4 flex gap-6 items-center">
      <span className="text-white font-bold text-xl tracking-wide">Military Asset System</span>
      {links.filter(link => !link.roles || link.roles.includes(role)).map(link =>
        <Link
          to={link.to}
          key={link.to}
          className="text-amber-100 hover:text-white underline"
        >
          {link.label}
        </Link>
      )}
      <button
        onClick={logout}
        className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
      <span className="ml-4 text-gray-200">
        {role}
      </span>
    </nav>
  );
}
