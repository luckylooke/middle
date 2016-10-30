var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var Middle = require('../dist/middle.js');

describe('Middle', function() {
    describe('constructor', function() {

        it('should return a function', function() {
            var middle = new Middle();
            expect(middle).to.be.a('function');
        });

        it('should return a callback result when called', function() {
            var cb = function () {
                    return 'return value';
                },
                middle = new Middle(cb);
            expect(middle()).to.equal('return value');
        });

        it('should use context for callback function if provided', function() {
            var cb = function () {
                    return this.test;
                },
                ctx = {test:'test'},
                middle = new Middle(cb, ctx);
            expect(middle()).to.equal(ctx.test);
        });

    });

    describe('#use', function() {
        it('should be a function', function() {
            var middle = new Middle();
            expect(middle.use).to.be.a('function');
        });
    });
});
