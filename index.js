const lib = require('./src/lib');

module.exports = function (CONFIG) {

    return require('./src/controller.js')(CONFIG)

};