import { useState, useEffect } from "react";
import {signInWithEmailAndPassword,sendPasswordResetEmail,signOut} from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "./firebase";
import waterBg from "./assets/wb.jpg";
export default function WaterDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [historyType, setHistoryType] = useState("day");
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [searchTerm, setSearchTerm] = useState(""); // For Admin table search
  const [waterData, setWaterData] = useState({ userName: "-",totalUsage: 0,time: "-",});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [history, setHistory] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = history.filter( (item) => item.date === today );
  const todayUsage = todayRecords.reduce((sum, record) => sum + Number(record.intervalUsage || 0), 0 );
  
  // Weekly Usage
  const currentDate = new Date();
  const weekRecords = history.filter((item) => {
    if (!item.date) return false;
    const recordDate = new Date(item.date);
    const diffDays =
      (currentDate - recordDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays < 7;
  });
  const weeklyUsage = weekRecords.reduce(
    (sum, record) => sum + Number(record.intervalUsage || 0),
    0
  );

  // Monthly Usage
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthRecords = history.filter((item) => {
    if (!item.date) return false;
    const recordDate = new Date(item.date);
    return (
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });
  const monthlyUsage = monthRecords.reduce(
    (sum, record) => sum + Number(record.intervalUsage || 0),
    0
  );

  const limitExceeded = todayUsage > 1;
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => {
    if (todayUsage > 1 && !emailSent) {
      fetch("https://water-dashboard-email.onrender.com/send-alert")
        .then(() => console.log("Email sent"))
        .catch((err) => console.error("Email error:", err));
      setEmailSent(true);
    }
  }, [todayUsage, emailSent]);

  // FIREBASE LIVE STREAMING
 useEffect(() => {
    const currentRef = ref(db, "waterMeter/current");
    const unsubscribe = onValue(currentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWaterData({
          userName: data.userName || "-",
          totalUsage: Number(data.totalUsage || 0),
          time: data.time || "-",
        });
      }
    });
    return () => unsubscribe();
  }, []);
 
