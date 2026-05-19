import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

export default function WaterDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "Sahaya Jemi Priya",
      email: "ljemipriya@gmail.com",
      usage: 120,
    },
    {
      id: 2,
      name: "Priya Dharshini",
      email: "priyadharshinik2203@gmail.com",
      usage: 98,
    },
    {
      id: 3,
      name: "User 3",
      email: "user3@gmail.com",
      usage: 140,
    },
    {
      id: 4,
      name: "User 4",
      email: "user4@gmail.com",
      usage: 76,
    },
    {
      id: 5,
      name: "User 5",
      email: "user5@gmail.com",
      usage: 110,
    },
    {
      id: 6,
      name: "User 6",
      email: "user6@gmail.com",
      usage: 88,
    },
    {
      id: 7,
      name: "User 7",
      email: "user7@gmail.com",
      usage: 150,
    },
    {
      id: 8,
      name: "User 8",
      email: "user8@gmail.com",
      usage: 67,
    },
    {
      id: 9,
      name: "User 9",
      email: "user9@gmail.com",
      usage: 95,
    },
    {
      id: 10,
      name: "User 10",
      email: "user10@gmail.com",
      usage: 130,
    },
  ];

  const totalUsage = users.reduce(
    (sum, user) => sum + user.usage,
    0
  );

  const handleLogin = async () => {
    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const loggedInEmail =
        userCredential.user.email;

      // ADMIN LOGIN
      if (
        loggedInEmail ===
        "11bpriyadharshini@gmail.com"
      ) {
        setCurrentUser("admin");
      } else {
        // USER LOGIN
        const matchedUser = users.find(
          (user) =>
            user.email === loggedInEmail
        );

        if (matchedUser) {
          setCurrentUser(matchedUser);
        } else {
          alert("User not authorized");
          return;
        }
      }

      setLoggedIn(true);
      alert("Login Successful");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(
        auth,
        email
      );

      alert("Password reset email sent");
    } catch (error) {
      alert(error.message);
    }
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
          <h1 className="text-3xl font-bold text-center mb-6">
            Water Meter Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-3 border rounded-xl mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 border rounded-xl mb-6"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 text-white p-3 rounded-xl"
          >
            Login
          </button>

          <button
            onClick={handleForgotPassword}
            className="w-full mt-4 text-blue-700"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  if (
    loggedIn &&
    currentUser !== "admin"
  ) {
    return (
      <div className="p-10 min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold mb-6">
          User Dashboard
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-bold">
            {currentUser.name}
          </h2>

          <p className="mt-4 text-lg">
            Water Usage:
            {" "}{currentUser.usage} L
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">
          Water Meter
        </h1>

        <ul className="space-y-4">
          <li className="bg-blue-700 p-3 rounded-xl">
            Dashboard
          </li>

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
            <h3 className="text-gray-500">
              Total Users
            </h3>

            <p className="text-3xl font-bold mt-2">
              10
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">
              Total Water Usage
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalUsage} L
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">
              Alerts
            </h3>

            <p className="text-3xl font-bold mt-2 text-red-500">
              2
            </p>
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
                <th className="p-3">
                  User
                </th>

                <th className="p-3">
                  Usage (Liters)
                </th>

                <th className="p-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.usage} L
                  </td>

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

        {/* Individual User Dashboard */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Individual User Dashboard
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-100 p-5 rounded-xl">
              <h4 className="text-gray-500">
                Today's Usage
              </h4>

              <p className="text-3xl font-bold mt-2">
                45 L
              </p>
            </div>

            <div className="bg-slate-100 p-5 rounded-xl">
              <h4 className="text-gray-500">
                Monthly Usage
              </h4>

              <p className="text-3xl font-bold mt-2">
                980 L
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}