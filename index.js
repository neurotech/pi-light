const five = require('johnny-five');
const Hapi = require('hapi');

const server = new Hapi.Server();
const board = new five.Board({ repl: false });

let pins = [6, 5, 3];

server.connection({ port: process.env.PI_LIGHT_HTTP_PORT });

board.on('ready', function () {
  var torch = new five.Led.RGB(pins);
  var rainbow = ['FF0000', 'FF7F00', 'FFFF00', '00FF00', '0000FF', '4B0082', '8F00FF'];

  server.route({
    method: 'POST',
    path: '/light/{command}',
    handler: function (request, reply) {
      if (request.params.command) {
        var now = new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
        console.log(`[${now}] Request: ${request.params.command.toUpperCase()}`);
      }
      if (request.params.command === 'on') {
        torch.color(rainbow[Math.floor(Math.random() * rainbow.length)]);
        reply(`Light ${request.params.command.toUpperCase()}`);
      }
      if (request.params.command === 'off') {
        torch.off();
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
