// Setup dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path")

const userRoutes = require(path.join(__dirname, 'routes', 'userRoutes.js'));
const productRoutes = require(path.join(__dirname, 'routes', 'productRoutes.js'));

// Create server
const app = express();
const port = 4000;

// Connect to MongoDb Database
mongoose.connect(process.env.MONGO_DB_SITE, {
    useNewUrlParser: true, useUnifiedTopology: true
});

// Set notification for connection success or failure
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("We're connected to the MongoDb database"));

// Middleware
// Allow all resources to access our backend application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for our API
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"), (err) => {
            if (err) {
                res.status(500).send(err);
            }
        }
    )
})

// Listening to port
app.listen(process.env.PORT || port, () => {
    console.log(`API is now online on port ${process.env.PORT || port}`)
})