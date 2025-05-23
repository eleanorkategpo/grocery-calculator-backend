import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        groceryItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "GroceryItem",
        },
        description: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
        },
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);

export default ShoppingList;
