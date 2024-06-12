import type { Express, Request, Response } from "express";
import { QDB, getDB, myQueryDB } from "../utils";
import { getCache } from "../utils";
import { MyQuery, Project, Table, Team, Ticket } from "../DB/QueryBuilder";
const projectRoutes = (app: Express, basePath: string = "/projects") => {
	//get all the tickets for a given project
	const ProjectTickets = `${basePath}/:projid/tickets`;
	app.get(ProjectTickets, getCache(), (req, res) => {
		const ticketsQuery = new MyQuery<Ticket>("Ticket")
			.Select("*")
			.Where({ proj_id: Number(req.params.projid) });
		myQueryDB<Ticket>(req, res, ticketsQuery);
	});
	//get basic info for a given project
	const Project = `${basePath}/:projid`;
	app.get(Project, getCache(), (req, res) => {
		const proj_id = Number(req.params.projid);
		const query = new MyQuery<Project>("Project")
			.Select("*")
			.Where({ proj_id });
		myQueryDB(req, res, query);
	});
	//update info for a given project
	app.patch(Project, (req, res) => {
		const { proj_name, proj_description } = req.body;
		const updateProjectQuery = new MyQuery<Project>("Project")
			.Update({ proj_name, proj_description })
			.Where({ proj_id: req.params.projid })
			.Returning("*");
		myQueryDB<Project>(req, res, updateProjectQuery);
	});

	//get the history for a given project
	const ProjectHistory = `${basePath}/:projid/history`;
	app.get(ProjectHistory, getCache(), (req, res) => {
		const proj_id = Number(req.params.projid);
		const query = new MyQuery<Table>("History").Select("*").Where({ proj_id });
		myQueryDB(req, res, query);
	});

	//gets all the users of a given project
	const ProjectUsers = `${basePath}/:projid/users`;
	const usersQuery =
		'SELECT * FROM "User" u join "Role_User_Project" rup on u.user_id = rup.user_id join "Role" r on r.proj_id = rup.proj_id and r.proj_id = $1';
	app.get(ProjectUsers, getCache(), getDB(usersQuery, "projid"));

	//add a user to a project
	const ProjectUser = `${ProjectUsers}/:userid`;
	const addUserQuery =
		'INSERT INTO "Role_User_Project" (role_id,user_id, proj_id) VALUES ($1, $2, $3) RETURNING *';

	app.post(ProjectUser, (req, res) => {
		const { projid, userid } = req.params;
		const roleid = req.body.roleid;
		const values = [roleid, userid, projid];
		QDB(res, addUserQuery, "", values as string[]);
	});

	//gets first, last, email and roles of all members of a team given user in the team and the project id
	const ProjectUserTeam = `${ProjectUsers}/:userid/team/`;
	const userTeamQuery = "SELECT * FROM getTeam($1, $2)";
	app.get(
		ProjectUserTeam,
		getCache(),
		getDB(userTeamQuery, "userid", "projid")
	);

	//gets all teams for a given projid
	const ProjectTeams = `${basePath}/:projid/teams`;
	app.get(ProjectTeams, getCache(), (req, res) => {
		const proj_id = Number(req.params.projid);
		const query = new MyQuery<Team>("Team").Select("*").Where({ proj_id });
		myQueryDB(req, res, query);
	});

	//creates a new team
	app.post(ProjectTeams, (req, res) => {
		const { name: team_name, description: team_description } = req.body;
		const proj_id = Number(req.params.projid);

		const addTeamQuery = new MyQuery<Team>("Team")
			.Insert({ team_name, team_description, proj_id })
			.Returning("*");
		myQueryDB(req, res, addTeamQuery);
	});

	//gets all roles for a given projid
	const ProjectRoles = `${basePath}/:projid/roles`;
	const rolesQuery =
		'select * from "Role" r \
    join "Role_Permission" rp on r.role_id = rp.role_id \
	join "Permission" p on rp.permission_id = p.permission_id and r.proj_id = $1';
	app.get(ProjectRoles, getCache(), getDB(rolesQuery, "projid"));
};

export default projectRoutes;
