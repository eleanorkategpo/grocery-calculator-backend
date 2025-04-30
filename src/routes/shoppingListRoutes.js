import express from "express";
import {
  getShoppingList,
  addToShoppingList,
  removeFromShoppingList,
  updateShoppingList,
  clearShoppingList
} from "../controllers/shoppingListController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

// Fetch or create the user's shopping list
router.get("/", getShoppingList);
// Add a single item by ID
router.post("/add", addToShoppingList);
// Remove a single item by ID
router.delete("/remove/:itemId", removeFromShoppingList);
// Update entire list (batch)
router.patch("/update", updateShoppingList);
// Clear the shopping list
router.post("/clear", clearShoppingList);

export default router;
