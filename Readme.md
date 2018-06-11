# Simple Blockchain Data Structure 
## for Proof of Work Type Coin Transactions
## version 1.0
based on Udemy Course by Eric Traub

## Description
>Blockchain Data structure:
>>Blockchain()
>>>constructor function to create a blockchain with a genesis block

>>createNewBlock(nonce, previousBlockHash, hash)

>>getLastBlock()
>>>returns the last block in the blockchain data structure

>>createNewTransaction(amount, sender, recipient)
>>addTransactionToPendingTrasactions(transactionObj)
>>hashBlock(previousBlockHash, currentBlockData, nonce)
>>proofOfWork(previousBlockHash, currentBlockData)
>>chainIsValid(blockchain)

>Endpoints:
>>/blockchain
>>/transaction
>>/transaction/broadcast
>>/mine
>>/receive-new-block
>>/register-and-broadcast-node
>>/register-node
>>/register-nodes-bulk
>>/concensus

## Test Cases:
Genesis Block Test
Hash Block 
Proof of Work 
hashBlock method
Block Creation
Transactions
Blockchain integrity