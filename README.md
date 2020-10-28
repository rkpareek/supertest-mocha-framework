# supertest-mocha-framework

## About
`supertest-mocha-framework` is a open source api testing framework built on mocha and supertest to make the api testing simple, easy and fun. We continuously working on framework to provide to a seamless experice by adding more and more commandline options and features.

### Changelog:
-   All notable changes can be found  [here](CHANGELOG.md)

## Getting Started

### Usage
- Run `npm i --save supertestmocha`
- `mocha` and `supertest` are peer dependencies, you can install explicitly.

### Configure
- Create a confuguration object containing BaseUrl of your apis endpoints or application
````
var  config = {
	"baseUrl": "https://reqres.in",
	"debug": true | false
}
````
  
- Require the `supertestmocha` in your test file or global config file
````
var  supermocha = require('supertestmocha')
var  test = new  supermocha(config);
````
### Creating Test Cases
- Use the `test` object to create test cases
- Pass the `options` object to test object
- Response can be handled in `Callback` function
````
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
            expect(res.body).to.have.property('job', 'Quality Check')
            done();
        })
    });
});
````
#### Params
````
	test({options}, cb);
````
-  _@param {object} options - an object that hold the `uri`, `method`, `json`, `content-type` etc.._
-   _@param {function} cb- callback function to handle response_

### Running Tests
- Use `mocha` as runner: `mocha example\use.js -[options]`

#### Command Options
- `-d` | `--debug` to debug the api, it will log the api request and reponse
- `-p` | `--parallel` use to run the test cases in parallel
- `-l` | `--logs` save the logs in .log file