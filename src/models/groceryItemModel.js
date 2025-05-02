import mongoose from "mongoose";
const groceryItemSchema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    description: {  
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
    },
    total: {
        type: Number,
        required: true,
    },
    groceryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});


const GroceryItem = mongoose.model("GroceryItem", groceryItemSchema);

export default GroceryItem; 