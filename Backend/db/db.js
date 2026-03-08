const mongoose = require('mongoose');


function connectToDb() {
    const mongoUri = process.env.DB_CONNECT;
    
    mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => console.log('DB Connection Error:', err));
}


module.exports = connectToDb;
