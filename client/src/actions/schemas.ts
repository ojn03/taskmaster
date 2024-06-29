import { Type, Static, TSchema } from "@sinclair/typebox";
//TODO allow for arrays of types without creating extra typeboxes
export type User = {
  user_id: number;
  first: string;
  last: string;
  email: string;
};

//type to make make all fields optional except for K
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export const User = Type.Object(
  {
    user_id: Type.Number(),
    first: Type.String(),
    last: Type.String(),
    email: Type.String(),
  },
  { additionalProperties: false },
);

export const Project = Type.Object(
  {
    proj_id: Type.Number(),
    proj_name: Type.String(),
    proj_description: Type.String(),
  },
  { additionalProperties: false },
);

export type Project = Static<typeof Project>;

export const Ticket = Type.Object(
  {
    proj_id: Type.Number(),
    tick_id: Type.Number(),
    ticket_title: Type.String(),
    ticket_description: Type.String(),
    ticket_priority: Type.Number(),
    ticket_progress: Type.Number(),
    created_at: Type.Optional(Type.String()),
    updated_at: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

Ticket.title = "Ticket";

export type Ticket = Static<typeof Ticket>;

export type Team = {
  user_id: number;
  proj_id: number;
  role_id: number;
};

export const Role = Type.Object(
  {
    role_id: Type.Number(),
    role_title: Type.String(),
    role_description: Type.String(),
    proj_id: Type.Number(),
  },
  { additionalProperties: false },
);

export type Role = Static<typeof Role>;
