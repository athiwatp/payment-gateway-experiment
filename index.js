var Hapi = require('hapi');


var Server = new Hapi.Server();
var Views = require('./server/views');
var Routes = require('./server/routes');

Server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});

Views.register(Server);
Routes.register(Server);

Server.start();
