import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { ref, onValue } from "firebase/database";
import { auth, db } from "./firebase";

export default function WaterDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [waterData, setWaterData] = useState({
    userName: "",
    totalUsage: 0,
    time: 0,
  });

  useEffect(() => {
    const waterRef = ref(db, "waterMeter");

    onValue(waterRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setWaterData(data);
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setLoggedIn(true);

      if (
        email ===
        "11bpriyadharshini@gmail.com"
      ) {
        setCurrentUser("admin");
      } else {
        setCurrentUser("user");
      }

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
            className="w-full mt-4 text-blue-700"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  if (currentUser === "user") {
    return (
      <div className="p-10 min-h-screen bg-slate-100">
        <h1 className="text-3xl font-bold mb-6">
          User Dashboard
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-bold">
            {waterData.userName}
          </h2>

          <p className="mt-4 text-lg">
            Water Usage:
            {" "}
            {waterData.totalUsage} L
          </p>

          <p className="mt-2 text-gray-500">
            Time:
            {" "}
            {waterData.time}
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
            Live Data
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
              1
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">
              Current Usage
            </h3>

            <p className="text-3xl font-bold mt-2">
              {waterData.totalUsage} L
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-gray-500">
              Sensor Name
            </h3>

            <p className="text-3xl font-bold mt-2">
              {waterData.userName}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Live Water Meter Data
          </h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-3 text-left">
                  User
                </th>

                <th className="p-3 text-left">
                  Usage
                </th>

                <th className="p-3 text-left">
                  Timestamp
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3">
                  {waterData.userName}
                </td>

                <td className="p-3">
                  {waterData.totalUsage} L
                </td>

                <td className="p-3">
                  {waterData.time}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Current Reading
          </h3>

          <div className="bg-slate-100 p-5 rounded-xl">
            <h4 className="text-gray-500">
              Total Water Usage
            </h4>

            <p className="text-3xl font-bold mt-2">
              {waterData.totalUsage} L
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}