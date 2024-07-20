import { Request, Response } from "express";
import { MyQuery, User } from "../DB/QueryBuilder";
import { myQueryDB, getDB, QDB } from "../utils";

function getUser(req: Request, res: Response) {
  //get a specific user
  const query = new MyQuery<User>("User")
    .Select("*")
    .Where({ user_id: req.params.userid });
  myQueryDB(req, res, query);
}

function getProjects(req: Request, res: Response) {
  const projectsQuery =
    'select p.proj_id, proj_name, proj_description from "Project" p join "Role_User_Project" rup on p.proj_id = rup.proj_id and rup.user_id = $1';
  getDB(projectsQuery, "userid")(req, res);
}

function createProject(req: Request, res: Response) {
  const createProjectQuery = "select * from createProject($1, $2, $3, $4)";

  const { userid } = req.params;
  const { name, description } = req.body;
  const values = [userid, name, description];

  QDB(res, createProjectQuery, values);
}

function getTickets(req: Request, res: Response) {
  const ticketsQuery =
    'SELECT * FROM "Ticket" WHERE tick_id IN (SELECT tick_id FROM "User_Ticket" WHERE user_id = $1)';
  getDB(ticketsQuery, "userid")(req, res);
}

export { getUser, getProjects, createProject, getTickets };
