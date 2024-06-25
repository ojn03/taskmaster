type User = {
  user_id: number;
  first: string;
  last: string;
  email: string;
};

type Project = {
  proj_id: number;
  name: string;
  description: string;
  owner: number;
};

type Ticket = {
  proj_id: number;
  tick_id: number;
  ticket_title: string;
  ticket_description: string;
  ticket_progress: number;
  created_at: Date;
  updated_at: Date;
};

type Team = {
  user_id: number;
  proj_id: number;
  role_id: number;
};

type Role = {
  role_id: number;
  name: string;
};
