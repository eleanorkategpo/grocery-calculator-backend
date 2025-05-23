import express from "express";
import {
  getShoppingList,
  addToShoppingList,
  removeFromShoppingList,
  updateShoppingList,
  clearShoppingList,
} from "../controllers/shoppingListController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.get("/", getShoppingList);
router.post("/add", addToShoppingList);
router.delete("/remove/:itemId", removeFromShoppingList);
// Update entire list (batch)
router.patch("/update-item/:itemId", updateShoppingList);
// Clear the shopping list
router.post("/clear", clearShoppingList);

export default router;
