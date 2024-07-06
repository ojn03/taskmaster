import type { Request, Response } from "express";
import { QDB, getDB, myQueryDB } from "../utils";
import { Comment, MyQuery, Ticket } from "../DB/QueryBuilder";

function addTicket(req: Request, res: Response) {
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
}

function getAssignees(req: Request, res: Response) {
  const ticketAssigneesQuery =
    'select u.* from "User" u join "User_Ticket" ut on u.user_id = ut.user_id and ut.tick_id = $1';

  // because getBD returns a function, we need to first get that function and then call it with the request and response objects. this is called currying
  getDB(ticketAssigneesQuery, "tickid")(req, res);
}

function addAssignee(req: Request, res: Response) {
  const addAssigneeQuery =
    'INSERT INTO "User_Ticket" (user_id, tick_id) VALUES ($1, $2) RETURNING *';
  const tick_id = req.params.tickid;
  const { user_id } = req.body;
  const values = [user_id, tick_id];
  QDB(res, addAssigneeQuery, values);
}

function removeAssignee(req: Request, res: Response) {
  const { tickid, userid } = req.params;
  const removeAssigneeQuery =
    'DELETE FROM "User_Ticket" WHERE user_id = $1 AND tick_id = $2';
  const values = [userid, tickid];
  QDB(res, removeAssigneeQuery, values);
}

function getComments(req: Request, res: Response) {
  const tick_id = req.params.tickid;
  const query = new MyQuery<Comment>("Comment").Select("*").Where({ tick_id });
  myQueryDB(req, res, query);
}

function addComment(req: Request, res: Response) {
  //TODO add type and data validation (make sure fields exists, is a string, etc.)
  const tick_id = req.params.tickid;
  const { user_id, comment }: { user_id: number; comment: string } = req.body;
  const addCommentQuery = new MyQuery<Comment>("Comment")
    .Insert({ comment, tick_id, user_id })
    .Returning("*");
  myQueryDB(req, res, addCommentQuery);
}

function getTicket(req: Request, res: Response) {
  const tick_id = req.params.tickid;
  const query = new MyQuery<Ticket>("Ticket").Select("*").Where({ tick_id });
  myQueryDB(req, res, query);
}

function updateTicket(req: Request, res: Response) {
  const tick_id = req.params.tickid;
  const {
    title: ticket_title,
    description: ticket_description,
    priority: ticket_priority,
  } = req.body;

  const Query = new MyQuery<Ticket>("Ticket")
    .Update({ ticket_title, ticket_description, ticket_priority })
    .Where({ tick_id })
    .Returning("*");

  myQueryDB(req, res, Query);
}

function deleteTicket(req: Request, res: Response) {
  const tick_id = req.params.tickid;
  const deleteTicketQuery = new MyQuery<Ticket>("Ticket")
    .Delete()
    .Where({ tick_id });

  myQueryDB(req, res, deleteTicketQuery);
}

export {
  getTicket,
  addTicket,
  updateTicket,
  deleteTicket,
  getAssignees,
  addAssignee,
  removeAssignee,
  getComments,
  addComment,
};
