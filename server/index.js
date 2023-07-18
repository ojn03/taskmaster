const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./pool");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env.local" });
const Redis = require("ioredis");
const redisUrl = process.env.REDIS_URL;

const red = new Redis(redisUrl);

console.log("redis connected at", redisUrl);

//todo paginate queries
//look into orms
//todo add sessions, session verification, cookies, etc

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this

//ROUTES//

//REGISTRATION 
//todo make queries atomic

//regex patterns for input validation
const pVal = new RegExp("^" + process.env.NEXT_PUBLIC_P_VAL + "$");
const usernameVal = new RegExp("^" + process.env.NEXT_PUBLIC_U_VAL + "$");
const emailVal = new RegExp("^" + process.env.NEXT_PUBLIC_E_VAL + "$");

//REGISTER
app.post("/register", async (req, res) => {
	try {
		const {
			firstName: first,
			lastName: last,
			username,
			email,
			password
		} = req.body;

		//validate inputs
		if (
			//check if any are empty
			!first ||
			!last ||
			!username ||
			!email ||
			!password ||
			// regex validation
			!pVal.test(password) ||
			!usernameVal.test(username) ||
			!emailVal.test(email)
		) {
			res.json({ error: "invalid input" });
			return;
		}
		const hash = await bcrypt.hash(password, 10);
		//check if email or username already exists else register info into db
		const QueryRegister = {
			text: "CALL register($1, $2, $3, $4, $5, $6)",
			values: [email, username, first, last, hash, null]
		};

		const response = await pool.query(QueryRegister);
		res.json(response.rows[0]);
	} catch (error) {
		console.error(error.message);
		res.json({ error: "error 500" + error.message });
	}
});

//LOGIN
app.post("/login", async function (req, res) {
	try {
		const { username, email, password } = req.body;

		const queryLogin =
			// if username provided with no email, use username
			username && !email
				? {
						text: 'SELECT hash FROM "UserInfo" WHERE username = $1',
						values: [username]
				  }
				: // if email provided with no username, use email
				!username && email
				? {
						text: "select emailToHash($1) as hash",
						values: [email]
				  }
				: // if both username and email provided, or neither, return null
				  // only time both are provided is if user is outside of client which is not currently allowed
				  null;

		if (queryLogin && password) {
			const response = await pool.query(queryLogin);
			const hash = response.rows[0]?.hash;
			if (hash) {
				const match = await bcrypt.compare(password, hash);
				if (match) {
					res.json({ success: "logged in" });
					return;
				}
			}
		}
		res.json({ error: "invalid input" });
		return;
	} catch (error) {
		console.error(error.message);
		res.json({ error: "error 500: " + error.message });
	}
});

// cache middleware for get requests with 1 param
function cacheDB(paramName, cacheLocation) {
	return function (req, res, next) {
		red.get(`${cacheLocation}:${req.params[paramName]}`, (err, data) => {
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
		});
	};
}

//DB Query for get requests with 1 param
function queryDB(querytext, paramName, cacheLocation) {
	return function (req, res) {
		console.log(querytext, paramName, cacheLocation);
		console.log(req.params[paramName]);
		pool.query(querytext, [req.params[paramName]], (err, response) => {
			if (err) {
				console.error(err.message);
				res.json({ error: "error 500: " + err.message });
				console.timeEnd(cacheLocation);
			} else {
				red.setex(
					`${cacheLocation}:${req.params[paramName]}`,
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

//projects
//get all the project info for a given user
const projectsRoute = "/projects/:userid";
const projectsQuery =
	'select * from "Project" join "Priv_User_Project" on "Project".proj_id = "Priv_User_Project".proj_id where "Priv_User_Project".user_id = $1';
//'SELECT * FROM "Project" WHERE proj_id IN (SELECT proj_id FROM "Priv_User_Project" WHERE user_id = $1)',
//'select *  from "Project" join (select * from "Priv_User_Project" where user_id = $1) as pup on "Project".proj_id = "pup".proj_id;',
app.get(
	projectsRoute,
	cacheDB("userid", "projects"),
	queryDB("userid", "projects", projectsQuery)
);

//tickets
//get all the tickets for a given project
const ticketsRoute = "/tickets/:projid";
const ticketsQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1';
app.get(
	ticketsRoute,
	cacheDB("projid", "tickets"),
	queryDB(ticketsQuery, "projid", "tickets")
);

//history
//get the history for a given project
const historyRoute = "/history/:projid";
const historyQuery = 'SELECT * FROM "History" WHERE proj_id = $1';
app.get(
	historyRoute,
	cacheDB("projid", "history"),
	queryDB(historyQuery, "projid", "history")
);

//all users
//gets all the users of a given project
const usersRoute = "/users/:projid";
const usersQuery =
	'SELECT * FROM "User" WHERE user_id IN (SELECT user_id FROM "Priv_User_Project" WHERE proj_id = $1)';
app.get(
	usersRoute,
	cacheDB("projid", "users"),
	queryDB(usersQuery, "projid", "users")
);

app.listen(5001, () => {
	console.log("Server is running on port 5001");
});
