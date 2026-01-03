import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await axios.post(`${API}/auth/register`, {
        email,
        password
      });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <input
        className="border p-2 w-full mb-3"
        placeholder="Enter Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Enter new password"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={register}
        className="bg-black text-white w-full py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
