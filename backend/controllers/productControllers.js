const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const mongoose = require('mongoose');

// Retrieve all active products
module.exports.allActiveProducts = () => {
    return Product.find({isActive: true}).select('-orders').then(result => result);
}

// Retrieve all products
module.exports.allProducts = () => {
    return Product.find({}).select('-orders').then(result => result);
}

module.exports.stringProducts = () => {
    return Product.find({tags: "Strings"}).select('-orders').then(result => result);
}

module.exports.windProducts = () => {
    return Product.find({"tags": "Wind"}).select('-orders').then(result => result);
}

module.exports.accessoriesProducts = () => {
    return Product.find({"tags": "Accessories"}).select('-orders').then(result => result);
}

// Retrieve a single product
module.exports.getProduct = (productId) => {
    return Product.findById(productId).select('-orders').then(result => result);
}

// Create a Product
module.exports.createProduct = async (userId, reqBody) => {    

    const uploadResponse = await cloudinary.uploader.upload(reqBody.pictures, {folder: '/productPictures'}, 
    (err, result) => {
        if(err) {
            return false;
        } else {
            return true;
        }
    });
    
    let newProduct = new Product({
        name: reqBody.name,
        description: reqBody.description,
        price: reqBody.price,
        stocks: reqBody.stocks,
        tags: reqBody.tags,
        pictures: [{
            pic: uploadResponse.secure_url,
            cloudinaryId: uploadResponse.public_id
        }],
        seller: userId
    });


    // Save product
    let newProductSave =  await function() {
        return newProduct.save().then((product, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })    
    }
    let save = newProductSave();

    // Update user to put products in his/her account
    let updateUser = await User.findById(userId).then(user => {
        user.productsSelling.push({productId: newProduct._id});

        return user.save().then((user, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })
    })

    // Check if product creation and user products update is successful
    if(save && updateUser){
        return true;
    }
    else {
        return false;
    }
     
}

// Update product information
module.exports.updateProduct = async (userId, productId, reqBody) => {

    let updatedProduct = {};

    if(reqBody.pictures !== "") {
        
        const uploadResponse = await cloudinary.uploader.upload(reqBody.pictures, {folder: '/productPictures'}, 
            (err, result) => {
                if(err) {
                    return false;
                } else {
                    return true;
                }
            });

        updatedProduct = {$set: {
            name: reqBody.name,
            description: reqBody.description,
            price: reqBody.price,
            stocks: reqBody.stocks,
            tags: reqBody.tags,
            pictures: [
                {
                    pic: uploadResponse.secure_url,
                    cloudinaryId: uploadResponse.public_id
                }
            ]
        }}
    } else {
        updatedProduct = {$set: {
            name: reqBody.name,
            description: reqBody.description,
            price: reqBody.price,
            stocks: reqBody.stocks,
            tags: reqBody.tags
        }}
    }
    
    return Product.findById(productId).then(result => {
        // console.log(`Product Seller: ${result.seller}`);
        // console.log(`Logged in user: ${userId}`);

        return Product.findByIdAndUpdate(productId, updatedProduct).then((update, err) => {
            if(err) {
             return false;
            }
            else {
             return true;
            }
         })
    })
}

// Archive a product
module.exports.archiveProduct = (userId, productId) => {

    return Product.findById(productId).then(result => {
        
        let archiveUpdate = {$set: {
            isActive: false
        }};
        
        return Product.findByIdAndUpdate(productId, archiveUpdate).then((archive, err) => {
            if(err) {
                console.error(err)
                return false;
               }
               else {
                return true;
               }
        })
    })
}

// Add to Cart
// 1. Find duplicate prod in cart
module.exports.cartDuplicate = (userId, reqBody) => {

    return User.findById(userId).then(user => {
        
        return user.cart.some(product => product.productId == reqBody.productId);
    })
}

// 2. If no duplicate found
module.exports.cartAdd = (userId, reqBody) => {
    return User.findById(userId).then(user => {
        // console.log(user);
        user.cart.push(reqBody);

        return user.save().then((user, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })
    })
}

