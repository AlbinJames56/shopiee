const db = require('../config/connection');
const { connectToDatabase } = require('../config/connection');


module.exports = {
    addProduct: async (product, callback) => {
        console.log(product);
        try {
            //const client = await db();
            const database= await connectToDatabase(); // Call db() to get the client object
            //const database = client.db('shopiee'); // Replace 'shopiee' with your database name
            const result = await database.collection('product').insertOne(product);
            console.log('Product added successfully:', result);
            console.log(product)
            callback(product);
        } catch (error) {
            console.error('Error adding product:', error);
            callback(false);
        }
    }
}; 