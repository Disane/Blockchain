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
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  
  res.json({ note: `Transaction will be added in block ${blockIndex}`});
});

app.post('/transaction/broadcast', function(req, res){
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl =>{
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    }

    requestPromises.push(rp(requestOptions));
  });
  // collect all transactions and send them asynchronously
  Promise.all(requestPromises)
  .then(data =>{
    res.json({ note: 'Transaction created and broadcast successfully!'});
  })
  .catch(error => {
    assert(error, '/transaction/broadcast Promise error');
    console.error('/transaction/broadcast' + error);
  });
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
  // bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  // newly mined block ready
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  // broadcast newly mined block
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: {newBlock: newBlock },
      json: true
    }

    requestPromises.push(rp(requestOptions));
  });

  // asynchronosly process all promises
  Promise.all(requestPromises)
  .then(data => {
    // create mining reward transaction
    const requestOptions = {
      uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body:{
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    };

    // return promise request
    return rp(requestOptions);
  }).catch(error => {
    assert(error, '/mine Promise error');
    console.error('/mine Promise error' + error);
  })
  .then(data => {
    res.json({
      note: "New block mined and broadcast successfully!",
      block: newBlock
    });
  }).catch(error => {
    assert(error, '/mine Promise error');
    console.error('/mine Promise error' + error);
  });
});

// new endpoint to handle receiving blocks
app.post('/receive-new-block', function(req, res){
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();

  // check if the hashes line up properly
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  // check if the indexes line up properly
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  // process block check
  if(correctHash && correctIndex){
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    
    res.json({ 
      note:"new block received and accepted!" ,
      newBlock: newBlock
    });
  }
  else
  {
    res.json({ 
      note: "new block rejected!",
      newBlock: newBlock
    });
  }
});


// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res){
  const newNodeUrl = req.body.newNodeUrl;

  // TODO: Check if this is a bug! 
  //       We are basically adding a new node to the network nodes on the current node
  //       without checking if the target node url is actually our own
  //       Is this a bug or a feature?
  if((bitcoin.networkNodes.indexOf(newNodeUrl) == -1) && // if the new URL doesn't exist on this node yet
     (bitcoin.currentNodeUrl !== newNodeUrl)){ // if the new URL is not the exact same URL of the current node
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

  // console.log('/register-node bitcoin.currentNodeUrl: ' + bitcoin.currentNodeUrl + ", newNodeUrl: " + newNodeUrl);
  if(nodeNotAlreadyPresent && notCurrentNode){
    bitcoin.networkNodes.push(newNodeUrl);
  }
  // send a response when successful
  res.json({ note: "New node registered successfully." });
});

// register more than one node
app.post('/register-nodes-bulk', function(req, res){
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach( networkNodeUrl => {
    // check if url is already part of the network
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    // check if we are trying to add the current network as a new one
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    // console.log('/register-nodes-bulk bitcoin.currentNodeUrl: ' + bitcoin.currentNodeUrl + ", networkNodeUrl: " + networkNodeUrl);
    if(nodeNotAlreadyPresent && notCurrentNode){
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: "Bulk registration successful!" });
});

// acquires all blockchains from all the nodes connected to the network
// checks which node stores the longest valid blockchain
// TODO: check if we can oprimize this endpoint
//       we might not need: maxChainLength and we could replace that with newLongestChain.length
app.get('/concensus', function(req, res){
  const requestPromises = [];

  // acquire all blockchains on the network using their blockchain endpoint
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
  .then(blockchains => {
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    // find the longest blockchain on the network
    blockchains.forEach(blockchain => {
      // console.log("/concensus : checking blockchain on " + blockchain.currentNodeUrl);
      if(blockchain.chain.length > maxChainLength){
        maxLongestChain = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
        /*console.log("/concensus : found longer blockchain!");
        if(bitcoin.chainIsValid(newLongestChain))
        {
          console.log('VALID\n');
        }
        else{
          console.log('INVALID\n');
        }*/
      }
    });

    // now we check the results

    // if there is no new longest chain on the network or there is one but it is invalid
    if( !newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain)) ) {
      // we stick to our own blockchain
      res.json({
        note: "Current chain has not been replaced",
        chain: bitcoin.chain
      });
    }
    // if there is a longer valid chain on the network
    //else if(newLongestChain && bitcoin.chainIsValid(newLongestChain)) 
    else
    {
      // we replace our own blockchain with the newly found one
      bitcoin.chain = newLongestChain;
      bitcoin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: bitcoin.chain
      });
    }
  });
});

// start server at the specified port
app.listen(port, function(){
  console.log(`listening on port ${port}...`);
});