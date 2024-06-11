import type { Express } from "express";
import { getCache, getDB, patchDB } from "../utils";
import { MyQuery, Team } from "../DB/QueryBuilder";
const teamRoutes = (app: Express, basePath: string = "/teams") => {
	//get a specific team
	const team = `${basePath}/:teamid`;
	const teamQuery = 'select * from "Team" where team_id = $1';
	app.get(team, getCache(), getDB(teamQuery, "team", "teamid"));

	// get all members of a team
	const TeamMembers = `${basePath}/:teamid/users`;
	const teamMembersQuery =
		'select u.* from "Team" t join "Team_User_Project" tup on t.team_id = tup.team_id join "User" u on u.user_id = tup.user_id and tup.team_id = $1';
	app.get(
		TeamMembers,
		getCache(),
		getDB(teamMembersQuery, "teamMembers", "teamid")
	);
	//create a new team

	//delete a team

	//add a user to a team


	//remove a user from a team

	//update team info
	app.patch(team, (req, res) => {
		const updateTeamQuery = new MyQuery<Team>("Team")
        .Update({
			team_description: req.body.description,
            team_name: req.body.name,
		})
        .Where({ team_id: req.params.teamid })
        .Returning("*");
        patchDB<Team>(res, updateTeamQuery);
	});
    //TODO nice to have
	//get all the tickets for a given team
};
export default teamRoutes;
