import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connection Successful");
    } catch (err) {
        console.log("❌ Error Connecting MongoDB:", err.message);
        process.exit(1);
    }
}; 

export { connectDB };