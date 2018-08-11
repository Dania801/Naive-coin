"use strict";
exports.__esModule = true;
var blockchain_1 = require("./blockchain");
console.log(blockchain_1.getBlockchain());
var block = blockchain_1.generateNextBlock('Dania');
console.log(blockchain_1.addBlockToChain(block));
console.log(blockchain_1.getBlockchain());
