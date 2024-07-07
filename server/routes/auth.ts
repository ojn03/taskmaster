import bcrypt from "bcrypt";
import * as authController from "../Controllers/authController";
import type { Express } from "express";
import { pool } from "../pool";
import { ensureError } from "../utils";

const authRoutes = async (app: Express, basePath: string = "/auth") => {
  //TODO make queries atomic
  //TODO change password, username, email, etc
  //TODO protect projects, ticket, etc. Before an action is taken, check if user has the proper permissions and scope. ie. can't delete a project if you're not the owner or admin, cant add a ticket to a project if you're not a member of the project, etc
  //TODO maybe with each request add role and project id to req object, and add a middleware to check if the role has the proper permissions to do the action
  // each route will pass in a list of required permissions to the middleware

  //ensure only backend can access db

  //LOGOUT
  //delete refresh token on logout

  //REGISTER
  const registerPath = `${basePath}/register`;
  app.post(registerPath, authController.register);

  //LOGIN
  const loginPath = `${basePath}/login`;
  app.post(loginPath, authController.login);
};

export default authRoutes;
