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

	var enhanced = function middle_enhanced_fn() {

		var arg = Array.prototype.slice.call(arguments);

		if (enhanced._m_ctx === undefined) enhanced._m_ctx = this;

		if (enhanced._m_stack.length === enhanced._m_index) {

			enhanced._m_index = 0;
			return fn.apply(enhanced._m_ctx, arg);
		}

		arg.unshift(middle_enhanced_fn);
		return enhanced._m_stack[enhanced._m_index++].apply(enhanced._m_ctx, arg);
	};

	enhanced._m_stack = [];
	enhanced._m_index = 0;
	enhanced._m_ctx = ctx;

	enhanced.use = function (fn, ctx) {

		enhanced._m_stack.push(fn.bind(ctx));
	};

	return enhanced;
}

// ES7 decorator
function decorator(target, keyOrCtx, descriptor) {

	if (!target) return;

	var writable = descriptor.writable,
	    enumerable = descriptor.enumerable;


	return {
		get: function get() {

			var enhanced = middle(descriptor.value, this);
			Object.defineProperty(this, keyOrCtx, {
				value: enhanced,
				writable: writable,
				enumerable: enumerable
			});

			return enhanced;
		}
	};
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=middle.js.map