var system = require('system');
var page = require('webpage').create();

if (system.args.length !== 3) {
  console.log('Usage: phantomjs ' + system.args[0] + ' <target> <master-password>');
  console.log('(See https://github.com/tachesimazzoca/crx-pwgen)');
  phantom.exit();
}

page.open('https://tachesimazzoca.github.io/crx-pwgen/popup.html', function() {
  page.includeJs("https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js", function() {
    var generatedPassword = page.evaluate(function(args) {
      var target = args[1];
      var masterPassword = args[2];
      $('#jsTargetInput').val(target);
      $('#jsMasterPasswordInput').val(masterPassword);
      $('#jsGenerateButton').click();
      return $('#jsGeneratedPasswordInput').val();
    }, system.args);
    console.log(generatedPassword);
    phantom.exit();
  });
});
