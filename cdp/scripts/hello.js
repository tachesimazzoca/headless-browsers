const commandLineArgs = require('command-line-args');
const CDP = require('chrome-remote-interface');

const optionDefinitions = [
  { name: 'host', alias: 'h', type: String, defaultValue: 'localhost' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 9222 }
];

const options = commandLineArgs(optionDefinitions);

CDP(options, (client) => {
  const { Runtime } = client;

  Promise.all([
    Runtime.enable()
  ]).then(() => {
    return Runtime.evaluate({
      expression: 'var f = function(a, b) { return a + b; }; f(1, 2);'
    });

  }).then((res) => {
    console.log(res.result);
    client.close();

  }).catch((err) => {
    console.error(err);
    client.close();
  });

}).on('error', (err) => {
  console.error(err);
});
