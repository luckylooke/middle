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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function(undefined){
	    "use strict";
	    function Middle(cb, ctx, init){
	        if (!(this instanceof Middle))
	            throw new Error("Middle needs to be called with the new keyword");
	
	        if(!init){
	            var middleInstance = new Middle(cb, ctx, 'init'),
	                bindedRun = middleInstance.run.bind(middleInstance),
	                useInstance = new Middle(middleInstance.use, middleInstance, 'init'),
	                useInstancebindedRun = useInstance.run.bind(useInstance);
	
	            useInstancebindedRun.use = useInstance.use.bind(useInstance);
	            bindedRun.use = useInstancebindedRun;
	            bindedRun.middle = middleInstance; // access to original instance for dev/debug etc.. purposes
	            return bindedRun;
	        }
	
	        if(typeof cb == 'function')
	            this.callback = cb.bind(ctx == 'middleInstance' ? this : (ctx !== undefined ? ctx : null));
	        else
	            this.callback = function () {};
	
	        this._stack = [];
	        this.id = Math.random(); // dev: contexts identification
	    }
	
	    Middle.prototype.run = function () {
	        var result =  new Runner(this._stack, this.callback, arguments);
	        if(result.__mPrVaPr__ === '__mUnPr__') // mPrVaPr = middlePrimitiveValueProtection, mUnPr = middleUndefinedProtection
	            return undefined;
	        else if(result.__mPrVaPr__ !== undefined)
	            return result.__mPrVaPr__;
	        //else
	        return result;
	    };
	
	    Middle.prototype.use = function (fn, ctx) {
	        this._stack.push(ctx !== undefined ? fn.bind(ctx) : fn);
	    };
	
	    function Runner(stack, cb, args){
	        this._stack = stack;
	        this.callback = cb;
	
	        if(!this._stack.length)
	            return this.result(this.callback.apply(null, args));
	
	        this._stackIndex = 0;
	        this._stackLen = this._stack.length;
	        return this.result(this.next.apply(this, args));
	    }
	
	    Runner.prototype.next = function() {
	        if(this._stackIndex < this._stackLen){
	            this._stackIndex++;
	            return this._stack[this._stackIndex - 1]
	                .bind(null, this.next.bind(this))
	                .apply(null, arguments);
	        }else{
	            return this.callback.apply(null, arguments);
	        }
	    };
	
	    Runner.prototype.result = function(val) {
	        if(typeof val == 'object')
	            return val;
	        else if(val !== undefined)
	            return {__mPrVaPr__: val};
	        else
	            return {__mPrVaPr__: '__mUnPr__'};
	    };
	
	    if(true)
	        module.exports = Middle;
	})();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=middle.js.map