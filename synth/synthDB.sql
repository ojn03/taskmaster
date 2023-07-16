-- commands used to create sql db
CREATE TABLE "User"(
  "user_id" serial PRIMARY KEY,
  "first" varchar(50) NOT NULL,
  "last" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "UserInfo"(
  "user_id" int  primary key REFERENCES "User"(user_id),
  "username" varchar(50) UNIQUE NOT NULL,
  "hash" varchar(250) NOT NULL
);

CREATE TABLE "Request"(
  "req_id" serial PRIMARY KEY,
  "description" varchar(100) NOT NULL,
  "from_user" int NOT NULL REFERENCES "User"(user_id),
  "to_user" int NOT NULL REFERENCES  "User"(user_id)
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

CREATE TABLE "Privelege"(
  "priv_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL
);

CREATE TABLE "Role_Priveleges"(
  "role_id" int REFERENCES "Role"(role_id),
  "priv_id" int REFERENCES "Privelege"(priv_id)
);

CREATE TABLE "Priv_User_Project"(
  "priv_id" int REFERENCES "Privelege"(priv_id),
  "proj_id" int REFERENCES "Project"(proj_id),
  "user_id" int REFERENCES "User"(user_id)
);

CREATE TABLE "Sprint"(
  "sprint_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL
);

CREATE TABLE "User_Sprint"(
  "user_id" int REFERENCES "User"(user_id),
  "sprint_id" int REFERENCES "Sprint"(sprint_id)
);

CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL
);

CREATE TABLE "History"(
  "date_id" serial PRIMARY KEY,
  "date" date NOT NULL,
  "time" time NOT NULL,
  "event_id" int NOT NULL REFERENCES "Event"(event_id), --maybe use name instead of id
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)

    --add user_id and proj_id to track who created the event and what project it belongs to

);

CREATE TABLE "Ticket"(
  "tick_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(250) NOT NULL,
  "progress" int CHECK ("progress" BETWEEN 0 AND 2),
  "priority" int CHECK ("priority" BETWEEN 0 AND 4),
  "proj_id" int REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Ticket"(
  "tick_id" int REFERENCES "Ticket"(tick_id),
  "user_id" int REFERENCES "User"(user_id)
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" int REFERENCES "Sprint"(sprint_id),
  "tick_id" int REFERENCES "Ticket"(tick_id)
);

CREATE TABLE "Comment"(
  "comment_id" serial PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "datePosted" date NOT NULL,
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id)
);