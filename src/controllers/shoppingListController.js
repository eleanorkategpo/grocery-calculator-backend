import ShoppingList from "../models/shoppingListModel.js";
import AppError from "../utils/appError.js";
import GroceryItem from "../models/groceryItemModel.js";

// Get user's shopping list
export const getShoppingList = async (req, res, next) => {
  try {
    const shoppingList = await ShoppingList.findOne({
      user: req.user._id,
    }).lean();

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [],
      });
    }

    const items = await GroceryItem.find({
      _id: {
        $in: shoppingList.items.map((item) => item.groceryItemId),
      },
    }).lean();
    shoppingList.items = shoppingList.items.map((item) => ({
      ...items.find(
        (i) => i._id?.toString() === item.groceryItemId?.toString()
      ),
      ...item,
    }));

    //remove duplicate ids
    shoppingList.items = shoppingList.items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.groceryItemId === item.groceryItemId)
    );
    //sort by description
    shoppingList.items.sort((a, b) =>
      a.description?.localeCompare(b.description)
    );

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

      if (groceryItemId && item) {
        item = {
          ...item,
          description: description,
          quantity: quantity,
        };
        await shoppingList.save();
      } else {
        shoppingList.items.push({
          groceryItemId: groceryItemId ?? null,
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
    let shoppingList = await ShoppingList.findOne({
      user: req.user._id,
    }).lean();

    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: [],
      });
    }

    const index = shoppingList.items.findIndex(
      (item) => item._id.toString() === itemId
    );
    const item = shoppingList.items[index];

    // // Update the items
    // let updatedItems =
    //   shoppingList.items.length > 0
    //     ? shoppingList.items.map((item) => {
    //         if (item?._id?.toString() === itemId) {
    //           return {
    //             ...item,
    //             quantity: req.body.quantity,
    //             description: req.body.description,
    //             checked: req.body.checked ?? false,
    //           };
    //         }
    //         return item;
    //       })
    //     : [
    //         {
    //           groceryItemId: itemId,
    //           quantity: req.body.quantity,
    //           description: req.body.description,
    //           checked: req.body.checked ?? false,
    //         },
    //       ];
    await ShoppingList.findOneAndUpdate(
      { _id: shoppingList._id },
      {
        $set: {
          [`items.${index}`]: {
            ...item,
            groceryItemId: itemId,
            quantity: req.body.quantity ?? item.quantity,
            description: req.body.description ?? item.description,
            checked: req.body.checked ?? false,
          },
        },
      },
      { new: true }
    );

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
