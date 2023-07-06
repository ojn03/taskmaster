-- commands used to create sql db
-- todo make shema not public
CREATE TABLE "User" (
  "user_id" SERIAL PRIMARY KEY,
  "first name" varchar(50) NOT NULL,
  "last name" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "UserInfo" (
  "user_id" int PRIMARY KEY REFERENCES "User"(user_id),
  "username" varchar(50) NOT NULL,
  "hash" varchar(250) NOT NULL
);

CREATE TABLE "Request" (
  "req_id" SERIAL PRIMARY KEY,
  "request details" varchar(100) NOT NULL,
  "from_user" int references "User"(user_id),
  "to_user" int references "User"(user_id)
);

CREATE TABLE "Project" (
  "proj_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(250) NOT NULL
);

CREATE TABLE "Role" (
  "role_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL,
  "proj_id" int references "Project"(proj_id)
);

CREATE TABLE "Privelege" (
  "priv_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "Role_Priveleges" (
  "role_id" int REFERENCES "Role"(role_id),
  "priv_id" int REFERENCES "Privelege"(priv_id),
  PRIMARY KEY("role_id", "priv_id")
);

CREATE TABLE "Priv_User_Project" (
  "priv_id" int REFERENCES "Privelege"(priv_id),
  "proj_id" int REFERENCES "Project"(proj_id),
  "user_id" int REFERENCES "User"(user_id),
  PRIMARY KEY("priv_id", "proj_id", "user_id")
);

CREATE TABLE "Sprint" (
  "sprint_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "User_Sprint" (
  "user_id" int REFERENCES "User"(user_id),
  "sp_id" int REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY("user_id", "sp_id")
);

CREATE TABLE "Event"(
  "event_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "History" (
  "date_id" SERIAL PRIMARY KEY,
  "date" DATE NOT NULL,
  "time" TIME NOT NULL,
  "event_id" int references "Event"(event_id),
  "proj_id" int references "Project"(proj_id)
);

CREATE TABLE "Ticket" (
  "tick_id" SERIAL PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(250) NOT NULL,
  "progress" int check (
    "progress" between 0
    and 2
  ),
  "priority" int check (
    "priority" between 0
    and 4
  ),
  "proj_id" int references "Project"(proj_id)
);

CREATE TABLE "User_Ticket" (
  "tick_id" int REFERENCES "Ticket"(tick_id),
  "user_id" int REFERENCES "User"(user_id),
  primary key("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket" (
  "sprint_id" int REFERENCES "Sprint"(sprint_id),
  "Tick_id" int REFERENCES "Ticket"(tick_id),
  PRIMARY KEY("sprint_id", "Tick_id")
);

CREATE TABLE "Comment" (
  "comment_id" SERIAL PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "datePosted" DATE NOT NULL,
  "user_id" int references "User"(user_id),
  "tick_id" int references "Ticket"(tick_id)
);
