//TODO better error handling

import { red } from ".";

import { Request, Response, NextFunction } from "express";
import { pool } from "./pool";

export function ensureError(value: unknown): Error {
	if (value instanceof Error) return value;

	let stringified = "[Unable to stringify the thrown value]";
	try {
		stringified = JSON.stringify(value);
	} catch {}

	const error = new Error(
		`This value was thrown as is, not through an Error: ${stringified}`
	);
	return error;
}
// cache middleware for get requests

export function cacheDB(cacheLocation: string, ...params: string[]) {
	return function (req: Request, res: Response, next: NextFunction) {
		red.get(
			`${cacheLocation}:${params.map((param) => req.params[param]).join(":")}`,
			(err, data) => {
				console.time(cacheLocation);
				if (err) {
					console.error(err.message);
					res.json({ error: "error 500: " + err.message });
					console.timeEnd(cacheLocation);
				}
				if (data != null) {
					res.json(JSON.parse(data));
					console.timeEnd(cacheLocation);
					console.log("cache hit");
				} else {
					next();
				}
			}
		);
	};
} //DB Query for get requests
export function getDB(
	querytxt: string,
	cacheLocation: string,
	...params: string[]
) {
	return function (req: Request, res: Response) {
		pool.query(
			querytxt,
			params.map((param) => req.params[param]),
			(err, response) => {
				if (err) {
					console.error(err.message);
					res.json({ error: "error 500: " + err.message });
					console.timeEnd(cacheLocation);
				} else {
					red.setex(
						`${cacheLocation}:${params.map((param) => `${param}:${req.params[param]}`).join(":")}`,
						600,
						JSON.stringify(response.rows)
					);
					res.json(response.rows);
					console.timeEnd(cacheLocation);
					console.log("cache miss");
				}
			}
		);
	};
}

//DB Query for post requests
//FIXME this is incomplete
export function postDB(querytxt: string, cacheLocation: string, ...params: string[]) {
    pool.query(
      querytxt,
	  params,
    );
}