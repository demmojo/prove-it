var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});

export default ipfs;

