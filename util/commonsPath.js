var fs = require('fs'),
    commonsMask = './commons';

if (!fs.existsSync('./commons/gulpfile.js')) {
    commonsMask = '.' + commonsMask;
}

module.exports = commonsMask;