# gulp-translate-properties
Gulp plugin to translate java property(.properties) files for localization

Installation
----------

Install via [npm](http://npmjs.org/)

    npm install gulp-translate-properties --save


Usage overview
----------

Import the module and call it into gulp task
  
    var translateLanguage = require('gulp-translate-properties');
    
### Translate Properties Files

Extract one or more block of content from a file to multiple files.

    translateLanguage({APIKey: '',translateFrom: 'en',translateTo: 'bn'});

Options
    
* **APIKey**: Required.
* **translateFrom**: Required.
* **translateTo**: Required.
* **lineEnding**: Optional.

    
*Example*: Translate all Properties files 

    gulp.task('translateAllSamples', function () {
        'use strict';
        gulp.src(['lang/*.properties','lang/**/*.properties'])
            .pipe(translateLanguage({
                APIKey: '',
                translateFrom: 'en',
                translateTo: 'bn'
            }))
            .pipe(gulp.dest('dist'));
    });


# Sample

Check [sample code](https://github.com/rajumjib/samples-gulp).

# To Contribute

Please fork and send pull request, welcome!

# TODO List
* Add tests
* Changelog

# Author

Maintained by [Jahirul Islam Bhuiyan](http://www.online4help.com).