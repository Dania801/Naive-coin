import {Block, getBlockchain, addBlockToChain, getLatestBlock, generateNextBlock} from './blockchain';

console.log(getBlockchain());
const block = generateNextBlock('Dania')
console.log(addBlockToChain(block));
console.log(getBlockchain());