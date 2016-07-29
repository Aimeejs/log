Log
---

### Install
```sh
aimee i log --save
```

### Usage
```js
var L = require('log');
var l = new L('app.js');

l.line(45).log('jquery.min.js', 'is load') // => [18:01:38]linco.js:45 jquery.min.js is load
```
