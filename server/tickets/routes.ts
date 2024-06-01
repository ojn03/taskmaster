import { response, type Express } from "express";
import { getDB, cacheDB, QDB, ensureError } from "../utils";
import { QueryResult } from "pg";

const ticketRoutes = (app: Express, basePath: string = "/tickets") => {
	//get all the tickets
	const allTickets = basePath;
	const allTicketsQuery = 'SELECT * FROM "Ticket"';
	app.get(allTickets, cacheDB("tickets"), getDB(allTicketsQuery, "tickets"));

	//TODO this is decoupled from the project route
	// in this case, ensure the user has access to the ticket by checking if the user is part of the ticket's project
	//get a specific ticket
	const ticket = `${basePath}/:tickid`;
	const ticketQuery = 'SELECT * FROM "Ticket" WHERE tick_id = $1';
	app.get(
		ticket,
		cacheDB("ticket", "tickid"),
		getDB(ticketQuery, "ticket", "tickid")
	);

	//create a new ticket
	app.post(basePath, (req, res) => {
		const { title, description, priority, project_id } = req.body;
		const addTicketQuery =
			'INSERT INTO "Ticket" (title, description,priority, proj_id) VALUES ($1, $2, $3, $4) RETURNING *';
		const values = [title, description, priority, project_id];
		QDB(res, addTicketQuery, "", values as string[]);
	});

	//get the assignees of a specific ticket
	const ticketAssignees = `${ticket}/assignees`;
	const ticketAssigneesQuery =
		'SELECT * FROM "User_Ticket" join "User" on "User_Ticket".user_id = "User".user_id WHERE tick_id = $1';
	app.get(
		ticketAssignees,
		cacheDB("assignees", "tickid"),
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
	//TODO change route to tickets/:tickid/assignees/:assigneeid
	const removeAssigneeQuery =
		'DELETE FROM "User_Ticket" WHERE user_id = $1 AND tick_id = $2';
	app.delete(ticketAssignees, (req, res) => {
		const {tick_id, user_id } = req.params;
		const values = [user_id, tick_id];
		QDB(res, removeAssigneeQuery, "", values as string[]);
	}
	);

	//get the comments of a specific ticket
	const ticketComments = `${ticket}/comments`;
	const ticketCommentsQuery = 'SELECT * FROM "Comment" WHERE tick_id = $1';
	app.get(
		ticketComments,
		cacheDB("comments", "tickid"),
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

	//delete a comment from a specific ticket
	//TODO change route to /comments/:commentid
	// maybe move comments to their own route
	const comment = `${ticketComments}/:commentid`;
	const deleteCommentQuery = 'DELETE FROM "Comment" WHERE comment_id = $1';
	app.delete(comment, (req, res) => {
		const comment_id = req.params.commentid;
		const values = [comment_id];
		QDB(res, deleteCommentQuery, "", values as string[]);
	});

//update a specific ticket
//TODO
	app.patch(ticket, (req, res) => {
		const tick_id = req.params.tickid;
		const { title, description, priority, project_id } = req.body;
		if (!title || !description || !priority || !project_id) {
			return res.status(400).json({ error: "No fields to update" });
		}
		const values = [title, description, priority, project_id, tick_id].filter((v)=> v !== undefined);

		const updateTicketQuery =
			values.reduce((acc, _, i) => {
				if (i === 0) {
					return acc + 'UPDATE "Ticket" SET title = $1';
				}
				if (i === 1) {
					return acc + ', description = $2';
				}
				if (i === 2) {
					return acc + ', priority = $3';
				}
				if (i === 3) {
					return acc + ', proj_id = $4';
				}
				return acc + ' WHERE tick_id = $5 RETURNING *';
			}
		);
			// 'UPDATE "Ticket" SET title = $1, description = $2, priority = $3, proj_id = $4 WHERE tick_id = $5 RETURNING *';
		QDB(res, updateTicketQuery, "", values as string[]);

	})

	//delete a specific ticket
	app.delete(ticket, (req, res) => {
		const tick_id = req.params.tickid;
		const deleteTicketQuery = 'DELETE FROM "Ticket" WHERE tick_id = $1';
		const values = [tick_id];
		QDB(res, deleteTicketQuery, "", values as string[]);
	});
};

export default ticketRoutes;
