import * as schemas from "../lib/schemas";

import { ColumnDef } from "@tanstack/react-table";

export type Team = {
  id: number;
  first: string;
  last: string;
  email: string;
  role_title: string;
};
const teamColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "first",
    header: "first",
  },
  {
    accessorKey: "last",
    header: "last",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role_title",
    header: "role",
  },
];

const ticketColumns: ColumnDef<schemas.Ticket>[] = [
  {
    accessorKey: "ticket_title",
    header: "Title",
    size: 50,
  },
  {
    accessorKey: "ticket_description",
    header: "Description",
    size: 400,
  },
  {
    accessorKey: "ticket_progress",
    header: "Progress",
    size: 50,
  },
  {
    accessorKey: "ticket_priority",
    header: "Priority",
    size: 50,
  },
];

export type Role = {
  role_title: string;
  description: string;
};

const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "role_title",
    header: "Role",
  },
  {
    accessorKey: "description",
    header: "Function",
  },
];

const historyColumns: ColumnDef<schemas.History>[] = [
  {
    accessorKey: "created_at",
    header: "created_at",
  },
  {
    accessorKey: "user_id",
    header: "user_id",
  },
  {
    accessorKey: "event_title",
    header: "Event",
  },
];

export type AllTeams = {
  team_name: string;
  description: string;
};
const allTeamsColumns: ColumnDef<AllTeams>[] = [
  {
    accessorKey: "team_name",
    header: "Team Name",
  },
  {
    accessorKey: "description",
    header: "desc",
  },
];

const userProjectsColumns: ColumnDef<schemas.Project>[] = [
  {
    accessorKey: "proj_name",
    header: "Project Name",
  },
  {
    accessorKey: "proj_description",
    header: "Description",
  },
];

const userColumns: ColumnDef<schemas.User>[] = [
  {
    accessorKey: "first",
    header: "First",
  },
  {
    accessorKey: "last",
    header: "Last",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const RoleColumns: ColumnDef<schemas.Role>[] = [
  {
    accessorKey: "role_title",
    header: "Role",
  },
  {
    accessorKey: "role_description",
    header: "Description",
  },
];

//@ts-expect-error
const userRoleColumns: ColumnDef<schemas.User & schemas.Role>[] = [
  ...userColumns,
  ...RoleColumns,
];

export {
  teamColumns,
  ticketColumns,
  roleColumns,
  historyColumns,
  allTeamsColumns,
  userProjectsColumns,
  userColumns,
  userRoleColumns,
};
