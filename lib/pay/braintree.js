exports.pay = function(config, price, currency, creditCardInfo, callbackFunc) {
    var Braintree = require('braintree');
    var gateway = Braintree.connect(config.connection);

    gateway.transaction.sale({
        'amount': price,
        'merchantAccountId': config.merchants[currency],
        'creditCard' : { 
            'number'            :   creditCardInfo["number"],
            'cardholderName'    :   creditCardInfo["firstName"] + creditCardInfo["lastName"],
            'cvv'               :   creditCardInfo["cvv"],
            'expirationMonth'   :   creditCardInfo["expireMonth"],
            'expirationYear'    :   creditCardInfo["expireYear"]
        }
    }, function (err, result) {
        callbackFunc(err, result);
    });
};
