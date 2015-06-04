var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();
server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});

server.views({
    engines: {
        html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './templates'
});

server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
       reply.view('index');
    }
});

// serve static file
server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'jam'
            //,listing: true
        }
    }
});

server.start();
