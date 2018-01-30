var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}

var middle = require('../dist/middle.js').default;
var mdeco = require('../dist/middle.js').decorator;

var Dragon = (_class = function () {
	function Dragon() {
		_classCallCheck(this, Dragon);

		this.txt = 'am class';
	}

	_createClass(Dragon, [{
		key: 'drag',
		value: function drag(x, y) {
			console.log('drag', this && this.txt);
			var zzz = this || {};
			return zzz.txt + ' tadaaa ' + x + y;
		}
	}]);

	return Dragon;
}(), (_applyDecoratedDescriptor(_class.prototype, 'drag', [mdeco], Object.getOwnPropertyDescriptor(_class.prototype, 'drag'), _class.prototype)), _class);

// console.log( 'Dragon', Dragon )

Dragon.prototype.drag.use(function (next, x, y) {
	console.log('proto.drag.use', this && this.txt);
	return next(x, y);
});

var dragn = new Dragon();
dragn.txt = 'am instance';
dragn.drag.use(function (next, x, y) {
	console.log('drag.use', this && this.txt);
	return next(x, y);
}, dragn);

var x = dragn.drag(1, 2);
