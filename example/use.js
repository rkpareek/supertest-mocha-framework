
// Create a confuguration object containing BaseUrl of your apis endpoints or application
var config = {
    "BASE_URL": "https://reqres.in"
}

var expect = require('chai').expect;
var supermocha = require('../index')
var test = new supermocha(config)

describe('Test Suite...', function () {
    this.timeout(50000)

    // Example Test Case 01
    it('\n1. Create a Test User', function (done) {
        test({
            uri: '/api/users',
            method: 'post',
            json: {
                "name": "Test User",
                "job": "Quality Check"
            }
        }, function (err, res) {
            expect(res.body).to.have.property('name', 'Test User')
            expect(res.body).to.have.property('job', 'Quality Checkm')
            done();
        })
    });


});