const Blockchain = require('./blockchain.js');
const bitcoin = new Blockchain();

/*
    Genesis Block Test
    Requires a genesis block to be defined!
*/
console.log(bitcoin);


/*  These Tests only work if no Genesis block has been created

    Test Hash Block test
    Used for confirming whether a block is valid
    Test Case: Should yield a hash on the first try!

const previousBlockHash = '8UT86J4J65GH4J6F4H65E4R6H4WEA68TGW4E6GWE9GWE9';
const currentBlockData = [
    {
        amount: 10,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    },
    {
        amount: 30,
        sender: 'jenGWE84GH96W84EH6WE',
        recipient: 'alex894gh9w4eh96we49'
    },
    {
        amount: 200,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    }
];

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, 173852));
*/

/* Proof of Work Test
const previousBlockHash = '8UT86J4J65GH4J6F4H65E4R6H4WEA68TGW4E6GWE9GWE9';
const currentBlockData = [
    {
        amount: 10,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    },
    {
        amount: 30,
        sender: 'jenGWE84GH96W84EH6WE',
        recipient: 'alex894gh9w4eh96we49'
    },
    {
        amount: 200,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    }
];

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
*/

/* Test hashBlock method
const previousBlockHash = '8UT86J4J65GH4J6F4H65E4R6H4WEA68TGW4E6GWE9GWE9';
const currentBlockData = [
    {
        amount: 10,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    },
    {
        amount: 30,
        sender: 'jenGWE84GH96W84EH6WE',
        recipient: 'alex894gh9w4eh96we49'
    },
    {
        amount: 200,
        sender: 'alex894gh9w4eh96we49',
        recipient: 'jenGWE84GH96W84EH6WE'
    }
];
const nonce = 100;
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
*/

/* Test Block Creation
bitcoin.createNewBlock(2389,'0INA905DNF90N', '90ANSD9F0N9009N');
bitcoin.createNewBlock(111,'0IANSDFEG3543', 'NGOIERN45646IE');
bitcoin.createNewBlock(2899,'OPERNHOPR8498465', '1641hGEW6ewh4W');
*/

/* Test Transactions
bitcoin.createNewBlock(892348,'h4er56h4er65h4er564h6er546her456h46er4h6', 'HER84H4ED56HF464WER6');
bitcoin.createNewTransaction(100, 'alex894gh9w4eh96we49','jenGWE84GH96W84EH6WE');
bitcoin.createNewBlock(123464, 'GWE84G6W4G56WS4E6G5G4E6W', 'G41W68E4G6WE4H65WERH4');

bitcoin.createNewTransaction(50, 'alex894gh9w4eh96we49','jenGWE84GH96W84EH6WE');
bitcoin.createNewTransaction(300, 'jenGWE84GH96W84EH6WE','alex894gh9w4eh96we49');
bitcoin.createNewTransaction(2000, 'alex894gh9w4eh96we49','jenGWE84GH96W84EH6WE');

bitcoin.createNewBlock(979465456, 'A4F84A6EG54S6G54', 'J65F4J56FG4J65GH46JG');

console.log(bitcoin);
console.log('\n[*] Transactions in second block:\n ');
console.log(bitcoin.chain[1]);
console.log('\n[*] Transactions in third block:\n ');
console.log(bitcoin.chain[2]);
*/