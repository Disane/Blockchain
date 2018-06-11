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

// returns the block if the provided blockHash exists
Blockchain.prototype.getBlock = function(blockHash){
    let correctBlock = null;
    // console.log("Blockchain.getBlock: looking for hash: " + blockHash);
    // PROBLEM:
    //  return on forEach doesn't work!
    //  we should probably switch this out with a proper for loop!
    //  another solution is to break the callback loop using an exception:
    var BreakException = {};
    try
    {
        this.chain.forEach(block => {
            // console.log(`checking #${block.index} with hash: ${block.hash}`);
            if(block.hash === blockHash)
            {
                correctBlock = block;
                // console.log("Blockchain.getBlock: found hash!");
                // return when done 
                throw BreakException;
            }
        });
    }
    catch(e)
    {
        if(e !== BreakException) {
            throw e;
        }
    }
    // if(correctBlock){console.log(`Blockchain.getBlock: Returning block for hash ${correctBlock.hash}`);}else{console.log(`Blockchain.getBlock: could not find block for hash ${blockHash}`);}
    return correctBlock;
};

// PROBLEM:
    //  return on forEach doesn't work!
    //  we should probably switch this out with a proper for loop!
    //  another solution is to break the callback loop using an exception:
    // PROBLEM 2: thorwing an exception here results in an error that throws [Object object] to the endpoint request
    //              possible solution would be to reformulate the code as a nested for loop
    //var BreakException = {};
    //try
    //{
        /*this.chain.forEach(block => {
            console.log("inside chain.forEach");
            block.transactions.forEach(transaction => {
                console.log("inside transactions.forEach");
                if(transaction.transactionId === transactionId)
                {
                    console.log("found transaction!");
                    console.log("found block!");
                    correctTransaction = transaction;
                    correctBlock = block;
                    //throw BreakException;
                }
            });
        });*/
    //}
    /*catch(e)
    {
        if(e === BreakException) throw e;
    }*/
// look up transaction object and block in which the transaction is stored based on the transaction ID
Blockchain.prototype.getTransaction = function(transactionId)
{
    if(transactionId == null)
    {
        console.log("Blockchain.getTransaction: No transactionId or null was passed!");
        return {
            "transaction": null,
            "block": null 
        }
    }

    //console.log("Blockchain.getTransaction: looking for transactionId: " + transactionId);

    // an optimized version of the linear transaction search algorithm
    // this one breaks the search once the items have been found
    // speeding up the search
    for(let b=0; b < this.chain.length; b++){
        // iterate over all blocks in the chain
        //console.log("inside chain for loop");
        for(let t=0; t < this.chain[b].transactions.length; t++){
            //console.log("inside transactions for loop");
            if(this.chain[b].transactions[t].transactionId === transactionId)
            {
                /*console.log("found transaction!");
                console.log("found block!");*/
                return {
                    "transaction": this.chain[b].transactions[t],
                    "block": this.chain[b]
                };
            }
        }
    }
    
    return {
        "transaction": null,
        "block": null
    };
};

// find the all transactions of an address as well as its current balance baced on 
// whether it was a recipient or a sender in the conducted transactions
Blockchain.prototype.getAddressData = function(address){
    const addressTransactions = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient === address)
            {
                addressTransactions.push(transaction);
            }
        });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
        if(transaction.recipient === address)
        {
            balance += transaction.amount;
        }
        else if(transaction.sender === address)
        {
            balance -= transaction.amount;
        }
    });
    
    return{
        addressTransactions: addressTransactions,
        addressBalance: balance
    };
};

module.exports = Blockchain;