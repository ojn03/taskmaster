-- commands used to create sql db
-- todo make shema not public
--todo change "name" to "title" in all tables except "User"
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
  --rename to role_title
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

--static table
CREATE TABLE "Privelege"(
  "priv_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL
);

CREATE TYPE "priv" AS enum(
  'priv1',
  'priv2',
  'priv3',
  'priv4',
  'priv5'
);

CREATE TABLE "Role_Privelege"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id),
  -- "priv_id" int NOT NULL REFERENCES "Privelege"(priv_id),
  "privelege" "priv" NOT NULL,
  PRIMARY KEY ("role_id", "privelege")
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
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "sprint_id" int NOT NULL REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY ("user_id", "sprint_id")
);

--static table
CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "event_title" unique varchar(50) NOT NULL
  -- todo maybe remove id and just use title as primary key
  -- todo consider enum
);

CREATE TYPE "ev" AS enum(
  'event1',
  'event2',
  'event3',
  'event4',
  'event5'
);

--todo maybe replace static tables for enums
CREATE TABLE "History"(
  "history_id" serial PRIMARY KEY,
  "date" date NOT NULL,
  "time" time NOT NULL,
  "event" "ev" NOT NULL,
  -- "event_title" int NOT NULL REFERENCES "Event"(event_title),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id)
);

-- TODO maybe make ticket_project composite key
CREATE TABLE "Ticket"(
  "tick_id" serial PRIMARY KEY,
  "title" varchar(50) NOT NULL,
  "description" varchar(250) NOT NULL,
  "progress" int NOT NULL CHECK ("progress" BETWEEN 0 AND 2) default 0,
  "priority" int NOT NULL CHECK ("priority" BETWEEN 0 AND 4) default 0, 
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
  "datePosted" date NOT NULL,
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id)
);

--PROCEDURES--
--register
CREATE OR REPLACE PROCEDURE register(em varchar(100),
--email
un varchar(50),
--username
fn varchar(50),
--first name
ln varchar(50),
--last name
hsh varchar(250),
--hashed password
out error text --error message
)
LANGUAGE plpgsql
AS $$
DECLARE
  id integer;
BEGIN
  IF EXISTS (
    SELECT
      *
    FROM
      "User"
    WHERE
      email = em) THEN
  SELECT
    'email already exists' INTO error;
ELSE
  IF EXISTS (
    SELECT
      *
    FROM
      "UserInfo"
    WHERE
      username = un) THEN
  SELECT
    'username already exists' INTO error;
ELSE
 -- adding registration info
  INSERT INTO "User"(FIRST, LAST, email)
    VALUES (fn, ln, em)
  RETURNING
    user_id INTO id;
  INSERT INTO "UserInfo"(user_id, username, hash)
    VALUES (id, un, hsh);
  -- registration complete
END IF;
END IF;
END
$$;

-- end register
--begin loginEmail
CREATE OR REPLACE PROCEDURE loginEmail(em varchar(100), hsh varchar(250), out error text)
LANGUAGE plpgsql
AS $$
DECLARE
  id integer;
BEGIN
  IF EXISTS (
    SELECT
      *
    FROM
      "UserInfo"
    WHERE
      email = em
      AND "hash" = hsh) THEN
  SELECT
    'valid credentials' INTO error;
ELSE
  SELECT
    'invalid credentials' INTO error;
END IF;
END
$$;

CREATE OR REPLACE PROCEDURE loginUsername(un varchar(50),
--username
hsh varchar(250),
--hashed password
out error text --error message
)
LANGUAGE plpgsql
AS $$
DECLARE
  id integer;
BEGIN
  IF EXISTS (
    SELECT
      *
    FROM
      "UserInfo"
    WHERE
      username = un
      AND "hash" = hsh) THEN
  SELECT
    'valid credentials' INTO error;
  -- get all the necessary info (privileges, projects, tickets etc)
ELSE
  SELECT
    'invalid credentials' INTO error;
END IF;
END
$$;

-- end loginUsername
CREATE OR REPLACE FUNCTION emailToHash(em varchar(100))
  RETURNS varchar (
    250
)
    AS $$
DECLARE
  id integer;
BEGIN
  SELECT
    user_id
  FROM
    "User"
  WHERE
    email = em INTO id;
  RETURN (
    SELECT
      "hash"
    FROM
      "UserInfo"
    WHERE
      user_id = id);
END
$$
LANGUAGE plpgsql;

--to test query speed and efficiency
CREATE OR REPLACE FUNCTION "runtime"(PAR_sql text, OUT sql_runtime real)
  AS $$
DECLARE
  run_time_start timestamp with time zone;
  run_time_end timestamp with time zone;
BEGIN
  SELECT
    clock_timestamp() INTO run_time_start;
  EXECUTE PAR_sql;
  SELECT
    clock_timestamp() INTO run_time_end;
  SELECT
    EXTRACT(EPOCH FROM (run_time_end - run_time_start)) INTO sql_runtime;
END;
$$
LANGUAGE plpgsql
VOLATILE;

--gets first, last, email and roles of all members of a team given a user in the team and the project id
CREATE OR REPLACE FUNCTION getTeam(u_id integer, p_id integer)
  RETURNS TABLE(
    user_id integer,
    FIRST varchar(50),
    LAST varchar(50),
    email varchar(100),
    role_title varchar(50)
  )
  AS $$
DECLARE
  t_id integer;
BEGIN
  SELECT
    team_id
  FROM
    "Team_User_Project"
  WHERE
    "Team_User_Project".user_id = u_id
    AND proj_id = p_id INTO t_id;
  RETURN Query
  SELECT
    u.user_id,
    u.first,
    u.last,
    u.email,
    r.name AS role_title
  FROM
    "User" u
    JOIN "Role_User_Project" rup ON u.user_id = rup.user_id
    JOIN "Role" r ON rup.role_id = r.role_id
    JOIN "Team_User_Project" tup ON u.user_id = tup.user_id
  WHERE
    tup.team_id = t_id
    AND tup.proj_id = p_id;
END;
$$
LANGUAGE plpgsql;

