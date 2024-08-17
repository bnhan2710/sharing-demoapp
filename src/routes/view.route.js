const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
router.get('/chat', (req, res) => {
    res.render('chat.pug')
})

router.get('/auth', (req,res) => {
    res.render('auth.pug')
})  

router.get('/video-call' ,(req,res) => {
    res.redirect(`/v1/video-call/${uuidv4()}`);
})

router.get('/video-call/:room', (req, res) => {
    res.render('videocall.pug', { roomId: req.params.room });
  });

module.exports = router;    