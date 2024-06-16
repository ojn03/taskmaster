-- sql schema
CREATE TABLE "User"(
  "user_id" serial PRIMARY KEY,
  "first" varchar(50) NOT NULL,
  "last" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--TODO add createdAt and updatedAt for all tables
CREATE TABLE "UserInfo"(
  "user_id" int PRIMARY KEY REFERENCES "User"(user_id) on delete cascade,
  "username" varchar(50) UNIQUE NOT NULL,
  "hash" varchar(250) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Request"(
  "req_id" serial PRIMARY KEY,
  "req_description" varchar(100) NOT NULL,
  "from_user" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  "to_user" int NOT NULL REFERENCES "User"(user_id) on delete cascade
);

CREATE TABLE "Project"(
  "proj_id" serial PRIMARY KEY,
  "proj_name" varchar(50) NOT NULL,
  "proj_description" varchar(250) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Role"(
  "role_id" serial PRIMARY KEY,
  "role_title" varchar(50) NOT NULL,
  --rename to role_title
  "role_description" varchar(100) NOT NULL,
  -- TODO create trigger to disable updates on proj_id and all other foreign keys
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade
);

CREATE TABLE "Role_User_Project"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id) on delete cascade,
  "user_id" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade,
  PRIMARY KEY ("proj_id", "user_id")
  --TODO fix duplication of proj_id. Roleid already has proj_id
);

--static table
CREATE TABLE "Permission"(
  "permission_id" serial PRIMARY KEY,
  "permission_name" varchar(50) NOT NULL,
  "permission_description" varchar(100) NOT NULL
);

CREATE TYPE "perm" AS enum(
  'priv1',
  'priv2',
  'priv3',
  'priv4',
  'priv5'
);

CREATE TABLE "Role_Permission"(
  "role_id" int NOT NULL REFERENCES "Role"(role_id) on delete cascade,
  -- "permission_id" int NOT NULL REFERENCES "Permission"(Permission_id),
  "Permission" "perm" NOT NULL,
  PRIMARY KEY ("role_id", "Permission")
);

CREATE TABLE "Team"(
  "team_id" serial PRIMARY KEY,
  "team_name" varchar(50) NOT NULL,
  "team_description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade
);

CREATE TABLE "Team_User_Project"(
  "team_id" int NOT NULL REFERENCES "Team"(team_id) on delete cascade,
  "user_id" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade,
  PRIMARY KEY ("user_id", "proj_id")
  --TODO dupliation of proj_id
);

CREATE TABLE "Sprint"(
  "sprint_id" serial PRIMARY KEY,
  "sprint_name" varchar(50) NOT NULL,
  "sprint_description" varchar(100) NOT NULL,
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade
);

CREATE TABLE "User_Sprint"(
  "user_id" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  "sprint_id" int NOT NULL REFERENCES "Sprint"(sprint_id) on delete cascade,
  PRIMARY KEY ("user_id", "sprint_id")
);

--static table
CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "event_title" varchar(50) UNIQUE NOT NULL
  -- TODO consider enum
);

CREATE TYPE "ev" AS enum(
  'event1',
  'event2',
  'event3',
  'event4',
  'event5'
);

CREATE TABLE "History"(
  "history_id" serial PRIMARY KEY,
  "event" "ev" NOT NULL,
  -- "event_title" int NOT NULL REFERENCES "Event"(event_title),
  "user_id" int NOT NULL REFERENCES "User"(user_id),
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TODO maybe make ticket_project composite key
CREATE TABLE "Ticket"(
  "tick_id" serial PRIMARY KEY,
  "ticket_title" varchar(50) NOT NULL,
  "ticket_description" varchar(250) NOT NULL,
  "ticket_progress" int NOT NULL CHECK ("progress" BETWEEN 0 AND 2) default 0,
  "ticket_priority" int NOT NULL CHECK ("priority" BETWEEN 0 AND 4) default 0, 
  "proj_id" int NOT NULL REFERENCES "Project"(proj_id) on delete cascade,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "User_Ticket"(
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id) on delete cascade,
  "user_id" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  PRIMARY KEY ("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" int NOT NULL REFERENCES "Sprint"(sprint_id) on delete cascade,
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id) on delete cascade,
  PRIMARY KEY ("sprint_id", "tick_id")
);

CREATE TABLE "Comment"(
  "comment_id" serial PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "user_id" int NOT NULL REFERENCES "User"(user_id) on delete cascade,
  "tick_id" int NOT NULL REFERENCES "Ticket"(tick_id) on delete cascade,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

CREATE OR REPLACE FUNCTION createProject(user_id INT, project_name varchar(50),project_description varchar(250) )
-- TODO add error handling
RETURNS TABLE(roleid INT, userid INT, projid INT) AS $$
DECLARE
    new_project_id INT;
    new_role_id INT;
BEGIN
    -- Create a new project
    INSERT INTO "Project" ("proj_name", "proj_description")
    VALUES (project_name, project_description)
    RETURNING "proj_id" INTO new_project_id;

    -- Create an 'admin' role tied to the new project
    INSERT INTO "Role" ("role_title", "role_description", "proj_id")
    VALUES ('admin', 'Admin role for project ' || project_name, new_project_id)
    RETURNING "role_id" INTO new_role_id;

    -- Update the Role_User_Project table
    INSERT INTO "Role_User_Project" ("role_id", "user_id", "proj_id")
    VALUES (new_role_id, user_id, new_project_id);
     -- Return the newly created Role_User_Project entity
    RETURN QUERY SELECT new_role_id, user_id, new_project_id;
END;
$$ LANGUAGE plpgsql;

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
    r.role_title AS role_title
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


-- helper function to update updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- triggers to update updated_at column in ticket
CREATE TRIGGER set_updated_time
BEFORE UPDATE ON "Ticket"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_updated_time
BEFORE UPDATE ON "User"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_updated_time
BEFORE UPDATE ON "UserInfo"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_updated_time
BEFORE UPDATE ON "Project"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_updated_time
BEFORE UPDATE ON "Comment"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
--TODO add update triggers for all necessary tables