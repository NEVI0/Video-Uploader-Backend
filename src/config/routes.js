const express = require('express');

const AuthCtrl = require('../controllers/AuthCtrl');
const PostCtrl = require('../controllers/PostCtrl');
const PaymentCtrl = require('../controllers/PaymentCtrl');

module.exports = (server) => {

    const api = express.Router();
    server.use('/api', api);

    api.get('/', (request, response) => {
		return response.status(200).send(`Server's Running...`);  
    });

    api.post('/signup', AuthCtrl.signup);
    api.post('/signin', AuthCtrl.signin);

    api.get('/paypalSuccess/:email', PaymentCtrl.paypalSuccess);
    api.get('/paypalCancel', PaymentCtrl.paypalCancel);

    api.get('/post', PostCtrl.getPosts);
    api.post('/post/:userId', PostCtrl.createNewPost);

}