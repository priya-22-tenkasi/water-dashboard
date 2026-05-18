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
      name: "User 1",
      email: "user1@gmail.com",
      usage: 120,
    },
    {
      id: 2,
      name: "User 2",
      email: "user2@gmail.com",
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
      if (loggedInEmail === "11bpriyadharshini@gmail.com") {
        setCurrentUser("admin");
      } else {
        // USER LOGIN
        const matchedUser = users.find(
          (user) => user.email === loggedInEmail
        );

        if (matchedUser) {
          setCurrentUser(matchedUser);
        } else {
          alert("User not authorized");
          return;
        }
      }

      setLoggedIn(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
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
            className="w-full p-3 border rounded-xl mb-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 text-white p-3 rounded-xl"
          >
            Login
          </button>

          <button
            onClick={handleForgotPassword}
            className="mt-4 text-blue-700 w-full"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  if (loggedIn && currentUser !== "admin") {
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
            Water Usage: {currentUser.usage} L
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="flex min-h-screen bg-slate-100">
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

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">
              Total Users
            </h3>

            <p className="text-3xl font-bold mt-2">
              {users.length}
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
      </div>
    </div>
  );
}