const express = require('express');

const app = express();
var request = require('request');
const bodyParser = require('body-parser');
const axios = require('axios');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/webhooks', (req, res) => {

  res.status(200).send('Hello, webhooks!').end();
});

app.post("/webhooks", (req, res) => {
  try {
    console.log(req.body)

    axios.post('https://tstdrv1019523.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=792&deploy=1&compid=TSTDRV1019523&h=e9ce716184022a4abffb', {
      request: req.body
    },
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      })
    axios.post('http://192.168.10.1:8001/api/orders/create', {
      request: req.body
    })

    res.status(200).send('Post route hit').end();


  }
  catch (err) {
    console.log("/webhooks route error: ", err)
    return res.status(404).json({
      success: false,
      message: `${err}`
    })
  }
})


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
