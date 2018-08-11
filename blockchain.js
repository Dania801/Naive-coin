"use strict";
exports.__esModule = true;
var CryptoJS = require("crypto-js");
var Block = /** @class */ (function () {
    function Block(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
    return Block;
}());
exports.Block = Block;
var calculateHash = function (index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};
var genesisBlock = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'g3n35i5-8l0ck');
var generateNextBlock = function (blockData) {
    var previousBLock = getLatestBlock();
    var nextIndex = previousBLock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousBLock.hash, nextTimestamp, blockData);
    var newBlock = new Block(nextIndex, nextHash, previousBLock.hash, nextTimestamp, blockData);
    return newBlock;
};
exports.generateNextBlock = generateNextBlock;
var blockchain = [genesisBlock];
var getBlockchain = function () { return blockchain; };
exports.getBlockchain = getBlockchain;
var getLatestBlock = function () { return blockchain[blockchain.length - 1]; };
exports.getLatestBlock = getLatestBlock;
var addBlock = function (newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock()) && isValidBlockStructure(newBlock)) {
        blockchain.push(newBlock);
    }
};
var calculateHashForBlock = function (block) {
    return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
};
var addBlockToChain = function (newBlock) {
    if (isValidNewBlock(newBlock, getLatestBlock()) && isValidBlockStructure(newBlock)) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;
var isValidNewBlock = function (newBlock, previousBLock) {
    if (previousBLock.index + 1 !== newBlock.index) {
        console.log('Invalid index!');
        return false;
    }
    else if (previousBLock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash!');
        return false;
    }
    else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash!');
        return false;
    }
    return true;
};
var isValidBlockStructure = function (block) {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};
exports.isValidBlockStructure = isValidBlockStructure;
var isValidChain = function (blockchain) {
    var isValidGenesis = function (block) {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchain[0])) {
        return false;
    }
    for (var i = 1; i < blockchain.length; i++) {
        if (!isValidNewBlock(blockchain[i], blockchain[i - 1])) {
            return false;
        }
    }
    return true;
};
var replaceChain = function (newBlocks) {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Recieved valid blockchain. Replacing current blockchain with the new one...');
        blockchain = newBlocks;
    }
    else {
        console.log('Recieved invalid blockchain');
    }
};
exports.replaceChain = replaceChain;
