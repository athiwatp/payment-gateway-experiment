var Hapi = require('hapi');
var Joi = require('joi');
var Path = require('path');
var PayModule = require('./lib/pay');

var server = new Hapi.Server();
server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});


server.views({
    engines: {
        html: require('swig')
    },
    path: Path.join(__dirname, 'templates')
});

// landing page
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
       reply.view('index');
    }
});

// show after paying successfully
server.route({
    method: 'GET',
    path:'/paid', 
    handler: function (request, reply) {
        reply.view('pay_success')
    }
});

// submit payment
/*
example card info
var creditCardInfo = {
    "number"       :   '4032032506316469',
    "type"         :   'visa',
    "expireMonth"  :   '06',
    "expireYear"   :   '2020',
    "cvv"          :   '123',
    "firstName"    :   'Keerati',
    "lastName"     :   'Thiwanruk'
};

var creditCardInfo = {
    "number"       :   '5555555555554444',
    "type"         :   'mastercard',
    "expireMonth"  :   '06',
    "expireYear"   :   '2020',
    "cvv"          :   '123',
    "firstName"    :   'Keerati',
    "lastName"     :   'Thiwanruk'
};
*/

server.route({
    method: 'POST',
    path:'/pay', 
    handler: function (request, reply) {
        console.log(request);
        var payload = request.payload;
        var gatewayName = 'paypal';
        var price = payload.price;
        var currency = payload.currency.toUpperCase();
        var payerFullname = payload.fullname;

        var cardHolderFirstname = payload.card_holder_firstname;
        var cardHolderLastname = payload.card_holder_firstname;
        var creditCardInfo = {
            "number"       :   payload.card_number,
            "type"         :   payload.card_holder_name,
            "expireMonth"  :   payload.card_expire_month,
            "expireYear"   :   payload.card_expire_year,
            "cvv"          :   payload.card_cvv,
            "firstName"    :   cardHolderFirstname,
            "lastName"     :   cardHolderLastname
        };

        PayModule.pay(gatewayName, '10.00', 'USD', creditCardInfo, function(error, res) {
            console.log(error);
            console.log('===============');
            console.log(res);
            reply.redirect('/paid');
        });
    },
    config: {
        validate: {
            failAction: function(request, reply, source, error) {
                var details = error.data.details;
                var errorObj = {};
                var errorKeys = [];
                for(var i = 0; i < details.length; i++) {
                    var detail = details[i];
                    var key = detail.context.key;
                    errorObj[key] = detail.message; 
                    errorKeys.push(key);
                }
                reply.view('index', { 'error': errorObj, 'error_keys': errorKeys, 'payload': error.data._object });
            },
            options: {
                convert: true,
                abortEarly: false
            },
            payload: {
                price: Joi.number().required(), 
                currency: Joi.string().required(), 
                fullname: Joi.string().trim().required(), 
                card_holder_firstname: Joi.string().required().trim(), 
                card_holder_lastname: Joi.string().required().trim(), 
                card_number: Joi.string().required().creditCard(),
                card_expire_month: Joi.number().required().min(1).max(12),
                card_expire_year: Joi.number().required(),
                card_cvv: Joi.number().required()
            }
        }
    }
});



// serve static file
server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'jam'
            //,listing: true
        }
    }
});

server.start();
