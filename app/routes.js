const router = require('express').Router();
const eventController = require('./controllers/event-controller');

router.get('/:id',(req,res)=>{
    eventController.newTexts(req, res);
});
router.get('/test',(req,res)=>{
    eventController.test();
});
module.exports = router;
