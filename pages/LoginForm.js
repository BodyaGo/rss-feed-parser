import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .post("/api/login", { username, password })
      .then((response) => response.data)
      .then((data) => {
        if (data.token) {
          handleLogin(data.token);
        } else {
          setError("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("An error occurred during login");
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <form onSubmit={handleSubmit} className="flex items-center justify-center mb-8">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded mr-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border border-gray-300 px-4 py-2 rounded mr-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
          type="submit"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LoginForm;