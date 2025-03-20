const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("Database Connected Succsessfully!"))
    .catch((err) => console.log("Database Connection Unsuccessfull!"))
}

module.exports = dbConnect;