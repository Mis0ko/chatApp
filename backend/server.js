import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";


import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";


//const app = express();
const PORT = process.env.PORT || 5000;

// give absolute path to the root folder
const __dirname = path.resolve();


dotenv.config();

app.use(express.json()); // to parse the incoming request with json payloads from body
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// use to serve static file (html, css, js)
// frontend build in production in dist folder
app.use(express.static(path.join(__dirname, "/frontend/dist")))

// every routes that in not into "/api/*" is redirected to frontend index.html (deployed version)
app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
});


server.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running on port ${PORT}`)
})