import { useState } from "react";
import { type User } from "../App";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
    const ADMIN_EMAIL = "azizbeknarzullayevo1o@gmail.com";
    const ADMIN_PASSWORD = "azizbek1";
    const checkUser = ()=>{
        if (!user.email || !user.password) {
      alert("Email va parolni kiriting!");
      return;
    }

    if (user.email === ADMIN_EMAIL && user.password === ADMIN_PASSWORD) {
      alert("Xush kelibsiz Admin!");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("Email yoki parol noto'g'ri!");
    }
  };

    
  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] bg-blue-50 rounded-xl p-4 sm:p-6 mx-auto mt-10 shadow">
      <h1 className="font-bold text-center">Admin uchun!</h1>
      <input
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email ..."
        className="form-control mb-3 h-[45px] sm:h-[50px]"
        type="text"
        value={user.email}
      />

      <input
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password ..."
        className="form-control mb-3 h-[45px] sm:h-[50px]"
        type="password"
        value={user.password}
      />

      <button onClick={checkUser} className="btn btn-dark w-full py-2 sm:py-3">
        Sign In
      </button>

      <p className="text-center my-3 text-sm sm:text-base">Or</p>

      <p className="text-center text-sm sm:text-base mb-3">
        Are you User?{" "}
        <Link to={"/signup"} className="text-blue-600 font-medium">
          Sign up
        </Link>
      </p>


    </div>
  );
};

export default SignIn;
