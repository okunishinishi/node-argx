(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.argx = require("../lib/index.js");
},{"../lib/index.js":3}],2:[function(require,module,exports){
/**
 * Parse arguments.
 * @constructor Argx
 * @param {Arguments} args - Function arguments
 */

"use strict";

var typeHits = require('./type/type_hits'),
    isNumber = require('./type/is_number');

/** @lends constructor */
function Argx(args) {
    var s = this;
    s.values = Array.prototype.slice.call(args, 0);
}

Argx.prototype = {
    /**
     * Splice argument values.
     * @param {number} start - Where to start
     * @param {number} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction.
     */
    splice: function (start, howmany, type) {
        var s = this;

        if (typeof(arguments[1]) !== 'number') {
            if (isNumber(arguments[1])) {
                howmany = Number(arguments[1]);
            } else {
                type = arguments[1];
                howmany = 1;
            }
        }
        howmany = howmany || 1;
        if (start < 0) {
            start += s.values.length;
        }
        var result, hitCount = 0;
        for (var i = start + howmany - 1; i >= start; i--) {
            var skipByType = type && !typeHits(s.values[i], type);
            if (skipByType) {
                break;
            }
            var spliced = s.values.splice(i, 1);
            if (!spliced.length) {
                break;
            }
            spliced = spliced[0];
            switch (hitCount) {
                case 0:
                    result = spliced;
                    break;
                case 1:
                    result = [spliced, result];
                    break;
                default:
                    result.unshift(spliced);
                    break;
            }
            hitCount += 1;
        }
        return result;
    },
    /**
     * Pop values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string|function} [type] - Type restriction. Could be a name of type or a constructor.
     * @returns {*} - Value. Array if multiple hits.
     * @example
     *  function doSomething() {
     *      var args = argx(arguments);
     *      args.pop();
     *      args.pop(2);
     *      args.pop('string')
     *      args.pop(MyCustomError);
     *  }
     */
    pop: function (howmany, type) {
        var s = this;
        var from = -Number(howmany);
        if (isNaN(from)) {
            from = -1;
        }
        return s.splice(from, howmany, type);
    },
    /**
     * Shift values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction. Could be a name of type or a constructor.
     * @returns {*} - Value. Array if multiple hits.
     * @example
     *  function doSomething() {
     *      var args = argx(arguments);
     *      args.shift();
     *      args.shift(2);
     *      args.shift('string')
     *      args.shift(MyCustomError);
     *  }
     */
    shift: function (howmany, type) {
        var s = this;
        return s.splice(0, howmany, type);
    },
    /**
     * Get all remain values.
     * @returns {Array}
     */
    remain: function () {
        var s = this;
        var values = s.values;
        s.values = [];
        return values;
    }
};

module.exports = Argx;

},{"./type/is_number":5,"./type/type_hits":7}],3:[function(require,module,exports){
/**
 * Parse function arguments. Useful to implement variadic functions.
 * @module argx
 * @version 1.2.0
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

},{"./argx":2,"./noop":4}],4:[function(require,module,exports){
/**
 * Function to do nothing.
 * @memberof module:argx/lib
 * @function noop
 */

"use strict";

/** @lends noop */
function noop() {
    // Do nothing.
}

module.exports = noop;

},{}],5:[function(require,module,exports){
/**
 * Detect is a number or not.
 * @param {*} value - Value to check.
 * @returns {boolean} - Is a number or not.
 * @private
 */

"use strict";

/** @lends _isNumber */
function _isNumber(value) {
    var notNumber = isNaN(Number(value));
    if (notNumber) {
        return false;
    }
    return !_isEmptyString(value) && !_isEmptyArray(value);
}

function _isEmptyString(value) {
    return value === "";
}

function _isEmptyArray(value) {
    return Array.isArray(value) && (value.length === 0);
}

module.exports = _isNumber;
},{}],6:[function(require,module,exports){
/**
 * Parse a type.
 * @param {string|object|function} type - Type to parse.
 * @private
 */

"use strict";

/** @lends _parseType */
function _parseType(type) {
    if (type === Function) {
        return 'function';
    }
    if (type === Array) {
        return 'array';
    }
    if (type === String) {
        return 'string';
    }
    if (type === Number) {
        return 'number';
    }
    if (typeof(type) === 'string') {
        type = String(type).toLowerCase().trim();
    }
    return type;
}

module.exports = _parseType;
},{}],7:[function(require,module,exports){
/**
 * Detect if type hits.
 * @function typeHits
 * @param {*} value - Value to check with.
 * @param {string|object|string[]|object[]} type - Type to check with.
 * @returns {boolean} - Hit or not.
 * @private
 */
"use strict";

var parseType = require('./parse_type');

/** @lends typeHits */
function typeHits(value, type) {
    var isEmpty = (typeof(value) === 'undefined') || (value === null);
    if (isEmpty) {
        return false;
    }
    var s = this;
    var isMultiple = Array.isArray(type);
    if (isMultiple) {
        return typeHits.anyOf(value, type);
    }
    type = parseType(type);
    var isArrayType = (type === 'array');
    if (isArrayType) {
        return Array.isArray(value);
    }
    switch (typeof(type)) {
        case 'string':
            if (/\|/.test(type)) {
                return typeHits.anyOf(value, type.split(/\|/g));
            }
            return typeof(value) === type;
        case 'function':
            return value instanceof(type);
        case 'object':
            return !!(type && type.isPrototypeOf) && type.isPrototypeOf(value);
        default:
            return false;
    }
}

/**
 * Detect if any of type hits.
 * @param {*} value - Value to check with.
 * @param {string[]|object[]} types - types to check.
 * @returns {boolean} - Hit or not.
 * @private
 */
typeHits.anyOf = function anyOfTypeHits(value, types) {
    for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var hit = typeHits(value, type);
        if (hit) {
            return true;
        }
    }
    return false;
};

module.exports = typeHits;
},{"./parse_type":6}]},{},[1]);