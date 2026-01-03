import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      console.log('Login attempt for:', email);
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/notes");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login} className="bg-black text-white w-full py-2 rounded">
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        className="bg-black text-white w-full py-2 rounded"
      >
        Do not have an account? Register
      </button>
    </div>
  );
}
