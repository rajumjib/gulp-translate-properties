'use strict';

var Stream = require('stream');
var Path = require('path');

function postfix(suffix) {

  var stream = new Stream.Transform({ objectMode: true });

  function parsePath(path) {
    var extname = Path.extname(path);
    return {
      dirname: Path.dirname(path),
      basename: Path.basename(path, extname),
      extname: extname
    };
  }

  stream._transform = function (originalFile, unused, callback) {

    var file = originalFile.clone({ contents: false });
    var parsedPath = parsePath(file.relative);
    var dirname = parsedPath.dirname,
      basename = parsedPath.basename,
      extname = parsedPath.extname;

    var path = Path.join(dirname, basename + suffix + extname);
    file.path = Path.join(file.base, path);

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }
    callback(null, file);
  };
  return stream;
}

module.exports = postfix;