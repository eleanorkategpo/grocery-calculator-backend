import ShoppingList from "../models/shoppingListModel.js";
import GroceryItem from "../models/groceryItemModel.js";
import AppError from "../utils/appError.js";
import mongoose from "mongoose";

// Get user's shopping list
export const getShoppingList = async (req, res, next) => {
  try {
    //fetch shopping list and items from GroceryItem collection
    const shoppingList = await ShoppingList.findOne({ user: req.user._id }).lean();
    const items = await GroceryItem.find({
      _id: {
        $in: shoppingList.items.map((item) => item.item),
      },
    }).lean();
    shoppingList.items = shoppingList.items.map((item) => ({
      ...items.find((i) => i._id.toString() === item.item.toString()),
      quantity: item.quantity,
      checked: item.checked,
    }));

    res.status(200).json({
      status: "success",
      data: { ...shoppingList },
    });
  } catch (error) {
    next(error);
  }
};

// Add item to shopping list
export const addToShoppingList = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const id = new mongoose.Types.ObjectId(itemId);

    if (!id) {
      return next(new AppError("Item ID is required", 400));
    }

    // Check if the item exists
    const item = await GroceryItem.findById(id);
    if (!item) {
      return next(new AppError("Item not found", 404));
    }

    // Find the user's shopping list or create one
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [{ item: id, checked: false, quantity: 1 }],
      });
    } else {
      // Check if the item already exists in the list
      if (!shoppingList.items.some((item) => item.item.toString() === id)) {
        shoppingList.items.push({ item: id, checked: false, quantity: 1 });
        await shoppingList.save();
      }
    }

    res.status(200).json({
      status: "success",
      data: {
        message: "Item added to shopping list",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from shopping list
export const removeFromShoppingList = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Find the user's shopping list
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      return next(new AppError("Shopping list not found", 404));
    }

    // Remove the item from the list
    shoppingList.items = shoppingList.items.filter(
      (item) => item.toString() !== itemId
    );

    await shoppingList.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "Item removed from shopping list",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update shopping list (for batch operations)
export const updateShoppingList = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return next(new AppError("Items array is required", 400));
    }

    // Find the user's shopping list
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [],
      });
    }

    // Update the items
    shoppingList.items = items;
    await shoppingList.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "Shopping list updated",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Clear shopping list
export const clearShoppingList = async (req, res, next) => {
  try {
    // Find the user's shopping list
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      return next(new AppError("Shopping list not found", 404));
    }

    // Clear the items
    shoppingList.items = [];
    await shoppingList.save();

    res.status(200).json({
      status: "success",
      data: {
        message: "Shopping list cleared",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { checked, quantity } = req.body;

    const shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      return next(new AppError("Shopping list not found", 404));
    }
    const item = shoppingList.items.find((item) => item.item.toString() === itemId);

    if (!item) {
      return next(new AppError("Item not found", 404));
    }
    if (checked !== undefined) {
      item.checked = checked;
    }
    if (quantity !== undefined) {
      item.quantity = quantity;
    }
    await shoppingList.save();

    res.status(200).json({
      status: "success",
      data: { message: "Item updated" },
    });
  } catch (error) {
    next(error);
  }
};
