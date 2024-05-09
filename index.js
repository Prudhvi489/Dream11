const express = require('express');
const { DB_USER, DB_PWD, DB_URL } = require('./config/config');
const fs = require('fs');
const bodyParser = require('body-parser');
const playerslistdata = require('./data/players.json')
const { MongoClient, ServerApiVersion } = require('mongodb');
const {connectdb} =require("./database/mongoconnection")
const router = require('./routes');
const app = express();
const port = 8081;

const DB_NAME = "task-jeff";
const DB_COLLECTION_NAME = "players";

// // const uri = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.unpwfuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // const uri = "mongodb+srv://prudhvisai489:WL172TgvaKNpmrtN@cluster0.dqfzt61.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const uri = "mongodb+srv://"+DB_USER+":"+DB_PWD+"@"+DB_URL+"/?retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let db;

// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     db = client.db(DB_NAME); 

//   // Get the collection
//   // const collection = db.collection('playerslist');
//   // Insert players json into MongoDB
//   // collection.insertMany(playerslistdata, function(err, result) {
//   //   if (err) {
//   //     console.error('Error inserting data:', err);
//   //   } else {
//   //     console.log('Inserted documents into the collection');
//   //   }
//   // });
//     console.log("You successfully connected to MongoDB!");
    
//   }
//   catch(err){
//     console.log(err)
//   }
//   finally {
//   }
// }


// Sample create document
async function sampleCreate() {
  const demo_doc = { 
    "demo": "doc demo",
    "hello": "world"
  };
  const demo_create = await db.collection(DB_COLLECTION_NAME).insertOne(demo_doc);
  
  console.log(demo_create.insertedId);
}

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

app.listen(port, async() => {
  await connectdb();
  console.log(`App listening on port ${port}`);
});

// run();

// module.exports ={
//   db
// }