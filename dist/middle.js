(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Middle", [], factory);
	else if(typeof exports === 'object')
		exports["Middle"] = factory();
	else
		root["Middle"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = middle;
exports.decorator = decorator;
function middle(fn, ctx) {

	// TODO: Consider Enhanced class ---> enhanced = new Enhanaced() ???

	var enhanced = middle_enhanced_fn;

	enhanced._m_stack = [];
	enhanced._m_index = 0;
	enhanced._m_ctx = ctx;

	function middle_enhanced_fn() {

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments#Using_the_Spread_Syntax_with_Arguments
		var args = [].concat(Array.prototype.slice.call(arguments));

		if (!ctx && (ctx === undefined || ctx === null)) {
			enhanced._m_ctx = ctx = this;
		} else {
			enhanced._m_ctx = ctx;
		}
		// console.log('middle_enhanced_fn ctx', ctx )

		if (enhanced._m_stack.length === enhanced._m_index) {
			enhanced._m_index = 0;
			return fn.apply(ctx, args);
		}

		args.unshift(middle_enhanced_fn); // pass middle_enhanced_fn as "next" function in first parameter

		return enhanced._m_stack[enhanced._m_index++].apply(ctx, args);
	}

	enhanced.use = function (useFn, useCtx, index) {

		var bound = void 0;

		if (useCtx !== undefined && useCtx !== null) bound = useFn.bind(useCtx);

		if (typeof index == 'number') enhanced._m_stack.splice(index, 0, bound || useFn);else enhanced._m_stack.push(bound || useFn);
	};

	enhanced.subscribe = function (subFn, subCtx, index, onReturn) {

		var used = function used(next) {

			var args = [].concat(Array.prototype.slice.call(arguments));

			if (!subCtx && (subCtx === undefined || subCtx === null)) subCtx = ctx;

			if (onReturn) {

				var res = next.apply(ctx, args); // continue chain
				subFn.call(subCtx, res); // call callback on return path
				return res;
			} else {

				args.shift(); // remove the "next" parameter
				subFn.apply(subCtx, args);
				args.unshift(next); // put the "next" parameter back
				return next.apply(ctx, args); // continue chain
			}
		};

		enhanced.use(used, undefined, index);

		return used;
	};

	return enhanced;
}

// ES7 decorator ( https://www.martin-brennan.com/es7-decorators/ )
function decorator(target, key, descriptor) {

	if (!target) return;

	var writable = descriptor.writable,
	    enumerable = descriptor.enumerable;


	return {
		get: function get() {

			var newEnhanced = middle(descriptor.value);
			Object.defineProperty(this, key, {
				value: newEnhanced,
				writable: writable,
				enumerable: enumerable
			});

			return newEnhanced;
		}
	};
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=middle.js.map