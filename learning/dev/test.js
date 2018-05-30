const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(125232,'7xhg3d7634grih23h','idb71dn71wndqsd');
bitcoin.createNewBlock(123,'7xhg3d7634grih23h','idb71dn71wndqsd');
bitcoin.createNewBlock(3151,'7xhg3d7634grih23h','idb71dn71wndqsd');


console.log(bitcoin);
