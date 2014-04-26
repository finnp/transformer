#!/usr/bin/env node

var rw = require('rw');
var S = require('string');
var _ = require('underscore');
var transformer = require('./');
var argv = require('minimist')(process.argv.slice(2));

var log = console.log;

function usage() {
  var n = process.argv[1];
  log('Usage: ' + n + ' <in-type-id> <out-type-id> < <in-file> > <out-file>');
};

function print_src(id) {
  var m = transformer.load(argv.src);
  log(m.src);
}

function convert(in_id, out_id  ){
  if (!(in_id && out_id)) {
    usage();
    process.exit(-1);
  }

  var in2out = transformer(in_id, out_id);

  // for now use rw module with Sync. TODO: streams.
  var input = rw.readSync('/dev/stdin', 'utf8');
  var output = in2out(input);
  rw.writeSync('/dev/stdout', '' + output, 'utf8');
}

function handle_requires_modules_error(modules) {
  tmpl = _.template("Error: transformer needs the following npm modules to perform this conversion:\n\
<% _.each(modules, function(m) { %>\n\
  - <%= m %>\n\
<% }); %>\n\
To install them, run:\n\
\n\
  # in this directory\n\
  npm install <%= modules.join(' ') %>\n\
\n\
  # globally (you may need to sudo)\n\
  npm install -g <%= modules.join(' ') %>\n\
\n\
Or, if you want transformer to automatically install dependencies for you,\n\
use the --install-deps flag:\n\
\n\
  transform --install-deps ...\n\
  transform --install-deps-global ...\n\
");

  log(tmpl({ modules: modules }));
  process.exit(-1);
}


function main() {

  if (argv.src) { // is it print src?
    print_src(argv.src);
  }
  else { // seems to be a conversion
    convert(argv._[0], argv._[1]);
  }
}


// run main.
try {
  main();
} catch (e) {
  if (e.code == 'MODULE_NOT_FOUND') {
    var s = e.toString();
    var s = s.substr(s.search("'")).replace(/'/g, '');
    handle_requires_modules_error([s]);
  } else {
    throw e;
  }
}
