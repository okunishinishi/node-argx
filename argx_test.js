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

exports['Check type.'] = function (test) {
    (function () {
        var args = argx(arguments);
        var num1 = 0,
            str1 = '',
            str2 = 'foo',
            obj1 = {},
            obj2 = Object.create(obj1),
            Func = function () {
            },
            func = new Func();

        // Check numbers
        test.equal(args._typeHits(num1, 'number'), true);
        test.equal(args._typeHits(num1, 'string'), false);
        test.equal(args._typeHits(num1, 'function'), false);
        test.equal(args._typeHits(num1, 'object'), false);
        test.equal(args._typeHits(num1, obj1), false);
        test.equal(args._typeHits(num1, obj2), false);
        test.equal(args._typeHits(num1, Func), false);
        test.equal(args._typeHits(num1, null), false);
        test.equal(args._typeHits(num1, undefined), false);

        // Check empty string.
        test.equal(args._typeHits(str1, 'number'), false);
        test.equal(args._typeHits(str1, 'string'), true);
        test.equal(args._typeHits(str1, 'function'), false);
        test.equal(args._typeHits(str1, 'object'), false);
        test.equal(args._typeHits(str1, obj1), false);
        test.equal(args._typeHits(str1, obj2), false);
        test.equal(args._typeHits(str1, Func), false);
        test.equal(args._typeHits(str1, null), false);
        test.equal(args._typeHits(str1, undefined), false);

        // Check string.
        test.equal(args._typeHits(str2, 'number'), false);
        test.equal(args._typeHits(str2, 'string'), true);
        test.equal(args._typeHits(str2, 'function'), false);
        test.equal(args._typeHits(str2, 'object'), false);
        test.equal(args._typeHits(str2, obj1), false);
        test.equal(args._typeHits(str2, obj2), false);
        test.equal(args._typeHits(str2, Func), false);
        test.equal(args._typeHits(str2, null), false);
        test.equal(args._typeHits(str2, undefined), false);

        // Check object.
        test.equal(args._typeHits(obj1, 'number'), false);
        test.equal(args._typeHits(obj1, 'string'), false);
        test.equal(args._typeHits(obj1, 'function'), false);
        test.equal(args._typeHits(obj1, 'object'), true);
        test.equal(args._typeHits(obj1, obj1), false);
        test.equal(args._typeHits(obj1, obj2), false);
        test.equal(args._typeHits(obj1, Func), false);
        test.equal(args._typeHits(obj1, null), false);
        test.equal(args._typeHits(obj1, undefined), false);

        // Check object inheritance.
        test.equal(args._typeHits(obj2, 'number'), false);
        test.equal(args._typeHits(obj2, 'string'), false);
        test.equal(args._typeHits(obj2, 'function'), false);
        test.equal(args._typeHits(obj2, 'object'), true);
        test.equal(args._typeHits(obj2, obj1), true); // Hit by `isPrototypeOf`
        test.equal(args._typeHits(obj2, obj2), false);
        test.equal(args._typeHits(obj2, Func), false);
        test.equal(args._typeHits(obj2, null), false);
        test.equal(args._typeHits(obj2, undefined), false);

        // Check function.
        test.equal(args._typeHits(Func, 'number'), false);
        test.equal(args._typeHits(Func, 'string'), false);
        test.equal(args._typeHits(Func, 'function'), true);
        test.equal(args._typeHits(Func, 'object'), false);
        test.equal(args._typeHits(Func, obj1), false);
        test.equal(args._typeHits(Func, obj2), false);
        test.equal(args._typeHits(Func, Func), false);
        test.equal(args._typeHits(Func, func), false);
        test.equal(args._typeHits(Func, null), false);
        test.equal(args._typeHits(Func, undefined), false);

        // Check function inheritance.
        test.equal(args._typeHits(func, 'number'), false);
        test.equal(args._typeHits(func, 'string'), false);
        test.equal(args._typeHits(func, 'function'), false);
        test.equal(args._typeHits(func, 'object'), true);
        test.equal(args._typeHits(func, obj1), false);
        test.equal(args._typeHits(func, obj2), false);
        test.equal(args._typeHits(func, Func), true); // Hit by `instanceof`
        test.equal(args._typeHits(func, func), false);
        test.equal(args._typeHits(func, null), false);
        test.equal(args._typeHits(func, undefined), false);


    })();
    test.done();
};

exports['Hit with multiple type.'] = function (test) {
    function MyFunc() {
    }

    (function () {
        var args = argx(arguments);
        test.equal(args._typeHits("foo", "string|number"), true);
        test.equal(args._typeHits("foo", "string|function"), true);
        test.equal(args._typeHits("foo", "function|number"), false);
        test.equal(args._typeHits("foo", ["string", "number"]), true);
        test.equal(args._typeHits("foo", ["string", "function"]), true);
        test.equal(args._typeHits("foo", ["function", "number"]), false);
        test.equal(args._typeHits(new MyFunc, [MyFunc, "number"]), true);

        test.ok(!args.pop('string|number'));
        test.ok(!args.pop(['string', 'number']));
        test.ok(!!args.pop([MyFunc, 'number']));
        test.ok(!args.shift([MyFunc, 'number']));
        test.ok(!!args.shift(['string', 'number']));
        test.ok(!!args.shift('string|number'));

    })('v1', 'v2', new MyFunc);
    test.done();
};

exports['Working with custom object.'] = function (test) {
    var CustomError = function (name) {
        this.name = name;
    };
    CustomError.prototype = Object.create(Error.prototype);

    (function acceptCustom() {
        var args = argx(arguments);
        var fn = args.shift(Function);
        test.equal(fn.name, 'func01');
        var error = args.shift(CustomError);
        test.equal(error.name, 'err01');
        var obj = args.pop(Object);
        test.equal(obj.name, 'obj01');
    })(
        function func01() {
        },
        new CustomError('err01'),
        {name: 'obj01'}
    );

    (function rejectCustom() {
        var args = argx(arguments);
        test.ok(!args.pop(Function));
        test.ok(!args.pop(CustomError));
        test.ok(!args.pop('number'));
        test.ok(!args.pop('string'));
        test.ok(!args.shift("object"));
        test.ok(!args.shift('number'));
        test.ok(!args.shift('string'));
    })(
        function func01() {
        },
        new CustomError('err01'),
        {name: 'obj01'}
    );
    test.done();
};