'use strict'

export default function middle( fn, ctx ) {

	// TODO: Consider Enhanced class ---> enhanced = new Enhanaced() ???

	var enhanced = middle_enhanced_fn

	enhanced._m_stack = []
	enhanced._m_index = 0
	enhanced._m_ctx = ctx

	function middle_enhanced_fn() {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments#Using_the_Spread_Syntax_with_Arguments
		const args = [ ...arguments ]

		console.log('middle_enhanced_fn this', this && this.txt)
		debugger

		if ( !ctx && ( ctx === undefined || ctx === null ) && this !== undefined ){
			enhanced._m_ctx = ctx = this
		}

		if ( enhanced._m_stack.length === enhanced._m_index ) {

			enhanced._m_index = 0
			return fn.apply( ctx, args )
		}

		args.unshift( middle_enhanced_fn ) // pass middle_enhanced_fn as "next" function in first parameter

		return enhanced._m_stack[ enhanced._m_index++ ].apply( ctx, args )
	}

	enhanced.use = ( useFn, useCtx, index ) => {

		let bound

		if ( useCtx !== undefined && useCtx !== null )
			bound = useFn.bind( useCtx )

		if ( typeof index == 'number' )

			enhanced._m_stack.splice( index, 0, bound || useFn )

		else

			enhanced._m_stack.push( bound || useFn )
	}

	enhanced.subscribe = ( subFn, subCtx, index, onReturn ) => {

		const used = function( next ) {

			const args = [ ...arguments ]

			if ( !subCtx && ( subCtx === undefined || subCtx === null ))
				subCtx = ctx

			if ( onReturn ){

				const res = next.apply( ctx, args ) // continue chain
				subFn.call( subCtx, res ) // call callback on return path
				return res

			} else {

				args.shift() // remove the "next" parameter
				subFn.apply( subCtx, args )
				args.unshift( next ) // put the "next" parameter back
				return next.apply( ctx, args ) // continue chain
			}

		}

		enhanced.use( used, undefined, index )

		return used
	}

	return enhanced
}

// ES7 decorator ( https://www.martin-brennan.com/es7-decorators/ )
export function decorator( target, key, descriptor ) {

	if ( !target ) return

	const { writable, enumerable } = descriptor

	return {
		get: function () {

			const newEnhanced = middle( descriptor.value, null, () => this )
			Object.defineProperty( this, key, {
				value: newEnhanced,
				writable: writable,
				enumerable: enumerable
			} )

			return newEnhanced
		}
	}
}
