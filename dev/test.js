const Blockchain = require('./blockchain.js');
const bitcoin = new Blockchain();

// run using:
// node dev/test.js

/*
    Genesis Block Test
    Requires a genesis block to be defined!
*/
// console.log(bitcoin);


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

/*
    Test blockchain validity
*/
// Test 1
console.log("Checking a correct block chain... (results should be VALID)");
var bc1 = {"chain":[{"index":1,"timestamp":1528466730338,"transactions":[],"nonce":100,"hash":"0","previousBlockHash":"0"},{"index":2,"timestamp":1528466871089,"transactions":[],"nonce":18140,"hash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100","previousBlockHash":"0"},{"index":3,"timestamp":1528466917414,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"548ae1b06b2511e8a5db1718beb0abb4"},{"amount":10,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"60c8bb506b2511e8a5db1718beb0abb4"},{"amount":20,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"6870e0306b2511e8a5db1718beb0abb4"},{"amount":30,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"6a9fce206b2511e8a5db1718beb0abb4"}],"nonce":192028,"hash":"0000da1f352d17b2816d37ce05486b65d127248723d2e496a8aa8ede7a021bdf","previousBlockHash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"},{"index":4,"timestamp":1528466958962,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"702401906b2511e8a5db1718beb0abb4"},{"amount":40,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"7fec61806b2511e8a5db1718beb0abb4"},{"amount":50,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"81d349f06b2511e8a5db1718beb0abb4"},{"amount":60,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"8401c2b06b2511e8a5db1718beb0abb4"},{"amount":70,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"86501f806b2511e8a5db1718beb0abb4"}],"nonce":72164,"hash":"00006714c479e6111734ef3788e086d174927c3aae5d9c9d2b4d47ef2589b6a6","previousBlockHash":"0000da1f352d17b2816d37ce05486b65d127248723d2e496a8aa8ede7a021bdf"},{"index":5,"timestamp":1528466971950,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"88e7e1606b2511e8a5db1718beb0abb4"}],"nonce":3832,"hash":"0000ecaf1a9ae7b3d19aeaf08ab252d039c40980bb51073691d2e80693a7724b","previousBlockHash":"00006714c479e6111734ef3788e086d174927c3aae5d9c9d2b4d47ef2589b6a6"},{"index":6,"timestamp":1528466973953,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"90a563006b2511e8a5db1718beb0abb4"}],"nonce":13882,"hash":"000070537ad8c9447eb59293c1799d55730b6bba0beaccdb64019252287a9018","previousBlockHash":"0000ecaf1a9ae7b3d19aeaf08ab252d039c40980bb51073691d2e80693a7724b"}],"pendingTransactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"91d72c406b2511e8a5db1718beb0abb4"}],"currentNodeUrl":"http://localhost:3001","networkNodes":[]};
if (bitcoin.chainIsValid(bc1.chain)) {
    console.log('VALID\n');
}
else{
    console.log('INVALID\n');
}
// Test 2
console.log("Checking an incorrect/modified block chain... (results should be INVALID)");
var bc2 = {"chain":[{"index":1,"timestamp":1528466730338,"transactions":[],"nonce":100,"hash":"0","previousBlockHash":"0"},{"index":2,"timestamp":1528466871089,"transactions":[],"nonce":18140,"hash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100","previousBlockHash":"0"},{"index":3,"timestamp":1528466917414,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"548ae1b06b2511e8a5db1718beb0abb4"},{"amount":10,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"60c8bb506b2511e8a5db1718beb0abb4"},{"amount":20,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"6870e0306b2511e8a5db1718beb0abb4"},{"amount":30,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"6a9fce206b2511e8a5db1718beb0abb4"}],"nonce":192028,"hash":"0000da1f352d17b2816d37ce05486b65d127248723d2e496a8aa8ede7a021bdf","previousBlockHash":"0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"},{"index":4,"timestamp":1528466958962,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"702401906b2511e8a5db1718beb0abb4"},{"amount":40,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"7fec61806b2511e8a5db1718beb0abb4"},{"amount":50,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"81d349f06b2511e8a5db1718beb0abb4"},{"amount":60,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"8401c2b06b2511e8a5db1718beb0abb4"},{"amount":70,"sender":"J4RTJ4R6R64J6RT6JR46","recipient":"ERY4R654RH4FG64H6FG4J65JTY46KT4","transactionId":"86501f806b2511e8a5db1718beb0abb4"}],"nonce":72164,"hash":"00006714c479e6111734ef3788e086d174927c3aae5d9c9d2b4d47ef2589b6a6","previousBlockHash":"0000da1f352d17b2816d37ce05486b65d127248723d2e496a8aa8ede7a021bdf"},{"index":5,"timestamp":1528466971950,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"88e7e1606b2511e8a5db1718beb0abb4"}],"nonce":3832,"hash":"0000ecaf1a9ae7b3d19aeaf08ab252d039c40980bb51073691d2e80693a7724b","previousBlockHash":"00006714c479e6111734ef3788e086d174927c3aae5d9c9d2b4d47ef2589b6a6"},{"index":6,"timestamp":1528466973953,"transactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"90a563006b2511e8a5db1718beb0abb4"}],"nonce":13882,"hash":"000070537ad8c9447eb59293c1799d55730b6bba0beaccdb64019252287a9018","previousBlockHash":"0000ecaf1a9ae7b3d19aeaf08ab252d039c40980bb51073691d2e80693a7724b"}, {"index":666,"timestamp":1528466730666,"transactions":[],"nonce":666,"hash":"0000666666666666666666666666666666666666666666666666666666666666","previousBlockHash":"000070537ad8c9447eb59293c1799d55730b6bba0beaccdb64019252287a9018"}],"pendingTransactions":[{"amount":12.5,"sender":"00","recipient":"00a0a4906b2511e8a5db1718beb0abb4","transactionId":"91d72c406b2511e8a5db1718beb0abb4"}],"currentNodeUrl":"http://localhost:3001","networkNodes":[]};
if (bitcoin.chainIsValid(bc2.chain)) {
    console.log('VALID\n');
}
else{
    console.log('INVALID\n');
}
