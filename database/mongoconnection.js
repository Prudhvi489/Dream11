const { MongoClient, ServerApiVersion } = require('mongodb');
const { DB_USER, DB_PWD, DB_URL } = require('../config/config');

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

let dbconnect;

async function connectdb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    dbconnect = client.db(DB_NAME); 
  // Get the collection
  // const collection = db.collection('playerslist');
  // Insert players json into MongoDB
  // collection.insertMany(playerslistdata, function(err, result) {
  //   if (err) {
  //     console.error('Error inserting data:', err);
  //   } else {
  //     console.log('Inserted documents into the collection');
  //   }
  // });
    console.log("You successfully connected to MongoDB!");
    return dbconnect

  }
  catch(err){
    console.log(err)
  }
  finally {
  }
}
// const playerscollection = db.collection("playerslist")
module.exports ={
    connectdb,
    dbconnect
    // playerscollection
}
