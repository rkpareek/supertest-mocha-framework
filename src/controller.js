const lib = require('./lib');
var supertest = require('supertest')

module.exports = function (CONFIG) {

    return function (options, callback) {
        /**
         * @param {object} options - the object containing all required param to create a request.
         *
         * @param {string} options.uri - api endpoint
         *
         * @param {string} options.method - request method ['get', 'put', 'post', 'delete', 'options'], {optional} default: GET
         *
         * @param {object} options.headers - request headers, {optional} default: null
         *
         * @param {object} options.json - request payload, {optional} default: null
         *
         * @param {string} options.setContentType - an header for request body content type, {optional} default: /json/
         *
         * @param {string} options.expectContentType - response content type, {optional} default: /json/
         *
         * @param {function} callback - function to handle callback response
         *
         */

        let reqMethod = options.method || 'get';
        let req_headers = '';
        let req_body = '';
        let request;

        let server = supertest.agent(CONFIG.BASE_URL);
        request = server[reqMethod](options.uri);

        if (lib.proxyCountryCode) {
            request.proxy(utilFunctions.proxyUrl(lib.proxyCountryCode))
        }

        if (options.setContentType) {
            request.set('Content-Type', options.setContentType);
        } else {
            request.set('Content-Type', 'application/json');
        }

        if (options.headers) {
            request.set(options.headers);
            req_headers = '\n header: ' + JSON.stringify(options.headers);
        }

        if (options.json) {
            request = request.send(options.json);
            req_body = '\n body: ' + JSON.stringify(options.json);
        }

        if (lib.debug) {
            console.log('\x1b[35m%s\x1b[0m', '\nRequest Url...\n', reqMethod, options.uri);
            if (options.json) {
                console.log('\x1b[36m%s\x1b[0m', '\nRequest Payload...\n', options.json);
            }
            if (options.headers) {
                console.log('\x1b[33m%s\x1b[0m', '\nRequest Headers...\n', options.headers);
            }
        }

        if (options.method !== 'options') {
            if (options.expectContentType) {
                request.expect('Content-Type', options.expectContentType);
            }
            // else request.expect('Content-Type', /json/);
        }

        request.end(function (err, res) {
            if (lib.debug) {
                if (typeof res !== 'undefined') {
                    let res_body = typeof res.body === 'object' ? JSON.stringify(res.body) : res.body;
                    console.log('\x1b[32m%s\x1b[0m', '\nRequest Response...\n ' + res.statusCode, res_body + '\n');
                }
            }

            function pass_cb(callback) {
                callback(arguments[1], arguments[2]);
            }

            pass_cb(callback, err, res);
        });
    }
}
