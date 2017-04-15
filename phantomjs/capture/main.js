var system = require('system');
var page = require('webpage').create();
var headers = [];
var each = function(xs, f) {
  var i = 0;
  for (i = 0; i < xs.length; i++) {
    f(xs[i]);
  }
}

if (system.args.length !== 3) {
  console.log('Usage: phantomjs ' + system.args[0] + ' <url> <file.(png|jpg|pdf)>');
  phantom.exit();
}

var loc = system.args[1];
var path = system.args[2];
page.open(loc, function(status) {
  page.render(path);
  phantom.exit();
});
