import dotenv from 'dotenv'
dotenv.config()

import { app } from "./App.js";
import { connectDB } from "./Db/db.js";

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`⚙️  Server is running on port ${PORT}`);
        })

    } catch (err) {
        console.log("Error Starting Server:", err);
    }
}

startServer();