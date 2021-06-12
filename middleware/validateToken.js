// This middleware provides login function using JWT

const jwt = require('jsonwebtoken');
const secret = process.env.secret;

function validateToken(req,res,next){
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).send("Access denied. Login with your credentials")
    };

    try{
        const payload = jwt.verify(token,secret);
        req.user = payload;
        next();
    } catch (excp){
        res.status(400).send('Invalid token.');
    }
};

module.exports = validateToken;