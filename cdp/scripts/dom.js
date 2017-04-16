const commandLineArgs = require('command-line-args');
const CDP = require('chrome-remote-interface');

const optionDefinitions = [
  { name: 'host', alias: 'h', type: String, defaultValue: 'localhost' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 9222 }
];

var options = commandLineArgs(optionDefinitions, { partial: true } );
var argv = options._unknown;

if (argv.length !== 2) {
  console.log('Usage: node dom.js --host <localhost> --port <9222> <target> <master-password>');
  console.log('(See https://github.com/tachesimazzoca/crx-pwgen)');
  process.exit();
}

var target = argv[0];
var masterPassword = argv[1];

CDP(options, (client) => {
  const { Runtime, Page, DOM } = client;

  Page.loadEventFired(() => {
    DOM.getDocument().then((doc) => {
      Promise.all([
        DOM.querySelector({
          nodeId: doc.root.nodeId,
          selector: '#jsTargetInput'
        }),
        DOM.querySelector({
          nodeId: doc.root.nodeId,
          selector: '#jsMasterPasswordInput'
        })
      ]).then((elems) => {
        DOM.setAttributeValue({
          nodeId: elems[0].nodeId,
          name: 'value',
          value: target
        });
        DOM.setAttributeValue({
          nodeId: elems[1].nodeId,
          name: 'value',
          value: masterPassword
        });
        return Runtime.evaluate({
          expression: "document.querySelector('#jsGenerateButton').click();" +
              "document.querySelector('#jsGeneratedPasswordInput').value;"
  
        });
      }).then((res) => {
        console.log(res.result.value);
        client.close();
      });
    });
  });

  Promise.all([
    Runtime.enable(),
    Page.enable(),
    DOM.enable()
  ]).then(() => {

    Page.navigate({
      url: 'https://tachesimazzoca.github.io/crx-pwgen/popup.html'
    });

  }).catch((err) => {
    console.error(err);
    client.close();
  });

}).on('error', (err) => {
  console.error(err);
});
