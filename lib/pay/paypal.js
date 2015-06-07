var Paypal = null;

exports.pay = function(config, price, currency, creditCardInfo, callbackFunc) {

    if (!Paypal) {
        Paypal = require('paypal-rest-sdk');
        Paypal.configure(config);
    }

    var request = {
        "intent"    :   "sale",
        "payer"     :   {
            "payment_method":"credit_card",
            "funding_instruments":[{
                "credit_card":{
                    "number"        :   creditCardInfo["number"],
                    "type"          :   creditCardInfo["type"],
                    "expire_month"  :   creditCardInfo["expireMonth"],
                    "expire_year"   :   creditCardInfo["expireYear"],
                    "cvv2"          :   creditCardInfo["cvv"],
                    "first_name"    :   creditCardInfo["firstName"],
                    "last_name"     :   creditCardInfo["lastName"]
                }
            }]
        },
        "transactions" : [{
            "amount" : {
                "total": price,
                "currency":currency
            },
            "description"   :   "This is a kind donation from someone on earth."
        }]
    };
    Paypal.payment.create(request, function (err, result) {
        callbackFunc(err, result);
    });

};
