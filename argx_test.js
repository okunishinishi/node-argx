/**
 * Test for argx.
 * Runs with nodeunit.
 */

"use strict";


var argx = require('./argx');

function noop() {
}

exports['Pop arguments.'] = function (test) {
    (function foo() {
        var args = argx(arguments);
        test.ok(args.pop('function'));
        test.ok(args.pop(1, 'object'));
        test.equal(args.remain().length, 2);
    })('v1', 'v2', {}, noop);

    (function foo2() {
        var args = argx(arguments);
        test.ok(!args.pop('function'));
        test.ok(args.pop(1, 'object'));
        test.equal(args.remain().length, 2);
    })('v1', 'v2', {});

    (function foo4() {
        var args = argx(arguments);
        test.ok(!args.pop('function'));
        test.ok(!args.pop("1", 'object'));
        test.equal(args.remain().length, 2);
    })('v1', 'v2');

    (function foo4() {
        var args = argx(arguments);
        test.ok(args.pop(2).length, 2);
        test.ok(args.remain().length, 2);
    })('v1', 'v2', 'v3', 'v4', 'v5');


    test.done();
};

exports['Shift arguments.'] = function (test) {
    (function foo() {
        var args = argx(arguments);
        test.equal(args.shift(2).length, 2);
        test.equal(args.shift(1, 'function'), undefined);
        test.equal(args.remain().length, 2);
        test.equal(args.shift(), undefined);
        test.equal(args.shift(124), undefined);
    })('v1', 'v2', {}, noop);

    (function foo2() {
        var args = argx(arguments);
        test.ok(args.shift(2).length, 2);
        test.ok(args.remain().length, 2);
    })('v1', 'v2', 'v3', 'v4', 'v5');

    test.done();
};

exports['Use noop.'] = function (test) {
    test.ifError(argx.noop());
    test.done();
};