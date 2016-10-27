function Middle(cb, ctx, init){
    "use strict";
    if (!(this instanceof Middle))
        throw new Error("Middle needs to be called with the new keyword");

    if(!init){
        var middleInstance = new Middle(cb, ctx, 'init'),
            bindedRun = middleInstance.run.bind(middleInstance),
            useInstance = new Middle(middleInstance.use, middleInstance, 'init'),
            useInstancebindedRun = useInstance.run.bind(useInstance);

        useInstancebindedRun.use = useInstance.use.bind(useInstance);
        bindedRun.use = useInstancebindedRun;
        return bindedRun;
    }

    if(typeof cb == 'function')
        this.callback = cb.bind(ctx == 'middleInstance' ? this : ctx || null);
    else
        this.callback = function () {};

    this._stack = [];
    this.id = Math.random(); // dev: contexts identification
}

Middle.prototype.run = function () {
    new Runner(this._stack, this.callback, arguments);
};

Middle.prototype.use = function (fn) {
    this._stack.push(fn);
};

Runner = function(stack, cb, args){
    this._stack = stack;
    this.callback = cb;

    if(!this._stack.length)
        return this.callback.apply(null, args);

    this._stackIndex = 0;
    this._stackLen = this._stack.length;
    return this.next.apply(this, args);
};

Runner.prototype.next = function() {
    if(this._stackIndex < this._stackLen){
        this._stackIndex++;
        this._stack[this._stackIndex - 1]
            .bind(null, this.next.bind(this))
            .apply(null, arguments);
    }else{
        this.callback.apply(null, arguments);
    }
};

// function argsToArray(argums) {
//     // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
//      return (argums.length === 1 ? [argums[0]] : Array.apply(null, argums));
// }


// TEST: ===============================================================================

var myCallback = function (input) {
        input *= 10;
        console.log('myCallback result:', input, this.test);
    },
    cbCtx = {test: 'blue'},
    myCtx = {test: 'red'},
    mw = new Middle(myCallback, cbCtx),
    fn1 = function(next, input){
        input++;
        console.log('fn1', input, this.test);
        next(input);
    },
    fn2 = function(next, input){
        input++;
        console.log('fn2', input, this.test);
        setTimeout(function () {
            next(input); // simulating async task
        }, 1500);
    },
    fn3 = function(next, input){
        input++;
        console.log('fn3', input, this.test);
        next(input);
    };

mw.use.use(function (next, fn) {
    console.log('you added new middleware: ', fn);
    next(fn);
});
mw.use(fn1.bind(myCtx));
mw.use(fn2); // test is undefined
mw.use(fn3.bind(myCtx));
mw(10);
mw(10);
mw(15);