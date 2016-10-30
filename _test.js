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
    return next(fn);
});
mw.use(fn1.bind(myCtx));
mw.use(fn2); // test is undefined
mw.use(fn3.bind(myCtx));
mw(10);
mw(10);
mw(15);

var testObj = {
    someConstant: 10
};

function logMiddle(next, a, b) {
    console.log('You are about summing these values:', a, b, this.someConstant);
    return next(a, b);
}

testObj.sum = new Middle(function(a, b){
    return a+b+this.someConstant;
}, testObj);

testObj.sum.use(logMiddle);
testObj.sum.use(logMiddle.bind(testObj));
testObj.sum.use(logMiddle, testObj);

console.log('returns result 18: ', testObj.sum(3, 5));