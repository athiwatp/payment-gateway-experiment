var Joi = require('joi');
var Pay = require('../lib/pay');
var CardIssuer = require('../lib/card_issuer');

var PAYPAL = 'paypal';
var BRAINTREE = 'braintree';

function getGateway(cardType, currency) {
    if (cardType == CardIssuer.Issuers.AMEX && currency != 'USD') {
        throw new Error("AMEX card can be used only for USD");
    }

    if ( cardType == CardIssuer.Issuers.AMEX ||
         currency == 'USD' ||
         currency == 'EUR' ||
         currency == 'AUD' 
    ) {
        return PAYPAL;
    } 

    return BRAINTREE;
}

function renderError(reply, errorObj, errorKeys, payload) {
    reply.view(
        'index',
        { 'error': errorObj, 'error_keys': errorKeys, 'payload': payload }
    );
}

exports.register = function(server) {
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
    server.route({
        method: 'POST',
        path:'/pay', 
        handler: function (request, reply) {
            var payload = request.payload;
            var price = payload.price;
            var currency = payload.currency.toUpperCase();
            var payerFullname = payload.fullname;

            var cardHolderFirstname = payload.card_holder_firstname;
            var cardHolderLastname = payload.card_holder_firstname;

            try {
                var cardType = CardIssuer.getIssuer(payload.card_number);
                var creditCardInfo = {
                    "number"       :   payload.card_number,
                    "type"         :   cardType,
                    "expireMonth"  :   payload.card_expire_month,
                    "expireYear"   :   payload.card_expire_year,
                    "cvv"          :   payload.card_cvv,
                    "firstName"    :   cardHolderFirstname,
                    "lastName"     :   cardHolderLastname
                };

                var gatewayName = getGateway(cardType, currency);

                Pay.pay(gatewayName, price, currency, creditCardInfo, function(error, res) {
                    if (error) {
                        renderError(
                            reply, 
                            { 'global' : 
                                error.response.message 
                                || "An unknown error has occurred at payment gateway : " + gatewayName
                            }, 
                            ['global'],
                            payload
                        )
                    } else {
                        reply.redirect('/paid');
                    }
                });


            } catch(error) {
                renderError(
                    reply, 
                    { 'global' : error.message }, 
                    ['global', 'card_number'],
                    payload
                )
            }


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
                    reply.view(
                        'index',
                        { 'error': errorObj, 'error_keys': errorKeys, 'payload': error.data._object }
                    );

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
            }
        }
    });

};
