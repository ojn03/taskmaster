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
  ticket_id: number;
  proj_id: number;
  ticket_title: string;
  ticket_description: string;
  ticket_progress: string;
  created_at: string;
  updated_at: string;
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
