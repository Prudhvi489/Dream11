const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const {connectdb} =require("./database/mongoconnection")
const router = require('./routes');
const app = express();
const port = 8081;

// Middleware to parse JSON body
app.use(bodyParser.json());
// Endpoints

app.get('/', async (req, res) => {
  res.send('Hello World!');
});


/**
 * Major routing from routes folder
 */
app.use('/',router);

/**To insert players into the players list collection run addplayers function */
app.listen(port, async() => {
  await connectdb();
  console.log(`App listening on port ${port}`);
});
