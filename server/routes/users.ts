import type { Express } from "express";
import { MyQuery, User } from "../DB/QueryBuilder";
import { QDB, getCache, getDB, myQueryDB } from "../utils";

const userRoutes = (app: Express, basePath: string = "/users") => {
	//get a specific user
	const User = `${basePath}/:userid`;
	app.get(User, getCache(), (req,res) =>{
		const query = new MyQuery<User>("User").Select("*").Where({user_id: req.params.userid})
		myQueryDB(req, res, query)
	});

	//get all the project info for a given user. returns (proj_id, name, description, userid, roleid)
	const UserProjects = `${basePath}/:userid/projects`;
	const projectsQuery =
		'select p.proj_id, proj_name, proj_description, role_id from "Project" p join "Role_User_Project" rup on p.proj_id = rup.proj_id and rup.user_id = $1';
	app.get(UserProjects, getCache(), getDB(projectsQuery, "userid"));

	//create a new project for a given user
	const createProjectQuery = "select * from createProject($1, $2, $3, $4)";
	app.post(basePath, (req, res) => {
		const { userid } = req.params;
		const { name, description } = req.body;
		const values = [userid, name, description];

		QDB(res, createProjectQuery, values);
	});

	//get all the tickets for a given user
	const UserTickets = `${basePath}/:userid/tickets`;
	const ticketsQuery =
		'SELECT * FROM "Ticket" WHERE tick_id IN (SELECT tick_id FROM "User_Ticket" WHERE user_id = $1)';
	app.get(UserTickets, getCache(), getDB(ticketsQuery, "userid"));
};

export default userRoutes;
