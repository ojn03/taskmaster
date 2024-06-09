const teamColumns = [
	{
		accessorKey: "first",
		header: "first"
	},
	{
		accessorKey: "last",
		header: "last"
	},
	{
		accessorKey: "email",
		header: "Email"
	},
	{
		accessorKey: "role_title",
		header: "role"
	}
];

const ticketColumns = [
	{
		accessorKey: "ticket_title",
		header: "Title",
		size: 50
	},
	{
		accessorKey: "description",
		header: "Description",
		size: 400
	},
	{
		accessorKey: "progress",
		header: "Progress",
		size: 50
	},
	{
		accessorKey: "priority",
		header: "Priority",
		size: 50
	}
];

const roleColumns = [
	{
		accessorKey: "role_title",
		header: "Role"
	},
	{
		accessorKey: "description",
		header: "Function"
	}
];

const historyColumns = [
	{
		accessorKey: "date",
		header: "Date"
	},
	{
		accessorKey: "time",
		header: "Time"
	},
	{
		accessorKey: "event_title",
		header: "Event"
	}
];

const allTeamsColumns = [
	{
		accessorKey: "team_name",
		header: "Team Name"
	},
	{
		accessorKey: "description",
		header: "desc"
	}
];



export {
	teamColumns,
	ticketColumns,
	roleColumns,
	historyColumns,
	allTeamsColumns
};
