const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log("Error in connecting DB");
      process.exit(1);
    });
}

module.exports = connectToDB;
