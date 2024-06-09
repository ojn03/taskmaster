import { type Express } from "express";
import { getDB, getCache, QDB, patchDB } from "../utils";
import { validate } from "class-validator";
import { MyQuery, Ticket } from "../DB/QueryBuilder";
import { plainToClass } from "class-transformer";

const ticketRoutes = (app: Express, basePath: string = "/tickets") => {
	//get all the tickets
	const allTickets = basePath;
	const allTicketsQuery = 'SELECT * FROM "Ticket"';
	app.get(allTickets, getCache("tickets"), getDB(allTicketsQuery, "tickets"));

	//TODO this is decoupled from the project route
	// in this case, ensure the user has access to the ticket by checking if the user is part of the ticket's project
	//get a specific ticket
	const ticket = `${basePath}/:tickid`;
	const ticketQuery = 'SELECT * FROM "Ticket" WHERE tick_id = $1';
	app.get(
		ticket,
		getCache("ticket", "tickid"),
		getDB(ticketQuery, "ticket", "tickid")
	);

	//create a new ticket
	app.post(basePath, (req, res) => {
		const { title, description, priority, project_id } = req.body;
		const addTicketQuery =
			'INSERT INTO "Ticket" (ticket_title, ticket_description,ticket_priority, proj_id) VALUES ($1, $2, $3, $4) RETURNING *';
		const values = [title, description, priority, project_id];
		QDB(res, addTicketQuery, "", values as string[]);
	});

	//get the assignees of a specific ticket
	const ticketAssignees = `${ticket}/assignees`;
	const ticketAssigneesQuery =
		'SELECT * FROM "User_Ticket" join "User" on "User_Ticket".user_id = "User".user_id WHERE tick_id = $1';
	app.get(
		ticketAssignees,
		getCache("assignees", "tickid"),
		getDB(ticketAssigneesQuery, "assignees", "tickid")
	);

	//add an assignee to a specific ticket
	const addAssigneeQuery =
		'INSERT INTO "User_Ticket" (user_id, tick_id) VALUES ($1, $2) RETURNING *';
	app.post(ticketAssignees, (req, res) => {
		const tick_id = req.params.tickid;
		const { user_id } = req.body;
		const values = [user_id, tick_id];
		QDB(res, addAssigneeQuery, "", values as string[]);
	});

	//remove an assignee from a specific ticket
	const ticketAssignee = `${ticketAssignees}/:userid`;
	const removeAssigneeQuery =
		'DELETE FROM "User_Ticket" WHERE user_id = $1 AND tick_id = $2';
	app.delete(ticketAssignee, (req, res) => {
		const { tickid, userid } = req.params;
		const values = [userid, tickid];
		QDB(res, removeAssigneeQuery, "", values as string[]);
	});

	//get the comments of a specific ticket
	const ticketComments = `${ticket}/comments`;
	const ticketCommentsQuery = 'SELECT * FROM "Comment" WHERE tick_id = $1';
	app.get(
		ticketComments,
		getCache("comments", "tickid"),
		getDB(ticketCommentsQuery, "comments", "tickid")
	);

	//add a comment to a specific ticket
	const addCommentQuery =
		'INSERT INTO "Comment" (tick_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *';
	app.post(ticketComments, (req, res) => {
		//TODO add type and data validation (make sure fields exists, is a string, etc.)
		const tick_id = req.params.tickid;
		const { user_id, comment }: { user_id: number; comment: string } = req.body;
		const values = [tick_id, user_id, comment];
		QDB(res, addCommentQuery, "", values as string[]);
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

		patchDB(res, Query);
	});

	//delete a specific ticket
	app.delete(ticket, (req, res) => {
		const tick_id = req.params.tickid;
		const deleteTicketQuery = 'DELETE FROM "Ticket" WHERE tick_id = $1';
		const values = [tick_id];
		QDB(res, deleteTicketQuery, "", values as string[]);
	});
};

export default ticketRoutes;
