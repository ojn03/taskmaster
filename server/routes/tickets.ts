import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { type Express } from "express";
import { Comment, MyQuery, Ticket } from "../DB/QueryBuilder";
import { QDB, getCache, getDB, myQueryDB } from "../utils";

const ticketRoutes = (app: Express, basePath: string = "/tickets") => {
  //get all the tickets
  const allTickets = basePath;
  const allTicketsQuery = 'SELECT * FROM "Ticket"';
  app.get(allTickets, getCache(), getDB(allTicketsQuery));
  //TODO this is decoupled from the project route
  // in this case, ensure the user has access to the ticket by checking if the user is part of the ticket's project
  //get a specific ticket
  const ticket = `${basePath}/:tickid`;
  app.get(ticket, getCache(), (req, res) => {
    const tick_id = req.params.tickid;
    const query = new MyQuery<Ticket>("Ticket").Select("*").Where({ tick_id });
    console.log(query.toString());
    myQueryDB(req, res, query);
  });

  //create a new ticket
  app.post(basePath, (req, res) => {
    const { title, description, priority, project_id } = req.body;

    const addTicketQuery = new MyQuery<Ticket>("Ticket")
      .Insert({
        ticket_title: title,
        ticket_description: description,
        ticket_priority: priority,
        proj_id: project_id,
      })
      .Returning("*");
    myQueryDB<Ticket>(req, res, addTicketQuery);
  });

  //get the assignees of a specific ticket
  const ticketAssignees = `${ticket}/users`;
  const ticketAssigneesQuery =
    'SELECT * FROM "User_Ticket" join "User" on "User_Ticket".user_id = "User".user_id WHERE tick_id = $1';
  app.get(ticketAssignees, getCache(), getDB(ticketAssigneesQuery, "tickid"));

  //add an assignee to a specific ticket
  const addAssigneeQuery =
    'INSERT INTO "User_Ticket" (user_id, tick_id) VALUES ($1, $2) RETURNING *';
  app.post(ticketAssignees, (req, res) => {
    const tick_id = req.params.tickid;
    const { user_id } = req.body;
    const values = [user_id, tick_id];
    QDB(res, addAssigneeQuery, values as string[]);
  });

  //remove an assignee from a specific ticket
  const ticketAssignee = `${ticketAssignees}/:userid`;
  const removeAssigneeQuery =
    'DELETE FROM "User_Ticket" WHERE user_id = $1 AND tick_id = $2';
  app.delete(ticketAssignee, (req, res) => {
    const { tickid, userid } = req.params;
    const values = [userid, tickid];
    QDB(res, removeAssigneeQuery, values as string[]);
  });

  //get the comments of a specific ticket
  const ticketComments = `${ticket}/comments`;
  app.get(ticketComments, getCache(), (req, res) => {
    const tick_id = Number(req.params.tickid);
    const query = new MyQuery<Comment>("Comment")
      .Select("*")
      .Where({ tick_id });
    myQueryDB(req, res, query);
  });

  //add a comment to a specific ticket
  app.post(ticketComments, (req, res) => {
    //TODO add type and data validation (make sure fields exists, is a string, etc.)
    const tick_id = Number(req.params.tickid);
    const { user_id, comment }: { user_id: number; comment: string } = req.body;
    const addCommentQuery = new MyQuery<Comment>("Comment")
      .Insert({ comment, tick_id, user_id })
      .Returning("*");
    myQueryDB(req, res, addCommentQuery);
  });

  //update a specific ticket
  app.patch(ticket, (req, res) => {
    const tick_id = Number(req.params.tickid);
    const update = plainToClass(Ticket, req.body);

    validate(update).then((errors) => {
      //TODO handle validation
    });

    const Query = new MyQuery<Ticket>("Ticket")
      .Update(update)
      .Where({ tick_id })
      .Returning("*");

    myQueryDB(req, res, Query);
  });

  //delete a specific ticket
  app.delete(ticket, (req, res) => {
    const tick_id = req.params.tickid;
    const deleteTicketQuery = new MyQuery<Ticket>("Ticket")
      .Delete()
      .Where({ tick_id });

    myQueryDB(req, res, deleteTicketQuery);
  });
};

export default ticketRoutes;
