const db = require('../config/connection');
const { connectToDatabase } = require('../config/connection');


module.exports = {
    addProduct: async (product, callback) => {
        //console.log(product);
        try {
            
            const database= await connectToDatabase(); 
            const result = await database.collection('product').insertOne(product);
            console.log('Product added successfully:', result);
            const insertedId = result.insertedId.toString(); // Convert ObjectId to string
            //console.log('Inserted ID:', insertedId);
            callback(insertedId);
        } catch (error) {
            console.error('Error adding product:', error);
            callback(false);
        }
    }
}; 