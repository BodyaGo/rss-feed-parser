import connectDB from "../../utils/db";
import User from "../../models/User";
import jwt from "jsonwebtoken";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Check if the request has a valid token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify and decode the token to get the user ID
    const decodedToken = jwt.verify(token, "secret-key");
    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = decodedToken.userId;

    // Find the logged-in user
    const loggedInUser = await User.findById(userId);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: loggedInUser.username });
  } catch (error) {
    console.error("User retrieval error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
