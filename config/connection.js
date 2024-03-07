const { MongoClient } = require('mongodb');
 
// MongoDB connection URI
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
       // console.log('Connected to MongoDB Atlas');

        // Access a specific database
        //const database = client.db('shopiee'); // Replace '<dbname>' with your actual database name
        
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas', error);
        throw error;
    }
}

module.exports= { connectToDatabase }; // Exporting the function correctly
