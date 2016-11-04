var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var Middle = require('../dist/middle.js');

describe('Middle', function() {
    describe('constructor', function() {
        var cb = function () {
                return 'return value';
            },
            middle = new Middle(cb);

        it('should return a function', function() {
            expect(middle).to.be.a('function');
        });

        it('should return a callback result when called', function() {
            expect(middle()).to.equal('return value');
        });

        describe('constructor - context provided', function() {
            it('should use context for callback function if provided', function() {
                var result,
                    cb = function () {
                        result = this.test;
                    },
                    ctx = {test:'test'},
                    middle = new Middle(cb, ctx);
                middle();

                expect(result).to.equal(ctx.test);
            });
        });

        describe('constructor - init parameter provided', function() {
            it('should return Middle instance if third parameter provided', function() {
                var middle = new Middle(null, null, 'init');
                expect(middle).to.be.an.instanceof(Middle);
            });
        });

    });

    describe('middle instance', function() {
        var middle = new Middle();

        it('should be a function', function() {
            expect(middle).to.be.a('function');
        });

        it('should have an array property _stack', function() {
            expect(middle._stack).to.be.an('array');
        });

        it('should have a function property callback', function() {
            expect(middle.callback).to.be.an('function');
        });

        it('should have a Middle instance in middle property', function() {
            expect(middle.middle).to.be.an.instanceof(Middle);
        });
    });

    describe('#use', function() {

        var middle = new Middle(),
            testBool = false,
            test = function(){testBool = true};
        middle.use(test);
        middle();

        it('should be a function', function() {
            expect(middle.use).to.be.a('function');
        });

        it('should add provided function to stack', function() {
            expect(middle._stack.indexOf(test) === 0).to.be.truth;
        });

        it('should run provided function when called instance', function() {
            expect(testBool).to.be.truth;
        });

        describe('#use - providing context', function(){

            var middle = new Middle(),
                testBool = false,
                testCtx = {testVal: true},
                test = function(){testBool = this.testVal};
            middle.use(test, testCtx);
            middle();

            it('should run provided function when called instance and use provided context', function() {
                expect(testBool).to.be.truth;
            });
        });

        describe('#use - usecase prototype', function(){
            function MyClass(){
                this.suprdupr = 'supr';
            }

            MyClass.prototype.suprMethod = new Middle(function suprMet(){
                return this.suprdupr + 'dupr';
            });

            var myClass = new MyClass();

            myClass.suprMethod.use(function useInSupr(next) {
                return next() + 'mupr';
            });

            var returnVal = myClass.suprMethod();

            it('should run provided function when called instance and use provided context', function() {
                expect(returnVal).to.equal('suprduprmupr');
            });
        });

        describe('#use - usecase passing parameter forward addition', function(){

            var cb = function(input){
                    return input + '' + 0;
                },
                test1 = function(next, input){
                    return next(input) + '' + 1;
                },
                test2 = function(next, input){
                    return next(input) + '' + 2;
                },
                test3 = function(next, input){
                    return next(input) + '' + 3;
                },
                middle = new Middle(cb),
                result;

            middle.use(test3);
            middle.use(test2);
            middle.use(test1);

            result = middle('start:');

            it('should run provided function when called instance and use provided context', function() {
                expect(result).to.equal('start:0123');
            });
        });

        describe('#use - usecase passing parameter backward addition', function(){

            var cb = function(input){
                    return input + '' + 4;
                },
                test1 = function(next, input){
                    return next(input + '' + 1);
                },
                test2 = function(next, input){
                    return next(input + '' + 2);
                },
                test3 = function(next, input){
                    return next(input + '' + 3);
                },
                middle = new Middle(cb),
                result;

            middle.use(test1);
            middle.use(test2);
            middle.use(test3);

            result = middle('start:');

            it('should run provided function when called instance and use provided context', function() {
                expect(result).to.equal('start:1234');
            });
        });
    });
});
