import * as bodyParser from 'body-parser';
import * as express from 'express';

import {Block, generateNextBlock, getBlockchain, addBlockToChain} from './blockchain';
import {connectToPeers, getSockets, initP2PServer} from './p2p';

const HTTP_PORT: number = parseInt(process.env.HTTP_PORT) ||3001;
const P2P_PORT: number = parseInt(process.env.P2P_PORT) || 6001;

const initHttpServer = (myHttpPort) => {
    const app = express();
    app.use(bodyParser.json());

    app.listen(myHttpPort, () => {
        console.log(`listening HTTP on port: ${myHttpPort}`);
    });

    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });

    app.post('/mine-block', (req, res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });

    app.get('/peers', (req, res) => {
        res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort))
    });

    app.post('/add-peer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    
}

initHttpServer(HTTP_PORT);
initP2PServer(P2P_PORT);