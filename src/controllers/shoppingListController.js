import ShoppingList from "../models/shoppingListModel.js";
import AppError from "../utils/appError.js";
import { v4 as uuidv4 } from "uuid";

// Get user's shopping list
export const getShoppingList = async (req, res, next) => {
  try {
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [],
      });
    }

    // Populate the items from the GroceryItem collection
    await shoppingList.populate("items");

    res.status(200).json({
      status: "success",
      data: {
        items: shoppingList.items || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add item to shopping list
export const addToShoppingList = async (req, res, next) => {
  try {
    const { description, quantity, groceryItemId, price } = req.body;
    // Find the user's shopping list or create one
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });
    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [...shoppingList.items, req.body],
      });
    }

    if (!shoppingList.items) shoppingList.items = [];
    else {
      //check if item already exists in the shopping list
      let item = shoppingList.items.find(
        (item) => item.groceryItemId === groceryItemId
      );
      if (item) {
        item = {
          ...item,
          description: description,
          quantity: quantity,
        };
        await shoppingList.save();
      } else {
        shoppingList.items.push({
          groceryItemId: groceryItemId,
          description: description,
          quantity: quantity,
          price: price,
        });
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
      (item) => item._id.toString() !== itemId
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
    const { itemId } = req.params;

    // Find the user's shopping list
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [],
      });
    }

    // Update the items
    shoppingList.items =
      shoppingList.items.length > 0
        ? shoppingList.items.map((item) => {
            if (item?.groceryItemId?.toString() === itemId) {
              return {
                ...item,
                quantity: req.body.quantity,
                description: req.body.description,
              };
            }
            return item;
          })
        : [
            {
              groceryItemId: itemId,
              quantity: req.body.quantity,
              description: req.body.description,
            },
          ];
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
