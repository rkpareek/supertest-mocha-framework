
// Call the config obj
var config = require('./config.json')

var expect = require('chai').expect;
var supermocha = require('../index')
var test = new supermocha(config);

describe('Test Suite...', function () {
    this.timeout(50000)


    it('\n1. Create a Test User and Fetch this user', function (done) {
        let fname = "Test User 01";
        //Create a Test User
        test({
            uri: '/api/user',
            method: 'post',
            json: {
                "name": fname,
                "job": "leader"
            }
        }, function (err, res) {
            expect(res.body).to.have.property('job');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('name', fname);
            let userId = res.body.id;
            //Get the list of Test Users
            test({
                uri: '/api/users/2' //userId,
            }, function (err, res) {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('data');
                expect(res.body.data).to.have.property('id', 2);
                expect(res.body.data).to.have.property('email');
                // Add required assertion here
                done()
            })
        });
    })


});