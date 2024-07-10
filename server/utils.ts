//TODO better error handling

import { NextFunction, Request, Response } from "express";
import { red } from ".";
import { MyQuery, Table } from "./DB/QueryBuilder";
import { pool } from "./pool";

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );
  return error;
}

/**
 * 
 * middleware that caches db query results for get requests.
//TODO implement cache logic for post,patch,delete requests, and rename this function accordingly (getCache -> cache)
 */
export function getCache() {
  return function (req: Request, res: Response, next: NextFunction): void {
    return next();
    if (req.method !== "GET") {
      return next();
    }
    red.get(`${req.path}`, (err, data) => {
      if (err) {
        console.error(err.message);
        return res.json({ error: "error 500: " + err.message });
      } else if (data != null) {
        console.log("cache hit");
        return res.json(JSON.parse(data));
      } else {
        return next();
      }
    });
  };
}

//DB Middlware for get requests
export function getDB(querytxt: string, ...params: string[]) {
  return function (req: Request, res: Response) {
    pool.query(
      querytxt,
      params.map((param) => req.params[param]),
      (err, response) => {
        if (err) {
          console.error(err.message);
          res.json({ error: "error 500: " + err.message });
        } else {
          red.setex(`${req.path}`, 600, JSON.stringify(response.rows));
          console.log("cache miss");
          res.json(response.rows);
        }
      },
    );
  };
}

/**
 * DB Query for patch requests
 */
export function myQueryDB<T extends Table>(
  req: Request,
  res: Response,
  query: MyQuery<T>,
  lengthTilExpiration: number = 600, //TODO set this dynamically
) {
  query.Query((err, response) => {
    if (err) {
      console.error(err.message);
      res.json({ error: "error 500: " + err.message });
    } else {
      const data = response.rows;
      switch (req.method) {
        case "GET":
        case "POST":
        case "PATCH": //TODO find out how to only update part of the cache. maybe use hset/hget
          red.setex(`${req.path}`, lengthTilExpiration, JSON.stringify(data));
          console.log("cache set");
          break;

        case "DELETE":
          red.del(`${req.path}`); //TODO error handling
          break;
        default:
          break;
      }
      res.json(data);
    }
  });
}
/**
 * DB Query for general requests
 */
export function QDB(
  res: Response,
  querytxt: string,
  params: (string | number)[],
) {
  pool.query(querytxt, params, (err, response) => {
    if (err) {
      console.error(err.message);
      res.json({ error: "error 500: " + err.message });
    } else {
      res.json(response.rows);
    }
  });
}
