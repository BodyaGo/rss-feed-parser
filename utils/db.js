import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Replace the connection URL with your MongoDB connection string
    await mongoose.connect("mongodb+srv://serv:KffvYaUC6Nn50zgM@cluster0.ao3aagi.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
