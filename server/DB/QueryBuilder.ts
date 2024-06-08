// Desc: QueryBuilder class for building SQL queries
import { pool } from "../pool";
import { ClientBase, QueryResult } from "pg";
import {
	IsDateString,
	IsNotEmpty,
	IsPositive,
	IsString,
	Matches,
	MaxLength,
	IsEmail,
	IsAlphanumeric,
} from "class-validator";
export type Table = Ticket | User | Project | Role|Comment;


//TODO maybe add created at and updated at to all classes
export class Ticket {
	@IsPositive()
	@IsNotEmpty()
	tick_id: number;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	priority: string;

	@IsPositive()
	proj_id: number;
}

export class Comment{
	@IsPositive()
	comment_id: number;

	@IsString()
	comment: string;

	@IsPositive()
	tick_id: number;

	@IsPositive()
	user_id: number;

	@IsDateString()
	created_at: Date;

	@IsDateString()
	update_at: Date;
}

export class Role {
	@IsPositive()
	role_id: number;

	@IsString()
	@MaxLength(50)
	name: string;

	@IsString()
	@MaxLength(100)
	description: string;

	@IsPositive()
	proj_id: number;
}


export class User {
	@MaxLength(50)
	@IsString()
	first: string;

	@MaxLength(50)
	@IsString()
	last: string;

	@IsPositive()
	user_id: number;

	@Matches(process.env.NEXT_PUBLIC_USERNAME_REGEX as string)
	@IsString()
	username: string;

	
	@Matches(process.env.NEXT_PUBLIC_PASSWORD_REGEX as string)
	@IsString()
	password: string;

	@IsEmail()
	@MaxLength(50) //TODO maybe separate user from userinfo
	@IsString()
	email: string;
};

//TODO add validation
export class Project {
	@IsAlphanumeric()
	proj_id: number|string;

	@MaxLength(50)
	@IsString()
	name: string;

	@MaxLength(250)
	@IsString()
	description: string;
};

//TODO update all applicable routes to use this class
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
