const express = require("express");
const router = express.Router();

const productControllers = require("../controllers/productControllers");
const auth = require("../auth");


// Retrieve all active products
router.get("/", (req, res) => {
    console.log(req.query);
    productControllers.allActiveProducts().then(product => res.send(product));
})

router.get("/strings", (req, res) => {
    productControllers.stringProducts().then(product => res.send(product));
})
router.get("/wind", (req, res) => {
    productControllers.windProducts().then(product => res.send(product));
})
router.get("/accessories", (req, res) => {
    productControllers.accessoriesProducts().then(product => res.send(product));
})



// Retrieve all products
router.get("/all", (req, res) => {
    productControllers.allProducts().then(product => res.send(product));
})

// Retrieve a single product
router.get("/:productId", (req, res) => {
    productControllers.getProduct(req.params.productId).then(product => res.send(product));
})

// Create a product
router.post("/createProduct", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin){
        productControllers.createProduct(userData.id, req.body).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!");
    }
})

// Update Product Information
router.patch("/:productId", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin){
        productControllers.updateProduct(userData.id, req.params.productId, req.body).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!");
    }
})

// Archive a product
router.patch("/:productId/archive", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin){
        productControllers.archiveProduct(userData.id, req.params.productId).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!");
    }
})

// Order a product (update stock only!)
router.patch("/order/update-stock", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    let data = {
        userId: userData.id,
        productId: req.body.productId,
        stocks: req.body.stocks
    }

    console.log(data);

    // if user is admin
    if(userData.isAdmin){
        res.send("You are not allowed to order, change to non-admin account!")
    }
    // if user is not admin
    else {
        productControllers.orderProduct(data).then(product => res.send(product));
    }
})


// Add to cart
// 1. Find duplicate prod in cart
router.post("/cart/duplicate", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        res.send("You are not allowed to order, change to non-admin account!")
    }
    else {
        productControllers.cartDuplicate(userData.id, req.body).then(product => res.send(product))
    }
})
// 2. If no duplicate found
    router.post("/cart/:productId/", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("You are not allowed to order, change to non-admin account!")
    }
    else {
        productControllers.cartAdd(userData.id, req.body).then(product => res.send(product))
    }
})
// 3. If duplicate found for Product Card  & Cart View
router.patch("/cart/update-card", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("You are not allowed to order, change to non-admin account!")
    }
    else {
        productControllers.cartUpdateCard(userData.id, req.body).then(product => res.send(product))
    }
})

// 4. If duplicate found for Product View
router.patch("/cart/:productId/update-prod-view", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("You are not allowed to order, change to non-admin account!")
    }
    else {
        productControllers.cartUpdateView(userData.id, req.params.productId, req.body).then(product => res.send(product))
    }
})

// Remove prod from cart
router.delete("/cart/:productId", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("Change to non-admin account!")
    }
    else {
        productControllers.deleteCartProduct(userData.id, req.params.productId).then(product => res.send(product))
    }
})

// Check out products
// Check out single prod
router.post("/order/checkout/:productId", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("Change to non-admin account!")
    }
    else {
        productControllers.checkoutSingle(userData.id, req.params.productId, req.body).then(product => res.send(product))
    }
})

// Checkout multiple prods
router.post("/order/checkout", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    // console.log(userData);
    // console.log(req.body);

    if(userData.isAdmin) {
        res.send("Change to non-admin account!")
    }
    else {
        productControllers.checkoutMultiple(userData.id, req.body).then(product => res.send(product))
    }
})

// router.post("/order/checkout", auth.verify, (req, res) => {
//     const userData = auth.decode(req.headers.authorization);
    
//     if(userData.isAdmin) {
//         res.send("Admin is not allowed to checkout");
//     }
//     else {
//         productControllers.checkOut(userData, req.body).then(product => res.send(product));
//     }
// })

// Retrieve archived products
router.get("/:productId/archive", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin){
        productControllers.showArchive(userData.id, req.params.productId).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!")
    }
})

// Unarchive product
router.patch("/:productId/reactivate", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    let data = {
        userId: userData.id,
        productId: req.params.productId
    }
    if(userData.isAdmin){
        productControllers.reactivateProduct(data).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!")
    }
})

module.exports = router;