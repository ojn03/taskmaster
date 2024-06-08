import { ensureError } from "./utils";
import 'reflect-metadata'; // required for class-transformer
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import userRoutes from "./routes/users";
import ticketRoutes from "./routes/tickets";
import commentRoutes from "./routes/comments";
dotenv.config({ path: "../.env.local" });
const app = express();
const redisUrl = process.env.REDIS_URL as string;

export const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//todo paginate queries
//todo add sessions, session verification, cookies, etc

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this

//ROUTES//
authRoutes(app);
projectRoutes(app);
userRoutes(app);
ticketRoutes(app);
commentRoutes(app)

app.listen(5001, () => {
	console.log("Server is running on port 5001");
});
