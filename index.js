'use strict';

var os = require('os');
var through2 = require('through2');
var apiKey = '';
var googleTranslate = require('google-translate')(apiKey);
var readable = require('stream').Readable;
var _ = require('underscore')._;

function translateLanguage(opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();
  
  if(!opts.APIKey){
  
    return;
  }
  opts.translateFrom = opts.translateFrom || 'en';
  if(!opts.translateTo){
  
    return;
  }
  opts.lineEnding= opts.lineEnding || os.EOL; /*'\r\n';*/


  function translateFile(file, encoding, callback) {
    var fileContent = file.contents;
    var buffer = fileContent.toString();
    var lines = buffer.split(opts.lineEnding);

    var lineList = [];
    var lineProccessedList = [];
    for (var i = 0; i < lines.length; i++) {
      var splitArray = lines[i].split('=');
      lineList.push({ lineKey: splitArray[0], lineText: splitArray[1] });
      lineProccessedList.push(splitArray[1]);
    };

    if (lineList.length > 0 && lineProccessedList.length > 0) {
      googleTranslate.translate(lineProccessedList, opts.translateFrom, opts.translateTo, function (err, translation) {
        if (err) {
          console.log(err);
          callback(null, file);
        }

        for (var i = 0; i < translation.length; i++) {
          var index = _.findIndex(lineList, { lineText: translation[i].originalText });
          if (index > -1) {
            lineList[index].lineText = translation[i].translatedText;
          }
        };

        var fileString = '';
        for (var i = 0; i < lineList.length; i++) {
          if (lineList[i].lineText) {
            fileString += lineList[i].lineKey + '=' + toUnicode(lineList[i].lineText) + opts.lineEnding;
          } else {
            fileString += lineList[i].lineKey + opts.lineEnding;
          }
        };

        var readableStream = new readable;
        readableStream.push(fileString);
        readableStream.push(null);
        file.contents = readableStream;
        callback(null, file);
      });
    } else {
      callback(null, file);
    }
  }

  var stream = through2.obj(translateFile);
  stream.resume();
  return stream;
}

module.exports = translateLanguage;