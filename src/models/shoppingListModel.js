import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroceryItem",
        required: true
      },
      checked: {
        type: Boolean,
        default: false
      },
      quantity: {
        type: Number,
        default: 1,
      },
      
    },
  ],
}, {
  timestamps: true
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
