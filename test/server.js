var Code = require('code');
var Lab = require('lab');
var Cheerio = require('cheerio');
var Proxyquire = require('proxyquire');
var lab = exports.lab = Lab.script();

lab.experiment("Server", function() {

    function expectErrorText($, inputIds, errorText) {
        for( var i = 0; i < inputIds; i++ ) {
            Code.expect( $(inputIds[i]).next().text() ).to.contain(errorText);
        }
    }

    function expectGETOk(server, endpoint, done) {
        server.inject({method: 'GET', url: endpoint}, function(res) {
            Code.expect(res.statusCode).to.equal(200);
            done();
        });

    }

    function expectPOSTErrorText(server, endpoint, payload, errorText, done) {
        server.inject({
            'method': 'POST', 
            'url': endpoint,
            'payload': payload 
        }, function(res) {
            Code.expect(res.statusCode).to.equal(200);
            $ = Cheerio.load(res.result);           
            Code.expect( $('.panel-body').text().trim() ).to.equal(errorText);

            done();
        });

    }

    function successPay(gatewayName, price, currency, creditCardInfo, callbackFunc) {
        callbackFunc(null, {});
    };

    function failPay(gatewayName, price, currency, creditCardInfo, callbackFunc) {
        callbackFunc({ 'response' : {'message': 'Intentional error'}}, {});
    };

    function failPayNoMessage(gatewayName, price, currency, creditCardInfo, callbackFunc) {
        callbackFunc({ 'response' : {}}, {});
    };

    var payStub = {};
    var stubs = {
        '../server/models/payment': {
            'savePayment' : function(orderData, gatewayRes) {
                return {};
            }
        },
        '../lib/pay' : payStub, 
        '@global': true 
    };


    var Routes = Proxyquire('../server/routes', stubs );
    var Server = require('../server/server');

    lab.test("return landing page successfully", function(done) {
        expectGETOk(Server, '/' , done)
    });

    lab.test("return paid page successfully", function(done) {
        expectGETOk(Server, '/paid' , done)
    });


    lab.test("return valiation error if all fields' value are blank", function(done) {
        Server.inject({
            method: 'POST', 
            url: '/pay',
            payload: {
                price: "",
                currency: "",
                fullname: "",
                card_holder_firstname: "",
                card_holder_lastname: "",
                card_number: "",
                card_cvv: "",
                card_expire_month: "",
                card_expire_year: ""
            }
        }, function(res) {
            Code.expect(res.statusCode).to.equal(200);
            $ = Cheerio.load(res.result);           

            Code.expect( $('.panel-heading').text().trim() ).to.equal("Error");
            Code.expect( $('.panel-body').text().trim() ).to.equal("There are some errors. Please see below.");

            expectErrorText(["#price", "#card_cvv", "#card_expire_month", "#card_expire_year"], "must be a number");
            expectErrorText(["#fullname", "#card_holder_firstname", "#card_holder_lastname"], "is not allowed to be empty");
            expectErrorText(["#card_number"], "must be a credit card");

            done();
        });
    });

    lab.test("return error if use AMEX with currencies that are not USD", function(done) {
        payStub.pay = failPayNoMessage;
        var payload = {
            price: "1",
            currency: "HKD",
            fullname: "Keerati Thiwanruk",
            card_holder_firstname: "Keerati",
            card_holder_lastname: "Thiwanruk",
            card_number: "378282246310005",
            card_cvv: "123",
            card_expire_month: "06",
            card_expire_year: "2020"
        };

        expectPOSTErrorText(Server, '/pay', payload, 'AMEX card can be used only for USD', done);
    });


    lab.test("return error message from request from third party", function(done) {
        payStub.pay = failPay;
        var payload = {
            price: "1",
            currency: "USD",
            fullname: "Keerati Thiwanruk",
            card_holder_firstname: "Keerati",
            card_holder_lastname: "Thiwanruk",
            card_number: "378282246310005",
            card_cvv: "123",
            card_expire_month: "06",
            card_expire_year: "2020"
        };

        expectPOSTErrorText(Server, '/pay', payload, 'Intentional error', done);
    });

    lab.test("return error at paypal if no error message", function(done) {
        payStub.pay = failPayNoMessage;
        var payload = {
            price: "1",
            currency: "USD",
            fullname: "Keerati Thiwanruk",
            card_holder_firstname: "Keerati",
            card_holder_lastname: "Thiwanruk",
            card_number: "378282246310005",
            card_cvv: "123",
            card_expire_month: "06",
            card_expire_year: "2020"
        };

        expectPOSTErrorText(Server, '/pay', payload, 'An unknown error has occurred at payment gateway : paypal', done);
    });

    lab.test("return error at braintree if no error message", function(done) {
        payStub.pay = failPayNoMessage;
        var payload = {
            price: "1",
            currency: "HKD",
            fullname: "Keerati Thiwanruk",
            card_holder_firstname: "Keerati",
            card_holder_lastname: "Thiwanruk",
            card_number: "4111111111111111",
            card_cvv: "123",
            card_expire_month: "06",
            card_expire_year: "2020"
        };

        expectPOSTErrorText(Server, '/pay', payload, 'An unknown error has occurred at payment gateway : braintree', done);
    });


});

