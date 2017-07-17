'use strict'

export default function middle( fn, ctx ) {

	// TODO: enahnaced as class 

	const enhanced = function middle_enhanced_fn() {

		const args = Array.prototype.slice.call( arguments )

		if ( enhanced._m_ctx === undefined )

			enhanced._m_ctx = this

		if ( enhanced._m_stack.length === enhanced._m_index ) {

			enhanced._m_index = 0
			return fn.apply( enhanced._m_ctx, args )
		}

		args.unshift( middle_enhanced_fn ) // pass middle_enhanced_fn as first parameter (next)

		return enhanced._m_stack[ enhanced._m_index++ ].apply( enhanced._m_ctx, args )
	}

	enhanced._m_stack = []
	enhanced._m_index = 0
	enhanced._m_ctx = ctx

	enhanced.use = ( fn, ctx, index ) => {

		if ( typeof index == 'number' )

			enhanced._m_stack.splice( index, 0, fn.bind( ctx ))

		else

			enhanced._m_stack.push( fn.bind( ctx ) )
	}

	enhanced.subscribe = ( fn, ctx, index, onReturn ) => {

		const used = function( next ) {

			const args = Array.prototype.slice.call( arguments )
			args.shift() // remove the "next" parameter
			
			if ( onReturn ){

				const res = next.apply( null, args )
				fn.call( ctx, res )
				return res

			}else{

				fn.apply( ctx, args )
				return next.apply( null, args )
			}

		}

		enhanced.use( used, null, index )

		return used
	}

	return enhanced
}

// ES7 decorator
export function decorator( target, keyOrCtx, descriptor ) {

	if ( !target ) return

	const { writable, enumerable } = descriptor

	return {
		get: function () {

			const enhanced = middle( descriptor.value, this )
			Object.defineProperty( this, keyOrCtx, {
				value: enhanced,
				writable: writable,
				enumerable: enumerable
			} )

			return enhanced
		}
	}
}
