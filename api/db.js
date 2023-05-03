const { MongoClient } = require("mongodb");
require('dotenv').config()


const uri = `mongodb+srv://sandersCluster:${process.env.DATABASE_KEY}@cluster.pcw0j6d.mongodb.net/Cluster`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

const getDb = () => {
    if (!client.topology.isConnected()) {
        throw new Error("MongoDB not connected");
  }
  return client.db("Cluster");
};




module.exports = { connectDb, getDb };
