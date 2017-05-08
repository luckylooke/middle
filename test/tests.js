let chai = require( 'chai' );
let chaiAsPromised = require( "chai-as-promised" );
chai.use( chaiAsPromised );
let expect = chai.expect;

let middle = require( '../dist/middle.js' ).default;
// let mdeco = require( '../dist/middle.js' ).decorator;


describe( 'middle', function () {

	let cb = function () {
			return 'return value';
		},
		ecb = middle( cb );

	it( 'should return a function', function () {
		expect( ecb ).to.be.a( 'function' );
	} );

	it( 'should return a callback result when called', function () {
		expect( ecb() ).to.equal( 'return value' );
	} );

	describe( 'main fn - context provided', function () {
		it( 'should use context for callback function if provided', function () {
			let result = '',
				cb = function () {
					result = this.test;
				},
				ctx = { test: 'test' },
				ecb = middle( cb, ctx );
			ecb();

			expect( result ).to.equal( ctx.test );
		} );
	} );

} );

describe( '#use', function () {

	let ecb = middle( function () {
			return 'return';
		} ),
		testBool = false,
		test = function () {
			testBool = true
		};
	ecb.use( test );
	ecb();

	it( 'should be a function', function () {
		expect( ecb.use ).to.be.a( 'function' );
	} );

	it( 'should add provided function to stack', function () {
		expect( ecb._m_stack.indexOf( test ) === 0 ).to.be.truth;
	} );

	it( 'should run provided function when called instance', function () {
		expect( testBool ).to.be.truth;
	} );

	describe( '#use - providing context', function () {

		let ecb = middle( function () {
				return 'return';
			} ),
			testBool = false,
			testCtx = { testVal: true },
			test = function () {
				testBool = this.testVal
			};
		ecb.use( test, testCtx );
		ecb();

		it( 'should run provided function when called instance and use provided context', function () {
			expect( testBool ).to.be.truth;
		} );
	} );

	describe( '#use - usecase prototype', function () {
		function MyClass() {
			this.suprdupr = 'supr';
		}

		MyClass.prototype.suprMethod = middle( function suprMet() {
			return this.suprdupr + 'dupr';
		} );

		let myClass = new MyClass();

		myClass.suprMethod.use( function useInSupr( next ) {
			return next() + 'mupr';
		} );

		let returnVal = myClass.suprMethod();

		it( 'should run provided function when called instance and use provided context', function () {
			expect( returnVal ).to.equal( 'suprduprmupr' );
		} );
	} );

	describe( '#use - usecase passing parameter forward addition', function () {

		let cb = function ( input ) {
				return input + '' + 0;
			},
			test1 = function ( next, input ) {
				return next( input ) + '' + 1;
			},
			test2 = function ( next, input ) {
				return next( input ) + '' + 2;
			},
			test3 = function ( next, input ) {
				return next( input ) + '' + 3;
			},
			ecb = middle( cb ),
			result;

		ecb.use( test3 );
		ecb.use( test2 );
		ecb.use( test1 );

		result = ecb( 'start:' );

		it( 'should run provided function when called instance and use provided context', function () {
			expect( result ).to.equal( 'start:0123' );
		} );
	} );

	describe( '#use - usecase passing parameter backward addition', function () {

		let cb = function ( input ) {
				return input + '' + 4;
			},
			test1 = function ( next, input ) {
				return next( input + '' + 1 );
			},
			test2 = function ( next, input ) {
				return next( input + '' + 2 );
			},
			test3 = function ( next, input ) {
				return next( input + '' + 3 );
			},
			ecb = middle( cb ),
			result;

		ecb.use( test1 );
		ecb.use( test2 );
		ecb.use( test3 );

		result = ecb( 'start:' );

		it( 'should run provided function when called instance and use provided context', function () {
			expect( result ).to.equal( 'start:1234' );
		} );
	} );
} );

// Cannot make decorators work in mocha/chai.. any help? Thanks

// describe( '@mdeco', function () {
//
// 	class SomeClass{
// 		@mdeco
// 		test(){
// 			return 'test';
// 		}
// 	}
//
// 	let someClassInstance = new SomeClass();
//
// 	it( 'should return a function', function () {
// 		expect( someClassInstance.test.use ).to.be.a( 'function' );
// 	} );
//
// 	someClassInstance.test.use( function( next ){
// 		return next() + '123';
// 	} );
//
// 	it( 'should return a callback result when called', function () {
// 		expect( someClassInstance.test() ).to.equal( 'test123' );
// 	} );
//
// } );
