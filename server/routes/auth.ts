import express from "express";
import * as authController from "../Controllers/authController";

const basePath: string = "/auth";
const router = express.Router();

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
router.post(registerPath, authController.register);

//REFRESH
const refreshPath = `${basePath}/refresh`;
router.post(refreshPath, authController.refresh);

//LOGIN
const loginPath = `${basePath}/login`;
router.post(loginPath, authController.login);

//LOGOUT
const logoutPath = `${basePath}/logout`;
router.post(logoutPath, authController.logout);

export default router;
