import * as CryptoJS from 'crypto-js';

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;
    public difficulty: number;
    public nonce: number;

    constructor(index: number, 
            hash: string,
            previousHash: string,
            timestamp: number,
            data: string,
            difficulty: number, 
            nonce: number){
                this.index = index;
                this.hash = hash;
                this.previousHash = previousHash;
                this.timestamp = timestamp;
                this.data = data;
                this.difficulty = difficulty;
                this.nonce = nonce;
    }
}

// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;
const  BLOCK_GENERATION_INTERVAL: number = 10;


const calculateHash = (index: number, 
    previousHash: string, 
    timestamp: number, 
    data: string): string => 
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const genesisBlock: Block = new Block (0, 
    '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', 
    null, 1465154705, 
    'g3n35i5-8l0ck', 
    0,
    0);

const getAdjestedDifficulty = (lastBlock: Block, blockchain: Block[]) => {
    const prevAdjustmentBlock: Block = blockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken: number = lastBlock.timestamp * prevAdjustmentBlock.timestamp;
    if (timeTaken < timeExpected / 2){
        return prevAdjustmentBlock.difficulty +1;
    } else if (timeTaken > timeExpected * 2) {
        return prevAdjustmentBlock.difficulty -1;
    } else {
        return prevAdjustmentBlock.difficulty;
    }
}

const getDifficulty = (blockchain: Block[]): number => {
    const lastBlock: Block = getLatestBlock();
    if(lastBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && lastBlock.index !== 0) {
        return getAdjestedDifficulty(lastBlock, blockchain);
    } else {
        return lastBlock.difficulty;
    }
}

const generateNextBlock = (blockData: string) => {
    const previousBLock: Block = getLatestBlock();
    const difficulty: number = getDifficulty(getBlockchain());
    const nextIndex: number = previousBLock.index +1;
    const nextTimestamp: number = new Date().getTime() /1000;
    const nextHash: string = calculateHash(nextIndex, 
        previousBLock.hash, 
        nextTimestamp, 
        blockData);
    const newBlock: Block = new Block(nextIndex, 
        nextHash, 
        previousBLock.hash, 
        nextTimestamp, 
        blockData);

    return newBlock;
}

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;
const getLatestBlock = () : Block => blockchain[blockchain.length -1];

const addBlock = (newBlock: Block) => {
    if(isValidNewBlock(newBlock, getLatestBlock()) && isValidBlockStructure(newBlock)) {
        blockchain.push(newBlock);
    }
}

const calculateHashForBlock = (block: Block): string => 
    calculateHash(block.index, 
        block.previousHash, 
        block.timestamp, 
        block.data);

const addBlockToChain = (newBlock: Block) : boolean => {
    if(isValidNewBlock(newBlock, getLatestBlock()) && isValidBlockStructure(newBlock)) {
        blockchain.push(newBlock);
        return true;
    }

    return false;
}

const isValidNewBlock = (newBlock: Block, previousBLock: Block) => {
    if(previousBLock.index +1 !== newBlock.index) {
        console.log('Invalid index!');
        return false;
    } else if (previousBLock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash!');
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log('invalid hash!');
        return false;
    }
    return true;
};

const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && (typeof block.previousHash === 'string' || (block.index ===0 && block.previousHash === null))
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
} 

const isValidChain = (blockchain: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    }
    if(!isValidGenesis(blockchain[0])) {
        return false;
    }
    for (let i = 1; i < blockchain.length; i++) {
        if(!isValidNewBlock(blockchain[i], blockchain[i-1])){
            return false;
        }
    }
    return true;
}

const replaceChain = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Recieved valid blockchain. Replacing current blockchain with the new one...');
        blockchain = newBlocks;
    } else {
        console.log('Recieved invalid blockchain');
    }
}

const hexToBinary = (hash: String): string => {
    let ret: string = '';
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i: number = 0; i < hash.length; i = i + 1) {
        if (lookupTable[hash[i]]) {
            ret += lookupTable[hash[i]];
        } else {
            return null;
        }
    }
    return ret;
}

const hasMatchesDifficulty = (hash: string, difficulty: number): boolean => {
    const hashInBinary: string = hexToBinary(hash);
    const requiredPrefix: string = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
};

export {Block, getBlockchain, getLatestBlock, generateNextBlock, isValidBlockStructure, replaceChain, addBlockToChain};