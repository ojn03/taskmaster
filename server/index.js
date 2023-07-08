const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this


const config = {
    user: 'postgres',
    // password: process.env.POSTGRES_SUPER_PASS,
    host: 'localhost',
    port: 5432,
    database: 'taskmaster'
}

//ROUTES//

//REGISTRATION not tested

//regex patterns for input validation
const PVal = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*\(\)\-_\+=\{\}\[\]\|\\:;"'<>,\.\/\? ]).{8,30}/
const usernameVal = /[a-zA-Z0-9_]{5,30}/
const emailVal = /^[a-z0-9._%+-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/

const test = "do $$ \
declare message text; \
begin \
if not exists (select * from User where 'email' = 'hi') then \
select 'notice' as message; \
end if; \
end $$;"


//todo make queries atomic


app.post('/register', async (req, res) => {
    try {
        // console.log(req.body)
        const { first, last, username, email, hash } = req.body
        //validate inputs
        if (//check if any are empty
            !first || !last || !username || !email || !hash
            // regex validation
            || !usernameVal.test(username) || !emailVal.test(email)) {
            res.json('invalid input')
            return;
        }

        //check if email or username already exists else insert info into db
        const QueryRegister = 
        {text: 'CALL register($1, $2, $3, $4, $5, $6)',
        values: [email, username, first, last, hash,null],};
        console.log(QueryRegister)

        const response = await pool.query(QueryRegister);

        res.json((response));
    } catch (error) {
        console.error(error.message)
        res.json('error')
    }
})

//LOGIN not tested




app.listen(5001, () => {
    console.log('Server is running on port 5001');
});

{/*

create or replace procedure register(em varchar(100), un varchar(50), fn varchar(50), ln varchar(50), hsh varchar(250), out error text)
language plpgsql
 as $$
 declare id integer;
begin 
if exists (select * from "User" where email = em) then
select 'email already exists' into error;
else
if exists (select * from "UserInfo" where username = un) then
select 'username already exists' into error;
else
raise notice 'adding registration info';
insert into "User" (first,last,email) values(fn,ln,em) returning user_id into id;
insert into "UserInfo" (user_id,username,hash) values(id,un,hsh);
raise notice 'registration complete';
end if;
end if;
end $$;


*/}





