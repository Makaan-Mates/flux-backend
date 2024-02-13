const mongoose = require("mongoose")

const databaseConnection = (url:string) => {
    mongoose.connect(url)
    .then(() => console.log("Database connected successfully"))
    .catch((error: any) => console.error("Database connection error:", error));
}

export {};

module.exports = { databaseConnection };