import assert from "assert";
import { Type } from "typescript";
import { pool } from "../pool";

type Table = Ticket | User | Project;

type Ticket = {
	tick_id: number;
	title: string;
	description: string;
	priority: string;
	proj_id: number;
};


type User = {
	user_id: number;
	username: string;
	password: string;
	email: string;
};

type Project = {
	proj_id: number;
	name: string;
	description: string;
};

export class MyQuery<T extends Table> implements myQuery<T>{
	QueryString: string = "";

	Where(clauses: Partial<T>): this {
        
		Object.entries(clauses)
			.map(([key, value]) => `${key} = '${value}'`)
			.join(" AND ");
		return this;
	}

	Update(data: Partial<T>): this {
		return this;
	}

	Insert(data: Partial<T>): this {
		return this
	}
	Select(columns: Array<keyof T>): this {
		return this;
	}
 
	Query() {
		pool.query(this.QueryString, (err, res) => {;
	})}
}
new MyQuery<Ticket>().Select([])


interface myQuery<T> {
    Select(columns: Array<keyof T> | string): this;
    // Select(colString: string): this;
    Insert(data: Partial<T>): this;
    Where(conditions: Partial<T>): this;
    Update(data: Partial<T>): this;
    Query(): void;
}

// const a = new MyQuery(new someCLass());
// 	QueryString: string = "";
// 	Table: string;
// 	constructor(table: string) {
// 		this.Table = table;
// 	}

// 	Select(columns: string[]) {
// 		this.QueryString = `SELECT ${columns.join(", ")} FROM ${this.Table}`;
// 		return this;
// 	}

//     Insert(data: Record<string, string>) {
//         let keys = Object.keys(data);
//         let values = Object.values(data);
//         this.QueryString = `INSERT INTO ${this.Table} (${keys.join(", ")}) VALUES (${values.join(", ")})`;
//         return this;
//     }

//     //TODO from() into()

// 	Where(conditions: Record<string, string>) {
// 		let whereClause = Object.entries(conditions)
// 			.map(([key, value]) => `${key} = '${value}'`)
// 			.join(" AND ");
// 		this.QueryString += ` WHERE ${whereClause}`;
// 		return this;
// 	}

// 	Update(data: Record<string, string>) {
// 		let setClause = Object.entries(data)
// 			.map(([key, value]) => `${key} = '${value}'`)
// 			.join(", ");
// 		this.QueryString += ` SET ${setClause}`;
// 		return this;
// 	}
// }
