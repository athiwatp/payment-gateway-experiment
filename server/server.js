var Hapi = require('hapi');

var Server = new Hapi.Server();
var Views = require('./views');
var Routes = require('./routes');

Server.connection({ 
    host: '0.0.0.0', 
    port: 8000 
});

Views.register(Server);
Routes.register(Server);

module.exports = Server;
