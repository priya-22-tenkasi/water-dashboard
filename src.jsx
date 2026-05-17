export default function WaterDashboard() {
  const users = [
    { id: 1, name: 'User 1', usage: 120 },
    { id: 2, name: 'User 2', usage: 98 },
    { id: 3, name: 'User 3', usage: 140 },
    { id: 4, name: 'User 4', usage: 76 },
    { id: 5, name: 'User 5', usage: 110 },
    { id: 6, name: 'User 6', usage: 88 },
    { id: 7, name: 'User 7', usage: 150 },
    { id: 8, name: 'User 8', usage: 67 },
    { id: 9, name: 'User 9', usage: 95 },
    { id: 10, name: 'User 10', usage: 130 },
  ];

  const totalUsage = users.reduce((sum, user) => sum + user.usage, 0);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Water Meter</h1>

        <ul className="space-y-4">
          <li className="bg-blue-700 p-3 rounded-xl">Dashboard</li>
          <li className="hover:bg-blue-700 p-3 rounded-xl cursor-pointer">
            Users
          </li>
          <li className="hover:bg-blue-700 p-3 rounded-xl cursor-pointer">
            Alerts
          </li>
          <li className="hover:bg-blue-700 p-3 rounded-xl cursor-pointer">
            Reports
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold mt-2">10</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Total Water Usage</h3>
            <p className="text-3xl font-bold mt-2">{totalUsage} L</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">Alerts</h3>
            <p className="text-3xl font-bold mt-2 text-red-500">2</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            User Water Usage
          </h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-200 text-left">
                <th className="p-3">User</th>
                <th className="p-3">Usage (Liters)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.usage} L</td>
                  <td className="p-3">
                    {user.usage > 130 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        High Usage
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Dashboard Example */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Individual User Dashboard
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-100 p-5 rounded-xl">
              <h4 className="text-gray-500">Today's Usage</h4>
              <p className="text-3xl font-bold mt-2">45 L</p>
            </div>

            <div className="bg-slate-100 p-5 rounded-xl">
              <h4 className="text-gray-500">Monthly Usage</h4>
              <p className="text-3xl font-bold mt-2">980 L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
