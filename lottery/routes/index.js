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

//register and broadcast it the network
router.post('/register-and-broadcast-node',function(req,res){
  const newNodeUrl = req.body.newNodeUrl;
  if (lottery.netWorkNodes.indexOf(newNodeUrl) == -1) lottery.networkNodes.push(newNodeUrl);

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
    const bulkRegisterOptions ={
      uri:newNodeUrl + '/register-nodes-bulk',
      body:'POST',
      body:{allNetworkNodes:[...lottery.networkNodes, lottery.currentNodeUrl]},
      json:true
    };

    return rp(bulkRegisterOptions);
  })
  .then(data=>{
    res.json({note:'New node registered with network successfully'})
  })
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
