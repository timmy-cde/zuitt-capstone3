const jwt = require("jsonwebtoken");

// Token Creation
/*
    - Analogy
        Pack the gift and provide a lock with the secret code as the key
*/ 
const secret = `${process.env.SECRECT_PASS}`;

module.exports.createAccessToken = (user) => {
    // When the user logs in, a token will be created with the user's information.
    // This will be used for the token payload
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    // Syntax: jwt.sign(payload, secretOrPrivateKey, [option/callBackFunction]);
    return jwt.sign(data, secret, {});
}

// Token Verification
// Middleware function
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    // console.log(typeof token);

    if(typeof token !== "undefined") {
        // console.log(token);
        // This removes the "Bearer " prefix and obtains only the token for verification.
        token = token.slice(7, token.length);
        // console.log(token);

        // Syntax: jwt.verify(token, secretCode, [option/callBackFunction]);
        return jwt.verify(token, secret, (err, data) => {
            // If JWT is not valid
            if(err) {
                return res.send({auth: "Token Failed"});
            }
            else {
                // the verify method will be used as a middleware in the route to verify the token before proceeding to the function that invokes the controller function.
                next();
            }
        })
    }
    else {
        return res.send({auth: "Failed"});
    }
}


// Token decryption
module.exports.decode = (token) => {

    if(typeof token !== "undefined") {
        token = token.slice(7, token.length);
        return jwt.verify(token, secret, (err, data) => {
            // If JWT is not valid
            if(err) {
                return null;
            }
            else {
                // Syntax: jwt.decode(token, [options])
                return jwt.decode(token, {complete: true}).payload;
            }
        })
    }
    else {
        return null;
    }
}