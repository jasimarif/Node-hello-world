if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

var nsrestlet = require('nsrestlet');
const User = require('./models/User')
const basicAuthCredentials = [{ id: 1, username: 'einvoicesg', password: 'einvoicesg', firstName: 'Test', lastName: 'User' }];
const app = express();
app.use(basicAuth);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
const dbUrl = process.env.db || 'mongodb://localhost:27017/user'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

async function basicAuth(req, res, next) {

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    console.log("HEADERSS", req.headers)
    console.log("base64Credentials", base64Credentials)
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    console.log("credentials", credentials)
    const [username, password] = credentials.split(':');
    console.log("username", username, "password", password)
    const user = await authenticate({ username, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}

async function authenticate({ username, password }) {
    const user = basicAuthCredentials.find(u => u.username === username && u.password === password);
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

app.post('/register', async (req, res) => {
    console.log("req body", req.body)
    // req.body.accountId = req.body.accountId.toLowerCase()

    let accountId = req.headers.accountid
    console.log("account id", accountId)
    const existingUser = await User.find({ accountId:accountId })
    console.log("existing user found", existingUser)

    if (existingUser.length===0) {
        const newUser = new User({
            accountId: req.body.accountId,
            tokenKey: req.body.tokenKey,
            tokenSecret: req.body.tokenSecret,
            consumerKey: req.body.consumerKey,
            consumerSecret: req.body.consumerSecret,
            url: req.body.url,

        })
        await newUser.save()
        console.log("new user", newUser)

    }
    
    else {
        console.log("existing user found", existingUser)
        const updatedUser = await User.findOneAndUpdate({accountId:accountId}, req.body)
        console.log("user is updated", updatedUser)
    }
    res.send("jasim")
})


app.get('/restlet', (req, res) => {
    res.status(200).send('Hello, restlet!').end();
})

app.post('/restlet', async (req, res) => {
    var accountId = req.headers.accountid
    const user = await User.find({ accountId: accountId })
    var { accountId, tokenKey, tokenSecret, consumerKey, consumerSecret, url } = user[0]
    var accountSettings = {
        accountId, tokenKey, tokenSecret, consumerKey, consumerSecret
    };
    var urlSettings = { url }

    //create a link
    var myRestlet = nsrestlet.createLink(accountSettings, urlSettings)
    //then call get, post, put, or delete
    var body = req.body
    console.log("JSON bodyyyy", JSON.stringify(body))
    myRestlet.post({ body: JSON.stringify(body) }, function (error, msg) {
        if (!error) {
            console.log("message", msg)
            res.send("OK")
        }
        else {
            console.log("erorr", error);
            res.send("There was an error")
        }
    });

})

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;



  // url: 'https://tstdrv925863.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=405&deploy=1'
        // url: 'https://tstdrv987562.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=336&deploy=1'
        // url: 'https://tstdrv2397753.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=14&deploy=1'
