const { MongoClient } = require('mongodb');
//const db = require('../config/connection');
// MongoDB connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
      

        // Access a specific database
        
        const db = client.db("shopiee"); // Replace '<dbname>' with your actual database name
        
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas', error);
        throw error;
    }
}

module.exports= { connectToDatabase }; // Exporting the function correctly
