const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Sender's account must be needed for a transaction"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Recevier's account must be needed for a transaction"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["SUCCESS", "PENDING", "FAILED", "REVERSED"],
        message: "Status can be either SUCCESS, PENDING, FAILED or REVERSED",
      },
      default: "PENDING",
    },
    ammount: {
      type: Number,
      required: [true, "Ammount is required for creating a transaction"],
      min: [0, "Transation can't be in negative"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required for creating a transction"],
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
