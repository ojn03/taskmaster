import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../pool";
import { ensureError } from "../utils";
import { red } from "../index";
//regex patterns for input validation
//TODO use uuids instead of auto incrementing ids
async function login(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const queryLogin =
      // if username provided with no email, use username
      username && !email
        ? {
            text: 'SELECT user_id, hash FROM "UserInfo" WHERE username = $1',
            values: [username],
          }
        : // if email provided with no username, use email
          !username && email
          ? {
              //TODO use join instead of subquery
              text: 'select user_id, hash from "UserInfo" where user_id = (select user_id from "User" where email = ($1))',
              values: [email],
            }
          : // if both username and email provided, or neither, return null
            // only time both are provided is if user is outside of client which is not currently allowed
            null;
    //TODO check user exists first
    if (queryLogin && password) {
      const response = await pool.query(queryLogin);
      if (response.rows.length === 0) {
        return res.status(401).json("invalid credentials");
      }
      const { hash, user_id } = response.rows[0];
      if (hash && user_id) {
        const match = await bcrypt.compare(password, hash);
        if (match) {
          const access_token = jwt.sign(
            { user_id, username, email },
            process.env.ACCESS_TOKEN_SECRET!,

            { expiresIn: "1h" },
          );
          const refresh_token = jwt.sign(
            { user_id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "1d" },
          );

          //TODO store refresh token in db/redis
          red.setex(`refresh:${user_id}`, 24 * 60 * 60, refresh_token);
          //TODO maybe encrypt tokens
          return res
            .status(200)
            .cookie("refresh_token", refresh_token, {
              httpOnly: true,
              secure: true,
              signed: true,
              maxAge: 24 * 60 * 60 * 1000,
              path: "/auth/refresh",
            })
            .cookie("access_token", access_token, {
              httpOnly: true,
              secure: true,
              signed: true,
              maxAge: 60 * 60 * 1000,
            })
            .json({ user_id, username, email });
        }
      }
    }
    res.status(401).json("invalid credentials");
    return;
  } catch (err) {
    console.error(err);
    const error = ensureError(err);
    res.status(500).send(error.message);
  }
}

async function refresh(req: Request, res: Response) {
  const refresh_token = req.signedCookies.refresh_tokenrefresh_token as string;
  if (!refresh_token) {
    return res.sendStatus(401);
  }

  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET!,
    (err, decoded) => {
      if (err) {
        console.error(err);
        return res.sendStatus(401);
      }

      //@ts-ignore
      red.get(`refresh:${decoded?.user_id}`, (err, token) => {
        if (err || !token) {
          err && console.error(err);
          return res.sendStatus(401);
        }
        if (token !== refresh_token) {
          return res.sendStatus(401);
        }
      });
    },
  );

  //TODO rotate refresh token and send new access token

  // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err, user) => {
  //   if (err) {
  //     console.error(err);
  //     return res.sendStatus(403);
  //   }
  //   const accessToken = jwt.sign(
  //     { user_id: user.user_id },
  //     process.env.ACCESS_TOKEN_SECRET!,
  //     { expiresIn: "1h" }
  //   );
  //   res.cookie("accessToken", accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     signed: true,
  //     maxAge: 60 * 60 * 1000,
  //   });
  // });

  res.sendStatus(200);
}
/*todo
 *  logout
 *  blacklist access token
 * remove refresh token from db/redis
 *
 */

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const access_token = req.cookies.access_token as string;
  if (!access_token) {
    console.error("no access token");
    return res.sendStatus(401);
  }
  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) {
      console.error(err);
      return res.sendStatus(401);
    }
    //@ts-ignore
    req.user = user;
    next();
  });
}

async function register(req: Request, res: Response) {
  const pVal = new RegExp("^" + process.env.NEXT_PUBLIC_PASSWORD_REGEX + "$");
  const usernameVal = new RegExp(
    "^" + process.env.NEXT_PUBLIC_USERNAME_REGEX + "$",
  );
  const emailVal = new RegExp("^" + process.env.NEXT_PUBLIC_EMAIL_REGEX + "$");
  const isValid = (
    first: string,
    last: string,
    username: string,
    email: string,
    password: string,
  ) => {
    return !(
      !first ||
      !last ||
      !username ||
      !email ||
      !password ||
      !pVal.test(password) ||
      !usernameVal.test(username) ||
      !emailVal.test(email)
    );
  };

  try {
    const {
      firstName: first,
      lastName: last,
      username,
      email,
      password,
    } = req.body;

    //validate inputs
    if (!isValid(first, last, username, email, password)) {
      return res.status(422).send("invalid input");
    }
    const hash = await bcrypt.hash(password, 10);
    //check if email or username already exists else register info into db
    const QueryRegister = {
      text: "CALL register($1, $2, $3, $4, $5, null)",
      values: [email, username, first, last, hash],
    };

    const response = await pool.query(QueryRegister);
    const error = response.rows[0].error;
    if (error) {
      return res.status(400).send(error);
    }
    return res.status(200).send("successfully registered");
  } catch (err) {
    const error = ensureError(err);
    console.error(error);

    //TODO send this as a message rather than a json object, and update the client to handle it
    return res.status(500).send(error.message);
  }
}

export { login, refresh, register, verifyToken };
