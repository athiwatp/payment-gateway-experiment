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
    layout: true,
    path: Path.join(__dirname, 'templates'),
    layoutPath: Path.join(__dirname, 'templates/layout'),
    partialsPath: Path.join(__dirname, 'templates/partials')
});


server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
       reply.view('index');
    }
});

server.route({
    method: 'POST',
    path:'/pay', 
    handler: function (request, reply) {
        // form validation?
        // save to db?
        console.log(request);
        reply.view()
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
