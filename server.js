require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db");

connectToDB();

app.listen(2005, () => {
  console.log("server is running on port 2005");
});
