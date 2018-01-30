let middle = require( '../dist/middle.js' ).default
let mdeco = require( '../dist/middle.js' ).decorator



	class Dragon {

		txt = 'am class'

		@mdeco
		drag( x, y ) {
			console.log('drag', this && this.txt )
			const zzz = this || {}
			return zzz.txt + ' tadaaa ' + x + y
		}
	}

	// console.log( 'Dragon', Dragon )

	Dragon.prototype.drag.use(function( next, x, y ) {
		console.log('proto.drag.use', this && this.txt )
		return next( x, y )
	})

	let dragn = new Dragon
	dragn.txt = 'am instance'
	dragn.drag.use(function( next, x, y ) {
		console.log('drag.use', this && this.txt )
		return next( x, y )
	}, dragn)

	let x = dragn.drag( 1, 2 )



