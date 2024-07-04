import type { Express } from "express";
import { MyQuery, Team } from "../DB/QueryBuilder";
import { getDB, myQueryDB } from "../utils";
const teamRoutes = (app: Express, basePath: string = "/teams") => {
  //get a specific team
  const team = `${basePath}/:teamid`;
  app.get(team, (req, res) => {
    const query = new MyQuery<Team>("Team")
      .Select("*")
      .Where({ team_id: req.params.teamid });
    myQueryDB(req, res, query);
  });

  // get all members of a team
  const TeamMembers = `${basePath}/:teamid/users`;
  const teamMembersQuery =
    'select u.* from "Team" t join "Team_User_Project" tup on t.team_id = tup.team_id join "User" u on u.user_id = tup.user_id and tup.team_id = $1';
  app.get(TeamMembers, getDB(teamMembersQuery, "teamid"));

  //delete a team
  app.delete(team, (req, res) => {
    const deleteTeamQuery = new MyQuery<Team>("Team")
      .Delete()
      .Where({ team_id: req.params.teamid });
    myQueryDB<Team>(req, res, deleteTeamQuery);
  });

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
    myQueryDB<Team>(req, res, updateTeamQuery);
  });
  //TODO nice to have
  //get all the tickets for a given team
};
export default teamRoutes;
