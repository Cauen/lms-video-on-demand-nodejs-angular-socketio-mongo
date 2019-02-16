
var jwt2 = require('jsonwebtoken');
var secret = require('../config/jwt_auth');
let User = require('../models/User');

var isAdmin = function (req, res, next) {
    if (req.headers && req.headers.authorization) {
        var authorization;
        var decoded;
        var idInRequest = req.params.id;
        if (!idInRequest)
            idInRequest = req.body.userid;

        if (!idInRequest)
            return res.status(401).send('User dont have sent');
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            authorization = req.headers.authorization.split(' ')[1];
        } else {
            return res.status(401).send('Without tokens');
        }
        try {
            var decoded = jwt2.verify(authorization, secret);
            console.log(JSON.stringify(decoded))

        } catch (err) {
            console.log(err);
            return res.status(401).send('Invalid token');
        }
        if (decoded)
            User.findById(decoded._id, function (err, user) {
                if (!user)
                    return res.status('401').send('User not found');
                if (decoded._id == idInRequest || user.role == 'administrator')
                    next()
                else
                    return res.status(401).send('User not have permissions');
            });



    }
}

module.exports = isAdmin;