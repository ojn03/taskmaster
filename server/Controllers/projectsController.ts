import type { Request, Response } from "express";
import { QDB, getDB, myQueryDB } from "../utils";
import {
  MyQuery,
  Project,
  History,
  Ticket,
  Team,
  Role,
} from "../DB/QueryBuilder";

function getProjectInfo(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const query = new MyQuery<Project>("Project").Select("*").Where({ proj_id });
  myQueryDB(req, res, query);
}

function UpdateProjectInfo(req: Request, res: Response) {
  const { proj_name, proj_description } = req.body;
  const proj_id = req.params.projid;
  const updateProjectQuery = new MyQuery<Project>("Project")
    .Update({ proj_name, proj_description })
    .Where({ proj_id })
    .Returning("*");
  myQueryDB<Project>(req, res, updateProjectQuery);
}

function getProjectHistory(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const query = new MyQuery<History>("History").Select("*").Where({ proj_id });
  myQueryDB(req, res, query);
}

function getProjectTickets(req: Request, res: Response) {
  const ticketsQuery = new MyQuery<Ticket>("Ticket")
    .Select("*")
    .Where({ proj_id: req.params.projid });
  myQueryDB<Ticket>(req, res, ticketsQuery);
}

function getProjectUserTickets(req: Request, res: Response) {
  const userTicketsQuery =
    'SELECT * FROM "Ticket" WHERE proj_id = $1 AND tick_id IN (SELECT tick_id FROM "User_Ticket" WHERE user_id = $2)';

  getDB(userTicketsQuery, "projid", "userid")(req, res);
}

function getProjectUsers(req: Request, res: Response) {
  console.log("getting project users");
  const usersQuery =
    'SELECT u.*, r.role_id, role_title, role_description FROM "User" u join "Role_User_Project" rup on u.user_id = rup.user_id join "Role" r on r.proj_id = rup.proj_id and r.proj_id = $1';
  getDB(usersQuery, "projid")(req, res);
}

function getProjectUserTeam(req: Request, res: Response) {
  const userTeamQuery = "SELECT * FROM getTeam($1, $2)";
  console.log("gettting team ", req.params);
  getDB(userTeamQuery, "userid", "projid")(req, res);
}

function getProjectTeams(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const query = new MyQuery<Team>("Team").Select("*").Where({ proj_id });
  myQueryDB(req, res, query);
}

function getProjectRoles(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const getRolesQuery = new MyQuery<Role>("Role")
    .Select("*")
    .Where({ proj_id });
  myQueryDB(req, res, getRolesQuery);
}

function createProjectUser(req: Request, res: Response) {
  const addUserQuery =
    'INSERT INTO "Role_User_Project" (role_id, user_id, proj_id) VALUES ($1, $2, $3) RETURNING *';
  const { projid, userid } = req.params;
  const roleid = req.body.roleid;
  const values = [roleid, userid, projid];
  QDB(res, addUserQuery, values as string[]);
}

function createProjectTeam(req: Request, res: Response) {
  const { name: team_name, description: team_description } = req.body;
  const proj_id = req.params.projid;

  const addTeamQuery = new MyQuery<Team>("Team")
    .Insert({ team_name, team_description, proj_id })
    .Returning("*");
  myQueryDB(req, res, addTeamQuery);
}

export {
  UpdateProjectInfo,
  getProjectInfo,
  getProjectHistory,
  getProjectTickets,
  getProjectUsers,
  getProjectUserTickets,
  getProjectUserTeam,
  getProjectTeams,
  getProjectRoles,
  createProjectUser,
  createProjectTeam,
};
