const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Check duplicate email
module.exports.checkEmail = (reqBody) => {
    return User.find({"email": reqBody.email}).then(result => {

        // if email has no duplicate
        if(result.length == 0) {
            return false;
        }
        else {
            return true;
        }
    })
}

// Register a User
module.exports.createUser = (reqBody) => {

    let newUser = new User({
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        email: reqBody.email,
        mobileNo: reqBody.mobileNo,
        address: reqBody.address,
        password: bcrypt.hashSync(reqBody.password, 10)
    });

    return newUser.save().then((user, err) => {
        if(err) {
            return false;
        }
        else {
            return true;
        }
    })

}

// User Login/Authentication
module.exports.loginUser = (reqBody) => {
    return User.findOne({email: reqBody.email}).then(result => {
        
        // if user does not exist
        if(result == null) {
            return false;
        }
        else {
            const isCorrectPassword = bcrypt.compareSync(reqBody.password,result.password);
            
            if(isCorrectPassword) {
                return {access: auth.createAccessToken(result)};
            }
            else {
                return false;
            }
        }
    })
}

// Get user details
module.exports.userProfile = (data) => {
    // find the user by user id and exclude password for displaying the profile
    // include personal info only
    return User.findById(data.id).select('-password -ordered -checkOut -productsSelling').then(result => result);
}

// Set as Admin
module.exports.setAsAdmin = (userId) => {
    return User.findByIdAndUpdate(userId, {$set: {isAdmin: true}}).then((updatedUser, err) => {
        if(err) {
            return false;
        }
        else {
            return true;
        }
    })
}

// Set back user as user
module.exports.setAsUser = (userId) => {
    return User.findByIdAndUpdate(userId, {$set: {isAdmin: false}}).then((updatedUser, err) => {
        if(err) {
            return false;
        }
        else {
            return true;
        }
    })
}

// Retrieve user's orders (customer)
module.exports.viewOrders = (data) => {
    return User.findById(data.id).then(user => user.checkOut);
}

module.exports.viewPendingOrders = (userid) => {
    return User.findById(userid).then(user => {
        return user.checkOut.filter(order => order.isCompleted === false || order[1].isCompleted === false)
    })
}


module.exports.viewCompleteOrders = (userid) => {
    let filteredArray = [];
    let filter1 = []
    let filter2 = []
    // return User.findById(userid).then(user => {
    //     // user.checkOut.map(product => {
    //     //     // return console.log(product.length)

    //     //     if(product.length === 2) {
    //     //         filter2 = user.checkOut.filter(order => order[1].isCompleted === true)

    //     //     } else {
    //     //         filter1 = user.checkOut.filter(order => order.isCompleted === true)
    //     //     }
    //     //     return filteredArray = [...filteredArray, filter1, filter2];
    //     // })
    //     return user.checkOut.filter(order => order.isCompleted === true || order[1].isCompleted === true)

        return User.findById(userid).then(user => {
            return user.checkOut.filter(order => order.isCompleted === true || order[1].isCompleted === true) 
        })
    // })
}

// Retrieve all orders admin (admin)
module.exports.viewOrdersAdmin = (data) => {
    return User.find({"isAdmin": false}).then(user => user)
}

// Retrieve all users
module.exports.allUsers = (data) => {
    return User.find({}).select('-password').then(user => user);
}

// Retrieve user cart
module.exports.cart = (userId) => {
    return User.findById(userId).select('-address -firstName -lastName -isAdmin -mobileNo -password -productsSeliing -email -createdOn').then(user => user);
}