// 3. If duplicate found for Product Card & Cart View
module.exports.cartUpdateCard = (userId, reqBody) => {
    return User.findById(userId).then(user => {

        let index = user.cart.findIndex(prod => prod.productId == reqBody.productId);

        user.cart[index].quantity += 1;
        user.cart[index].subtotal = user.cart[index].quantity * user.cart[index].price;

        return user.save().then((user, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })
    })
}

// 4. If duplicate found for Product View 
module.exports.cartUpdateView = (userId, productId, reqBody) => {
    return User.findById(userId).then(user => {

        let index = user.cart.findIndex(prod => prod.productId == productId);

        user.cart[index].quantity = reqBody.quantity;
        user.cart[index].subtotal = user.cart[index].quantity * user.cart[index].price;

        return user.save().then((user, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })
    })
}

// Remove prod from cart
module.exports.deleteCartProduct = (userId, productId) => {
    return User.findById(userId).then(user => {
        let index = user.cart.findIndex(prod => prod.productId == productId);
        
        user.cart.splice(index, 1);

        return user.save().then((user, err) => {
            if(err) {
                return false;
            }
            else {
                return true;
            }
        })
    })
}

// Check out products
module.exports.checkoutSingle = async (userId, productId, reqBody) => {
    let newUserCheckOut = {
        productId: productId,
        name: reqBody.name,
        pic: reqBody.pic,
        price: reqBody.price,
        quantity: reqBody.quantity,
        subtotal: reqBody.subtotal,
        total: reqBody.total,
        isCompleted: false,
        checkOutDate: new Date(),
        orderId: new mongoose.Types.ObjectId()
    }

    // let newProdCheckOut = {
    //     userId: userId,
    //     name: reqBody.name,
    //     pic: reqBody.pic,
    //     price: reqBody.price,
    //     quantity: reqBody.quantity,
    //     subtotal: reqBody.subtotal,
    //     total: reqBody.total,
    //     isCompleted: false,
    //     checkOutDate: new Date()
    // }

    let userCheck = await User.findById(userId).then(user => {
        user.checkOut.push(newUserCheckOut);

        return user.save().then((user, err) => {
            if(err) {
                return false;
            } else {
                return true;
            }
        })
    })

    let productCheck = await Product.findById(productId).then(product => {
        // product.orders.push(newProdCheckOut);
        product.stocks -= reqBody.quantity
        // console.log(product.stocks);

        return product.save().then((prod, err) => {
            if(err) {
                return false;
            } else {
                return true;
            }
        })
    })

    if(userCheck && productCheck) {
        return true;
    } else {
        return false;
    }
}

module.exports.checkoutMultiple = async (userId, reqBody) => {

    let userCheck = await User.findById(userId).then(user => {
        // console.log(reqBody);
        reqBody.orderId = new mongoose.Types.ObjectId();
        
        let newCheck = [user.cart, reqBody];
        // console.log(newCheck);

        user.checkOut = [...user.checkOut, newCheck];
        // console.log(user.checkOut);
        user.cart = [];

        return user.save().then((user, err) => {
            if(err) {
                return false;
            } else {
                return true;
            }
        })
    })

    let productCheck = await User.findById(userId).then(user => {
        // console.log(user.checkOut);

        user.checkOut[user.checkOut.length - 1][0].map(prod => {
            // console.log(prod)

            Product.findById(prod.productId).then(perProduct => {

                // prod.userId = userId;
                // perProduct.checkOut = [...perProduct.checkOut, [prod, reqBody]];
                perProduct.stocks -= prod.quantity;

                return perProduct.save().then((prod, err) => {
                    if(err) {
                        return false;
                    } else {
                        return true;
                    }
                })
            })
        })
    })

    if(userCheck && productCheck) {
        return true;
    } else {
        return false;
    }
}

// Show archived product
module.exports.showArchive = (userId) => {
    return Product.find({seller: userId, isActive: false}).select('-seller').then(result => result);
}

// Unarchive product
module.exports.reactivateProduct = (data) => {
    return Product.findById(data.productId).then(product => {

        let reactivateProd = {$set: {
            isActive: true
        }};
        
        return Product.findByIdAndUpdate(data.productId, reactivateProd).then((archive, err) => {
            if(err) {
                return false;
               }
               else {
                return true;
               }
        }) 
    })
}
