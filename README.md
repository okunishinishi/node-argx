argx
=====

Parse function arguments. Useful to implement variadic functions.

<!-- Badge start -->

[![Build Status][my_travis_badge_url]][my_travis_url]
[![Code Climate][my_codeclimate_badge_url]][my_codeclimate_url]
[![Code Coverage][my_codeclimate_coverage_badge_url]][my_codeclimate_url]
[![npm version][my_npm_budge_url]][my_npm_url]

Usage
-----

Pass the `arguments` object to `.argx()` inside your function.

```javascript
/**
 * This an example to declare an variadic functions.
 */

var argx = require('argx');

function doSomething(values, options, callback) {
    var args = argx(arguments);
    callback = args.pop('function') || function noop(){}; // Consume last argument if it's a function. 
    options = args.pop('object') || {}; // Consume last argument if it's an object. 
    values = args.remain(); // Get remaining arguments as array.
    /*...*/
}

doSomething('foo', 'bar');
doSomething('foo', 'bar', {verbose:true});
doSomething('foo', 'bar', function(err){});
doSomething('foo', 'bar', {verbose:true}, function(err){});

```


Installation
-----

```bash
npm install argx --save
```

API Guide
-----

API guide for Argx instance, which is returned by `argx(arguments)`.

| Signature | Description |
| ----- | ----- | 
| .pop() | Pop an argument value from last. |
| .pop(2) | Pop multiple values from last. Orders are preserved. |
| .pop('function') | Pop only if the last value conform the type. |
| .pop(3, 'function') | Pop values while conforming the type. |
| .shift() | Shift an argument value from top. |
| .shift(2) | Shift multiple values from top. |
| .shift('function') | Shift only if the top value conform the type. |
| .shift(3, 'function') | Shift values while conforming the type. |
| .remain() | Shift all remained values. Always returns an array. |

Note that `.pop()`/`.shift()` methods returns values as array only if multiple hits.
If you want to make sure to keep values as array, use `[].concat()`.

```javascript
var args = argx(arguments);
var values = [].concat(args.pop(2, 'string') || []); // Always array.
```


License
-------
This software is released under the [MIT License][my_license_url].



<!-- Links start -->

[nodejs_url]: http://nodejs.org/
[npm_url]: https://www.npmjs.com/
[nvm_url]: https://github.com/creationix/nvm
[bitdeli_url]: https://bitdeli.com/free
[my_bitdeli_badge_url]: https://d2weczhvl823v0.cloudfront.net/okunishinishi/node-argx/trend.png
[my_repo_url]: https://github.com/okunishinishi/node-argx
[my_travis_url]: http://travis-ci.org/okunishinishi/node-argx
[my_travis_badge_url]: http://img.shields.io/travis/okunishinishi/node-argx.svg?style=flat
[my_license_url]: https://github.com/okunishinishi/node-argx/blob/master/LICENSE
[my_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-argx
[my_codeclimate_badge_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-argx.svg?style=flat
[my_codeclimate_coverage_badge_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-argx.svg?style=flat
[my_apiguide_url]: http://okunishinishi.github.io/node-argx/apiguide
[my_lib_apiguide_url]: http://okunishinishi.github.io/node-argx/apiguide/module-argx_lib.html
[my_coverage_url]: http://okunishinishi.github.io/node-argx/coverage/lcov-report
[my_coverage_report_url]: http://okunishinishi.github.io/node-argx/coverage/lcov-report/
[my_gratipay_url]: https://gratipay.com/okunishinishi/
[my_gratipay_budge_url]: http://img.shields.io/gratipay/okunishinishi.svg?style=flat
[my_npm_url]: http://www.npmjs.org/package/argx
[my_npm_budge_url]: http://img.shields.io/npm/v/argx.svg?style=flat
[my_tag_url]: http://github.com/okunishinishi/node-argx/releases/tag/
[my_tag_badge_url]: http://img.shields.io/github/tag/okunishinishi/node-argx.svg?style=flat

<!-- Links end -->
