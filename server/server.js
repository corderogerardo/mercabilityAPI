require('./config/config');
// TODO-do: MongoDB Start Windows "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe"
// Third party modules
const express = require('express');
const bodyParser = require('body-parser');

// Client ID Google+ Oauth nof-test :
// Client secret :

// My modules exported
let { todos } = require('./router/todos');
let { users } = require('./router/users');
let { categories } = require('./router/categories');
// Express REST API Server Instance
let app = express();
const port = process.env.PORT;

// Use Middleware to allow express read and send json data, body parser wraps express.
app.use(bodyParser.json());

app.use(users);
app.use(todos);
app.use(categories);

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };
