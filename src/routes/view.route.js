const router = require('express').Router();
// const { v4: uuidv4 } = require('uuid');
router.get('/chat', (req, res) => {
    res.render('chat.pug')
})


module.exports = router;   