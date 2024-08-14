const authService = require('../services/auth.service.js')

const register = async(req, res) =>{
    try{
        const result = await authService.register(req.body)
        return res.status(result.statusCode).json({message: result.message})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

const login = async(req, res) =>{
    try{
        const result = await authService.login(req.body)
        if(result.accessToken){
            return res.status(result.statusCode).json({accessToken: result.accessToken})
        }
        return res.status(result.statusCode).json({message: result.message})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {
    register,
    login
}