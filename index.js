Web3 = require('web3');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080
app.use(express.json());

//const PancakePredictionV2 = './build/PancakePredictionV2.json';



const options = {
    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false
    }
  };


let userObject = [];
let epoch;
let roundObject = [];

var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://speedy-nodes-nyc.moralis.io/6b82ee16c1b85ab2ddd0dee1/bsc/mainnet/ws",
      options
    )
  );

let PancakePredictionV2 = require("./build/PancakePredictionV2.js");

const contract = new web3.eth.Contract(PancakePredictionV2, '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA');

console.log("isConnected=");
web3.eth.net.isListening().then(console.log);

// listen for target user bet and get user data
var subscription = web3.eth.subscribe('logs', {
    address: '0x18b2a687610328590bc8f2e5fedde3b582a49cda',
    topics: [['0x0d8c1fe3e67ab767116a81f122b83c2557a8c2564019cb7c4f83de1aeb1f1f0d','0x438122d8cff518d18388099a5181f0d17a12b4f1b55faedf6e4a6acee0060c12'], '0x000000000000000000000000dcd2f74d73d7961799d14fb8e7bcf0b10df34de8']
}, function (error, result) {
    console.log(error)
    if (!error)
        console.log(result);
        // log user object to variable
        userObject.shift(); // remove old log
        userObject.push(result);

      
        // get round data
        getEpoch();
        // epoch = getEpoch()
        getRounds();
        // getRound(epoch);
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


// get current epoch
/*
async function getEpoch() {
  try {
      const epochData = await contract.methods.currentEpoch().call(function (err, res) {
        if (err) {
          console.log("An error occured", err)
        }
        console.log("User bet for round:", res)
        epoch = res;
        return (res);

        //just return the value and put into the thing
      })
  } catch (e) {
      console.log(e);
  }
}
*/

// get current round stats
async function getRounds() {
  try {

      const roundData = await contract.methods.rounds(epoch).call(function (err, res) {
        if (err) {
          console.log("An error occured", err)
        }
        console.log("The round data ", res)
        roundObject.shift();
        roundObject.push(res);

        //just return the value and put into the thing
      })
  } catch (e) {
      console.log(e);
  }
}


// handles get requests 
app.get('/get', async (req, res) => {
  res.status(200).send({

      //User Object raw
      currentMatch: { epoch },
      userObject: { userObject },
      roundsObject: { roundObject }
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
