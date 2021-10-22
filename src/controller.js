const lib = require('./lib');
var supertest = require('supertest')
var _ = require('underscore');
const { indexOf } = require('underscore');

module.exports = function (CONFIG) {

    var module = function (options, callback) {
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
        let debugging = CONFIG.debug ? CONFIG.debug : lib.debug;

        let server = supertest.agent(CONFIG.baseUrl);
        request = server[reqMethod](options.uri);

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

        if (debugging) {
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
            if (debugging) {
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
    };

    module.customError = function (res) {

        // @params {object} res An object containing the api response

        let payloadMsg = '';
        let requestHeaders = '';

        if (res.request.method !== 'GET' && res.request.method !== 'OPTIONS') {
            let requestBody = res.request._data;
            requestBody = this.resParser(requestBody, 'string');
            payloadMsg = '\nPayload: ' + requestBody;
        }

        if (Object.keys(res.request.header).length > 2) {
            requestHeaders = _.omit(res.request.header, ['User-Agent', 'Content-Type']);
            requestHeaders = '\nRequestHeaders: ' + this.resParser(requestHeaders, 'string');
        }

        let requestResponse;
        if (res.statusCode !== 404) requestResponse = JSON.stringify(res.body);
        else requestResponse = res.text;

        if (_.contains([500, 501, 502, 503, 504], res.statusCode)) {
            return '(' + res.statusCode + ') ' + res.request.method + ' ' + res.request.url +
                '\nActual Response: ' + JSON.stringify(res) +
                this.resParser(requestHeaders, 'string') + '\n';
        } else {
            return '(' + res.statusCode + ') ' + res.request.method + ' ' + res.request.url +
                '\nActual Response: ' + requestResponse + payloadMsg +
                this.resParser(requestHeaders, 'string') + '\n';
        }
    };

    module.assert = function (err, res, assertions, done) {

        /*
         * @param => err: err from api call {string} {required}
         *
         * @param => res: res from api call {string} {required}
         *
         * @param => assertions: {function} function containing all assertions
         *
         * @param => done: done function
         *
         */

        if (!err) {
            let url = res.request.url;
            url = url.indexOf('?') > -1 ? url.substr(0, url.indexOf('?')) : url;

            if (!err) {
                try {
                    assertions();
                } catch (e1) {
                    throw new Error(e1 + '\n\n' + this.customError(res));
                }
                finally {
                    console.log('(' + res.statusCode + ')', res.request.method, url);
                    done();
                }
            }
        } else {
            if (typeof res !== 'undefined' && typeof res.error !== 'undefined' && res.error) {
                throw res.error;
            } else throw err;
        }
    };

    module.resParser = function (res, toConvert) {
        toConvert = toConvert || 'object';
        if (toConvert === 'string') {
            res = typeof res === 'string' ? res : JSON.stringify(res);
        } else {
            res = typeof res === 'object' ? res : JSON.parse(res);
        }
        return res;
    }

    return module;
}

