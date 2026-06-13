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

  const [historyType, setHistoryType] = useState("day");

  const [waterData, setWaterData] = useState({
    userName: "",
    totalUsage: 0,
    time: "-",
  });
  

  // FIREBASE LIVE DATA

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const waterRef = ref(db, "waterMeter/history");

    onValue(waterRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Firebase Data:", data);
      console.log(history);
      if (!data) return;
      const records = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      records.sort((a, b) => Number(a.id) - Number(b.id));
      setHistory(records);
      if (records.length > 0) {
        const latest = records[records.length - 1];
        setWaterData({
          userName: latest.userName || "",
          totalUsage: Number(latest.totalUsage || 0),
          time: latest.time || "-",
        });
      }
    });
  }, []);

  // LOGIN
  
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

  const dailyUsage = [];

  for (let i = 1; i < history.length; i++) {
    dailyUsage.push({
      day: i,
      usage:
        history[i].totalUsage -
        history[i - 1].totalUsage,
    });
  }

  const weeklyUsage =
    history.length > 7
      ? history[history.length - 1].totalUsage -
        history[history.length - 8].totalUsage
      : 0;
  
  const monthlyUsage =
    history.length > 30
      ? history[history.length - 1].totalUsage -
        history[history.length - 31].totalUsage
      : 0;

  // RESET PASSWORD
  
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
            {waterData.totalUsage} L
          </p>

          <p className="mt-2 text-gray-500">
            Time: {waterData.time}
          </p>
        </div>
      </div>
    );
  }

  const getFilteredHistory = () => {
    const now = new Date();
    let minutesLimit = 2; // 1 day = 2 min
    if (historyType === "week") {
      minutesLimit = 14; // 7 days = 14 min
    }
    if (historyType === "month") {
      minutesLimit = 60; // 30 days = 60 min
    }

    return history.filter((item) => {
      if (!item.time) return false;
      const [h, m, s] = item.time.split(":").map(Number);
      const recordDate = new Date();
      recordDate.setHours(h, m, s, 0);
      const diffMinutes =
        (now.getTime() - recordDate.getTime()) /
        (1000 * 60);
      return diffMinutes >= 0 &&
            diffMinutes <= minutesLimit;
    });
  };

  const filteredHistory = getFilteredHistory();

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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-2xl shadow-lg">
            <h3>Total Users</h3>
            <p className="text-4xl font-bold mt-2">1</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg">
            <h3>Current Usage</h3>
            <p className="text-4xl font-bold mt-2">
              {waterData.totalUsage} L
            </p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg">
            <h3>Weekly Usage</h3>
            <p className="text-4xl font-bold mt-2">
              {weeklyUsage.toFixed(2)} L
            </p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded-2xl shadow-lg">
            <h3>Monthly Usage</h3>
            <p className="text-4xl font-bold mt-2">
              {monthlyUsage.toFixed(2)} L
            </p>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg">
            <h3>Sensor Name</h3>
            <p className="text-2xl font-bold mt-2">
              {waterData.userName}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h3 className="text-2xl font-semibold mb-4">
            Water Usage History
          </h3>

          <select
            value={historyType}
            onChange={(e) => setHistoryType(e.target.value)}
            className="border p-2 rounded-lg mb-4"
          >
            <option value="day">1 Day (2 min)</option>
            <option value="week">7 Days (14 min)</option>
            <option value="month">30 Days (60 min)</option>
          </select>
          <table className="w-full border">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2">User</th>
                <th className="p-2">Usage (L)</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td className="p-2">{item.userName}</td>
                  <td className="p-2">{item.totalUsage}</td>
                  <td className="p-2">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">
            Live Water Meter Data
          </h3>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-3 text-left">
                  User
                </th>
                <th className="p-3 text-left">
                  Usage
                </th>
                <th className="p-3 text-left">
                  Time
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
      </div>
    </div>
  );
}