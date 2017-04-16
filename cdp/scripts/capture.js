const commandLineArgs = require('command-line-args');
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const optionDefinitions = [
  { name: 'host', alias: 'h', type: String, defaultValue: 'localhost' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 9222 }
];

var options = commandLineArgs(optionDefinitions, { partial: true } );
var argv = options._unknown || [];

if (argv.length !== 2) {
  console.log('Usage: node capture.js --host <localhost> --port <9222> <location> <outfile>');
  process.exit();
}
var loc = argv[0];
var out = argv[1];

if (!out.match(/.png$/)) {
  console.log('The output ile format must be .png');
  process.exit();
}

CDP(options, (client) => {
  const { Page } = client;

  Page.loadEventFired(() => {
    Page.captureScreenshot({
      format: 'png'
    }).then((res) => {
      fs.writeFile(out, new Buffer(res.data, 'base64'), (err) => {
        if (err) {
          console.error(err);
        }
        client.close();
      });
    }).catch((err) => {
      console.error(err);
      client.close();
    });
  });

  Promise.all([
    Page.enable()
  ]).then(() => {

    Page.navigate({ url: loc });

  }).catch((err) => {
    console.error(err);
    client.close();
  });

}).on('error', (err) => {
  console.error(err);
});
