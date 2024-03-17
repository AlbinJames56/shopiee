const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { connectToDatabase } = require('./connection');

const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/shopiee', // MongoDB connection URI
  collection: 'sessions' // MongoDB collection to store sessions
});

store.on('error', function(error) {
  console.error('Session store error:', error);
});

module.exports = session({
  secret: 'your-secret-key', // Secret key for session encryption
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 60000000 } // Session cookie configuration
});
