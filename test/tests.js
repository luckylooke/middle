// global describe, it

let chai = require( 'chai' )
let chaiAsPromised = require( "chai-as-promised" )
chai.use( chaiAsPromised )
let expect = chai.expect

let middle = require( '../dist/middle.js' ).default
let mdeco = require( '../dist/middle.js' ).decorator

describe.only( 'middle', function () {

	class Dragon {

		txt = 'bum'

		@mdeco
		drag( x, y, test ) {
			return this.txt + ' tadaaa ' + x + y + test
		}
	}

	Dragon.prototype.drag.use( function( next, x, y, test ) {
		test += 'A'
		return next( x, y, test ) + ' foo'
	})

	let dragn = new Dragon
	dragn.txt = 'tidaa'
	dragn.drag.use( function( next, x, y, test ) {
		test += 'B'
		return next( x, y, test ) + ' bar'
	}, dragn)

	dragn.drag.use( function( next, x, y, test ) {
		test += 'C'
		return next( x, y, test ) + ' bar2'
	})

	let x = dragn.drag( 1, 2, ' punk' )

	it( 'dragon.drag is a function', function () {
		expect( dragn.drag ).to.be.a( 'function' )
	} )
	it( 'call order is same as registration order, and reversed in return value manipulation', function () {
		expect( x ).to.equal( 'tidaa tadaaa 12 punkABC bar2 bar foo' )
	} )
	it( 'by default instance context is used', function () {
		expect( x ).to.not.equal( 'bum tadaaa 12 punkABC bar2 bar foo' )
	} )

} )

// describe( 'middle', function () {

// 	let cb = function () { // cb
// 			return 'return value'
// 		},
// 		ecb = middle( cb ) // enhanced cb

// 	it( 'should return a function', function () {
// 		expect( ecb ).to.be.a( 'function' )
// 	} )

// 	it( 'should return a callback result when called', function () {
// 		expect( ecb() ).to.equal( 'return value' )
// 	} )

// 	describe( 'main fn - context provided', function () {
// 		it( 'should use context for callback function if provided', function () {
// 			let result = '',
// 				cb = function () {
// 					result = this.test
// 				},
// 				ctx = { test: 'test' },
// 				ecb = middle( cb, ctx )
// 			ecb()

// 			expect( result ).to.equal( ctx.test )
// 		} )
// 	} )

// } )

// describe( '#use', function () {

// 	let ecb = middle( function () {
// 			return 'return'
// 		} ),
// 		testBool = false,
// 		test = function () {
// 			testBool = true
// 		}
// 	ecb.use( test )
// 	ecb()

// 	it( 'should be a function', function () {
// 		expect( ecb.use ).to.be.a( 'function' )
// 	} )

// 	it( 'should add provided function to stack', function () {
// 		expect( ecb._m_stack.indexOf( test ) === 0 ).to.be.truth
// 	} )

// 	it( 'should run provided function when called instance', function () {
// 		expect( testBool ).to.be.truth
// 	} )

// 	describe( '#use - providing context', function () {

// 		let ecb = middle( function () {
// 				return 'return'
// 			} ),
// 			testBool = false,
// 			testCtx = { testVal: true },
// 			test = function () {
// 				testBool = this.testVal
// 			}
// 		ecb.use( test, testCtx )
// 		ecb()

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( testBool ).to.be.truth
// 		} )
// 	} )

// 	describe( '#use - usecase prototype', function () {
// 		function MyClass() {
// 			this.suprdupr = '1'
// 		}

// 		MyClass.prototype.suprMethod = middle( function suprMet( arg ) {
// 			return '' + arg + this.suprdupr + '2'
// 		} )

// 		let myClass = new MyClass()

// 		myClass.newProp = '3'

// 		myClass.suprMethod.use( function useInSupr( next ) {
// 			return next() + this.newProp + '4'
// 		} )

// 		let returnVal = myClass.suprMethod('0') + '5'

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( returnVal ).to.equal( '012345' )
// 		} )
// 	} )

// 	describe( '#use - usecase passing parameter forward addition', function () {

// 		let cb = function ( input ) {
// 				return input + '' + 0
// 			},
// 			test1 = function ( next, input ) {
// 				return next( input ) + '' + 1
// 			},
// 			test2 = function ( next, input ) {
// 				return next( input ) + '' + 2
// 			},
// 			test3 = function ( next, input ) {
// 				return next( input ) + '' + 3
// 			},
// 			ecb = middle( cb ),
// 			result

