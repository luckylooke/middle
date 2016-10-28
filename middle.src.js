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
        this.callback = cb.bind(ctx == 'middleInstance' ? this : (ctx !== undefined ? ctx : null));
    else
        this.callback = function () {};

    this._stack = [];
    this.id = Math.random(); // dev: contexts identification
}

Middle.prototype.run = function () {
    var result =  new Runner(this._stack, this.callback, arguments);
    return result.__middlePrimitiveValueProtection__ || result;
};

Middle.prototype.use = function (fn, ctx) {
    this._stack.push(ctx !== undefined ? fn.bind(ctx) : fn);
};

Runner = function(stack, cb, args){
    this._stack = stack;
    this.callback = cb;

    if(!this._stack.length)
        return this.result(this.callback.apply(null, args));

    this._stackIndex = 0;
    this._stackLen = this._stack.length;
    return this.result(this.next.apply(this, args));
};

Runner.prototype.next = function() {
    if(this._stackIndex < this._stackLen){
        this._stackIndex++;
        return this._stack[this._stackIndex - 1]
            .bind(null, this.next.bind(this))
            .apply(null, arguments);
    }else{
        return this.callback.apply(null, arguments);
    }
};

Runner.prototype.result = function(val) {
   if(typeof val == 'object')
       return val;
    else
        return {__middlePrimitiveValueProtection__: val};
};