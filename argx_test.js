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
        test.deepEqual(args.remain(), ['v1', 'v2']);
    })('v1', 'v2', {}, noop);

    (function foo2() {
        var args = argx(arguments);
        test.strictEqual(args.pop('function'), undefined);
        test.deepEqual(args.pop(1, 'object'), {foo: 'bar'});
        test.deepEqual(args.remain(), ['v1', 'v2']);
    })('v1', 'v2', {foo: 'bar'});

    (function foo4() {
        var args = argx(arguments);
        test.strictEqual(args.pop('function'), undefined);
        test.strictEqual(args.pop("1", 'object'), undefined);
        test.deepEqual(args.remain(), ['v1', 'v2']);
    })('v1', 'v2');

    (function foo4() {
        var args = argx(arguments);
        test.deepEqual(args.pop(2), ["v4", "v5"]);
        test.deepEqual(args.remain(), ['v1', 'v2', 'v3']);
    })('v1', 'v2', 'v3', 'v4', 'v5');

    test.done();
};

exports['Shift arguments.'] = function (test) {
    (function foo() {
        var args = argx(arguments);
        test.deepEqual(args.shift(2), ['v1', 'v2']);
        test.equal(args.shift(1, 'function'), undefined);
        test.deepEqual(args.remain(), [{}, noop]);
        test.equal(args.shift(), undefined);
        test.equal(args.shift(124), undefined);
    })('v1', 'v2', {}, noop);

    (function foo2() {
        var args = argx(arguments);
        test.deepEqual(args.shift(2), ['v1', 'v2']);
        test.deepEqual(args.remain(), ['v3', 'v4', 'v5']);
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

    var myFunc = new MyFunc;
    (function () {
        var args = argx(arguments);
        test.equal(args._typeHits("foo", "string|number|object"), true);
        test.equal(args._typeHits("foo", "string|function|object"), true);
        test.equal(args._typeHits("foo", "function|number|object"), false);
        test.equal(args._typeHits("foo", ["string", "number|object"]), true);
        test.equal(args._typeHits("foo", ["string|object", "function"]), true);
        test.equal(args._typeHits("foo", ["function", "number"]), false);
        test.equal(args._typeHits(new MyFunc, [MyFunc, "number"]), true);

        test.strictEqual(args.pop('string|number'), undefined);
        test.strictEqual(args.pop(['string', 'number']), undefined);
        test.strictEqual(args.pop([MyFunc, 'number']), myFunc);
        test.strictEqual(args.shift([MyFunc, 'number']), undefined);
        test.strictEqual(args.shift(['string', 'number']), 'v1');
        test.strictEqual(args.shift('string|number'), 'v2');

    })('v1', 'v2', myFunc);
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

exports['Check is number.'] = function (test) {
    var args = argx(arguments);
    test.equal(args._isNumber(0), true);
    test.equal(args._isNumber("0"), true);
    test.equal(args._isNumber(""), false);
    test.equal(args._isNumber([]), false);
    test.done();
};

exports['Handle array.'] = function (test) {
    (function () {
        var args = argx(arguments);
        test.equal(args.pop('string'), undefined);
        test.equal(args.pop([]), undefined);
        test.deepEqual(args.pop('array'), ['v5', 'v6']);
        test.equal(args.pop([]), undefined);
        test.equal(args.pop('string'), undefined);
        test.deepEqual(args.pop(Array), ['v4', 'v5']);
    })(
        'v1',
        'v2',
        'v3',
        ['v4', 'v5'],
        ['v5', 'v6']
    );
    test.done();
};

exports['Handle arrays.'] = function (test) {
    (function () {
        var args = argx(arguments);
        test.deepEqual(args.shift("string"), undefined);
    })(["foo", "bar"]);
    (function () {
        var args = argx(arguments);
        test.deepEqual(args.shift("array"), ["foo", "bar"]);
    })(["foo", "bar"]);
    (function () {
        var args = argx(arguments);
        test.deepEqual(args.shift("object"), ["foo", "bar"]);
    })(["foo", "bar"]);
    (function () {
        var args = argx(arguments);
        test.deepEqual(args.shift(Array), ["foo", "bar"]);
    })(["foo", "bar"]);
    test.done();
};


exports['Parse type.'] = function (test) {
    (function () {
        var args = argx(arguments);
        test.equal(args._parseType('number'), 'number');
        test.equal(args._parseType('Number'), 'number');
        test.equal(args._parseType(' number '), 'number');
        test.equal(args._parseType(' Number '), 'number');
        test.equal(args._parseType(Function), 'function');
        test.equal(args._parseType(String), 'string');
        test.equal(args._parseType(Array), 'array');
        test.equal(args._parseType(Number), 'number');
    })();

    (function () {
        var args = argx(arguments);
        test.strictEqual(args.pop(Function), undefined);
        test.deepEqual(args.pop(Object), {foo: 'bar'});
        test.strictEqual(args.pop(Function), argx.noop);
        test.strictEqual(args.shift(Number), undefined);
        test.equal(args.shift(String), 'foo');
        test.strictEqual(args.shift(Number), 3);
    })("foo", 3, argx.noop, {foo: 'bar'});
    test.done();
};

exports['Issus #3'] = function (test) {
    // Test for issue #3 (https://github.com/okunishinishi/node-argx/issues/3)
    function argxGetNumberType(fn, string, number) {
        var args = argx(arguments);
        var values = {};
        values.fn = args.shift(Function);
        test.strictEqual(args.shift(Function), undefined);
        test.strictEqual(args.pop(Function), undefined);
        values.str = args.shift(String);
        test.strictEqual(args.shift(String), undefined);
        test.strictEqual(args.pop(String), undefined);
        values.numb = args.shift(Number);
        test.strictEqual(args.shift(Number), undefined);
        test.strictEqual(args.pop(Number), undefined);
        test.deepEqual(args.remain(), []);
        test.deepEqual(values, {
            fn: argxGetNumberType,
            str: 'hello',
            numb: 3
        })
    }

    argxGetNumberType(argxGetNumberType, "hello", 3);
    test.done();
};