const express = require("express");
const authRouter = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const accountRouter = require("./routes/accounts.route");
const transactionRoutes = require("./routes/transaction.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("api/transactions", transactionRoutes);

module.exports = app;
