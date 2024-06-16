"use client";
//TODO: ZOD schemas?

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

export type Ticket = {
  id: number;
  ticket_title: string;
  description: string;
  progress: number;
  priority: number;
};
const ticketColumns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "ticket_title",
    header: "Title",
    size: 50,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 400,
  },
  {
    accessorKey: "progress",
    header: "Progress",
    size: 50,
  },
  {
    accessorKey: "priority",
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
