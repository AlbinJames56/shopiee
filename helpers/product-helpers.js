const {db} = require('../config/connection');
const { connectToDatabase } = require('../config/connection');
var collection=require('../config/collections')

module.exports = {
    addProduct: async (product, callback) => {
        //console.log(product);
        try {
            
            const database= await connectToDatabase(); 
            const result = await database.collection(collection.PRODUCT_COLLECTION).insertOne(product);
            console.log('Product added successfully:', result);
            const insertedId = result.insertedId.toString(); // Convert ObjectId to string
            //console.log('Inserted ID:', insertedId);
            callback(insertedId);
        } catch (error) {
            console.error('Error adding product:', error);
            callback(false);
        }
    },
    getAllProducts:async(req,res)=>{
        try {
            
            const database= await connectToDatabase(); 
            const products = await database.collection(collection.PRODUCT_COLLECTION).find().toArray();
            
            //console.log('readed:', products);
            //res.render('admin/view-products', { products});
            return products;
        } catch (error) {
            console.error('Error sending product:', error);
           
        }
    }
};