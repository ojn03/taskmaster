const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

// middleware
app.use(cors());
app.use(express.json()); //req.body will be undefined without this


//ROUTES//

//REGISTRATION still testing
//todo make queries atomic

//regex patterns for input validation
const pVal = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*\(\)\-_\+=\{\}\[\]\|\\:;"'<>,\.\/\? ]).{8,45}/
const usernameVal = /[a-zA-Z0-9_]{5,45}/
const emailVal = /^[a-z0-9._%+-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/

app.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const { firstName: first, lastName: last, username, email, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        //validate inputs
        if (//check if any are empty
            !first || !last || !username || !email || !hash
            // regex validation
            || !usernameVal.test(username) || !emailVal.test(email)) {
            res.json({ 'error': 'invalid input' })
            return;
        }

        //check if email or username already exists else insert info into db
        const QueryRegister =
        {
            text: 'CALL register($1, $2, $3, $4, $5, $6)',
            values: [email, username, first, last, hash, null]
        };

        const response = await pool.query(QueryRegister);
        res.json(response.rows[0]);
    } catch (error) {
        console.error(error.message)
        res.json({ 'error': 'error 500' + error.message })
    }
})

//LOGIN

app.post('/login', async function (req, res) {
    try {
        const { username, email, password } = req.body
        console.log(req.body);
        console.log(username, email, password);

        const queryLogin =
            // if username provided with no email, use username
            (username && !email) ? {
                text: 'SELECT hash FROM "UserInfo" WHERE username = $1',
                values: [username]
            } :
                // if email provided with no username, use email
                (!username && email) ? {
                    text: 'select emailToHash($1) as hash',
                    values: [email]
                } :
                    // if both username and email provided, or neither, return null
                    // only time both are provided is if user is outside of client which is not currently allowed
                    null;

        if (queryLogin && password) {
            const response = await pool.query(queryLogin);
            const hash = response.rows[0]?.hash
            if (hash) {
                const match = await bcrypt.compare(password, hash)
                if (match) {
                    res.json({ 'success': 'logged in' })
                    return;
                }
            }
        }
        res.json({ 'error': 'invalid input' })
        return;
    } catch (error) {
        console.error(error.message)
        res.json({ 'error': 'error 500: ' + error.message })
    }
})

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});