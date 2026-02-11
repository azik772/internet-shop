import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
interface User {
  name: string;
  phone: number;
  email: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    name: "",
    phone: 0,
    email: "",
    password: "",
  });
  const signUser = async () => {
    if (!user.name || !user.phone || !user.email || !user.password) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    if (user.password.length < 8) {
      alert("Parol kamida 8 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      alert("Email formati noto'g'ri!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password,
      );

      await updateProfile(userCredential.user, {
        displayName: user.name,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
        }),
      );

      alert(`Ro'yxatdan muvaffaqiyatli o'tdingiz, ${user.name}!`);
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("Bu email allaqachon ishlatilgan!");
      } else if (error.code === "auth/weak-password") {
        alert("Parol juda zaif!");
      } else if (error.code === "auth/invalid-email") {
        alert("Email noto'g'ri formatda!");
      } else {
        alert("Xatolik yuz berdi: " + error.message);
      }
    }
  };
  return (
    <div className="w-full max-w-[380px] sm:max-w-[420px] bg-gray-200 shadow rounded-xl p-4 sm:p-6 mx-auto mt-10">
      <input
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name ..."
        className="form-control mb-3 h-[45px] sm:h-[50px]"
        type="text"
      />

      <input
        onChange={(e) => setUser({ ...user, phone: Number(e.target.value) })}
        placeholder="Phone ..."
        className="form-control mb-3 h-[45px] sm:h-[50px]"
        type="text"
      />

      <input
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email ..."
        className="form-control mb-3 h-[45px] sm:h-[50px]"
        type="text"
      />

      <input
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password ..."
        className="form-control mb-2 h-[45px] sm:h-[50px]"
        type="password"
      />


        <p className="text-red-600 my-2 text-sm sm:text-base">
          There should be at least 8 characters
        </p>
   

   

      <button onClick={signUser} className="btn btn-dark w-full py-2 sm:py-3">
        Sign Up
      </button>
    </div>
  );
};

export default SignUp;
