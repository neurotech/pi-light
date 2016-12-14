const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.PI_LIGHT_HTTP_PORT });

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
