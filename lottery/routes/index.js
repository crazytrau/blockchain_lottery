var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/blockchain', function(req,res){

});

router.post('/transaction', function(req,res){
  
});

router.get('/mine', function(req,res){

});

module.exports = router;
