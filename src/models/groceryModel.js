import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const grocerySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  storeName: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  checkoutDate: {
    type: Date,
  },
  totalAmount: {
    type: Number,
  },
  paidWith: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'gcash', 'paymaya', 'gotyme', 'atome', 'others'],
  },
  amountTendered: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Grocery = mongoose.model("Grocery", grocerySchema);

export default Grocery;
