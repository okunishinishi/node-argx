/**
 * Parse function arguments. Useful to implement variadic functions.
 * @module argx
 * @version 1.1.7
 */

"use strict";

var Argx = require('./argx'),
    noop = require('./noop');

/**
 * Get value from arguments.
 * @param {Arguments} args - Argument passed to your function.
 * @returns {Argx} - Parser object.
 */
function argx(args) {
    return new Argx(args);
}

argx.noop = noop;


module.exports = argx;