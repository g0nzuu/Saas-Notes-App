import React from 'react';

export default function Navbar({ tenant, role, email, onLogout }) {
  return (
    <div className="bg-white shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-semibold text-indigo-600">SaaS Notes</div>
          <div className="text-sm text-gray-500">{tenant?.name}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="font-medium">{email}</div>
            <div className="text-xs text-gray-500">{role}</div>
          </div>
          <button onClick={onLogout} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
}
