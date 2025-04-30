import Grocery from "../models/groceryModel.js";
import GroceryItem from "../models/groceryItemModel.js";
import mongoose from "mongoose";

export const getGroceryItemsById = async (req, res, next) => {
  try {
    const groceryItems = await GroceryItem.find({ groceryId: req.params.id });
    res.status(200).json({ status: "success", data: { groceryItems } });
  } catch (error) {
    next(error);
  }
};

export const createGroceryItem = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      groceryId: new mongoose.Types.ObjectId(req.body.groceryId),
      user: req.user._id,
    };
    const groceryItem = await GroceryItem.create(body);
    res.status(201).json({ status: "success", data: { groceryItem } });
  } catch (error) {
    next(error);
  }
};

export const updateGroceryItem = async (req, res, next) => {
  try {
    const groceryItem = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ status: "success", data: { groceryItem } });
  } catch (error) {
    next(error);
  }
};

export const deleteGroceryItem = async (req, res, next) => {
  try {
    await GroceryItem.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const getPreviousCarts = async (req, res, next) => {
  try {
    const previousCarts = await Grocery.aggregate([
      {
        $lookup: {
          from: "groceryitems",
          localField: "_id",
          foreignField: "groceryId",
          as: "items",
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          storeName: { $first: "$storeName" },
          budget: { $first: "$budget" },
          totalAmount: { $sum: "$items.total" },
          totalItems: { $sum: "$items.quantity" },
          items: { $push: "$items" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    if (!previousCarts.length) {
      return res
        .status(404)
        .json({ status: "fail", message: "No previous carts found" });
    }

    res.status(200).json({ status: "success", data: { previousCarts } });
  } catch (error) {
    next(error);
  }
};

export const getGroceryById = async (req, res, next) => {
  try {
    const grocery = await Grocery.findOne({ _id: req.params.id });
    const items = await GroceryItem.find({ groceryId: req.params.id });
    if (!grocery) {
      return res
        .status(404)
        .json({ status: "fail", message: "Grocery not found" });
    }
    res.status(200).json({ status: "success", data: { grocery, items } });
  } catch (error) {
    next(error);
  }
};

export const createGrocery = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      user: req.user._id,
    };
    const grocery = await Grocery.create(body);
    res.status(201).json({ status: "success", data: { grocery } });
  } catch (error) {
    next(error);
  }
};

export const updateGrocery = async (req, res, next) => {
  try {
    const grocery = await Grocery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "success", data: { grocery } });
  } catch (error) {
    next(error);
  }
};

export const deleteGrocery = async (req, res, next) => {
  try {
    await Grocery.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

export const getLastGroceryItems = async (req, res, next) => {
  try {
    const lastGroceryItems = await GroceryItem.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ status: "success", data: { lastGroceryItems } });
  } catch (error) {
    next(error);
  }
};
