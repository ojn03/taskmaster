import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Redis } from "ioredis";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import commentRoutes from "./routes/comments";
import projectRoutes from "./routes/projects";
import teamRoutes from "./routes/teams";
import ticketRoutes from "./routes/tickets";
import userRoutes from "./routes/users";
import roleRoutes from "./routes/roles";
import { verifyToken } from "./Controllers/authController";
import { getCache } from "./utils";
dotenv.config({ path: "../.env.local" });
const app = express();
const redisUrl = process.env.REDIS_URL as string;

export const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//TODO paginate queries
//TODO add sessions, session verification, cookies, etc
//TODO create readme

// middleware
app
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(express.json())
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use(authRouter)
  .use(verifyToken)
  .use(getCache); //cache middleware for get requests not in auth
//ROUTES//
projectRoutes(app);
userRoutes(app);
ticketRoutes(app);
commentRoutes(app);
teamRoutes(app);
roleRoutes(app);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
