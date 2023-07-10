import React, { useState } from "react";

const RegistrationForm = ({ handleRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await handleRegister(username, password);

      if (response.status === 409) {
        setError("Username is already taken. Please choose a different username.");
      } else if (response.status === 201) {
        setError("");
        // Handle registration success, e.g., redirect to login page
      } else {
        setError("Registration failed. Please try again later.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Registration</h2>
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
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300"
          type="submit"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default RegistrationForm;
