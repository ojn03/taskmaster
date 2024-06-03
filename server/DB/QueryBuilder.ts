// interface Table{

//     Where(conditions: Record<string, string>): Table

// }

// class Ticket implements Table {

//     // tick_id: number;
//     // title: string;
//     // description: string;
//     // priority: string;
//     // proj_id: number;
// }

// class User extends Table {
//     // user_id: number;
//     // username: string;
//     // password: string;
//     // email: string;
// }

// class someCLass{}

// class MyQuery<T extends Table> {

//     private _value: T;

//     constructor(value: T) {
//         this._value = value;
//     }

//     getValue(): T {
//         return this._value;
//     }
// }

// const a = new MyQuery(new someCLass());
// // 	QueryString: string = "";
// // 	Table: string;
// // 	constructor(table: string) {
// // 		this.Table = table;
// // 	}

// // 	Select(columns: string[]) {
// // 		this.QueryString = `SELECT ${columns.join(", ")} FROM ${this.Table}`;
// // 		return this;
// // 	}

// //     Insert(data: Record<string, string>) {
// //         let keys = Object.keys(data);
// //         let values = Object.values(data);
// //         this.QueryString = `INSERT INTO ${this.Table} (${keys.join(", ")}) VALUES (${values.join(", ")})`;
// //         return this;
// //     }

// //     //TODO from() into()

// // 	Where(conditions: Record<string, string>) {
// // 		let whereClause = Object.entries(conditions)
// // 			.map(([key, value]) => `${key} = '${value}'`)
// // 			.join(" AND ");
// // 		this.QueryString += ` WHERE ${whereClause}`;
// // 		return this;
// // 	}

// // 	Update(data: Record<string, string>) {
// // 		let setClause = Object.entries(data)
// // 			.map(([key, value]) => `${key} = '${value}'`)
// // 			.join(", ");
// // 		this.QueryString += ` SET ${setClause}`;
// // 		return this;
// // 	}
// // }
