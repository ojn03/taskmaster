-- commands used to create sql db
-- todo make shema not public
CREATE TABLE "User"(
  "user_id" serial PRIMARY KEY,
  "first name" varchar(50) NOT NULL,
  "last name" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "UserInfo"(
  "user_id" int PRIMARY KEY REFERENCES "User"(user_id),
  "username" varchar(50) UNIQUE NOT NULL,
  "hash" varchar(250) NOT NULL
);

CREATE TABLE "Request"(
  "req_id" serial PRIMARY KEY,
  "request details" varchar(100) NOT NULL,
  "from_user" int REFERENCES "User"(user_id),
  "to_user" int REFERENCES "User"(user_id)
);

CREATE TABLE "Project"(
  "proj_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(250) NOT NULL
);

CREATE TABLE "Role"(
  "role_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" varchar(100) NOT NULL,
  "proj_id" int REFERENCES "Project"(proj_id)
);

CREATE TABLE "Privelege"(
  "priv_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "Role_Priveleges"(
  "role_id" int REFERENCES "Role"(role_id),
  "priv_id" int REFERENCES "Privelege"(priv_id),
  PRIMARY KEY ("role_id", "priv_id")
);

CREATE TABLE "Priv_User_Project"(
  "priv_id" int REFERENCES "Privelege"(priv_id),
  "proj_id" int REFERENCES "Project"(proj_id),
  "user_id" int REFERENCES "User"(user_id),
  PRIMARY KEY ("priv_id", "proj_id", "user_id")
);

CREATE TABLE "Sprint"(
  "sprint_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "User_Sprint"(
  "user_id" int REFERENCES "User"(user_id),
  "sp_id" int REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY ("user_id", "sp_id")
);

CREATE TABLE "Event"(
  "event_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "desc" varchar(100) NOT NULL
);

CREATE TABLE "History"(
  "date_id" serial PRIMARY KEY,
  "date" date NOT NULL,
  "time" time NOT NULL,
  "event_id" int REFERENCES "Event"(event_id),
  "proj_id" int REFERENCES "Project"(proj_id)
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
  "user_id" int REFERENCES "User"(user_id),
  PRIMARY KEY ("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" int REFERENCES "Sprint"(sprint_id),
  "Tick_id" int REFERENCES "Ticket"(tick_id),
  PRIMARY KEY ("sprint_id", "Tick_id")
);

CREATE TABLE "Comment"(
  "comment_id" serial PRIMARY KEY,
  "comment" varchar(250) NOT NULL,
  "datePosted" date NOT NULL,
  "user_id" int REFERENCES "User"(user_id),
  "tick_id" int REFERENCES "Ticket"(tick_id)
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
  RAISE NOTICE 'adding registration info';
  INSERT INTO "User"(FIRST, LAST, email)
    VALUES (fn, ln, em)
  RETURNING
    user_id INTO id;
  INSERT INTO "UserInfo"(user_id, username, hash)
    VALUES (id, un, hsh);
  RAISE NOTICE 'registration complete';
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

create or replace function emailToHash(em varchar(100))
returns varchar(250)
as $$
declare
  id integer;
begin
  select user_id from "User" where email = em into id;
  return (select "hash" from "UserInfo" where user_id = id);
end
$$ language plpgsql;

