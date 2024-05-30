import { response, type Express } from "express";
import { getDB,cacheDB, postDB, ensureError} from "../utils";
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
			postDB(res, addTicketQuery, '', values as string[]);
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
		postDB(res, addAssigneeQuery, '', values as string[]);
	})

	//get the comments of a specific ticket
	const ticketComments = `${ticket}/comments`;
	const ticketCommentsQuery = 'SELECT * FROM "Comment" WHERE tick_id = $1';
	app.get(
		ticketComments,
		cacheDB("comments", "tickid"),
		getDB(ticketCommentsQuery, "comments", "tickid")
	);

	//add a comment to a specific ticket
	//FIXME this is incomplete
	const addCommentQuery =
			'INSERT INTO "Comment" (tick_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *';
	app.post(ticketComments, (req, res) => {
		//TODO add type and data validation (make sure description exists, is a string, etc.)
		const tick_id = req.params.tickid;
		const { user_id, comment }:{user_id:number, comment:string} = req.body;
		const values = [tick_id, user_id, comment];
		postDB(res, addCommentQuery, '', values as string[]);
	});
};

export default ticketRoutes;
