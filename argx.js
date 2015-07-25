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
     * Parse a type.
     * @param {string|object|function} type - Type to parse.
     * @private
     */
    _parseType: function (type) {
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
    },
    /**
     * Detect if type hits.
     * @param {*} value - Value to check with.
     * @param {string|object|string[]|object[]} type - Type to check with.
     * @returns {boolean} - Hit or not.
     * @private
     */
    _typeHits: function (value, type) {
        var isEmpty = (typeof(value) === 'undefined') || (value === null);
        if (isEmpty) {
            return false;
        }
        var s = this;
        var isMultiple = Array.isArray(type);
        if (isMultiple) {
            return s._anyTypeHits(value, type);
        }
        type = s._parseType(type);
        var isArrayType = (type === 'array');
        if (isArrayType) {
            return Array.isArray(value);
        }
        switch (typeof(type)) {
            case 'string':
                if (/\|/.test(type)) {
                    return s._anyTypeHits(value, type.split(/\|/g));
                }
                return typeof(value) === type;
            case 'function':
                return value instanceof(type);
            case 'object':
                return !!(type && type.isPrototypeOf) && type.isPrototypeOf(value);
            default:
                return false;
        }
    },
    /**
     * Detect if any of type hits.
     * @param {*} value - Value to check with.
     * @param {string[]|object[]} types - types to check.
     * @returns {boolean} - Hit or not.
     * @private
     */
    _anyTypeHits: function (value, types) {
        var s = this;
        for (var i = 0, len = types.length; i < len; i++) {
            var type = types[i];
            var hit = s._typeHits(value, type);
            if (hit) {
                return true;
            }
        }
        return false;
    },
    /**
     * Splice argument values.
     * @param {number} start - Where to start
     * @param {number} [howmany=1] - Number of value to get.
     * @param {string} [type] - Type restriction.
     * @private
     */
    _splice: function (start, howmany, type) {
        var s = this;

        if (typeof(arguments[1]) !== 'number') {
            if (s._isNumber(arguments[1])) {
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
            var skipByType = type && !s._typeHits(s.values[i], type);
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
     * Detect is a number or not.
     * @param {*} value - Value to check.
     * @returns {boolean} - Is a number or not.
     * @private
     */
    _isNumber: function (value) {
        var s = this;
        var notNumber = isNaN(Number(value));
        if (notNumber) {
            return false;
        }
        return !s._isEmptyString(value) && !s._isEmptyArray(value);
    },
    _isEmptyString: function (value) {
        return value === "";
    },
    _isEmptyArray: function (value) {
        return Array.isArray(value) && (value.length === 0);
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
        return s._splice(from, howmany, type);
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
