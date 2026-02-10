import { Link, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// import { signInWithPopup } from "firebase/auth";
import { auth, google } from "./firebase.config";
import { signInWithRedirect } from "firebase/auth";
// import { useEffect } from "react";
import Home from "./Home";
import Products from "./Products";
import Chat from "./pages/Chat";
import { useState } from "react";
export interface User {
  email: string;
  password: string;
}
export const SignwithGoogle = async () => {
  try {
    await signInWithRedirect(auth, google);
  } catch (error: any) {
    console.error("Google Sign In xatolik:", error);
    alert("Google orqali kirish amalga oshmadi: " + error.message);
  }
};
const App = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
      <nav className="bg-gray-900 px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            to={"/"}
            className="text-white font-bold text-lg whitespace-nowrap hover:text-blue-400 transition text-decoration-none"
          >
            🛒 Online Shopping
          </Link>

          <input
            className="hidden sm:block flex-1 max-w-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="text"
            placeholder="Qidirish..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="hidden sm:flex items-center gap-2">
            <Link className="btn btn-primary btn-sm" to={"/signin"}>
              Sign In
            </Link>
            <Link className="btn btn-primary btn-sm" to={"/signup"}>
              Sign Up
            </Link>
            <Link className="btn btn-warning btn-sm text-white" to={"/chat"}>
              Chat
            </Link>
          </div>

          <button
            className="sm:hidden text-white text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden mt-3 flex flex-col gap-3 px-2 pb-3">
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              placeholder="Qidirish..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <Link
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-full text-center"
                to={"/signin"}
              >
                Sign In
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-full text-center"
                to={"/signup"}
              >
                Sign Up
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                className="btn btn-warning w-full text-center text-white"
                to={"/chat"}
              >
                Chat
              </Link>
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Products search={search} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
