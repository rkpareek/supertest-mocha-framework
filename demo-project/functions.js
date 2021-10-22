

// Call the config obj
var config = require('./config.json')
var supermocha = require('../index')
var test = new supermocha(config);

module.exports = function () {

    var module = {

        createUser: function (payload, cb) {
            test({
                uri: '/api/user',
                method: 'post',
                json: payload
            }, function (err, res) {
                if (!err) {
                    cb(res.body, res);
                } else throw err;
            });
        }
    }

    return module;
}