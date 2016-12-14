const raspi = require('raspi-io');
const five = require('johnny-five');
const Hapi = require('hapi');

const server = new Hapi.Server();
const board = new five.Board({
  io: new raspi(),
  repl: false
});

let pin = 'P1-12';
let step = 2000;

server.connection({ port: process.env.PI_LIGHT_HTTP_PORT });

board.on('ready', function () {

});

board.on('ready', function () {
  let torch = new five.Led(pin);

  server.route({
    method: 'POST',
    path: '/light/{command}',
    handler: function (request, reply) {
      if (request.params.command === 'on') {
	torch.pulse(step);
        reply('Light ON');
      }
      if (request.params.command === 'off') {
        torch.off();
	reply('Light OFF');
      }
      reply('Form your request properly.');
    }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
  });

  this.on('exit', function () {
    torch.off();
  });
});
