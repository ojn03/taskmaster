import React from "react";
import { getAllTeams, getRoles, getProjects } from "@/lib/functions";
import DataTable from "@/components/Data-Table";
import * as Columns from "@/components/Columns";

const projid = 1;
const page = async () => {
	const teams = await getAllTeams({ projid });
	const roles = await getRoles({ projid });
	// const projects = await getProjects({ userid });
	return (
		<div>
			<DataTable data={teams} columns={Columns.allTeamsColumns} />
			{/* <DataTable data={projects} columns={Columns.} /> */}

			<DataTable columns={Columns.roleColumns} data={roles} />
		</div>
	);
};

export default page;
