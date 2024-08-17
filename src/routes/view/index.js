const router = require('express').Router();
const path = require('path');
// const { v4: uuidv4 } = require('uuid');
router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'chat.html'));
});

router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'auth.html'));
});
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views', 'auth.html'));
});
// router.get('/video-call' ,(req,res) => {
//     res.redirect(`/video-call/${uuidv4()}`);
// })

// router.get('/video-call/:room', (req, res) => {
//     res.render('videocall.pug', { roomId: req.params.room });
//   });

module.exports = router;    