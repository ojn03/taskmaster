import { type Express } from "express";
import * as ticketController from "../Controllers/ticketsController";
import { getDB } from "../utils";

const ticketRoutes = (app: Express, basePath: string = "/tickets") => {
  //get all the tickets
  const allTickets = basePath;
  const allTicketsQuery = 'SELECT * FROM "Ticket"';
  app.get(allTickets, getDB(allTicketsQuery));
  //TODO this is decoupled from the project route
  // in this case, ensure the user has access to the ticket by checking if the user is part of the ticket's project
  //get a specific ticket
  const ticket = `${basePath}/:tickid`;

  app
    .route(ticket)
    .get(ticketController.getTicket)
    //update a specific ticket
    .post(ticketController.updateTicket)
    //delete a specific ticket
    .delete(ticketController.deleteTicket);

  //create a new ticket
  app.post(basePath, ticketController.addTicket);

  const ticketAssignees = `${ticket}/users`;
  app
    .route(ticketAssignees)
    //get the assignees of a specific ticket
    .get(ticketController.getAssignees)
    //add an assignee to a specific ticket
    .post(ticketController.addAssignee);

  //remove an assignee from a specific ticket
  const ticketAssignee = `${ticketAssignees}/:userid`;
  app.delete(ticketAssignee, ticketController.removeAssignee);

  const ticketComments = `${ticket}/comments`;
  app
    .route(ticketComments)
    //get the comments of a specific ticket
    .get(ticketController.getComments)
    //add a comment to a specific ticket
    .post(ticketController.addComment);
};

export default ticketRoutes;
