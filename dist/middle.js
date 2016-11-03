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

	/*
	* https://github.com/luckylooke/middle/releases/tag/v2.0.0
	* */
	(function(undefined){
	    function Middle(cb, ctx, init){
	        if (!(this instanceof Middle))
	            throw new Error("Middle needs to be called with the new keyword");
	
	        if(!init){
	            var middleInstance = new Middle(cb, ctx, 'mi'),
	                middleRun = middleInstance.run,
	                useInstance = new Middle(middleInstance.use, middleInstance, 'ui'),
	                useInstanceRun = useInstance.run;
	
	            useInstanceRun.use = useInstance.use.bind(useInstance);
	            setProps(useInstanceRun, useInstance);
	
	            middleRun.use = useInstanceRun;
	            setProps(middleRun, middleInstance);
	            return middleRun;
	        }
	
	        if(typeof cb == 'function')
	            this.callback = (ctx == 'middleInstance') ? cb.bind(this) : (ctx !== undefined ? cb.bind(ctx) : cb);
	        else
	            this.callback = function () {};
	
	        this.run = function() { // must be inside constructor because we pass instance info via its object
	            return callRunner(arguments, this);
	        };
	        this._stack = [];
	        // this.id = Math.random() + init; // dev: contexts identification
	    }
	
	    Middle.prototype.use = function(fn, ctx) {
	        this._stack.push(ctx !== undefined ? fn.bind(ctx) : fn);
	    };
	
	    function callRunner(args, ctx) {
	        var result =  new Runner(args, ctx);
	        if(result.__mPrVaPr__ === '__mUnPr__') // mPrVaPr = middlePrimitiveValueProtection, mUnPr = middleUndefinedProtection
	            return undefined;
	        else if(result.__mPrVaPr__ !== undefined)
	            return result.__mPrVaPr__;
	        //else
	        return result;
	    }
	
	    function setProps(to, from) {
	        to._stack = from._stack;
	        to.callback = from.callback;
	        to.middle = from; // access to original instance
	    }
	
	    function Runner(args, ctx){
	        this._stack = args.callee._stack;
	        this.callback = args.callee.callback.bind(ctx);
	
	        if(!this._stack.length)
	            return this.result(this.callback.apply(null, args));
	
	        this._stackIndex = 0;
	        this._stackLen = this._stack.length;
	        return this.result(this.next.apply(this, args));
	    }
	
	    Runner.prototype.next = function () {
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