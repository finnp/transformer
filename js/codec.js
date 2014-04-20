var _ = require('underscore');
var Object = require(path.join(__dirname, 'object'));

module.exports = Codec

var codec_defaults = {
  '@context': 'http://transformer.io/context/transformer.jsonld',
  '@type': 'Codec',
}

function Codec(src, encode, decode) {
  if (src instanceof Codec)
    return src;

  if (!(this instanceof Codec))
    return new Codec(src, code, decode);

  src = Object(src, codec_defaults);

  this.src = src;
  this.encode = encode || identity;
  this.decode = decode || identity;
}

function identity(a) { return a; }
Codec.Identity = new Codec('transformer/identity-codec');
