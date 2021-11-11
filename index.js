Web3 = require('web3');
const app = express();

//API to mirrior a players bets on pancakeswap prediction

//bsc = "wss://speedy-nodes-nyc.moralis.io/6b82ee16c1b85ab2ddd0dee1/bsc/mainnet/ws" 
//wss://apis-sj.ankr.com/wss/7e5d6a9d92f241f683018ec5afc09c05/cbecb75a4675685170a2dd6c986a064c/binance/full/main
//wss://speedy-nodes-nyc.moralis.io/6b82ee16c1b85ab2ddd0dee1/bsc/mainnet/ws

let match = ''; // match #
let totalBull = ''; // total bull bets
let totalBear = ''; // total bear bets
let userAddress = ''; // target address to mirror trades
let betBull = ''; // user bets bull
let betBear = ''; // user bets bear
let statusCheck = ''; // global variable check status
let matchStatus = ''; // elapsed time left to place bet

const options = {
    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false
    }
  };

var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://speedy-nodes-nyc.moralis.io/6b82ee16c1b85ab2ddd0dee1/bsc/mainnet/ws",
      options
    )
  );


console.log("isConnected=");
web3.eth.net.isListening().then(console.log);


var subscription = web3.eth.subscribe('logs', {
    address: '0x18b2a687610328590bc8f2e5fedde3b582a49cda',
    topics: [['0x0d8c1fe3e67ab767116a81f122b83c2557a8c2564019cb7c4f83de1aeb1f1f0d','0x438122d8cff518d18388099a5181f0d17a12b4f1b55faedf6e4a6acee0060c12'], '0x0000000000000000000000009808153fa4135eb57c9c45802cc9f25385e0a8a6']
}, function (error, result) {
    console.log(error)
    if (!error)
        console.log(result);
        /*
        userAddress = result.topics[2];

        if (result.topics[0].contains('0x0d8c1fe3e67ab767116a81f122b83c2557a8c2564019cb7c4f83de1aeb1f1f0d')) {
          betBear = 1
        } else if(result.topics[0].contains('0x438122d8cff518d18388099a5181f0d17a12b4f1b55faedf6e4a6acee0060c12')){
          betBull = 1
        }

        // within subscription call another subscription (to regularly listen to time changes) or call it once and have internal countdown
        // get timed elapsed
        getRound();
        */
})
    .on("data", function (log) {
        console.log(log);
        console.log("2");
    })
    .on("changed", function (log) {
        console.log(log);
        console.log("3");
    });



    // READ rounds(epoch)
    // get total bullAmount  total bnb in bull
    // get total bearAmount  total bnb in bear
    // get match #
    // lock price
    // close price      // if no close price round is still in effect
    /*
      startTimestamp   uint256 :  1636564458 // convert this to human readable, Epoch & Unix Timestamp Conversion Tools
      lockTimestamp   uint256 :  1636564758
      closeTimestamp   uint256 :  1636565058
  */
    

/* var getRound = web3.eth.subscribe('logs', {
    address: '0x18b2a687610328590bc8f2e5fedde3b582a49cda',
    topics: [['0x0d8c1fe3e67ab767116a81f122b83c2557a8c2564019cb7c4f83de1aeb1f1f0d','0x438122d8cff518d18388099a5181f0d17a12b4f1b55faedf6e4a6acee0060c12'], '0x0000000000000000000000009808153fa4135eb57c9c45802cc9f25385e0a8a6']
}, function (error, result) {
    console.log(error)
    if (!error)

        // let all the variable and then after round ends log the results into the database.. api will be a live web socket though

      
        
});
*/


// unsubscribes the subscription

subscription.unsubscribe(function (error, success) {
    if (success)
        console.log('Successfully unsubscribed!');
});
