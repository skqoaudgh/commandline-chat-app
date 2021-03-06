const express = require('express');
const cors = require('cors');
const Chatkit = require('@pusher/chatkit-server');

const app = express();

const chatkit = new Chatkit.default({
    instanceLocator: 'YOUR INSTANCE LOCATOR',
    key: 'YOUR KEY'
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post('/users', (req, res) => {
    const { username } = req.body
    chatkit
    .createUser({
        id: username,
        name: username
    })
    .then(() => {
        console.log(`User created: ${username}`);
        res.sendStatus(201);
    })
    .catch(err => {
        if(err.error === 'services/chatkit/user_already_exists') {
            console.log(`User already exists: ${username}`);
            res.sendStatus(200);
        } 
        else {
            res.status(err.status).json(err);
        }
    });
});

app.post('/authenticate', (req, res) => {
    const authData = chatkit.authenticate({userId: req.query.user_id});
    res.status(authData.status).set(authData.headers).send(authData.body);
})

app.listen(3001, err => {
    if(err) {
        console.log(err)
    } 
    else {
        console.log(`Running on port 3001`);
    }
});