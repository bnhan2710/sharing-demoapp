const router = require('express').Router()
const authController = require('../../controllers/auth.controller.js')

router.post('/auth/login', authController.login)
router.post('/auth/register', authController.register)

module.exports = router;