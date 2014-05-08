var Conversion = require('../conversion');
var Loader = require('../loader');
var Base64 = Loader('base64');
var Ascii = Loader('ascii');

module.exports = new Conversion(Base64, Ascii, convert);

function convert(base64str, callback) {
  callback((new Buffer(base64str, 'base64')).toString('ascii'));
}