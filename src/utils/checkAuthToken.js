//Check Token
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.SECRET_KEY;

const checkAuthToken = async (token) => {
    if(!token) return { statusCode: 401, message: 'Access denied' };
    try {
        const verifiedUser = await jwt.verify(token, jwtSecret);
        if (!verifiedUser) {
            return { statusCode: 403, message: 'Invalid token' };
        }
        const decoded = jwt.decode(token);
        return { statusCode: 200, message: 'Token verified' , user: decoded };
    }
    catch(err) {
        console.log(err);
        return { statusCode: 500, message: 'Internal server error' };
    }
}

module.exports = {
    checkAuthToken
}