import { Request, Response, NextFunction } from "express";
import { ensureError } from "./utils";

import express from "express";
import cors from "cors";
import { pool } from "./pool";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import authRoutes from "./auth/routes";
import projectRoutes from "./projects/routes";
dotenv.config({ path: "../.env.local" });
const app = express();
const redisUrl = process.env.REDIS_URL as string;

const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//todo paginate queries
//todo add sessions, session verification, cookies, etc

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this

//DB Query for get requests
export function queryDB(querytxt: string, cacheLocation: string, ...params: string[]) {
	return function (req: Request, res: Response) {
		pool.query(querytxt, params.map((param) => req.params[param]), (err, response) => {
			if (err) {
				console.error(err.message);
				res.json({ error: "error 500: " + err.message });
				console.timeEnd(cacheLocation);
			} else {
				red.setex(
					`${cacheLocation}:${params.map((param) => req.params[param]).join(":")}`,
					600,
					JSON.stringify(response.rows)
				);
				res.json(response.rows);
				console.timeEnd(cacheLocation);
				console.log("cache miss");
			}
		});
	};
}

// cache middleware for get requests 
export function cacheDB( cacheLocation: string, ...params: string[]) {
	return function (req: Request, res: Response, next: NextFunction) {
		red.get(
			`${cacheLocation}:${params.map((param) => req.params[param]).join(":")}`,
			(err, data) => {
				console.time(cacheLocation);
				if (err) {
					console.error(err.message);
					res.json({ error: "error 500: " + err.message });
					console.timeEnd(cacheLocation);
				}
				if (data != null) {
					res.json(JSON.parse(data));
					console.timeEnd(cacheLocation);
					console.log("cache hit");
				} else {
					next();
				}
			}
		);
	};
}
//ROUTES//
authRoutes(app);
projectRoutes(app);

app.listen(5001, () => {
	console.log("Server is running on port 5001");
});
