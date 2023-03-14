/* eslint-disable comma-dangle */
/* remote repositories */

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

// internal modules
const schema = require('./Schema/schema');
const db = require('./db/remote');

// express app
const app = express();

// connect db
db();

// initialize graphQL
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
