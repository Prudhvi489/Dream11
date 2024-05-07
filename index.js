const express = require('express');
const { DB_USER, DB_PWD, DB_URL } = require('./config/config');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 8081;

const DB_NAME = "task-jeff";
const DB_COLLECTION_NAME = "players";

// const uri = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.unpwfuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://prudhvisai489:WL172TgvaKNpmrtN@cluster0.dqfzt61.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri = "mongodb+srv://"+DB_USER+":"+DB_PWD+"@"+DB_URL+"/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function run() {
  try {
    await client.connect();
    console.log("entering")
    await client.db("admin").command({ ping: 1 });

    db = client.db(DB_NAME);
    
    console.log("You successfully connected to MongoDB!");
    
  }
  catch(err){
    console.log(err)
  }
  finally {
  }
}


// Sample create document
async function sampleCreate() {
  const demo_doc = { 
    "demo": "doc demo",
    "hello": "world"
  };
  const demo_create = await db.collection(DB_COLLECTION_NAME).insertOne(demo_doc);
  
  console.log("Added!")
  console.log(demo_create.insertedId);
}


// Endpoints

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.get('/demo', async (req, res) => {
  await sampleCreate();
  res.send({status: 1, message: "demo"});
});

//

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

run();