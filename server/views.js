var Path = require('path');

exports.register = function(server) {
    server.views({
        engines: {
            html: require('swig')
        },
        path: Path.join(__dirname, 'templates')
    });
};
