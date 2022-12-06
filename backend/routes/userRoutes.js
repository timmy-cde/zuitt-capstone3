const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");
const auth = require("../auth");

// Check email for registration
router.post("/checkEmail", (req, res) => {
    userControllers.checkEmail(req.body).then(user => res.send(user));
});

// User Registration
router.post("/register", (req, res) => {
    userControllers.createUser(req.body).then(user => res.send(user));
});

// User Login/Authentication
router.post("/login", (req, res) => {
    userControllers.loginUser(req.body).then(user => res.send(user));
})

// Get user details
router.get("/profile", auth.verify, (req, res) => {
    // decode token
    const userData = auth.decode(req.headers.authorization);
    
    userControllers.userProfile(userData).then(user => res.send(user));
})

// Set user as admin
router.patch("/:userId/setAsAdmin", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        userControllers.setAsAdmin(req.params.userId).then(user => res.send(user));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!");
    }
})

// Set back user as user
router.patch("/:userId/setAsUser", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        userControllers.setAsUser(req.params.userId).then(user => res.send(user));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!");
    }
})

// Retrieve user's orders
router.get("/:userId/orders", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("Admin has no personal orders");
    }
    else {
        userControllers.viewOrders(userData).then(product => res.send(product));
    }
})

router.get("/:userId/orders/pending", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("Admin has no personal orders");
    }
    else {
        userControllers.viewPendingOrders(userData.id).then(product => res.send(product));
    }
})

router.get("/:userId/orders/complete", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    
    if(userData.isAdmin) {
        res.send("Admin has no personal orders");
    }
    else {
        userControllers.viewCompleteOrders(userData.id).then(product => res.send(product));
    }
})

// Retrieve all orders (admin)
router.get("/order/admin", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        userControllers.viewOrdersAdmin(userData).then(product => res.send(product));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!")
    }
})

// Retrieve all users
router.get("/all", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        userControllers.allUsers(userData).then(user => res.send(user));
    }
    else {
        res.send("You do not have admin priveleges to execute this request!")
    }
})

// Retrieve User Cart
router.get("/cart", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if(userData.isAdmin) {
        res.send("Switch to non-admin account!")
    }
    else {
        userControllers.cart(userData.id).then(user => res.send(user));
    }
})

module.exports = router;
