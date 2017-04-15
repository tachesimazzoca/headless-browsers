var system = require('system');
var page = require('webpage').create();
var headers = [];
var each = function(xs, f) {
  var i = 0;
  for (i = 0; i < xs.length; i++) {
    f(xs[i]);
  }
}

if (system.args.length !== 2) {
  console.log('Usage: phantomjs ' + system.args[0] + ' <url>');
  phantom.exit();
}

var loc = system.args[1];
page.open(loc, function(status) {
  console.log('page.open ... ' + status);
  console.log('');
  var elems = page.evaluate(function() {
    return {
      title: window.document.title,
      h1: window.document.getElementsByTagName('h1')
    };
  });
  console.log('title: ' + elems.title);
  console.log('h1:');
  each(elems.h1, function(x) {
    console.log('  - ' + x.textContent);
  });
  phantom.exit();
});

page.onResourceReceived = function(response) {
  if (response.stage === 'end') {
    console.log('[id:' + response.id + '] (' + response.status + ' ' +
        response.statusText + ') ' + response.url);
    each(response.headers, function(header) {
      console.log(header.name + ': ' + header.value);
    });
    console.log('');
  }
}
