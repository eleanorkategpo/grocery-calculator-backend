import express from "express";
import {
  getShoppingList,
  addToShoppingList,
  removeFromShoppingList,
  updateShoppingList,
  clearShoppingList,
  updateItem,
} from "../controllers/shoppingListController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.get("/", getShoppingList);
router.post("/add", addToShoppingList);
router.delete("/remove/:itemId", removeFromShoppingList);
router.patch("/update", updateShoppingList);
router.post("/clear", clearShoppingList);
router.patch("/update-item/:itemId", updateItem);

export default router;
