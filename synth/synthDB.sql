-- commands used to create sql db
-- todo fix array lengths in synth schemas
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
  "description" varchar(100) NOT NULL,
  "from_user" int NOT NULL REFERENCES "User"(user_id),
  "to_user" int NOT NULL REFERENCES "User"(user_id)
);

CREATE TABLE "Project"(
  "proj_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(250) NOT NULL
);

CREATE TABLE "Role"(
  "role_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Role_User_Project"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id),
  PRIMARY KEY ("proj_id", "user_id")
  --todo fix duplication of proj_id. Roleid already has proj_id
);

CREATE TABLE "Privelege"(
  "priv_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL
);

CREATE TABLE "Role_Priveleges"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id),
  "priv_id" int NOT NULL REFERENCES "Privelege"(priv_id),
  PRIMARY KEY ("role_id", "priv_id")
);

CREATE TABLE "Team"(
  "team_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL,
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
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Sprint"(
  "user_id" int not null REFERENCES "User"(user_id),
  "sprint_id" int not null REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY ("user_id", "sprint_id")
);

CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL
);

CREATE TABLE "History"(
  "history_id" serial PRIMARY KEY,
  "date" date NOT NULL,
  "time" time NOT NULL,
  "event_id" int NOT NULL REFERENCES "Event"(event_id),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Ticket"(
  "tick_id" serial PRIMARY KEY,
  "title" varchar(50) NOT NULL,
  "description" varchar(250) NOT NULL,
  "progress" int not null CHECK ("progress" BETWEEN 0 AND 2),
  "priority" int not null CHECK ("priority" BETWEEN 0 AND 4),
  "proj_id" int not null REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Ticket"(
  "tick_id" int not null REFERENCES "Ticket"(tick_id),
  "user_id" int not null REFERENCES "User"(user_id),
  PRIMARY KEY ("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" int not null REFERENCES "Sprint"(sprint_id),
  "tick_id" int not null REFERENCES "Ticket"(tick_id),
  PRIMARY KEY ("sprint_id", "tick_id")
);

CREATE TABLE "Comment"(
  "comment_id" serial PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "datePosted" date NOT NULL,
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id)
);

CREATE TABLE "User_Proj"(
  "user_id" int REFERENCES "User"(user_id),
  "proj_id" int REFERENCES "Project"(proj_id),
  PRIMARY KEY ("user_id", "proj_id")
);

