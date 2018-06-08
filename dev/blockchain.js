const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

/* 
    Notes:
    * started implementing network decentralization mechanics
    * implementing chainIsValid() for concensus check based on the longest valid chain algorithm
*/

/*
    Blockchain Data Structure with a Genesis Block
*/
function Blockchain(){
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    // Create genesis block 
    // add 100 Bitcoin
    this.createNewBlock(100,'0','0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function(){
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substr(0,4) !== '0000'){
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        // console.log(hash);
    }

    return nonce;
}

// Checks whether the blockchain's integrity was compromised
// returns true - if yes, false - if not
// MODIFIED: to exit once the first anomaly has been found found!
// Originally the function would keep iterating over the blockchain even after finding the first anomaly.
Blockchain.prototype.chainIsValid = function(blockchain){
    //let validChain = true;

    // check blocks, except for the genesis block
    for(let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(
            prevBlock['hash'], 
            {
                transactions: currentBlock['transactions'], 
                index: currentBlock['index']
            }, 
            currentBlock['nonce']
        );
        /*console.log("prevBlock[hash]: " + blockHash + 
        ", transactions: " + currentBlock['transactions'] + 
        ", index: " + currentBlock['index'] + 
        ", currentBlock[nonce]: " + currentBlock['nonce'] );*/

        // NOTE: '0000' should probably be a constant
        // we check if the hash begins with four zeroes
        if(blockHash.substring(0,4) !== '0000') {
            //validChain = false;
            // console.log("0000 not found in blockHash!" );
            //return validChain;
            return false;
        }

        // check if the current node points to the correct previous hash for the previous node
        if(currentBlock['previousBlockHash'] !== prevBlock['hash']){ // if chain is not valid
            //validChain = false;
            // console.log("previous block hash is not the same as the one stored on the current hash\'s previousBlockHash!" );
            //return validChain;
            return false;
        }
    }

    // check genesis block
    const genesisBlock = blockchain[0]
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if(!(correctNonce && correctPreviousBlockHash && correctHash && correctTransactions)){
        //validChain = false;
        // console.log("invalid genesis block!" );
        //return validChain;
        return false
    }

    //return validChain;
    return true;
};

module.exports = Blockchain;