function Middle(fn){
    if(fn !== '!init!'){
        var middleInstance = new Middle('!init!'),
            bindedRun = middleInstance.run.bind(middleInstance);

        bindedRun.use = middleInstance.use.bind(middleInstance);
        return bindedRun;
    }
    this._stack = [];
}

Middle.prototype.run = function () {
    if(this._stack.length){
        this._stackIndex = 0;
        this._stackLen = this._stack.length;
        this.next.apply(this, arguments);
    }
};

Middle.prototype.use = function (fn) {
    this._stack.push(fn);
};

Middle.prototype.next = function() {
    if(this._stackIndex < this._stackLen){
        this._stackIndex++;
        this._stack[this._stackIndex - 1]
            .bind(null, this.next.bind(this))
            .apply(null, arguments);
    }
};

// function argsToArray(argums) {
//     // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
//      return (argums.length === 1 ? [argums[0]] : Array.apply(null, argums));
// }


var mw = new Middle(),
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
    },
    context = {test: 'red'};
mw.use(fn1.bind(context));
mw.use(fn2); // test is undefined
mw.use(fn3.bind(context));
mw(10);