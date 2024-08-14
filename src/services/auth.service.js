const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { log } = require('console');


const register = async(data) =>{
    try {
        const { username, password, email } = data;
        const existingUser = await Account.findOne({username: username})
        if(existingUser){
            return res.status(400).json({message: "Username is already existed!"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newAccount = new Account({
            username,
            email,
            password:hashPassword
        })
        const user = await newAccount.save()
        return res.status(200).json({message: "Register completed!"})
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
            return res.status(400).json({message: "Wrong username or password"})
        }
        const match = bcrypt.compare(password,foundUser.password)
        if(!match){
            return res.status(400).json({message: "Wrong username or password"})
        }
        const accessToken = await jwt.sign({
            id: foundUser.id,
            username
        }, process.env.SECRET_KEY,{ expiresIn: '1h' })

        return res.status(200).json({
            message: "Login completed!",
            id: foundUser._id,
            token: accessToken
        })
    }
    catch(err){
        throw new Error(err.message);
    }
}

module.exports = {
    register,
    login
}