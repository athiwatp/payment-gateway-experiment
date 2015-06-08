var Braintree = require('braintree');

module.exports = {
    'paypal': {
        'mode' : 'sandbox',
        'client_id': 'ARuqjG3fQHbcNB60Z3kXec6jIGDF6i4OsIHL8Gac6cRWgR7Kmzaeu0M3Fthc5oMrkFX07GAxV0vuhVcz',
        'client_secret': 'EO9ZpSGGp43hSEXXsRPY87BvM9h_w8vlMJacJQieDHIkjgR5i9-8ivbiH8UPSlmx57hXgsAU339cNzls'
    },
    'braintree': {
        'connection' : {
            'environment': Braintree.Environment.Sandbox,
            'merchantId': "6xnjrt366fd2vwh9",
            'publicKey': "hdzrj9965dvynwwr",
            'privateKey': "c8fcd0d66cb79d80b6f5bb124f4c5720"
        },
        'merchants' : {
            'HKD' : 'merchant_hkd',
            'THB' : 'merchant_thb',
            'SGD' : 'merchant_sgd'
        }
    }
};
