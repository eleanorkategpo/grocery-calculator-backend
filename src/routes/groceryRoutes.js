import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getGroceryItemsById,
  createGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  getGroceryById,
  createGrocery,
  updateGrocery,
  deleteGrocery,
  getPreviousCarts,
  getLastGroceryItems,
} from "../controllers/groceryController.js";

const router = express.Router();

router.use(protect);
router.get("/previous-carts", getPreviousCarts);
router.post("/new-item", createGroceryItem);
router.get("/:id/items", getGroceryItemsById);
router.patch("/item/:itemId", updateGroceryItem);
router.delete("/item/:itemId", deleteGroceryItem);
router.get("/last-grocery-items", getLastGroceryItems);

router.post("/new-grocery", createGrocery);
router.get("/:id", getGroceryById);
router.patch("/:id", updateGrocery);
router.delete("/:id", deleteGrocery);

export default router;
