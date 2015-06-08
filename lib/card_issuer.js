// ref: http://www.freeformatter.com/credit-card-number-generator-validator.html#cardFormats
var AMEX = "amex";
var VISA = "visa";
var MASTERCARD = "mastercard";
var DISCOVER = "discover";

function first(number, digits) {
    return parseInt(number.substr(0,digits), 10);
}


exports.Issuers = {
    'AMEX'          : AMEX,
    'VISA'          : VISA,
    'MASTERCARD'    : MASTERCARD,
    'DISCOVER'      : DISCOVER
};

exports.getIssuer = function(number) {
    var numLength           = number.length;
    var firstDigit          = first(number, 1);
    var firstTwoDigits      = first(number, 2);
    var firstThreeDigits    = first(number, 3);
    var firstFourDigits     = first(number, 4);
    var firstSixDigits      = first(number, 6);

    if (numLength == 15 && ( firstTwoDigits == 34 || firstTwoDigits == 37 )) {
        return AMEX;
    }

    if (numLength >= 13 && numLength <= 16 && firstDigit == 4) {
        return VISA;
    }

    if (
        numLength >= 16 && numLength <= 19 && 
        firstTwoDigits >= 51 && firstTwoDigits <= 55
    ) {
        return MASTERCARD;
    }

    if (
        numLength == 16 && (
            firstTwoDigits == 65 ||
            ( firstThreeDigits >=  644 && firstThreeDigits <= 649 ) ||
            firstFourDigits == 6011 ||
            ( firstSixDigits >=  622126 && firstSixDigits <= 622925 )
        )
    ) {
        return DISCOVER;
    }

    throw new Error("We don't support this card number");
}
