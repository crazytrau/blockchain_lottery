var express = require('express');
var router = express.Router();

const nodeAddress = uuid().split('-').join('');
const rp = require('request-promise')
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/blockchain', function(req,res){
  res.send(lottery);
});

router.post('/transaction', function(req,res){
  const newTransaction = req.body;
  const blockIndex = lottery.addTransactionToPendingTransactions(newTransaction);
  res.json({note:`transaction will be added in block${blockIndex}.`});
});

router.post('/transaction/broadcast', function(req,res){
  const newTransaction = lottery.createNewTransaction(req.body.amount,req.body.sender, req.body.recipient);
  lottery.addTransactionToPendingTransactions(newTransaction);
  const requestPromises =[];
  lottery.netWorkNodes.forEach(networkNodeUrl=>{
    const requestOptions={
      uri:networkNodeUrl+'/transaction',
      method:'POST',
      body:newTransaction,
      json:true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(data=>{
    res.json({note:'transaction created and broadcast successfully.'});
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

  const newBlock = lottery.createNewBlock(nonce, previousBlockHash,blockHash);

  const requestPromises = [];
  lottery.netWorkNodes.forEach(networkNodeUrl=>{
    const requestOptions ={
      uri:networkNodeUrl+'/receive-new-block',
      method:'POST',
      body:{newBlock:newBlock},
      json:true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(data=>{
    //lottery.createNewTransaction(12.5, "00", nodeAddress);
    const requestOptions = {
      uri:lottery.currentNodeUrl+'/transaction/broadcast',
      method:'POST',
      body:{
        amount:12.5,
        sender:'00',
        recipient:nodeAddress
      },
      json:true
    };

    return rp(requestOptions);
  })
  .then(data=>{
    res.json({
      note: "new block mine and broadcast successfully",
      block: newBlock
    });
  });
});

router.post('/receive-new-block',function(req,res){
  const newBlock = req.body.newBlock;
  const lastBlock = lottery.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index']+1 === newBlock['index'];
  if (correctHash && correctIndex){
    lottery.chain.push(newBlock);
    lottery.pendingTransactions = [];
    res.json({
      note:'new block received and accepted.',
      newBlock:newBlock
    });
  }else{
    res.json({
      note: 'new block rejected,',
      newBlock:newBlock
    });
  }

});

//register and broadcast it the network
router.post('/register-and-broadcast-node',function(req,res){
  const newNodeUrl = req.body.newNodeUrl;
  if (lottery.netWorkNodes.indexOf(newNodeUrl) == -1) lottery.netWorkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  lottery.netWorkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body:{newNodeUrl : newNodeUrl},
      json:true
    };

    regNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: {
          allNetworkNodes: [...lottery.netWorkNodes, lottery.currentNodeUrl]
        },
        json: true
      };
      return rp(bulkRegisterOptions);
    })
    .then(data => {
      res.json({
        note: 'New Note Registered with network successfully'
      });
    });
});

//register node to the network
router.post('/register-node',function (req,res){
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = lottery.netWorkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = lottery.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) lottery.netWorkNodes.push(newNodeUrl);
  res.json({ note: 'New node register successfully.'});
});

//register multible nodes at once
router.post('/register-nodes-bulk',function (req,res){
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl=>{
    const notExistNode = lottery.netWorkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNodeUrl = lottery.currentNodeUrl !== networkNodeUrl;
    if (notExistNode && notCurrentNodeUrl) lottery.netWorkNodes.push(networkNodeUrl);
  });

  res.json({note:'Bulk registration successfully.'});
});

module.exports = router;
