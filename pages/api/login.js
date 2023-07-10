import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import connectDB from "../../utils/db";
import User from "../../models/User";
import jwt from "jsonwebtoken";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and return a token for successful login
    const token = generateToken(user._id);

    res.json({ user, username, message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Generate a token using JWT
function generateToken(userId) {
  const token = jwt.sign({ userId }, "secret-key", { expiresIn: "1h" });
  return token;
}
