const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

/**
 * - Create a new transaction
 * The 10 step transfer flow:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction PENDING
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction complete
 * 9. Commit MongoDB Session
 * 10. Send Email notification
 */
async function createTransaction(req, res) {
  /** 1. Validate request*/
  const { fromAccount, toAccount, ammount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !ammount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, ammount, idempotencyKey are required",
    });
  }
  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });
  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount and toAccount",
    });
  }
  /** 2. Validate Idempotency Key */
  const isTransactonAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (isTransactonAlreadyExists) {
    if (isTransactonAlreadyExists.status == "SUCESS") {
      return res.status(200).json({
        message: "Transaction is Completed",
        transaction: isTransactonAlreadyExists,
      });
    }
    if (isTransactonAlreadyExists.status == "PENDING") {
      return res.status(200).json({
        message: "Transaction is still in process",
      });
    }
    if (isTransactonAlreadyExists.status == "FAILED") {
      return res.status(500).json({
        message: "Previous transaction attempt failed, please try again",
      });
    }
    if (isTransactonAlreadyExists.status == "REVERSED") {
      return res.status(500).json({
        message: "Transaction was reveresed, please retry",
      });
    }
  }
  /**
   * 3. Check account status
   */
  if (!toAccount.status == "ACTIVE" || !fromAccount.status == "ACTIVE") {
    return res.status(400).json({
      message:
        "Both sender and reciver account must be ACTIVE to process transaction",
    });
  }
  /**
   * 4. Derived sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();
  if (balance < ammount) {
    return res.status(400).json({
      message: `Insufficient Fund Availble Balance is ${balance}. requested ammount is ${ammount}`,
    });
  }
  /**
   * 5. Create transaction
   */

  const session = await mongoose.startSession();
  session.startTransaction();
  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      ammount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );
  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      ammount: ammount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );
  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      ammount: ammount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );
  transaction.status = "SUCCESS";
  await transaction.save({ session });
  await session.commitTransaction();
  session.endSession();

  /**
   * 10. Email notification
   */
  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    ammount,
    toAccount,
  );
  res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, ammount, idempotencyKey } = req.body;
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
