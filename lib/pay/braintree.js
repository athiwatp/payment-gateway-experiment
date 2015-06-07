exports.pay = function(config, price, currency, creditCardInfo, callbackFunc) {
    //TODO: change merchant based on currency
    var Braintree = require('braintree');
    var gateway = Braintree.connect(config);

    gateway.transaction.sale({
        'amount': price,
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
