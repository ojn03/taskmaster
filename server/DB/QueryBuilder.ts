// Desc: QueryBuilder class for building SQL queries
import { pool } from "../pool";
import { QueryResult } from "pg";
import {
	IsDateString,
	IsPositive,
	IsString,
	Matches,
	MaxLength,
	IsEmail,
	IsNumberString
} from "class-validator";
export type Table = Ticket | User | Project | Role | Team|Comment;

//TODO maybe add created at and updated at to all classes
export class Ticket {
	@IsNumberString()
	@IsPositive()
	tick_id: number | string;

	@IsString()
	ticket_title: string;

	@IsString()
	ticket_description: string;

	@IsString()
	ticket_priority: string;

	@IsPositive()
	proj_id: number;

	@IsDateString()
	created_at: Date;

	@IsDateString()
	update_at: Date;
}

export class Comment {
	@IsNumberString()
	@IsPositive()
	comment_id: number | string;

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
	@IsNumberString()
	@IsPositive()
	role_id: number | string;

	@IsString()
	@MaxLength(50)
	role_title: string;

	@IsString()
	@MaxLength(100)
	role_description: string;

	@IsPositive()
	proj_id: number;

	@IsDateString()
	created_at: Date;

	@IsDateString()
	update_at: Date;
}

export class User {
	@IsNumberString()
	@IsPositive()
	user_id: number | string;

	@MaxLength(50)
	@IsString()
	first: string;

	@MaxLength(50)
	@IsString()
	last: string;

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

	@IsDateString()
	created_at: Date;

	@IsDateString()
	update_at: Date;
}

//TODO add validation
export class Project {
	@IsNumberString()
	@IsPositive()
	proj_id: number | string;

	@MaxLength(50)
	@IsString()
	proj_name: string;

	@MaxLength(250)
	@IsString()
	proj_description: string;

	@IsDateString()
	created_at: Date;

	@IsDateString()
	update_at: Date;
}

export class Team {
	@IsNumberString()
	@IsPositive()
	team_id: number | string;

	@MaxLength(50)
	@IsString()
	team_name: string;

	@MaxLength(100)
	@IsString()
	team_description: string;

	@IsPositive()
	proj_id: number;
}

//TODO update all applicable routes to use this class
export class MyQuery<T extends Table> {
	//TODO add flags as fields for different operations, to automatically add the correct operation. ie. whenever update is called, set this.updateFlag = true. then in the Query method, if updateFlag (or insert, etc) add returning * automatically.
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

	toString(): string {
		return this.QueryString;
	}
}
