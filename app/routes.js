const router = require('express').Router();
const eventController = require('./controllers/event-controller');

router.get('/new-text-not/:id',(req,res)=>{
    eventController.newTexts(req, res);
});
router.get('/most-comment/:id',(req,res)=>{
    eventController.mostComment(req,res);
});
router.get('/new-text/:id', (req, res)=>{
    eventController.newGeneralText(req, res);
});
router.get('/popular-text/:id', (req, res) => {
    eventController.popularTexts(req, res);
});
router.get('/popular-followed/:id', (req, res) => {
   eventController.popularFollowed(req, res);
});
router.get('/new-comment/:id', (req, res)=> {
    eventController.newComment(req, res);
});
router.get('/reply-comment/:id', (req, res)=>{
    eventController.getReplyComment(req, res);
});
module.exports = router;
