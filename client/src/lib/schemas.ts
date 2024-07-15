import { Type, Static } from "@sinclair/typebox";

export const User = Type.Object(
  {
    user_id: Type.Union([Type.String(), Type.Number()]), //TODO convert all ids to strings or uuids
    first: Type.String(),
    last: Type.String(),
    email: Type.String(),
  },
  { additionalProperties: false },
);

export type User = Static<typeof User>;

export const Project = Type.Object(
  {
    proj_id: Type.Union([Type.String(), Type.Number()]),
    proj_name: Type.String(),
    proj_description: Type.String(),
  },
  { additionalProperties: false },
);

export type Project = Static<typeof Project>;

export const Ticket = Type.Object(
  {
    proj_id: Type.Union([Type.String(), Type.Number()]),
    tick_id: Type.Union([Type.String(), Type.Number()]),
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
  user_id: string;
  proj_id: string;
  role_id: string;
};

export const Role = Type.Object(
  {
    role_id: Type.Union([Type.String(), Type.Number()]),
    role_title: Type.String(),
    role_description: Type.String(),
    proj_id: Type.Union([Type.String(), Type.Number()]),
  },
  { additionalProperties: false },
);

export const History = Type.Object(
  {
    history_id: Type.Union([Type.String(), Type.Number()]),
    proj_id: Type.Union([Type.String(), Type.Number()]),
    user_id: Type.Union([Type.String(), Type.Number()]),
    event_title: Type.String(),
    created_at: Type.String(),
  },
  { additionalProperties: false },
);

export type History = Static<typeof History>;

export type Role = Static<typeof Role>;

//type to make all fields optional except for K
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
