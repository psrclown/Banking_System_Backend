const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

transactionRoutes = Router();

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);
const transactionRoutes = Router();
