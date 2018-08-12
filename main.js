"use strict";
exports.__esModule = true;
var bodyParser = require("body-parser");
var express = require("express");
var blockchain_1 = require("./blockchain");
var p2p_1 = require("./p2p");
var HTTP_PORT = parseInt(process.env.HTTP_PORT) || 3001;
var P2P_PORT = parseInt(process.env.P2P_PORT) || 6001;
var initHttpServer = function (myHttpPort) {
    var app = express();
    app.use(bodyParser.json());
    app.listen(myHttpPort, function () {
        console.log("listening HTTP on port: " + myHttpPort);
    });
    app.get('/blocks', function (req, res) {
        res.send(blockchain_1.getBlockchain());
    });
    app.post('/mine-block', function (req, res) {
        var newBlock = blockchain_1.generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get('/peers', function (req, res) {
        res.send(p2p_1.getSockets().map(function (s) { return s._socket.remoteAddress + ':' + s._socket.remotePort; }));
    });
    app.post('/add-peer', function (req, res) {
        p2p_1.connectToPeers(req.body.peer);
        res.send();
    });
};
initHttpServer(HTTP_PORT);
p2p_1.initP2PServer(P2P_PORT);
