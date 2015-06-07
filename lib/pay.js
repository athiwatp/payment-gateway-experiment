var Braintree = require('./pay/braintree');
var Paypal = require('./pay/paypal');
var GlobalConfig = require('./config');
var gateways = {
    'braintree': Braintree,
    'paypal': Paypal
};


exports.pay = function(gatewayName, price, currency, creditCardInfo, callbackFunc) {
    console.log('global config', GlobalConfig);
    var config = GlobalConfig[gatewayName];
    console.log('selected config', config);
    gateways[gatewayName].pay(config, price, currency, creditCardInfo, callbackFunc);
}
