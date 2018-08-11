import { CryptoJS } from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, 
            hash: string,
            previousHash: string,
            timestamp: number,
            data: string){
                this.index = index;
                this.hash = hash;
                this.previousHash = previousHash;
                this.timestamp = timestamp;
                this.data = data;
    }
}

const calculateHash = (index: number, 
    previousHash: string, 
    timestamp: number, 
    data: string): string => 
        CryptoJS.SHA265(index, previousHash, timestamp, data).toString();

const genesisBlock: Block = new Block (0, 
    '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', 
    null, 1465154705, 
    'g3n35i5-8l0ck');

const generateNextBlock = (blockData: string) => {
    const previousBLock: Block = getLatestBlock();
    const nextIndex: number = previousBLock.index +1;
    const nextTimestamp: number = new Data().getTime() /1000;
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

const blockchain: Block[] = [genesisBlock];

const calculateHashForBlock = (block: Block): string => 
    calculateHash(block.index, 
        block.previousHash, 
        block.timestamp, 
        block.data);

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
