const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = 'asdh781d81bdywqb91d';
const currentBlockData = [  {amount:120,sender:'aiosu1dy1',recipient:'1d91yd71td8'},
                            {amount:20,sender:'jd18d29',recipient:'28c7b2btc82w'}];
let nonce = bitcoin.proofOfWork(previousBlockHash,currentBlockData);
console.log(nonce);
console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData, nonce))
