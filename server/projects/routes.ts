import type { Express } from "express";
import { getDB } from "../utils";
import { cacheDB } from "../utils";
const projectRoutes = (app: Express, basePath: string = "/projects") => {
	//FIXME create a new project
	const createProject = basePath;
	const createProjectQuery =
		'INSERT INTO "Project" (name, description) VALUES ($1, $2) RETURNING *';
	//TODO add user_id to the project as admin

	//get all the tickets for a given project
	const ProjectTickets = `${basePath}/:projid/tickets`;
	const ticketsQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1';
	app.get(
		ProjectTickets,
		cacheDB("tickets", "projid"),
		getDB(ticketsQuery, "tickets", "projid")
	);

	//create a new ticket for a given project

	//get the history for a given project
	const ProjectHistory = `${basePath}/:projid/history`;
	const historyQuery = 'SELECT * FROM "History" WHERE proj_id = $1';
	app.get(
		ProjectHistory,
		cacheDB("history", "projid"),
		getDB(historyQuery, "history", "projid")
	);

	//gets all the users of a given project
	const ProjectUsers = `${basePath}/:projid/users`;
	const usersQuery =
		'SELECT * FROM "User" WHERE user_id IN (SELECT user_id FROM "Role_User_Project" WHERE proj_id = $1)';
	app.get(
		ProjectUsers,
		cacheDB("users", "projid"),
		getDB(usersQuery, "users", "projid")
	);

	//gets first, last, email and roles of all members of a team given user in the team and the project id
	const ProjectUserTeam = `${ProjectUsers}/:userid/team/`;
	const userTeamQuery = "SELECT * FROM getTeam($1, $2)";
	app.get(
		ProjectUserTeam,
		cacheDB("team", "userid", "projid"),
		getDB(userTeamQuery, "team", "userid", "projid")
	);

	//gets all teams for a given projid
	const ProjectTeams = `${basePath}/:projid/teams`;
	const teamsQuery = 'select * from "Team" where proj_id = $1';
	app.get(
		ProjectTeams,
		cacheDB("teams", "projid"),
		getDB(teamsQuery, "teams", "projid")
	);

	//FIXME THIS IS INCOMPLETE
	// get all members of a team
	const TeamMembers = `${ProjectTeams}/:teamid/members`;
	const teamMembersQuery =
		'select * from "User" where user_id in (select user_id from "Team_User" where team_id = $1)';
	app.get(
		TeamMembers,
		cacheDB("teamMembers", "teamid"),
		getDB(teamMembersQuery, "teamMembers", "teamid")
	);

	//gets all roles for a given projid
	const ProjectRoles = `${basePath}/:projid/roles`;
	const rolesQuery =
		'select * from "Role" r \
    join "Role_Privelege" rp on r.role_id = rp.role_id join "Privelege" p on rp.priv_id = p.priv_id and r.proj_id = $1';
	app.get(
		ProjectRoles,
		cacheDB("roles", "projid"),
		getDB(rolesQuery, "roles", "projid")
	);
};

export default projectRoutes;
