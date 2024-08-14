const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Account = require('../models/account.model.js');

const register = async(data) =>{
    try {
        const { username, password, email } = data;
        const existingUser = await Account.findOne({username: username})
        if(existingUser){
            return {
                statusCode: 400,
                message: 'Username already exists'
            };
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newAccount = new Account({
            username,
            email,
            password:hashPassword
        })
        const user = await newAccount.save()
        return{
            statusCode:200,
            message: 'Register succesfully!!'
        }
    }
    catch(err) {
        throw new Error(err.message);
    }
}

const login = async(data) => {
    try{
        const {username,password} = data;
        const foundUser = await Account.findOne({username})
        if(!foundUser) {
            return {
                statusCode: 400,
                message: 'Invalid username'
            };
        }
        const match = await bcrypt.compare(password,foundUser.password)
        if(!match){
            return {
                statusCode: 401,
                message: 'Password is incorrect'
            }
        }
        const accessToken = await jwt.sign({
            id: foundUser.id,
            username
        }, process.env.SECRET_KEY,{ expiresIn: '1h' })

        return {
            statusCode:200,
            accessToken : accessToken,
        }
    }
    catch(err){
        throw new Error(err.message);
    }
}

module.exports = {
    register,
    login
}