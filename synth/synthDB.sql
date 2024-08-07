-- commands used to create sql db
-- TODO fix array lengths in synth schemas
CREATE TABLE "User"(
  "user_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "first" varchar(50) NOT NULL,
  "last" varchar(50) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL
);

--TODO add createdAt and updatedAt for all tables
CREATE TABLE "UserInfo"(
  "user_id" varchar(36) PRIMARY KEY REFERENCES "User"(user_id),
  "username" varchar(50) UNIQUE NOT NULL,
  "hash" varchar(250) NOT NULL
);

CREATE TABLE "Request"(
  "req_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "req_description" varchar(100) NOT NULL,
  "from_user" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "to_user" varchar(36) NOT NULL REFERENCES "User"(user_id)
);

CREATE TABLE "Project"(
  "proj_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "proj_name" varchar(50) NOT NULL,
  "proj_description" varchar(250) NOT NULL
);

CREATE TABLE "Role"(
  "role_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "role_title" varchar(50) NOT NULL,
  "role_description" varchar(100) NOT NULL,
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Role_User_Project"(
  "role_id" varchar(36) NOT NULL REFERENCES "Role"(role_id),
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id),
  PRIMARY KEY ("proj_id", "user_id")
  --TODO fix duplication of proj_id. Roleid already has proj_id
);

CREATE TABLE "Permission"(
  "permission_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "permission_name" varchar(50) NOT NULL,
  "permission_description" varchar(100) NOT NULL
);

CREATE TABLE "Role_Permission"(
  "role_id" varchar(36) NOT NULL REFERENCES "Role"(role_id),
  "permission_id" varchar(36) NOT NULL REFERENCES "Permission"(permission_id),
  PRIMARY KEY ("role_id", "permission_id")
);

CREATE TABLE "Team"(
  "team_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "team_name" varchar(50) NOT NULL,
  "team_description" varchar(100) NOT NULL,
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "Team_User_Project"(
  "team_id" varchar(36) NOT NULL REFERENCES "Team"(team_id),
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id),
  PRIMARY KEY ("user_id", "proj_id")
  --TODO dupliation of proj_id
);

CREATE TABLE "Sprint"(
  "sprint_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "sprint_name" varchar(50) NOT NULL,
  "sprint_description" varchar(100) NOT NULL,
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id)
);

CREATE TABLE "User_Sprint"(
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "sprint_id" varchar(36) NOT NULL REFERENCES "Sprint"(sprint_id),
  PRIMARY KEY ("user_id", "sprint_id")
);

CREATE TABLE "Event"(
  "event_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_title" varchar(50) UNIQUE NOT NULL
);

CREATE TABLE "History"(
  "history_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "event_title" varchar(50) NOT NULL REFERENCES "Event"(event_title),
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "Ticket"(
  "tick_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "ticket_title" varchar(50) NOT NULL,
  "ticket_description" varchar(250) NOT NULL,
  "ticket_progress" int NOT NULL CHECK ("ticket_progress" BETWEEN 0 AND 2),
  "ticket_priority" int NOT NULL CHECK ("ticket_priority" BETWEEN 0 AND 4),
  "proj_id" varchar(36) NOT NULL REFERENCES "Project"(proj_id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE "User_Ticket"(
  "tick_id" varchar(36) NOT NULL REFERENCES "Ticket"(tick_id),
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  PRIMARY KEY ("tick_id", "user_id")
);

CREATE TABLE "Sprint_Ticket"(
  "sprint_id" varchar(36) NOT NULL REFERENCES "Sprint"(sprint_id),
  "tick_id" varchar(36) NOT NULL REFERENCES "Ticket"(tick_id),
  PRIMARY KEY ("sprint_id", "tick_id")
);

CREATE TABLE "Comment"(
  "comment_id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  "comment" varchar(250) NOT NULL,
  "user_id" varchar(36) NOT NULL REFERENCES "User"(user_id),
  "tick_id" varchar(36) NOT NULL REFERENCES "Ticket"(tick_id),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

--extra table for synth generation
CREATE TABLE "User_Proj"(
  "user_id" varchar(36) REFERENCES "User"(user_id),
  "proj_id" varchar(36) REFERENCES "Project"(proj_id),
  PRIMARY KEY ("user_id", "proj_id")
);

CREATE OR REPLACE FUNCTION getTeam(u_id varchar(36), p_id varchar(36))
  RETURNS TABLE(
    proj_id varchar(36),
    role_id varchar(36),
    user_id varchar(36),
    FIRST varchar(50),
    LAST varchar(50),
    email varchar(100),
    role_title varchar(50),
    role_description varchar(100)
  )
  AS $$
DECLARE
  t_id varchar(36);
BEGIN
  SELECT
    team_id
  FROM
    "Team_User_Project" tup
  WHERE
    tup.user_id = u_id
    AND tup.proj_id = p_id INTO t_id;
  RETURN Query
  SELECT
    rup.proj_id,
    r.role_id,
    u.user_id,
    u.first,
    u.last,
    u.email,
    r.role_title,
    r.role_description
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

-- command to generate synth data: synth generate synth --size 30 --to 'postgresql://postgres@localhost:5432/synth' --random
-- to set sequence values: select setval('sequence_name', some_value)
