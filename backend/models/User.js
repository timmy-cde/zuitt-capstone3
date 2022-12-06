const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please input first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please input last name"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    mobileNo: {
        type: Number,
        required: [true, "Mobile number is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    ordered: [
        {
            // cart
            productId: {
                type: String,
                required: [true, "Product Id is required"]
            },
            price: {
                type: Number,
                required: [true, "Quantity is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"]
            },
            orderedOn: {
                type: Date,
                default: new Date()
            },
            isCheckedOut: {
                type: Boolean,
                default: false
            },
            isDelivered: {
                type: Boolean,
                default: false
            }
        }
    ],
    cart: [
        {
            productId: {
                type: String,
                required: [true, "prod id is required"]
            },
            name: {
                type: String,
                required: [true, "name is required"]
            },
            pic: {
                type: String,
                required: [true, "pic is required"]
            },
            price: {
                type: Number,
                required: [true, "price is required"]
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"]
            },
            subtotal: {
                type: Number,
                required: [true, "subtotal is required"]
            }
            
        }
    ],
    checkOut: {
        type: Array
    },
    productsSelling: [
        {
            productId: {
                type: String,
                default: null
            }
        }
    ]
})

module.exports = mongoose.model("User", userSchema);