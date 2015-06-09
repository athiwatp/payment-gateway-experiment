var Loki = require('lokijs');
var db = new Loki('payments.json'); 

var Payment = db.getCollection('payment');
if (!Payment) {
    Payment = db.addCollection('payment');
}

exports.savePayment = function( orderData, gatewayRes ){
    var newPayment = Payment.insert({
        'fullname': orderData.fullname,
        'price': orderData.price,
        'currency': orderData.currency,
        'gatewayResponse' : gatewayRes
    });
    db.save();
    return newPayment;
};

