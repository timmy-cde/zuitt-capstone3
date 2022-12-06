const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    stocks: {
        type: Number,
        required: [true, "Stock is required"]
    },
    tags: {
        type: String,
        required: [true, "Tag is required"]
    },
    pictures: [
        {
            pic: String,
            cloudinaryId: String
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    seller: {
        type: String,
        required: [true, "Seller is required"]
    },
    orders: {
        type: Array
    }
});

module.exports = mongoose.model("Product", productSchema);