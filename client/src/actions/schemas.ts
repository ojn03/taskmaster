import { Type, Static, TSchema } from "@sinclair/typebox";
//TODO allow for arrays of types without creating extra typeboxes
export type User = {
  user_id: number;
  first: string;
  last: string;
  email: string;
};

export type Project = {
  proj_id: number;
  name: string;
  description: string;
  owner: number;
};

export const Ticket = Type.Object({
  proj_id: Type.Number(),
  tick_id: Type.Number(),
  ticket_title: Type.String(),
  ticket_description: Type.String(),
  ticket_progress: Type.Number(),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

Ticket.title = "Ticket";

export type Ticket = Static<typeof Ticket>;

export type Team = {
  user_id: number;
  proj_id: number;
  role_id: number;
};

export type Role = {
  role_id: number;
  name: string;
};
