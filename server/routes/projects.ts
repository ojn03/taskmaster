import type { Express } from "express";
import { QDB, getDB, patchDB } from "../utils";
import { cacheDB } from "../utils";
import { MyQuery, Project } from "../DB/QueryBuilder";
const projectRoutes = (app: Express, basePath: string = "/projects") => {

	//get all the tickets for a given project
	const ProjectTickets = `${basePath}/:projid/tickets`;
	const ticketsQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1';
	app.get(
		ProjectTickets,
		cacheDB("tickets", "projid"),
		getDB(ticketsQuery, "tickets", "projid")
	);

	//get basic info for a given project
	const Project = `${basePath}/:projid`;
	const projectQuery = 'SELECT * FROM "Project" WHERE proj_id = $1';
	app.get(
		Project,
		cacheDB("project", "projid"),
		getDB(projectQuery, "project", "projid")
	);

	//update info for a given project
	app.patch(Project, (req, res) => {
		const { name, description } = req.body;
		const updateProjectQuery =
		new MyQuery<Project>("Project").Update({ name, description }).Where({ proj_id: req.params.projid });
		patchDB<Project>(res, updateProjectQuery);
	})

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

    //TODO finsish this
    //add a user to a project
    const ProjectUser = `${ProjectUsers}/:userid`;

    const addUserQuery = 'INSERT INTO "Role_User_Project" (role_id,user_id, proj_id) VALUES ($1, $2, $3) RETURNING *';

    app.post(ProjectUser, (req, res)=> {
        const { projid, userid } = req.params;
        const roleid = req.body.roleid;
        const values = [userid, projid, roleid];
        QDB(res, addUserQuery, "", values as string[]);
    })

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
