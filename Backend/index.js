import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/file.routes.js";
import { TestConnection } from "./database.js";
dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));
app.use("/api/v1/files", fileRoutes)

const PORT = 8000;


app.listen(PORT, () => {
    TestConnection();
    console.log(`Server running on port ${PORT}`);
})

