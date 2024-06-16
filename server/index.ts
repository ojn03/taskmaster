import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Redis } from "ioredis";
import "reflect-metadata"; // required for class-transformer
import authRoutes from "./routes/auth";
import commentRoutes from "./routes/comments";
import projectRoutes from "./routes/projects";
import teamRoutes from "./routes/teams";
import ticketRoutes from "./routes/tickets";
import userRoutes from "./routes/users";
dotenv.config({ path: "../.env.local" });
const app = express();
const redisUrl = process.env.REDIS_URL as string;

export const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//TODO paginate queries
//TODO add sessions, session verification, cookies, etc

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this

//ROUTES//
authRoutes(app);
projectRoutes(app);
userRoutes(app);
ticketRoutes(app);
commentRoutes(app);
teamRoutes(app);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
