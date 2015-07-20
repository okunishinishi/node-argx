/**
 * Parse function arguments. Useful to implement variadic functions.
 * @function argx
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
 */

"use strict";

/**
 * Parse arguments.
 * @constructor
 * @param {Arguments} args - Function arguments
 */
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
    _splice: function (start, howmany, type) {
        var s = this;

        if (typeof(arguments[1]) === 'string') {
            if (isNaN(Number(arguments[1]))) {
                type = arguments[1];
                howmany = 1;
            } else {
                howmany = Number(arguments[1]);
            }
        }

        howmany = howmany || 1;
        if (start < 0) {
            start += s.values.length;
        }
        var result;
        for (var i = start; i < (start + howmany); i++) {
            var skipByType = type && (typeof(s.values[i]) !== type);
            if (skipByType) {
                break;
            }
            var spliced = s.values.splice(i, 1);
            if (!spliced.length) {
                break;
            }
            spliced = spliced[0];
            if (result) {
                if (!Array.isArray(result)) {
                    result = [result];
                }
                result.push(spliced);
            } else {
                result = spliced;
            }
        }
        return result;
    },
    /**
     * Pop values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction.
     * @returns {*} - Value. Array if multpile hits.
     */
    pop: function (howmany, type) {
        var s = this;
        var from = -Number(howmany);
        if (isNaN(from)) {
            from = -1;
        }
        return s._splice(from, howmany, type);
    },
    /**
     * Shift values
     * @param {number|string} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction.
     * @returns {*} - Value. Array if multpile hits.
     */
    shift: function (howmany, type) {
        var s = this;
        return s._splice(0, howmany, type);
    },
    /**
     * Get all remain values.
     * @returns {array}
     */
    remain: function () {
        var s = this;
        var values = s.values;
        s.values = [];
        return values;
    }
};

/**
 * Get value from arguments.
 * @param {Arguments} args - Argument passed to your function.
 * @returns {Argx} - Parser object.
 */
function argx(args) {
    return new Argx(args);
}

/**
 * Function to do nothing.
 */
argx.noop = function noop() {
    // Do nothing.
};

module.exports = argx;
