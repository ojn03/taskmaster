import { Type, type Static, type TProperties } from "@sinclair/typebox";

function StrictObject<T extends TProperties>(properties: T) {
  return Type.Object(properties, { additionalProperties: false });
}

export const User = StrictObject({
  user_id: Type.String(),
  first: Type.String(),
  last: Type.String(),
  email: Type.String(),
});

export type User = Static<typeof User>;

export const Project = StrictObject({
  proj_id: Type.String(),
  proj_name: Type.String(),
  proj_description: Type.String(),
});

export type Project = Static<typeof Project>;

export const Ticket = StrictObject({
  proj_id: Type.String(),
  tick_id: Type.String(),
  ticket_title: Type.String(),
  ticket_description: Type.String(),
  ticket_priority: Type.Number(),
  ticket_progress: Type.Number(),
  created_at: Type.Optional(Type.String()),
  updated_at: Type.Optional(Type.String()),
});

export type Ticket = Static<typeof Ticket>;

export type Team = {
  user_id: string;
  proj_id: string;
  role_id: string;
};

export const Role = StrictObject({
  role_id: Type.String(),
  role_title: Type.String(),
  role_description: Type.String(),
  proj_id: Type.String(),
});

export const History = StrictObject({
  history_id: Type.String(),
  proj_id: Type.String(),
  user_id: Type.String(),
  event_title: Type.String(),
  created_at: Type.String(),
});

export type History = Static<typeof History>;

export type Role = Static<typeof Role>;

//type to make all fields optional except for K
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
