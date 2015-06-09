var Code = require('code');   // assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var CardIssuer = require('../lib/card_issuer');

function validate(cards, issuer, done) {
    for( var i = 0; i < cards.length; i++ ) {
        Code.expect(CardIssuer.getIssuer(cards[i])).to.equal(issuer);
    }
    done();
}

lab.test(
    'returns amex if card number length is 15 and startswith 34 or 37',
    function (done) {
        validate(
            ["377146748058415", "346517170606590"], 
            CardIssuer.Issuers.AMEX,
            done
        );
    }
);

lab.test(
    'returns visa if card number length is from 13 to 16 and startswith 4',
    function (done) {
        validate(
            ["4024007140828632"], 
            CardIssuer.Issuers.VISA,
            done
        );
    }
);

lab.test(
    'returns mastercard if card number length is from 16 to 19 and first two digits are from 51 to 55',
    function (done) {
        validate(
            ["5330259676200175", "5237045393184212", "5516330071322009"], 
            CardIssuer.Issuers.MASTERCARD,
            done
        );
    }
);

lab.test(
    'returns discover if card number length is 16 and starts with 6011, 622126 to 622925, 644, 645, 646, 647, 648, 649, 65',
    function (done) {
        validate(
            ["6011845975890148", "6011152992257033"], 
            CardIssuer.Issuers.DISCOVER,
            done
        );
    }
);

lab.test(
    'throw error when card issuer is not one of these; amex, visa, mastercard, discover',
    function(done) {
        var cards = ["6304303606278354", "3158433946669808", "6763450356413840"];
        for( var i = 0; i < cards.length; i++ ) {
            try {
                CardIssuer.getIssuer(cards[i])
            } catch(error) {
                Code.expect(error).to.be.an.instanceof(Error);
                Code.expect(error.message).to.equal("We don't support this card number");
            }
        }
        done();
    }
);
