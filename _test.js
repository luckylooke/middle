var Middle = require('./dist/middle.js');

var myCallback = function myCallback(input) {
        input *= 10;
        console.log('myCallback result:', input, this.test);
    },
    cbCtx = {test: 'blue'},
    myCtx = {test: 'red'},
    mw = new Middle(myCallback, cbCtx),
    fn1 = function fn1(next, input){
        input++;
        console.log('fn1', input, this.test);
        next(input);
    },
    fn2 = function fn2(next, input){
        input++;
        console.log('fn2', input, this.test);
        setTimeout(function () {
            next(input); // simulating async task
        }, 1500);
    },
    fn3 = function fn3(next, input){
        input++;
        console.log('fn3', input, this.test);
        next(input);
    };

    mw.test = 'green';

// mw.use.use(function (next, fn) {
//     console.log('you added new middleware: ', fn);
//     return next(fn);
// });
mw.use(fn1, myCtx);
mw.use(fn2); // test is green
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

testObj.sum = new Middle(function sum(a, b){
    return a+b+this.someConstant;
}, testObj);

testObj.sum.use(logMiddle);
testObj.sum.use(logMiddle.bind(testObj));
testObj.sum.use(logMiddle, testObj);

console.log('returns result 18: ', testObj.sum(3, 5));

function MyClass(){
    this.suprdupr = true;
}

MyClass.prototype.suprMethod = new Middle(function suprMet(){
    console.log('dingdong', this.suprdupr);
});

var myClass = new MyClass();

myClass.suprMethod.use(function useInSupr(next) {
    console.log('suprMethod called');
    next();
});

myClass.suprMethod();