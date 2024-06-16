-- commands used to create sql db
-- TODO fix array lengths in synth schemas
CREATE TABLE "User"(
  "user_id" serial PRIMARY KEY,
  "first" varchar(50) NOT NULL,
  "last" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "UserInfo"(
  "user_id" int PRIMARY KEY REFERENCES "User"(user_id),
  "username" varchar(50) UNIQUE NOT NULL,
  "hash" varchar(250) NOT NULL
);

CREATE TABLE "Request"(
  "req_id" serial PRIMARY KEY,
  "req_description" varchar(100) NOT NULL,
  "from_user" int NOT NULL REFERENCES "User"(user_id),
  "to_user" int NOT NULL REFERENCES "User"(user_id)
);

CREATE TABLE "Project"(
  "proj_id" serial PRIMARY KEY,
  "proj_name" varchar(50) NOT NULL,
  "proj_description" varchar(250) NOT NULL
);

CREATE TABLE "Role"(
  "role_id" serial PRIMARY KEY,
  "role_title" varchar(50) NOT NULL,
  "role_description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Role_User_Project"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id),
  PRIMARY KEY ("proj_id", "user_id")
  --TODO fix duplication of proj_id. Roleid already has proj_id
);

CREATE TABLE "Permission"(
  "permission_id" serial PRIMARY KEY,
  "permission_name" varchar(50) NOT NULL,
  "permission_description" varchar(100) NOT NULL
);

CREATE TABLE "Role_Permission"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id),
  "permission_id" int NOT NULL REFERENCES "Permission"(permission_id),
  PRIMARY KEY ("role_id", "permission_id")
);

CREATE TABLE "Team"(
  "team_id" serial PRIMARY KEY,
  "team_name" varchar(50) NOT NULL,
  "team_description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Team_User_Project"(
  "team_id" int NOT NULL REFERENCES "Team"(team_id),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id),
  PRIMARY KEY ("user_id", "proj_id")
  --TODO dupliation of proj_id
);

CREATE TABLE "Sprint"(
  "sprint_id" serial PRIMARY KEY,
  "sprint_name" varchar(50) NOT NULL,
  "sprint_description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Sprint"(
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "sprint_id" int NOT NULL REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY ("user_id", "sprint_id")
);

CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "event_title" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "History"(
  "history_id" serial PRIMARY KEY,
  "event_title" varchar(50) NOT NULL REFERENCES "Event"(event_title),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "Ticket"(
  "tick_id" serial PRIMARY KEY,
  "ticket_title" varchar(50) NOT NULL,
  "ticket_description" varchar(250) NOT NULL,
  "ticket_progress" int NOT NULL CHECK ("ticket_progress" BETWEEN 0 AND 2),
  "ticket_priority" int NOT NULL CHECK ("ticket_priority" BETWEEN 0 AND 4),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Ticket"(
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  PRIMARY KEY ("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" int NOT NULL REFERENCES "Sprint"(sprint_id),
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id),
  PRIMARY KEY ("sprint_id", "tick_id")
);

CREATE TABLE "Comment"(
  "comment_id" serial PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

--extra table for synth generation
CREATE TABLE "User_Proj"(
  "user_id" int REFERENCES "User"(user_id),
  "proj_id" int REFERENCES "Project"(proj_id),
  PRIMARY KEY ("user_id", "proj_id")
);

-- command to generate synth data: synth generate synth --size 30 --to 'postgresql://postgres@localhost:5432/synth' --random
-- to set sequence values: select setval('sequence_name', some_value)
