import { Request, Response, NextFunction } from "express";
import { ensureError } from "./utils";

import express from "express";
import cors from "cors";
import { pool } from "./pool";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import authRoutes from "./auth/login";
dotenv.config({ path: "../.env.local" });
const app = express();
const redisUrl = process.env.REDIS_URL as string;

const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//todo maybe move server to nextjs
//todo paginate queries
//todo add sessions, session verification, cookies, etc
//todo convert to typescript
//todo protect routes

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this

//ROUTES//

authRoutes(app);

//DB Query for get requests
function queryDB(querytxt: string, cacheLocation: string, ...params: string[]) {
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
function cacheDB( cacheLocation: string, ...params: string[]) {
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

//projects
//get all the project info for a given user
const projectsRoute = "/projects/:userid";
const projectsQuery =
	'select * from "Project" join "Role_User_Project" on "Project".proj_id = "Role_User_Project".proj_id where "Role_User_Project".user_id = $1';
//'SELECT * FROM "Project" WHERE proj_id IN (SELECT proj_id FROM "Priv_User_Project" WHERE user_id = $1)',
//'select *  from "Project" join (select * from "Priv_User_Project" where user_id = $1) as pup on "Project".proj_id = "pup".proj_id;',
app.get(
	projectsRoute,
	cacheDB("projects", 'userid'),
	queryDB( projectsQuery, "projects", "userid")
);

//tickets
//get all the tickets for a given project
const ticketsRoute = "/tickets/:projid";
const ticketsQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1';
app.get(
	ticketsRoute,
	cacheDB( "tickets","projid"),
	queryDB(ticketsQuery, "tickets","projid")
);

//history
//get the history for a given project
const historyRoute = "/history/:projid";
const historyQuery = 'SELECT * FROM "History" WHERE proj_id = $1';
app.get(
	historyRoute,
	cacheDB( "history","projid"),
	queryDB(historyQuery, "history","projid" )
);

//all users
//gets all the users of a given project
const usersRoute = "/user/:projid";
const usersQuery =
	'SELECT * FROM "User" WHERE user_id IN (SELECT user_id FROM "Role_User_Project" WHERE proj_id = $1)';
app.get(
	usersRoute,
	cacheDB("users","projid"),
	queryDB(usersQuery, "users", "projid")
);

//gets first, last, email and roles of all members of a team given user in the team and the project id
const teamRoute = "/team/:userid/:projid";
const teamQuery = "SELECT * FROM getTeam($1, $2)";
app.get(
	teamRoute,
	cacheDB("team","userid", "projid"),
	queryDB(teamQuery, "team", "userid", "projid")
);

//gets all teams for a given projid
//todo get all members of each team
//todo combine this with /team route

const allTeamsRoute = "/allteams/:projid";
const allTeamsQuery = 'select * from "Team" where proj_id = $1';
app.get(
	allTeamsRoute,
	cacheDB("allteams","projid"),
	queryDB(allTeamsQuery, "allteams", "projid")
);

//gets all roles for a given projid
const rolesRoute = "/roles/:projid";
const rolesQuery = 'select * from "Role" where proj_id = $1';
app.get(
	rolesRoute,
	cacheDB("roles", "projid"),
	queryDB(rolesQuery, "roles", "projid")
);

app.listen(5001, () => {
	console.log("Server is running on port 5001");
});
