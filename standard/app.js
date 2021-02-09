// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// [START gae_node_request_example]
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
    axios.post('https://tstdrv1019523.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=792&deploy=1&compid=TSTDRV1019523&h=e9ce716184022a4abffb', {
      firstName: 'Fred',
      request: req.body
    },
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
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
