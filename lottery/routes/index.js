var express = require('express');
var router = express.Router();

const nodeAddress = uuid().split('-').join('');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/blockchain', function(req,res){
  res.send(lottery);
});

router.post('/transaction', function(req,res){
  const blockIndex = lottery.createNewTransaction(req.body.amount,req.body.sender, req.body.recipient);
  res.json({
    note: `It add in block ${blockIndex}`
  });
});

router.get('/mine', function(req,res){
  const lastBlock = lottery.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transaction: lottery.pendingTransactions,
    index:lastBlock['index']+1
  };
  const nonce = lottery.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = lottery.hashBlock(previousBlockHash, currentBlockData, nonce);

  lottery.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = lottery.createNewBlock(nonce, previousBlockHash,blockHash);
  res.json({
    note: "new block mine successfully",
    block: newBlock
  })
});

module.exports = router;
