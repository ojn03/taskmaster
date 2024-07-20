import type { Express } from "express";
import { MyQuery, User } from "../DB/QueryBuilder";
import { QDB, getDB, myQueryDB } from "../utils";
import * as usersController from "../Controllers/usersController";

const userRoutes = (app: Express, basePath: string = "/users") => {
  //get a specific user
  const User = `${basePath}/:userid`;
  app.get(User, usersController.getUser);

  //get all the project info for a given user. returns (proj_id, name, description, userid, roleid)
  const UserProjects = `${basePath}/:userid/projects`;

  app.get(UserProjects, usersController.getProjects);

  //create a new project for a given user
  app.post(basePath, (req, res) => {
    usersController.createProject;
  });

  //get all the tickets for a given user
  const UserTickets = `${basePath}/:userid/tickets`;

  app.get(UserTickets, usersController.getTickets);
};

export default userRoutes;
