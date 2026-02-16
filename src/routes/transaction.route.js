const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controller/transaction.controller");

const router = express.Router();

router.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

/**
 * - POST /api/transaction/sytem/initial-fund
 * - Create initial fund
 */

router.post(
  "/system/initial-fund",
  authMiddleware.authMiddleware,
  transactionController.createInitialFundsTransaction,
  authMiddleware.authSystemMiddleware,
);

module.exports = router;
