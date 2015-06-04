var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
       reply('hello world');
    }
});

server.start();
