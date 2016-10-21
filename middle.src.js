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
    var i=0,
        len = this._stack.length;
    for(;i<len;i++){
        this._stack[i].apply(null, arguments);
    }
};

Middle.prototype.use = function (fn) {
    this._stack.push(fn);
};

/*
*
* Use:
 mw = new Middle();
 mw.use(function(){console.log(1);});
 mw.use(function(){console.log(2);});
 mw();
*
* */