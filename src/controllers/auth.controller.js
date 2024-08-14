const authService = require('../services/auth.service.js')

const register = async(req, res) =>{
    try{
        return await authService.register(req.body)
    }
    catch(err){
        res.status(500).json({message: 'Internal server error'})
    }
}

const login = async(req, res) =>{
    try{
        return await authService.login(req.body)
    }
    catch(err){
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {
    register,
    login
}