// 		ecb.use( test3 )
// 		ecb.use( test2 )
// 		ecb.use( test1 )

// 		result = ecb( 'start:' )

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( result ).to.equal( 'start:0123' )
// 		} )
// 	} )

// 	describe( '#use - usecase passing parameter backward addition', function () {

// 		let cb = function ( input ) {
// 				return input + '' + 4
// 			},
// 			test1 = function ( next, input ) {
// 				return next( input + '' + 1 )
// 			},
// 			test2 = function ( next, input ) {
// 				return next( input + '' + 2 )
// 			},
// 			test3 = function ( next, input ) {
// 				return next( input + '' + 3 )
// 			},
// 			ecb = middle( cb ),
// 			result

// 		ecb.use( test1 )
// 		ecb.use( test2 )
// 		ecb.use( test3 )

// 		result = ecb( 'start:' )

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( result ).to.equal( 'start:1234' )
// 		} )
// 	} )
// } )


// describe( '#subscribe', function () {

// 	let ecb = middle( function () {
// 			return 'return'
// 		} ),
// 		testBool = false,
// 		test = function () {
// 			testBool = true
// 		},
// 		used = ecb.subscribe( test )

// 	ecb()

// 	it( 'should be a function', function () {
// 		expect( ecb.subscribe ).to.be.a( 'function' )
// 	} )

// 	it( 'should add provided function to stack', function () {
// 		expect( ecb._m_stack.indexOf( used ) === 0 ).to.be.truth
// 	} )

// 	it( 'should run provided function when called instance', function () {
// 		expect( testBool ).to.be.truth
// 	} )

// 	describe( '#subscribe - providing context', function () {

// 		let ecb = middle( function () {
// 				return 'return'
// 			} ),
// 			testBool = false,
// 			testCtx = { testVal: true },
// 			test = function () {
// 				testBool = this.testVal
// 			}
// 		ecb.subscribe( test, testCtx )
// 		ecb()

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( testBool ).to.be.truth
// 		} )
// 	} )

// 	describe( '#subscribe - usecase prototype', function () {

// 		let called = false

// 		function MyClass() {
// 			this.suprdupr = 'supr'
// 		}

// 		MyClass.prototype.suprMethod = middle( function suprMet() {
// 			return this.suprdupr + 'dupr'
// 		} )

// 		let myClass = new MyClass()

// 		myClass.suprMethod.subscribe( function subInSupr() {
// 			called = true
// 		} )

// 		let returnVal = myClass.suprMethod()

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( returnVal ).to.equal( 'suprdupr' )
// 			expect( called ).to.be.truth
// 		} )
// 	} )

// 	describe( '#use - usecase on return phase', function () {

// 		let cb = function ( input ) {
// 				return input + '' + 4
// 			},
// 			test1 = function ( next, input ) {
// 				return next( input + '' + 1 )
// 			},
// 			test2 = function ( next, input ) {
// 				return next( input + '' + 2 )
// 			},
// 			test3 = function ( next, input ) {
// 				return next( input + '' + 3 )
// 			},
// 			notify = function ( input ) {
// 				message = input
// 			},
// 			message = '',
// 			ecb = middle( cb ),
// 			result

// 		ecb.use( test1 )
// 		ecb.use( test2 )
// 		ecb.use( test3 )
// 		// 					   ctx, index, onReturn
// 		ecb.subscribe( notify, null, null, true )

// 		result = ecb( 'start:' )

// 		it( 'should run provided function when called instance and use provided context', function () {
// 			expect( result ).to.equal( 'start:1234' )
// 			expect( message ).to.equal( 'start:1234' )
// 		} )
// 	} )
// } )

// // Cannot make decorators work in mocha/chai.. any help? Thanks

// // describe( '@mdeco', function () {
// //
// // 	class SomeClass{
// // 		@mdeco
// // 		test(){
// // 			return 'test'
// // 		}
// // 	}
// //
// // 	let someClassInstance = new SomeClass()
// //
// // 	it( 'should return a function', function () {
// // 		expect( someClassInstance.test.use ).to.be.a( 'function' )
// // 	} )
// //
// // 	someClassInstance.test.use( function( next ){
// // 		return next() + '123'
// // 	} )
// //
// // 	it( 'should return a callback result when called', function () {
// // 		expect( someClassInstance.test() ).to.equal( 'test123' )
// // 	} )
// //
// // } )
