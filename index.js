const five = require('johnny-five');
const Raspi = require('raspi-io');
const Hapi = require('hapi');

const server = new Hapi.Server();
const board = new five.Board({
  io: new Raspi(),
  repl: false
});

let pin = 'P1-12';
let step = 2000;

server.connection({ port: process.env.PI_LIGHT_HTTP_PORT });

board.on('ready', function () {
  let torch = new five.Led(pin);

  server.route({
    method: 'POST',
    path: '/light/{command}',
    handler: function (request, reply) {
      if (request.params.command) {
        var now = new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
        console.log(`[${now}] Request: ${request.params.command.toUpperCase()}`);
      }
      if (request.params.command === 'on') {
        torch.pulse(step);
        reply(`Light ${request.params.command.toUpperCase()}`);
      }
      if (request.params.command === 'off') {
        torch.stop().off();
        reply(`Light ${request.params.command.toUpperCase()}`);
      }
      if (request.params.command !== 'on' && request.params.command !== 'off') {
        reply('Form your request properly!');
      }
    }
  });

  this.on('exit', function () { torch.off(); });
});

server.start((err) => {
  if (err) { throw err; }
  console.log(`Server running at: ${server.info.uri}`);
});
