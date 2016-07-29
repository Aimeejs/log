var L = require('log');
var l = new L('test.js');

l.line(40).log('test', 'done.')
l.line(45).log('jquery.min.js', 'is load')
l.line(47).error('id is not defined')
