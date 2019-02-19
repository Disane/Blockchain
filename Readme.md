# Simple Blockchain Data Structure 
## for Proof of Work Type Coin Transactions
## version 1.0
##by Disane

# Description:
Simple blockchain data structure used in a Node.js Web App to create blockchain nodes for mining and processing blockchain transactions. There's also a simple block explorer attached to the project. 
This particular blochain utilizes:
* Proof of work to create and validate a new block.
* Longest chain to conduct blockchain integrity checks.

The code is based on Eric Traub's Udemy course: 
https://www.udemy.com/build-a-blockchain-in-javascript

# TODO:
Before you implement the end points for your wallet Web or Mobile App make sure that you complete all the improvements that are suggested by Eric at the end of this course. 

>>1. Transactions need to check whether the provided address has at least the amount of cryptocurrency assigned to it before proceeding.

>>2. You need to secure all inputs that may come from the outside.​ Check all the arguments that you pass to your end points and blockchain member functions. 
This is necessary to make the blockchain bulletproof against various hack attempts. 

# Usage
In this version we have 5 premade nodes to test transactions, mining and displaying currency information:
node dev/networkNode.js 3001 http://localhost:3001
node dev/networkNode.js 3002 http://localhost:3002
node dev/networkNode.js 3003 http://localhost:3003
node dev/networkNode.js 3004 http://localhost:3004
node dev/networkNode.js 3005 http://localhost:3005

## Test Run
Make sure you start all nodes (refer to the instructions above).

### Mining
Choose a node to interact with by opening a URL in your browser or using Postman eg.:
http://localhost:3001/mine - Will mine a block on node_1
you can do the same on any of the 5 predefined nodes

### Looking up blocks inside the blockchain using node_1:
Can be used to check if a block exists on the blockchain
http://localhost:3001/block/[block_hash]

### Start BlockExplorer UI on node_1:
http://localhost:3001/blockexplorer


