const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = 'asdh781d81bdywqb91d';
const currentBlockData = [  {amount:120,sender:'aiosu1dy1',recipient:'1d91yd71td8'},
                            {amount:20,sender:'jd18d29',recipient:'28c7b2btc82w'}];
const nonce = 981;

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
