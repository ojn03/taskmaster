import type { Express } from "express";
import * as projectController from "../Controllers/projectsController";

const projectRoutes = (app: Express, basePath: string = "/projects") => {
  //get all the tickets for a given project
  const ProjectTickets = `${basePath}/:projid/tickets`;
  app.route(ProjectTickets).get(projectController.getProjectTickets);

  const Project = `${basePath}/:projid`;
  app
    .route(Project)
    //get basic info for a given project
    .get(projectController.getProjectInfo)
    //update info for a given project
    .patch(projectController.UpdateProjectInfo);

  //get the history for a given project
  const ProjectHistory = `${basePath}/:projid/history`;
  app.get(ProjectHistory, projectController.getProjectHistory);

  //gets all the users of a given project
  const ProjectUsers = `${basePath}/:projid/users`;
  app.get(ProjectUsers, projectController.getProjectUsers);

  //gets all the tickets for a given project and user
  const ProjectUserTickets = `${ProjectUsers}/:userid/tickets`;
  app.get(ProjectUserTickets, projectController.getProjectUserTickets);

  //add a user to a project
  const ProjectUser = `${ProjectUsers}/:userid`;
  app.post(ProjectUser, projectController.createProjectUser);

  //gets first, last, email and roles of all members of a team given user in the team and the project id
  const ProjectUserTeam = `${ProjectUsers}/:userid/team/`;
  app.get(ProjectUserTeam, projectController.getProjectUserTeam);

  //gets all teams for a given projid
  const ProjectTeams = `${basePath}/:projid/teams`;
  app.get(ProjectTeams, projectController.getProjectTeams);

  //creates a new team
  app.post(ProjectTeams, projectController.createProjectTeam);

  //gets all roles for a given projid
  const ProjectRoles = `${basePath}/:projid/roles`;
  app.get(ProjectRoles, projectController.getProjectRoles);
};

export default projectRoutes;
