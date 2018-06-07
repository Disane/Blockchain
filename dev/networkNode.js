const express = require('express');
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const assert = require('assert')

// create proces at a differnt port
// variable is read from package.json
const port = process.argv[2];

// creates an unique address for this node
const nodeAddress = uuid().split('-').join('');

const app = express();

// Correctly handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const bitcoin = new blockchain();
 
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
  /*console.log(req.body);
  res.send(`The amount of the transaction is ${req.body.amount} bitcoin`);*/
  const blockindex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockindex}.`});
});

app.get('/mine', function (req, res) {
  // acquire the last block in the chain
  const lastBlock = bitcoin.getLastBlock();
  // get the hash of the last block
  const previousBlockHash = lastBlock['hash'];
  // create new block data
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };
  // WARNING!
  // THIS SINKS ALOT OF PROCESSING POWER!
  // process proof of work (mine) to solve the nonce
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  // create a new hash block using the processed nonce
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  // '00' address as a sender is always the mining reward system
  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    note: "New block mined successfully!",
    block: newBlock
  });

});

// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res){
  const newNodeUrl = req.body.newNodeUrl;

  // add new node url if it doesn't exist yet
  if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1){
    bitcoin.networkNodes.push(newNodeUrl);
  }

  // queue up promises
  // to register with all existing nodes
  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl  + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };
    regNodesPromises.push(rp(requestOptions));
  });
  
  // carry out promises by polling them from the queue
  Promise.all(regNodesPromises)
  .then(data => {
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
      json: true
    };

    return rp(bulkRegisterOptions);
  })
  .catch(error => {
    assert(error, '/register-and-broadcast-node Promise error');
    console.error('/register-and-broadcast-node Promise error' + error);
  })
  .then(data => {
    res.json({
      note: "New node registered with network successfully!"
    });
  })
  .catch(error => {
    assert(error, '/register-and-broadcast-node Promise error');
    console.error('/register-and-broadcast-node Promise error' + error);
  })
});

// every node in the network sends this to register the new node that receives this request
app.post('/register-node', function(req, res){
  // add new node url to register it
  const newNodeUrl = req.body.newNodeUrl;

  // check if node doesn't exist on the list yet
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;

  // check if we are dealing with the last url
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

  if(nodeNotAlreadyPresent && notCurrentNode){
    bitcoin.networkNodes.push(newNodeUrl);
  }
  // send a response when successful
  res.json({ note: "New node registered successfully." });
});

// register more than one node
app.post('/register-nodes-bulk', function(req, res){
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(networkNodeUrl =>{
    // check if url is already part of the network
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    // check if we are trying to add the current network as a new one
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode){
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successful!" });
});

// start server at the specified port
app.listen(port, function(){
  console.log(`listening on port ${port}...`);
});