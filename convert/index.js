'use strict';

var os = require('os');
var through2 = require('through2');
var readable = require('stream').Readable;

function convertToUnicode(opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();

  opts.lineEnding= opts.lineEnding || os.EOL; /*'\r\n';*/

  function processFile(file, encoding, callback) {
    var fileContent = file.contents;
    var buffer = fileContent.toString();
    var lines = buffer.split(opts.lineEnding);

    var fileString = '';
    for (var i = 0; i < lines.length; i++) {
      var properties = lines[i].split('=');
      if (properties[1]) {
        fileString += properties[0] + '=' + toUnicode(properties[1]) + opts.lineEnding;
      } else {
        fileString += properties[0] + opts.lineEnding;
      }
    };

    //var readableStream = new readable;
    //readableStream.push(fileString);
    //readableStream.push(null);
    //file.contents = readableStream;
    file.contents = new Buffer(fileString);
    callback(null, file);
  }

  function toUnicode(text) {
    var unicodeText = '';
    for (var i = 0; i < text.length; i++) {
      var unicodeChar = text.charCodeAt(i).toString(16).toUpperCase();
      while (unicodeChar.length < 4) {
        unicodeChar = '0' + unicodeChar;
      }
      unicodeChar = '\\u' + unicodeChar;
      unicodeText += unicodeChar;
    }
    return unicodeText;
  }

  var stream = through2.obj(processFile);
  stream.resume();
  return stream;
}

module.exports = convertToUnicode;