useEffect(() => {
    const historyRef = ref(db, "waterMeter/history");
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setHistory([]);
        return;
      }
      const records = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      records.sort((a, b) => Number(b.id) - Number(a.id));
      setHistory(records);
    });
    return () => unsubscribe();
  }, []);

  // LOGIN CONTEXT
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      if (email.toLowerCase() === "11bpriyadharshini@gmail.com") {
        setCurrentUser("admin");
      } else {
        setCurrentUser("user");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      setCurrentUser(null);
      setActiveTab("dashboard");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Error logging out");
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email dispatched successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // ADVANCED CALCULATION LOGIC (Safely fallbacks on insufficient entries)
  const dailyUsage = [];
  for (let i = 1; i < history.length; i++) {
    dailyUsage.push({
      day: i,
      usage: Math.max(0, Number(history[i].totalUsage || 0) - Number(history[i - 1].totalUsage || 0)),
    });
  }

  const FREE_LIMIT = 30; // Liters per month
  const RATE_PER_LITER = 15;
  const chargeableUsage =
    monthlyUsage > FREE_LIMIT
      ? monthlyUsage - FREE_LIMIT
      : 0;

  const monthlyBill = chargeableUsage * RATE_PER_LITER;

  // TIMEFRAME TIME-FILTERING (Calculates relative min delta mapping)
  const getFilteredHistory = () => {
    const today = new Date();
    return history.filter((item) => {
      if (!item.date) return false;
      const recordDate = new Date(item.date);
      const diffDays = Math.floor(
        (today - recordDate) / (1000 * 60 * 60 * 24)
      );
      if (historyType === "day") {
        return diffDays === 0;
      }
      if (historyType === "week") {
        return diffDays >= 0 && diffDays < 7;
      }
      if (historyType === "month") {
        return diffDays >= 0 && diffDays < 30;
      }
      return false;
    });
  };

  const filteredHistory = getFilteredHistory();
    const filteredRecords = history.filter((record) => {
    const matchesSearch =
      (record.userName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.id.toString().includes(searchTerm);
    const matchesDate =
      !selectedDate || record.date === selectedDate;
    const matchesMonth =
      !selectedMonth ||
      record.date?.startsWith(selectedMonth);
    return matchesSearch && matchesDate && matchesMonth;
  });
  
  const filteredTotalUsage = filteredRecords.reduce(
    (sum, record) =>
      sum + Number(record.intervalUsage || 0),
    0
  );
  // --- RENDER 1: AUTHENTICATION INTERFACE ---
  if (!loggedIn) {
    return (
     <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(${waterBg})`,
        }}
     >
        <div className="absolute inset-0 bg-blue/50"></div>
        <div className="relative bg-white/95 p-8 rounded-2xl shadow-2xl w-96 text-black">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mt-2 text-black">Water Meter </h1>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99]"
            >
              Sign In
            </button>
            <button
              onClick={handleForgotPassword}
              className="w-full text-center text-sm text-slate-600 hover:text-blue-400 transition-colors pt-2"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 2: USER METRIC VIEW ---
  if (currentUser === "user") {
    const isOveruse = waterData.totalUsage > 150; // Custom warning indicator limit
    return (
      <div className="p-6 md:p-10 min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {todayUsage > 1 && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl font-semibold">
              ⚠ Alert! Your daily water usage has exceeded 1 Liter.
            </div>
          )}
          <div className="flex justify-between items-center bg-yellow-300 p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <p className="text-3x1 font-extrabold text-slate-600 uppercase tracking-wider">User Dashboard</p>
              <h1 className="text-3xl font-extrabold text-red-900 tracking-tight">{waterData.userName}</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Log Out
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-300 p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-slate-600 text-3x1 font-medium">Meter Reading</h3>
                <p className="text-4xl font-black text-red-900 mt-2">{waterData.totalUsage} <span className="text-2x1 font-normal text-red-900">Liters</span></p>
              </div>
              <p className="text-3x1 text-slate-600 mt-4">Last refresh stream: <span className="font-mono">{waterData.time}</span></p>
            </div>
            <div className="bg-yellow-300 p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-slate-600 text-3x1 font-medium">Estimated Bill Tier</h3>
              <p className="text-4xl font-black text-red-900 mt-2">₹{monthlyBill.toFixed(2)}</p>
              <span className="inline-block mt-4 text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">30L Free / Month | ₹15 per Liter thereafter</span>
            </div>
            <div className={`bg-yellow-300 p-6 rounded-2xl shadow-sm border transition-colors ${isOveruse ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <h3 className="text-slate-600 text-2x1 font-medium">Efficiency Analysis</h3>
              <p className={`text-3xl font-bold mt-2 ${isOveruse ? "text-red-900" : "text-red-900"}`}>
                {isOveruse ? "Heavy Volumetric Usage" : "Optimal Threshold"}
              </p>
              <p className="text-2x1 text-slate-600 mt-2">Target recommended limit is under 100L.</p>
            </div>
          </div>
          <div className="bg-purple-400 p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Your Usage Log Chain</h3>
            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 sticky top-0">
                    <th className="p-3 font-semibold">Sequence Index</th>
                    <th className="p-3 font-semibold">Usage</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Time Recorded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-400 text-slate-400">
                  {history.map((record, idx) => (
                    <tr key={record.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono text-slate-600">
                        {idx + 1}
                      </td>

                      <td className="p-3 font-medium text-slate-900">
                        {Number(record.intervalUsage || 0).toFixed(2)} L
                      </td>
                      <td className="p-3 text-slate-500">
                        {record.date || "-"}
                      </td>
                      <td className="p-3 text-slate-500">
                        {record.time || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 3: ADMIN ADMINISTRATIVE PANEL ---
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          <div className="flex items-center space-x-2 mb-8 px-2">
            <span className="text-lg font-bold tracking-tight text-white">ADMIN DASHBOARD </span>
          </div>
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "OVERVIEW " },
              { id: "live", label: "REALTIME DATA" },
              { id: "reports", label: "REPORTS"}
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-slate-800 hover:bg-red-600 hover:text-white p-3 rounded-xl text-sm font-medium"
        >
          Log out
        </button>
      </div>

      {/* DASHBOARD WORKSPACE MAIN VIEW */}
      <div className="flex-1 p-8 overflow-y-auto max-w-[1400px]">     
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-blue-200 p-5 rounded-2xl border border-blue-200 shadow-sm">
                <span className="text-xs text-blue-700 font-semibold uppercase">
                  Total Users
                </span>
                <p className="text-3xl font-black text-blue-900 mt-1">1</p>
              </div>
              <div className="bg-yellow-100 p-5 rounded-2xl border border-yellow-200 shadow-sm">
                <span className="text-xs text-yellow-700 font-semibold uppercase">
                  Today's Usage
                </span>
                <p className="text-3xl font-black text-yellow-900 mt-1">
                  {todayUsage.toFixed(2)} L
                </p>
              </div>
              <div className="bg-blue-200 p-5 rounded-2xl border border-blue-200 shadow-sm">
                <span className="text-xs text-blue-700 font-semibold uppercase">
                  Weekly Usage
                </span>
                <p className="text-3xl font-black text-blue-900 mt-1">
                  {weeklyUsage.toFixed(1)} L
                </p>
              </div>
              <div className="bg-green-200 p-5 rounded-2xl border border-green-200 shadow-sm">
                <span className="text-xs text-green-700 font-semibold uppercase">
                  Monthly Usage
                </span>
                <p className="text-3xl font-black text-green-900 mt-1">
                  {monthlyUsage.toFixed(1)} L
                </p>
              </div>
            </div>

            {/* TIMEFRAME FILTER GRAPHICS TABLE */}
            <div className="bg-purple-400 rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Adaptive Segment Logs</h3>
                </div>
                <select
                  value={historyType}
                  onChange={(e) => setHistoryType(e.target.value)}
                  className="border border-slate-200 bg-slate-50 p-2.5 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="day">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <th className="p-3 font-semibold">User </th>
                      <th className="p-3 font-semibold">Usage </th>
                      <th className="p-3 font-semibold">Timestamp </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHistory.map((item, index) => {                     
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-3 font-medium text-slate-800">{item.userName || waterData.userName}</td>
                          <td className="p-3 font-mono font-semibold text-blue-600">
                            +{Number(item.intervalUsage || 0).toFixed(2)} L
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-xs">{item.time}</td>
                        </tr>
                      );
                    })}
                    {filteredHistory.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-6 text-center text-slate-400 text-xs">
                          No active records fetched in this targeted interval window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE STREAM READOUT */}
        {activeTab === "live" && (
          <div className="space-y-6">
            <div className="bg-green-400 rounded-2xl border border-slate-200/80 shadow-sm p-8 max-w-2xl">
              <div className="flex items-center space-x-3 mb-6 bg-emerald-50 border border-emerald-100 p-3 rounded-xl w-fit">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Live </span>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t border-slate-100 pt-6">
                <div>
                  <span className="text-xs font-medium text-white-400 block">User Name </span>
                  <span className="text-lg font-bold text-slate-800 mt-0.5 block">{waterData.userName}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-white-400 block">Absolute Total Usage</span>
                  <span className="text-lg font-black text-slate-800 mt-0.5 block">{waterData.totalUsage} L</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-medium text-white-400 block">Last Verified Broadcast Time</span>
                  <span className="text-sm font-mono text-slate-600 mt-0.5 block">{waterData.time}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT COMPREHENSIVE REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button 
                onClick={() => window.print()} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors active:scale-95 shadow-sm"
              >
                Export Master Report / PDF
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-purple-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-600 font-semibold uppercase">Total Log Iterations</span>
                <p className="text-2xl font-bold mt-1 text-slate-800">{history.length} Entries</p>
              </div>
              <div className="bg-purple-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-600 font-semibold uppercase">Peak Read Value</span>
                <p className="text-2xl font-bold mt-1 text-slate-800">
                  {history.length > 0 ? `${Math.max(...history.map(o => Number(o.totalUsage || 0)))} L` : "0 L"}
                </p>
              </div>
              <div className="bg-purple-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <span className="text-xs text-slate-600 font-semibold uppercase">Average Delta Step</span>
                <p className="text-2xl font-bold mt-1 text-slate-800">
                  {dailyUsage.length > 0 
                    ? `${(dailyUsage.reduce((acc, curr) => acc + curr.usage, 0) / dailyUsage.length).toFixed(2)} L`
                    : "0 L"}
                </p>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border p-2 rounded"
              />
            </div> 

            {/* SEACH CONTROL LOG DATA FIELD */}
            <div className="bg-green-300 rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search master logs by user name or entry ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md p-2.5 border border-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
              <div className="bg-blue-100 p-4 rounded-xl mb-4">
                <h3 className="font-bold text-blue-900">
                  Total Usage: {filteredTotalUsage.toFixed(2)} L
                </h3>
              </div>
              <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider sticky top-0 z-10">
                      <th className="p-3">Record ID</th>
                      <th className="p-3">User </th>
                      <th className="p-3">Absolute Usage (L)</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors text-xs">
                        <td className="p-3 font-mono text-slate-900 font-medium">{record.id}</td>
                        <td className="p-3 font-bold text-slate-900">{record.userName || "N/A"}</td>
                        <td className="p-3 text-slate-900 font-bold">{Number(record.totalUsage || 0).toFixed(2)} L</td>
                        <td className="p-3 text-slate-500">
                          {record.date || "-"}
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
                          {record.time || "-"}
                        </td>                        
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400">
                          No matching logs match query parameter settings.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}