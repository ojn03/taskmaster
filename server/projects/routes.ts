import type { Express } from "express";
import { queryDB, cacheDB } from "../index";
const projectRoutes = (app: Express, basePath: string = "/projects") => {

	//get all the project info for a given user. returns (proj_id, name, description, userid, roleid)
	const UserProjects = `${basePath}/:userid`;
	const projectsQuery =
		'select * from "Project" join "Role_User_Project" on "Project".proj_id = "Role_User_Project".proj_id and "Role_User_Project".user_id = $1';
	app.get(
		UserProjects,
		cacheDB("projects", "userid"),
		queryDB(projectsQuery, "projects", "userid")
	); // TODO maybe move to userRoutes to allow a projects/:projid route


    //get all the tickets for a given project
    const ProjectTickets = `${basePath}/:projid/tickets`;
    const ticketsQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1';
    app.get(
        ProjectTickets,
        cacheDB("tickets", "projid"),
        queryDB(ticketsQuery, "tickets", "projid")
    );

    //TODO maybe decouple this from the project route (/tickets/:tickid/)
    // in this case, ensure the user has access to the ticket by checking if the user is part of the ticket's project
    //get a specific ticket for a given project
    const ProjectTicket = `${ProjectTickets}/:tickid`;
    const ticketQuery = 'SELECT * FROM "Ticket" WHERE proj_id = $1 AND tick_id = $2';
    app.get(
        ProjectTicket,
        cacheDB("ticket", "projid", "tickid"),
        queryDB(ticketQuery, "ticket", "projid", "tickid")
    );

    //gets assignees of a given ticket
    const ProjectTicketAssignees = `${ProjectTicket}/assignees`;
    const ticketAssigneesQuery = 'SELECT * FROM "User_Ticket" join "User" on "User_Ticket".user_id = "User".user_id WHERE tick_id = $1'
    app.get(
        ProjectTicketAssignees,
        cacheDB("assignees", "tickid", "projid"),
        queryDB(ticketAssigneesQuery, "assignees", "tickid")
    );

    //gets comments of a given ticket
    const ProjectTicketComments = `${ProjectTicket}/comments`;
    const ticketCommentsQuery = 'SELECT * FROM "Comment" WHERE tick_id = $1';
    app.get(
        ProjectTicketComments,
        cacheDB("comments", "tickid", "projid"),
        queryDB(ticketCommentsQuery, "comments", "tickid")
    );


    //get the history for a given project
    const ProjectHistory = `${basePath}/:projid/history`;
    const historyQuery = 'SELECT * FROM "History" WHERE proj_id = $1';
    app.get(
        ProjectHistory,
        cacheDB("history", "projid"),
        queryDB(historyQuery, "history", "projid")
    );

    //gets all the users of a given project
    const ProjectUsers = `${basePath}/:projid/users`;
    const usersQuery =
        'SELECT * FROM "User" WHERE user_id IN (SELECT user_id FROM "Role_User_Project" WHERE proj_id = $1)';
    app.get(
        ProjectUsers,
        cacheDB("users", "projid"),
        queryDB(usersQuery, "users", "projid")
    );

    //gets first, last, email and roles of all members of a team given user in the team and the project id
    const ProjectUserTeam = `${ProjectUsers}/:userid/team/`;
    const userTeamQuery = "SELECT * FROM getTeam($1, $2)";
    app.get(
        ProjectUserTeam,
        cacheDB("team", "userid", "projid"),
        queryDB(userTeamQuery, "team", "userid", "projid")
    );

    //gets all teams for a given projid
    const ProjectTeams = `${basePath}/:projid/teams`;
    const teamsQuery = 'select * from "Team" where proj_id = $1';
    app.get(
        ProjectTeams,
        cacheDB("teams", "projid"),
        queryDB(teamsQuery, "teams", "projid")
    );

    //FIXME THIS IS INCOMPLETE
    // get all members of a team
    const TeamMembers = `${ProjectTeams}/:teamid/members`;
    const teamMembersQuery = 'select * from "User" where user_id in (select user_id from "Team_User" where team_id = $1)';
    app.get(
        TeamMembers,
        cacheDB("teamMembers", "teamid"),
        queryDB(teamMembersQuery, "teamMembers", "teamid")
    );

    //gets all roles for a given projid
    const ProjectRoles = `${basePath}/:projid/roles`;
    const rolesQuery = 'select * from "Role" where proj_id = $1';
    app.get(
        ProjectRoles,
        cacheDB("roles", "projid"),
        queryDB(rolesQuery, "roles", "projid")
    );


};

export default projectRoutes;
