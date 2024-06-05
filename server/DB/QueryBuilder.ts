// Desc: QueryBuilder class for building SQL queries
import { pool } from "../pool";
import { QueryResult } from "pg";
import {
	IsNotEmpty
} from "class-validator";
export type Table = Ticket | User | Project;

export type Ticket = {
	tick_id: number;
	title: string;
	description: string;
	priority: string;
	proj_id: number;
};

//TODO implement class-validator
// export class Ticket {
// 	@IsNotEmpty()
// 	tick_id: number;

// 	@IsNotEmpty()
// 	title: string;

// 	@IsNotEmpty()
// 	description: string;

// 	@IsNotEmpty()
// 	priority: string;

// 	@IsNotEmpty()
// 	proj_id: number;
// 	// constructor(ticket: Ticket){
// 	// 	this.tick_id = ticket.tick_id;
// 	// 	this.title = ticket.title;
// 	// 	this.description = ticket.description;
// 	// 	this.priority = ticket.priority;
// 	// 	this.proj_id = ticket.proj_id;
// 	// }
// }

export type User = {
	user_id: number;
	username: string;
	password: string;
	email: string;
};

export type Project = {
	proj_id: number;
	name: string;
	description: string;
};

export class MyQuery<T extends Table> {
	//implements myQuery<T>
	private QueryString: string = "";
	private readonly Table: string;
	constructor(tablename: string) {
		this.Table = tablename;
	}

	//TODO figure out overload. look at Query method in pg ClientBase class
	//TODO implement functionality different operations (=, <, >, etc)
	Where(clauses: Partial<T>): this {
		const whereClause = Object.entries(clauses)
			.map(([key, value]) => `${key} = '${value}'`)
			.join(" AND ");
		this.QueryString += ` WHERE ${whereClause}`;
		return this;
	}

	Update(data: Partial<T>): this {
		const setClause = Object.entries(data)
			.map(([key, value]) => `${key} = '${value}'`)
			.join(", ");
		this.QueryString += `UPDATE "${this.Table}" SET ${setClause}`;
		return this;
	}

	Insert(data: Partial<T>): this {
		const keys: Array<keyof T> = [];
		const values: Array<string> = [];
		Object.entries(data).forEach(([key, value]) => {
			keys.push(key as keyof T);
			values.push(value as string);
		});

		const insertQuery = `INSERT INTO "${this.Table}" (${keys.join(", ")}) VALUES (${values.join(", ")})`;
		this.QueryString += insertQuery;
		return this;
	}
	Select(columns: Array<keyof T> | string): this {
		if (typeof columns === "string") {
			this.QueryString += `SELECT ${columns} FROM "${this.Table}"`;
		} else {
			this.QueryString += `SELECT ${columns.join(", ")} FROM "${this.Table}"`;
		}
		return this;
	}

	Returning(columns: Array<keyof T> | string): this {
		if (typeof columns === "string") {
			this.QueryString += ` RETURNING ${columns}`;
		} else if (typeof columns === typeof Array<keyof T>) {
			this.QueryString += ` RETURNING ${columns.join(", ")}`;
		}
		return this;
	}

	Delete() {
		this.QueryString += `DELETE FROM "${this.Table}"`;
		return this;
	}

	Query(callback: (err: Error, result: QueryResult<any>) => void): void {
		pool.query(this.QueryString, callback);
	}
}
