const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PI_LIGHT_HTTP_PORT });

server.route({
  method: 'POST',
  path: '/light',
  handler: function (request, reply) {
    console.log('Light called!');
    reply('Hello!');
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
