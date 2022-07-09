Web3 = require('web3');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080
app.use(express.json());

const options = {
    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false
    }
  };

// target user address and bet
let userObject = [];
// round data for bet
let roundObject = [];

var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://speedy-nodes-nyc.moralis.io/YOUR-MORALIS-API/bsc/mainnet/ws",
      options
    )
  );

let PancakePredictionV2 = require("./build/PancakePredictionV2.js");

const contract = new web3.eth.Contract(PancakePredictionV2, '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA');

// check for web3 socket connection
console.log("isConnected=");
web3.eth.net.isListening().then(console.log);

// listen for target users bet
// address pancakeswapv2 contract address
// topics [[bull,bear][target_address]] *bull OR bear AND target address
var subscription = web3.eth.subscribe('logs', {
    address: '0x18b2a687610328590bc8f2e5fedde3b582a49cda',
    topics: [['0x0d8c1fe3e67ab767116a81f122b83c2557a8c2564019cb7c4f83de1aeb1f1f0d','0x438122d8cff518d18388099a5181f0d17a12b4f1b55faedf6e4a6acee0060c12'], '0x000000000000000000000000fddd3c283e56c86526cf385ca6a8b52871725a48']
}, function (error, result) {
    console.log(error)
    if (!error)
        console.log(result);

        // log user bet object
        userObject.shift(); // remove old user bet
        userObject.push(result);
    
        // get user bet round
        getRounds();
})
    .on("data", function (log) {
        console.log(log);
    })
    .on("changed", function (log) {
        console.log(log);
    });

// unsubscribes the subscription
subscription.unsubscribe(function (error, success) {
    if (success)
        console.log('Successfully unsubscribed!');
});

// get current open round stats
async function getRounds() {
  try {
      // get current open round
      const epochData = await contract.methods.currentEpoch().call();
      // get open round data
      const roundData = await contract.methods.rounds(epochData).call(); 

      roundObject.shift(); // remove old round
      // log round object
      roundObject.push(roundData);
    
  } catch (e) {
      console.log(e);
  }
}

// API handles get requests at /get
app.get('/get', async (req, res) => {
  res.status(200).send({
      userObject: { userObject },
      roundsObject: { roundObject }
  })
})

app.listen(port, () => {
  console.log(`prediction api listening at http://localhost:${port}`)
})
