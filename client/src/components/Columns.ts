"use client";
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

export type History = {
  date: string;
  time: string;
  event_title: string;
};
const historyColumns: ColumnDef<History>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
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

export {
  teamColumns,
  ticketColumns,
  roleColumns,
  historyColumns,
  allTeamsColumns,
};
