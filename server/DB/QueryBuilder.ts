class Query{
    QueryString: string = "";
    Table: string
    constructor(table: string){
        this.Table = table;
    }

    Select(columns: string[]){
        this.QueryString = `SELECT ${columns.join(", ")} FROM ${this.Table}`;
        return this
    }
    Where(column: string, value: string){
        this.QueryString += ` WHERE ${column} = ${value}`;
        return this
    }
    Where()
    
}