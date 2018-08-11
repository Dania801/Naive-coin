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