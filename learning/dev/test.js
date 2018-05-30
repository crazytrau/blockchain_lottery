const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(125232,'7xhg3d7634grih23h','idb71dn71wndqsd');

bitcoin.createNewTransaction(523,'CTRasjdh81h1', 'BIGabs8bd11b1d');

bitcoin.createNewBlock(18212,'aasdyb981dn1fasf','asjdb12d871b27d');

bitcoin.createNewTransaction(1,'CTRasjdh81h1', 'BIGabs8bd11b1d');
bitcoin.createNewTransaction(23,'CTRasjdh81h1', 'BIGabs8bd11b1d');
bitcoin.createNewTransaction(53,'CTRasjdh81h1', 'BIGabs8bd11b1d');

bitcoin.createNewBlock(11212,'ns8dny91nd1d','8n2h3y8d179db9');

console.log(bitcoin);
