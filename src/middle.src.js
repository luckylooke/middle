'use strict'

export default function middle( fn, ctx ) {

	let enhanced = function middle_enhanced_fn() {

		let arg = Array.prototype.slice.call( arguments )

		if ( enhanced._m_ctx === undefined )
			enhanced._m_ctx = this

		if ( enhanced._m_stack.length === enhanced._m_index ) {

			enhanced._m_index = 0
			return fn.apply( enhanced._m_ctx, arg )
		}

		arg.unshift( middle_enhanced_fn )
		return enhanced._m_stack[ enhanced._m_index++ ].apply( enhanced._m_ctx, arg )
	}

	enhanced._m_stack = []
	enhanced._m_index = 0
	enhanced._m_ctx = ctx

	enhanced.use = ( fn, ctx ) => {

		enhanced._m_stack.push( fn.bind( ctx ) )
	}

	return enhanced;
}

// ES7 decorator
export function decorator( target, keyOrCtx, descriptor ) {

	if ( !target ) return

	let { writable, enumerable } = descriptor

	return {
		get: function () {

			let enhanced = middle( descriptor.value, this )
			Object.defineProperty( this, keyOrCtx, {
				value: enhanced,
				writable: writable,
				enumerable: enumerable
			} )

			return enhanced
		}
	}
}
