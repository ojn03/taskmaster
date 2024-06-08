import type { Express } from "express";
import { QDB, getDB } from "../utils";
import { cacheDB } from "../utils";

const userRoutes = (app: Express, basePath: string = "/users") => {
	//get all the users

	//get a specific user

	//create a new user

	//get all the project info for a given user. returns (proj_id, name, description, userid, roleid)
	const UserProjects = `${basePath}/:userid/projects`;
	const projectsQuery =
		'select * from "Project" join "Role_User_Project" on "Project".proj_id = "Role_User_Project".proj_id and "Role_User_Project".user_id = $1';
	app.get(
		UserProjects,
		cacheDB("users", "userid", "projects"),
		getDB(projectsQuery, "projects", "userid")
	);

	//create a new project for a given user
	const createProjectQuery =
		'select * from createProject($1, $2, $3, $4)';
	app.post(basePath, (req, res) => {
		const { userid } = req.params;
		const { name, description } = req.body;
		const values = [userid, name, description];

		QDB(res, createProjectQuery,"", values);
	})

	//get all the tickets for a given user
	const UserTickets = `${basePath}/:userid/tickets`;
	const ticketsQuery =
		'SELECT * FROM "Ticket" WHERE tick_id IN (SELECT tick_id FROM "User_Ticket" WHERE user_id = $1)';
	app.get(
		UserTickets,
		cacheDB("users", "userid", "tickets"),
		getDB(ticketsQuery, "tickets", "userid")
	);
};

export default userRoutes;
