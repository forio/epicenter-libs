/*! Epicenter v3.2.0-alpha */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["epicenter"] = factory();
	else
		root["epicenter"] = factory();
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/construct.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct */ "./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js");

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/get.js":
/*!****************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/get.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var superPropBase = __webpack_require__(/*! ./superPropBase */ "./node_modules/@babel/runtime/helpers/superPropBase.js");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/isNativeFunction.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeFunction.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

module.exports = _isNativeFunction;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = _isNativeReflectConstruct;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/objectWithoutProperties.js":
/*!************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectWithoutProperties.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var objectWithoutPropertiesLoose = __webpack_require__(/*! ./objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ../helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");

var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/superPropBase.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/superPropBase.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ./getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/wrapNativeSuper.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/wrapNativeSuper.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ./getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");

var isNativeFunction = __webpack_require__(/*! ./isNativeFunction */ "./node_modules/@babel/runtime/helpers/isNativeFunction.js");

var construct = __webpack_require__(/*! ./construct */ "./node_modules/@babel/runtime/helpers/construct.js");

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/cometd/AckExtension.js":
/*!*********************************************!*\
  !*** ./node_modules/cometd/AckExtension.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright (c) 2008-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory){
    if (true) {
        module.exports = factory(__webpack_require__(/*! ./cometd */ "./node_modules/cometd/cometd.js"));
    } else {}
}(this, function(cometdModule) {
    /**
     * This client-side extension enables the client to acknowledge to the server
     * the messages that the client has received.
     * For the acknowledgement to work, the server must be configured with the
     * correspondent server-side ack extension. If both client and server support
     * the ack extension, then the ack functionality will take place automatically.
     * By enabling this extension, all messages arriving from the server will arrive
     * via /meta/connect, so the comet communication will be slightly chattier.
     * The fact that all messages will return via /meta/connect means also that the
     * messages will arrive with total order, which is not guaranteed if messages
     * can arrive via both /meta/connect and normal response.
     * Messages are not acknowledged one by one, but instead a batch of messages is
     * acknowledged when the /meta/connect returns.
     */
    return cometdModule.AckExtension = function() {
        var _cometd;
        var _serverSupportsAcks = false;
        var _batch;

        function _debug(text, args) {
            _cometd._debug(text, args);
        }

        this.registered = function(name, cometd) {
            _cometd = cometd;
            _debug('AckExtension: executing registration callback');
        };

        this.unregistered = function() {
            _debug('AckExtension: executing unregistration callback');
            _cometd = null;
        };

        this.incoming = function(message) {
            var channel = message.channel;
            var ext = message.ext;
            if (channel === '/meta/handshake') {
                if (ext) {
                    var ackField = ext.ack;
                    if (typeof ackField === 'object') {
                        // New format.
                        _serverSupportsAcks = ackField.enabled === true;
                        var batch = ackField.batch;
                        if (typeof batch === 'number') {
                            _batch = batch;
                        }
                    } else {
                        // Old format.
                        _serverSupportsAcks = ackField === true;
                    }
                }
                _debug('AckExtension: server supports acknowledgements', _serverSupportsAcks);
            } else if (channel === '/meta/connect' && message.successful && _serverSupportsAcks) {
                if (ext && typeof ext.ack === 'number') {
                    _batch = ext.ack;
                    _debug('AckExtension: server sent batch', _batch);
                }
            }
            return message;
        };

        this.outgoing = function(message) {
            var channel = message.channel;
            if (!message.ext) {
                message.ext = {};
            }
            if (channel === '/meta/handshake') {
                message.ext.ack = _cometd && _cometd.ackEnabled !== false;
                _serverSupportsAcks = false;
                _batch = 0;
            } else if (channel === '/meta/connect') {
                if (_serverSupportsAcks) {
                    message.ext.ack = _batch;
                    _debug('AckExtension: client sending batch', _batch);
                }
            }
            return message;
        };
    };
}));


/***/ }),

/***/ "./node_modules/cometd/ReloadExtension.js":
/*!************************************************!*\
  !*** ./node_modules/cometd/ReloadExtension.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright (c) 2008-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
    if (true) {
        module.exports = factory(__webpack_require__(/*! ./cometd */ "./node_modules/cometd/cometd.js"));
    } else {}
}(this, function(cometdModule) {
    /**
     * The reload extension allows a page to be loaded (or reloaded)
     * without having to re-handshake in the new (or reloaded) page,
     * therefore resuming the existing CometD connection.
     *
     * When the reload() method is called, the state of the CometD
     * connection is stored in the window.sessionStorage object.
     * The reload() method must therefore be called by page unload
     * handlers, often provided by JavaScript toolkits.
     *
     * When the page is (re)loaded, this extension checks the
     * window.sessionStorage and restores the CometD connection,
     * maintaining the same CometD clientId.
     */
    return cometdModule.ReloadExtension = function(configuration) {
        var _cometd;
        var _debug;
        var _state = {};
        var _name = 'org.cometd.reload';
        var _batch = false;
        var _reloading = false;

        function _reload(config) {
            if (_state.handshakeResponse) {
                _reloading = true;
                var transport = _cometd.getTransport();
                if (transport) {
                    transport.abort();
                }
                _configure(config);
                var state = JSON.stringify(_state);
                _debug('Reload extension saving state', state);
                window.sessionStorage.setItem(_name, state);
            }
        }

        function _similarState(oldState) {
            // We want to check here that the CometD object
            // did not change much between reloads.
            // We just check the URL for now, but in future
            // further checks may involve the transport type
            // and other configuration parameters.
            return _state.url === oldState.url;
        }

        function _configure(config) {
            if (config) {
                if (typeof config.name === 'string') {
                    _name = config.name;
                }
            }
        }

        function _receive(response) {
            _cometd.receive(response);
        }

        this.configure = _configure;

        this._receive = _receive;

        this.registered = function(name, cometd) {
            _cometd = cometd;
            _cometd.reload = _reload;
            _debug = _cometd._debug;
        };

        this.unregistered = function() {
            delete _cometd.reload;
            _cometd = null;
        };

        this.outgoing = function(message) {
            switch (message.channel) {
                case '/meta/handshake':
                {
                    _state = {};
                    _state.url = _cometd.getURL();

                    var state = window.sessionStorage.getItem(_name);
                    _debug('Reload extension found state', state);
                    // Is there a saved handshake response from a prior load ?
                    if (state) {
                        try {
                            var oldState = JSON.parse(state);

                            // Remove the state, not needed anymore
                            window.sessionStorage.removeItem(_name);

                            if (oldState.handshakeResponse && _similarState(oldState)) {
                                _debug('Reload extension restoring state', oldState);

                                // Since we are going to abort this message,
                                // we must save an eventual callback to restore
                                // it when we replay the handshake response.
                                var callback = _cometd._getCallback(message.id);

                                var self = this;
                                setTimeout(function() {
                                    _debug('Reload extension replaying handshake response', oldState.handshakeResponse);
                                    _state.handshakeResponse = oldState.handshakeResponse;
                                    _state.transportType = oldState.transportType;

                                    // Restore the callback.
                                    _cometd._putCallback(message.id, callback);

                                    var response = _cometd._mixin(true, {}, _state.handshakeResponse, {
                                        // Keep the response message id the same as the request.
                                        id: message.id,
                                        // Tells applications this is a handshake replayed by the reload extension.
                                        ext: {
                                            reload: true
                                        }
                                    });
                                    // Use the same transport as before.
                                    response.supportedConnectionTypes = [_state.transportType];

                                    self._receive(response);
                                    _debug('Reload extension replayed handshake response', response);
                                }, 0);

                                // Delay any sends until first connect is complete.
                                // This avoids that there is an old /meta/connect pending on server
                                // that will be resumed to send messages to the client, when the
                                // client has already closed the connection, thereby losing the messages.
                                if (!_batch) {
                                    _batch = true;
                                    _cometd.startBatch();
                                }

                                // This handshake is aborted, as we will replay the prior handshake response
                                return null;
                            } else {
                                _debug('Reload extension could not restore state', oldState);
                            }
                        } catch (x) {
                            _debug('Reload extension error while trying to restore state', x);
                        }
                    }
                    break;
                }
                case '/meta/connect':
                {
                    if (_reloading === true) {
                        // The reload causes the failure of the outstanding /meta/connect,
                        // which CometD will react to by sending another. Here we avoid
                        // that /meta/connect messages are sent between the reload and
                        // the destruction of the JavaScript context, so that we are sure
                        // that the first /meta/connect is the one triggered after the
                        // replay of the /meta/handshake by this extension.
                        _debug('Reload extension aborting /meta/connect during reload');
                        return null;
                    }

                    if (!_state.transportType) {
                        _state.transportType = message.connectionType;
                        _debug('Reload extension tracked transport type', _state.transportType);
                    }
                    break;
                }
                case '/meta/disconnect':
                {
                    _state = {};
                    break;
                }
                default:
                {
                    break;
                }
            }
            return message;
        };

        this.incoming = function(message) {
            if (message.successful) {
                switch (message.channel) {
                    case '/meta/handshake':
                    {
                        // If the handshake response is already present, then we're replaying it.
                        // Since the replay may have modified the handshake response, do not record it here.
                        if (!_state.handshakeResponse) {
                            // Save successful handshake response
                            _state.handshakeResponse = message;
                            _debug('Reload extension tracked handshake response', message);
                        }
                        break;
                    }
                    case '/meta/connect':
                    {
                        if (_batch) {
                            _batch = false;
                            _cometd.endBatch();
                        }
                        break;
                    }
                    case '/meta/disconnect':
                    {
                        _state = {};
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }
            return message;
        };

        _configure(configuration);
    };
}));


/***/ }),

/***/ "./node_modules/cometd/cometd.js":
/*!***************************************!*\
  !*** ./node_modules/cometd/cometd.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright (c) 2008-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* CometD Version 4.0.7 */

(function(root, factory) {
    if (true) {
        // CommonJS.
        module.exports = factory();
    } else {}
}(this, function() {
    /**
     * Browsers may throttle the Window scheduler,
     * so we may replace it with a Worker scheduler.
     */
    var Scheduler = function() {
        var _ids = 0;
        var _tasks = {};
        this.register = function(funktion) {
            var id = ++_ids;
            _tasks[id] = funktion;
            return id;
        };
        this.unregister = function(id) {
            var funktion = _tasks[id];
            delete _tasks[id];
            return funktion;
        };
        this.setTimeout = function(funktion, delay) {
            return window.setTimeout(funktion, delay);
        };
        this.clearTimeout = function(id) {
            window.clearTimeout(id);
        };
    };

    /**
     * The scheduler code that will run in the Worker.
     * Workers have a built-in `self` variable similar to `window`.
     */
    function WorkerScheduler() {
        var _tasks = {};
        self.onmessage = function(e) {
            var cmd = e.data;
            var id = _tasks[cmd.id];
            switch (cmd.type) {
                case 'setTimeout':
                    _tasks[cmd.id] = self.setTimeout(function() {
                        delete _tasks[cmd.id];
                        self.postMessage({
                            id: cmd.id
                        });
                    }, cmd.delay);
                    break;
                case 'clearTimeout':
                    delete _tasks[cmd.id];
                    if (id) {
                        self.clearTimeout(id);
                    }
                    break;
                default:
                    throw 'Unknown command ' + cmd.type;
            }
        };
    }


    /**
     * Utility functions.
     */
    var Utils = {
        isString: function(value) {
            if (value === undefined || value === null) {
                return false;
            }
            return typeof value === 'string' || value instanceof String;
        },
        isArray: function(value) {
            if (value === undefined || value === null) {
                return false;
            }
            return value instanceof Array;
        },
        /**
         * Returns whether the given element is contained into the given array.
         * @param element the element to check presence for
         * @param array the array to check for the element presence
         * @return the index of the element, if present, or a negative index if the element is not present
         */
        inArray: function(element, array) {
            for (var i = 0; i < array.length; ++i) {
                if (element === array[i]) {
                    return i;
                }
            }
            return -1;
        }
    };


    /**
     * A registry for transports used by the CometD object.
     */
    var TransportRegistry = function() {
        var _types = [];
        var _transports = {};

        this.getTransportTypes = function() {
            return _types.slice(0);
        };

        this.findTransportTypes = function(version, crossDomain, url) {
            var result = [];
            for (var i = 0; i < _types.length; ++i) {
                var type = _types[i];
                if (_transports[type].accept(version, crossDomain, url) === true) {
                    result.push(type);
                }
            }
            return result;
        };

        this.negotiateTransport = function(types, version, crossDomain, url) {
            for (var i = 0; i < _types.length; ++i) {
                var type = _types[i];
                for (var j = 0; j < types.length; ++j) {
                    if (type === types[j]) {
                        var transport = _transports[type];
                        if (transport.accept(version, crossDomain, url) === true) {
                            return transport;
                        }
                    }
                }
            }
            return null;
        };

        this.add = function(type, transport, index) {
            var existing = false;
            for (var i = 0; i < _types.length; ++i) {
                if (_types[i] === type) {
                    existing = true;
                    break;
                }
            }

            if (!existing) {
                if (typeof index !== 'number') {
                    _types.push(type);
                } else {
                    _types.splice(index, 0, type);
                }
                _transports[type] = transport;
            }

            return !existing;
        };

        this.find = function(type) {
            for (var i = 0; i < _types.length; ++i) {
                if (_types[i] === type) {
                    return _transports[type];
                }
            }
            return null;
        };

        this.remove = function(type) {
            for (var i = 0; i < _types.length; ++i) {
                if (_types[i] === type) {
                    _types.splice(i, 1);
                    var transport = _transports[type];
                    delete _transports[type];
                    return transport;
                }
            }
            return null;
        };

        this.clear = function() {
            _types = [];
            _transports = {};
        };

        this.reset = function(init) {
            for (var i = 0; i < _types.length; ++i) {
                _transports[_types[i]].reset(init);
            }
        };
    };


    /**
     * Base object with the common functionality for transports.
     */
    var Transport = function() {
        var _type;
        var _cometd;
        var _url;

        /**
         * Function invoked just after a transport has been successfully registered.
         * @param type the type of transport (for example 'long-polling')
         * @param cometd the cometd object this transport has been registered to
         * @see #unregistered()
         */
        this.registered = function(type, cometd) {
            _type = type;
            _cometd = cometd;
        };

        /**
         * Function invoked just after a transport has been successfully unregistered.
         * @see #registered(type, cometd)
         */
        this.unregistered = function() {
            _type = null;
            _cometd = null;
        };

        this._debug = function() {
            _cometd._debug.apply(_cometd, arguments);
        };

        this._mixin = function() {
            return _cometd._mixin.apply(_cometd, arguments);
        };

        this.getConfiguration = function() {
            return _cometd.getConfiguration();
        };

        this.getAdvice = function() {
            return _cometd.getAdvice();
        };

        this.setTimeout = function(funktion, delay) {
            return _cometd.setTimeout(funktion, delay);
        };

        this.clearTimeout = function(id) {
            _cometd.clearTimeout(id);
        };

        /**
         * Converts the given response into an array of bayeux messages
         * @param response the response to convert
         * @return an array of bayeux messages obtained by converting the response
         */
        this.convertToMessages = function(response) {
            if (Utils.isString(response)) {
                try {
                    return JSON.parse(response);
                } catch (x) {
                    this._debug('Could not convert to JSON the following string', '"' + response + '"');
                    throw x;
                }
            }
            if (Utils.isArray(response)) {
                return response;
            }
            if (response === undefined || response === null) {
                return [];
            }
            if (response instanceof Object) {
                return [response];
            }
            throw 'Conversion Error ' + response + ', typeof ' + (typeof response);
        };

        /**
         * Returns whether this transport can work for the given version and cross domain communication case.
         * @param version a string indicating the transport version
         * @param crossDomain a boolean indicating whether the communication is cross domain
         * @param url the URL to connect to
         * @return true if this transport can work for the given version and cross domain communication case,
         * false otherwise
         */
        this.accept = function(version, crossDomain, url) {
            throw 'Abstract';
        };

        /**
         * Returns the type of this transport.
         * @see #registered(type, cometd)
         */
        this.getType = function() {
            return _type;
        };

        this.getURL = function() {
            return _url;
        };

        this.setURL = function(url) {
            _url = url;
        };

        this.send = function(envelope, metaConnect) {
            throw 'Abstract';
        };

        this.reset = function(init) {
            this._debug('Transport', _type, 'reset', init ? 'initial' : 'retry');
        };

        this.abort = function() {
            this._debug('Transport', _type, 'aborted');
        };

        this.toString = function() {
            return this.getType();
        };
    };

    Transport.derive = function(baseObject) {
        function F() {
        }

        F.prototype = baseObject;
        return new F();
    };


    /**
     * Base object with the common functionality for transports based on requests.
     * The key responsibility is to allow at most 2 outstanding requests to the server,
     * to avoid that requests are sent behind a long poll.
     * To achieve this, we have one reserved request for the long poll, and all other
     * requests are serialized one after the other.
     */
    var RequestTransport = function() {
        var _super = new Transport();
        var _self = Transport.derive(_super);
        var _requestIds = 0;
        var _metaConnectRequest = null;
        var _requests = [];
        var _envelopes = [];

        function _coalesceEnvelopes(envelope) {
            while (_envelopes.length > 0) {
                var envelopeAndRequest = _envelopes[0];
                var newEnvelope = envelopeAndRequest[0];
                var newRequest = envelopeAndRequest[1];
                if (newEnvelope.url === envelope.url &&
                    newEnvelope.sync === envelope.sync) {
                    _envelopes.shift();
                    envelope.messages = envelope.messages.concat(newEnvelope.messages);
                    this._debug('Coalesced', newEnvelope.messages.length, 'messages from request', newRequest.id);
                    continue;
                }
                break;
            }
        }

        function _transportSend(envelope, request) {
            this.transportSend(envelope, request);
            request.expired = false;

            if (!envelope.sync) {
                var maxDelay = this.getConfiguration().maxNetworkDelay;
                var delay = maxDelay;
                if (request.metaConnect === true) {
                    delay += this.getAdvice().timeout;
                }

                this._debug('Transport', this.getType(), 'waiting at most', delay, 'ms for the response, maxNetworkDelay', maxDelay);

                var self = this;
                request.timeout = this.setTimeout(function() {
                    request.expired = true;
                    var errorMessage = 'Request ' + request.id + ' of transport ' + self.getType() + ' exceeded ' + delay + ' ms max network delay';
                    var failure = {
                        reason: errorMessage
                    };
                    var xhr = request.xhr;
                    failure.httpCode = self.xhrStatus(xhr);
                    self.abortXHR(xhr);
                    self._debug(errorMessage);
                    self.complete(request, false, request.metaConnect);
                    envelope.onFailure(xhr, envelope.messages, failure);
                }, delay);
            }
        }

        function _queueSend(envelope) {
            var requestId = ++_requestIds;
            var request = {
                id: requestId,
                metaConnect: false,
                envelope: envelope
            };

            // Consider the /meta/connect requests which should always be present.
            if (_requests.length < this.getConfiguration().maxConnections - 1) {
                _requests.push(request);
                _transportSend.call(this, envelope, request);
            } else {
                this._debug('Transport', this.getType(), 'queueing request', requestId, 'envelope', envelope);
                _envelopes.push([envelope, request]);
            }
        }

        function _metaConnectComplete(request) {
            var requestId = request.id;
            this._debug('Transport', this.getType(), '/meta/connect complete, request', requestId);
            if (_metaConnectRequest !== null && _metaConnectRequest.id !== requestId) {
                throw '/meta/connect request mismatch, completing request ' + requestId;
            }
            _metaConnectRequest = null;
        }

        function _complete(request, success) {
            var index = Utils.inArray(request, _requests);
            // The index can be negative if the request has been aborted
            if (index >= 0) {
                _requests.splice(index, 1);
            }

            if (_envelopes.length > 0) {
                var envelopeAndRequest = _envelopes.shift();
                var nextEnvelope = envelopeAndRequest[0];
                var nextRequest = envelopeAndRequest[1];
                this._debug('Transport dequeued request', nextRequest.id);
                if (success) {
                    if (this.getConfiguration().autoBatch) {
                        _coalesceEnvelopes.call(this, nextEnvelope);
                    }
                    _queueSend.call(this, nextEnvelope);
                    this._debug('Transport completed request', request.id, nextEnvelope);
                } else {
                    // Keep the semantic of calling response callbacks asynchronously after the request
                    var self = this;
                    this.setTimeout(function() {
                        self.complete(nextRequest, false, nextRequest.metaConnect);
                        var failure = {
                            reason: 'Previous request failed'
                        };
                        var xhr = nextRequest.xhr;
                        failure.httpCode = self.xhrStatus(xhr);
                        nextEnvelope.onFailure(xhr, nextEnvelope.messages, failure);
                    }, 0);
                }
            }
        }

        _self.complete = function(request, success, metaConnect) {
            if (metaConnect) {
                _metaConnectComplete.call(this, request);
            } else {
                _complete.call(this, request, success);
            }
        };

        /**
         * Performs the actual send depending on the transport type details.
         * @param envelope the envelope to send
         * @param request the request information
         */
        _self.transportSend = function(envelope, request) {
            throw 'Abstract';
        };

        _self.transportSuccess = function(envelope, request, responses) {
            if (!request.expired) {
                this.clearTimeout(request.timeout);
                this.complete(request, true, request.metaConnect);
                if (responses && responses.length > 0) {
                    envelope.onSuccess(responses);
                } else {
                    envelope.onFailure(request.xhr, envelope.messages, {
                        httpCode: 204
                    });
                }
            }
        };

        _self.transportFailure = function(envelope, request, failure) {
            if (!request.expired) {
                this.clearTimeout(request.timeout);
                this.complete(request, false, request.metaConnect);
                envelope.onFailure(request.xhr, envelope.messages, failure);
            }
        };

        function _metaConnectSend(envelope) {
            if (_metaConnectRequest !== null) {
                throw 'Concurrent /meta/connect requests not allowed, request id=' + _metaConnectRequest.id + ' not yet completed';
            }

            var requestId = ++_requestIds;
            this._debug('Transport', this.getType(), '/meta/connect send, request', requestId, 'envelope', envelope);
            var request = {
                id: requestId,
                metaConnect: true,
                envelope: envelope
            };
            _transportSend.call(this, envelope, request);
            _metaConnectRequest = request;
        }

        _self.send = function(envelope, metaConnect) {
            if (metaConnect) {
                _metaConnectSend.call(this, envelope);
            } else {
                _queueSend.call(this, envelope);
            }
        };

        _self.abort = function() {
            _super.abort();
            for (var i = 0; i < _requests.length; ++i) {
                var request = _requests[i];
                if (request) {
                    this._debug('Aborting request', request);
                    if (!this.abortXHR(request.xhr)) {
                        this.transportFailure(request.envelope, request, {reason: 'abort'});
                    }
                }
            }
            var metaConnectRequest = _metaConnectRequest;
            if (metaConnectRequest) {
                this._debug('Aborting /meta/connect request', metaConnectRequest);
                if (!this.abortXHR(metaConnectRequest.xhr)) {
                    this.transportFailure(metaConnectRequest.envelope, metaConnectRequest, {reason: 'abort'});
                }
            }
            this.reset(true);
        };

        _self.reset = function(init) {
            _super.reset(init);
            _metaConnectRequest = null;
            _requests = [];
            _envelopes = [];
        };

        _self.abortXHR = function(xhr) {
            if (xhr) {
                try {
                    var state = xhr.readyState;
                    xhr.abort();
                    return state !== window.XMLHttpRequest.UNSENT;
                } catch (x) {
                    this._debug(x);
                }
            }
            return false;
        };

        _self.xhrStatus = function(xhr) {
            if (xhr) {
                try {
                    return xhr.status;
                } catch (x) {
                    this._debug(x);
                }
            }
            return -1;
        };

        return _self;
    };


    var LongPollingTransport = function() {
        var _super = new RequestTransport();
        var _self = Transport.derive(_super);
        // By default, support cross domain
        var _supportsCrossDomain = true;

        _self.accept = function(version, crossDomain, url) {
            return _supportsCrossDomain || !crossDomain;
        };

        _self.newXMLHttpRequest = function() {
            return new window.XMLHttpRequest();
        };

        function _copyContext(xhr) {
            try {
                // Copy external context, to be used in other environments.
                xhr.context = _self.context;
            } catch (e) {
                // May happen if XHR is wrapped by Object.seal(),
                // Object.freeze(), or Object.preventExtensions().
                this._debug('Could not copy transport context into XHR', e);
            }
        }

        _self.xhrSend = function(packet) {
            var xhr = _self.newXMLHttpRequest();
            _copyContext(xhr);
            xhr.withCredentials = true;
            xhr.open('POST', packet.url, packet.sync !== true);
            var headers = packet.headers;
            if (headers) {
                for (var headerName in headers) {
                    if (headers.hasOwnProperty(headerName)) {
                        xhr.setRequestHeader(headerName, headers[headerName]);
                    }
                }
            }
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    packet.onSuccess(xhr.responseText);
                } else {
                    packet.onError(xhr.statusText);
                }
            };
            xhr.onabort = xhr.onerror = function() {
                packet.onError(xhr.statusText);
            };
            xhr.send(packet.body);
            return xhr;
        };

        _self.transportSend = function(envelope, request) {
            this._debug('Transport', this.getType(), 'sending request', request.id, 'envelope', envelope);

            var self = this;
            try {
                var sameStack = true;
                request.xhr = this.xhrSend({
                    transport: this,
                    url: envelope.url,
                    sync: envelope.sync,
                    headers: this.getConfiguration().requestHeaders,
                    body: JSON.stringify(envelope.messages),
                    onSuccess: function(response) {
                        self._debug('Transport', self.getType(), 'received response', response);
                        var success = false;
                        try {
                            var received = self.convertToMessages(response);
                            if (received.length === 0) {
                                _supportsCrossDomain = false;
                                self.transportFailure(envelope, request, {
                                    httpCode: 204
                                });
                            } else {
                                success = true;
                                self.transportSuccess(envelope, request, received);
                            }
                        } catch (x) {
                            self._debug(x);
                            if (!success) {
                                _supportsCrossDomain = false;
                                var failure = {
                                    exception: x
                                };
                                failure.httpCode = self.xhrStatus(request.xhr);
                                self.transportFailure(envelope, request, failure);
                            }
                        }
                    },
                    onError: function(reason, exception) {
                        self._debug('Transport', self.getType(), 'received error', reason, exception);
                        _supportsCrossDomain = false;
                        var failure = {
                            reason: reason,
                            exception: exception
                        };
                        failure.httpCode = self.xhrStatus(request.xhr);
                        if (sameStack) {
                            // Keep the semantic of calling response callbacks asynchronously after the request
                            self.setTimeout(function() {
                                self.transportFailure(envelope, request, failure);
                            }, 0);
                        } else {
                            self.transportFailure(envelope, request, failure);
                        }
                    }
                });
                sameStack = false;
            } catch (x) {
                _supportsCrossDomain = false;
                // Keep the semantic of calling response callbacks asynchronously after the request
                this.setTimeout(function() {
                    self.transportFailure(envelope, request, {
                        exception: x
                    });
                }, 0);
            }
        };

        _self.reset = function(init) {
            _super.reset(init);
            _supportsCrossDomain = true;
        };

        return _self;
    };


    var CallbackPollingTransport = function() {
        var _super = new RequestTransport();
        var _self = Transport.derive(_super);
        var jsonp = 0;

        _self.accept = function(version, crossDomain, url) {
            return true;
        };

        _self.jsonpSend = function(packet) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');

            var callbackName = '_cometd_jsonp_' + jsonp++;
            window[callbackName] = function(responseText) {
                head.removeChild(script);
                delete window[callbackName];
                packet.onSuccess(responseText);
            };

            var url = packet.url;
            url += url.indexOf('?') < 0 ? '?' : '&';
            url += 'jsonp=' + callbackName;
            url += '&message=' + encodeURIComponent(packet.body);
            script.src = url;
            script.async = packet.sync !== true;
            script.type = 'application/javascript';
            script.onerror = function(e) {
                packet.onError('jsonp ' + e.type);
            };
            head.appendChild(script);
        };

        function _failTransportFn(envelope, request, x) {
            var self = this;
            return function() {
                self.transportFailure(envelope, request, 'error', x);
            };
        }

        _self.transportSend = function(envelope, request) {
            var self = this;

            // Microsoft Internet Explorer has a 2083 URL max length
            // We must ensure that we stay within that length
            var start = 0;
            var length = envelope.messages.length;
            var lengths = [];
            while (length > 0) {
                // Encode the messages because all brackets, quotes, commas, colons, etc
                // present in the JSON will be URL encoded, taking many more characters
                var json = JSON.stringify(envelope.messages.slice(start, start + length));
                var urlLength = envelope.url.length + encodeURI(json).length;

                var maxLength = this.getConfiguration().maxURILength;
                if (urlLength > maxLength) {
                    if (length === 1) {
                        var x = 'Bayeux message too big (' + urlLength + ' bytes, max is ' + maxLength + ') ' +
                            'for transport ' + this.getType();
                        // Keep the semantic of calling response callbacks asynchronously after the request
                        this.setTimeout(_failTransportFn.call(this, envelope, request, x), 0);
                        return;
                    }

                    --length;
                    continue;
                }

                lengths.push(length);
                start += length;
                length = envelope.messages.length - start;
            }

            // Here we are sure that the messages can be sent within the URL limit

            var envelopeToSend = envelope;
            if (lengths.length > 1) {
                var begin = 0;
                var end = lengths[0];
                this._debug('Transport', this.getType(), 'split', envelope.messages.length, 'messages into', lengths.join(' + '));
                envelopeToSend = this._mixin(false, {}, envelope);
                envelopeToSend.messages = envelope.messages.slice(begin, end);
                envelopeToSend.onSuccess = envelope.onSuccess;
                envelopeToSend.onFailure = envelope.onFailure;

                for (var i = 1; i < lengths.length; ++i) {
                    var nextEnvelope = this._mixin(false, {}, envelope);
                    begin = end;
                    end += lengths[i];
                    nextEnvelope.messages = envelope.messages.slice(begin, end);
                    nextEnvelope.onSuccess = envelope.onSuccess;
                    nextEnvelope.onFailure = envelope.onFailure;
                    this.send(nextEnvelope, request.metaConnect);
                }
            }

            this._debug('Transport', this.getType(), 'sending request', request.id, 'envelope', envelopeToSend);

            try {
                var sameStack = true;
                this.jsonpSend({
                    transport: this,
                    url: envelopeToSend.url,
                    sync: envelopeToSend.sync,
                    headers: this.getConfiguration().requestHeaders,
                    body: JSON.stringify(envelopeToSend.messages),
                    onSuccess: function(responses) {
                        var success = false;
                        try {
                            var received = self.convertToMessages(responses);
                            if (received.length === 0) {
                                self.transportFailure(envelopeToSend, request, {
                                    httpCode: 204
                                });
                            } else {
                                success = true;
                                self.transportSuccess(envelopeToSend, request, received);
                            }
                        } catch (x) {
                            self._debug(x);
                            if (!success) {
                                self.transportFailure(envelopeToSend, request, {
                                    exception: x
                                });
                            }
                        }
                    },
                    onError: function(reason, exception) {
                        var failure = {
                            reason: reason,
                            exception: exception
                        };
                        if (sameStack) {
                            // Keep the semantic of calling response callbacks asynchronously after the request
                            self.setTimeout(function() {
                                self.transportFailure(envelopeToSend, request, failure);
                            }, 0);
                        } else {
                            self.transportFailure(envelopeToSend, request, failure);
                        }
                    }
                });
                sameStack = false;
            } catch (xx) {
                // Keep the semantic of calling response callbacks asynchronously after the request
                this.setTimeout(function() {
                    self.transportFailure(envelopeToSend, request, {
                        exception: xx
                    });
                }, 0);
            }
        };

        return _self;
    };


    var WebSocketTransport = function() {
        var _super = new Transport();
        var _self = Transport.derive(_super);
        var _cometd;
        // By default WebSocket is supported
        var _webSocketSupported = true;
        // Whether we were able to establish a WebSocket connection
        var _webSocketConnected = false;
        var _stickyReconnect = true;
        // The context contains the envelopes that have been sent
        // and the timeouts for the messages that have been sent.
        var _context = null;
        var _connecting = null;
        var _connected = false;
        var _successCallback = null;

        _self.reset = function(init) {
            _super.reset(init);
            _webSocketSupported = true;
            if (init) {
                _webSocketConnected = false;
            }
            _stickyReconnect = true;
            _context = null;
            _connecting = null;
            _connected = false;
        };

        function _forceClose(context, event) {
            if (context) {
                this.webSocketClose(context, event.code, event.reason);
                // Force immediate failure of pending messages to trigger reconnect.
                // This is needed because the server may not reply to our close()
                // and therefore the onclose function is never called.
                this.onClose(context, event);
            }
        }

        function _sameContext(context) {
            return context === _connecting || context === _context;
        }

        function _storeEnvelope(context, envelope, metaConnect) {
            var messageIds = [];
            for (var i = 0; i < envelope.messages.length; ++i) {
                var message = envelope.messages[i];
                if (message.id) {
                    messageIds.push(message.id);
                }
            }
            context.envelopes[messageIds.join(',')] = [envelope, metaConnect];
            this._debug('Transport', this.getType(), 'stored envelope, envelopes', context.envelopes);
        }

        function _websocketConnect(context) {
            // We may have multiple attempts to open a WebSocket
            // connection, for example a /meta/connect request that
            // may take time, along with a user-triggered publish.
            // Early return if we are already connecting.
            if (_connecting) {
                return;
            }

            // Mangle the URL, changing the scheme from 'http' to 'ws'.
            var url = _cometd.getURL().replace(/^http/, 'ws');
            this._debug('Transport', this.getType(), 'connecting to URL', url);

            try {
                var protocol = _cometd.getConfiguration().protocol;
                context.webSocket = protocol ? new window.WebSocket(url, protocol) : new window.WebSocket(url);
                _connecting = context;
            } catch (x) {
                _webSocketSupported = false;
                this._debug('Exception while creating WebSocket object', x);
                throw x;
            }

            // By default use sticky reconnects.
            _stickyReconnect = _cometd.getConfiguration().stickyReconnect !== false;

            var self = this;
            var connectTimeout = _cometd.getConfiguration().connectTimeout;
            if (connectTimeout > 0) {
                context.connectTimer = this.setTimeout(function() {
                    _cometd._debug('Transport', self.getType(), 'timed out while connecting to URL', url, ':', connectTimeout, 'ms');
                    // The connection was not opened, close anyway.
                    _forceClose.call(self, context, {code: 1000, reason: 'Connect Timeout'});
                }, connectTimeout);
            }

            var onopen = function() {
                _cometd._debug('WebSocket onopen', context);
                if (context.connectTimer) {
                    self.clearTimeout(context.connectTimer);
                }

                if (_sameContext(context)) {
                    _connecting = null;
                    _context = context;
                    _webSocketConnected = true;
                    self.onOpen(context);
                } else {
                    // We have a valid connection already, close this one.
                    _cometd._warn('Closing extra WebSocket connection', this, 'active connection', _context);
                    _forceClose.call(self, context, {code: 1000, reason: 'Extra Connection'});
                }
            };

            // This callback is invoked when the server sends the close frame.
            // The close frame for a connection may arrive *after* another
            // connection has been opened, so we must make sure that actions
            // are performed only if it's the same connection.
            var onclose = function(event) {
                event = event || {code: 1000};
                _cometd._debug('WebSocket onclose', context, event, 'connecting', _connecting, 'current', _context);

                if (context.connectTimer) {
                    self.clearTimeout(context.connectTimer);
                }

                self.onClose(context, event);
            };

            var onmessage = function(wsMessage) {
                _cometd._debug('WebSocket onmessage', wsMessage, context);
                self.onMessage(context, wsMessage);
            };

            context.webSocket.onopen = onopen;
            context.webSocket.onclose = onclose;
            context.webSocket.onerror = function() {
                // Clients should call onclose(), but if they do not we do it here for safety.
                onclose({code: 1000, reason: 'Error'});
            };
            context.webSocket.onmessage = onmessage;

            this._debug('Transport', this.getType(), 'configured callbacks on', context);
        }

        function _webSocketSend(context, envelope, metaConnect) {
            var json = JSON.stringify(envelope.messages);
            context.webSocket.send(json);
            this._debug('Transport', this.getType(), 'sent', envelope, '/meta/connect =', metaConnect);

            // Manage the timeout waiting for the response.
            var maxDelay = this.getConfiguration().maxNetworkDelay;
            var delay = maxDelay;
            if (metaConnect) {
                delay += this.getAdvice().timeout;
                _connected = true;
            }

            var self = this;
            var messageIds = [];
            for (var i = 0; i < envelope.messages.length; ++i) {
                (function() {
                    var message = envelope.messages[i];
                    if (message.id) {
                        messageIds.push(message.id);
                        context.timeouts[message.id] = self.setTimeout(function() {
                            _cometd._debug('Transport', self.getType(), 'timing out message', message.id, 'after', delay, 'on', context);
                            _forceClose.call(self, context, {code: 1000, reason: 'Message Timeout'});
                        }, delay);
                    }
                })();
            }

            this._debug('Transport', this.getType(), 'waiting at most', delay, 'ms for messages', messageIds, 'maxNetworkDelay', maxDelay, ', timeouts:', context.timeouts);
        }

        _self._notifySuccess = function(fn, messages) {
            fn.call(this, messages);
        };

        _self._notifyFailure = function(fn, context, messages, failure) {
            fn.call(this, context, messages, failure);
        };

        function _send(context, envelope, metaConnect) {
            try {
                if (context === null) {
                    context = _connecting || {
                        envelopes: {},
                        timeouts: {}
                    };
                    _storeEnvelope.call(this, context, envelope, metaConnect);
                    _websocketConnect.call(this, context);
                } else {
                    _storeEnvelope.call(this, context, envelope, metaConnect);
                    _webSocketSend.call(this, context, envelope, metaConnect);
                }
            } catch (x) {
                // Keep the semantic of calling response callbacks asynchronously after the request.
                var self = this;
                this.setTimeout(function() {
                    _forceClose.call(self, context, {
                        code: 1000,
                        reason: 'Exception',
                        exception: x
                    });
                }, 0);
            }
        }

        _self.onOpen = function(context) {
            var envelopes = context.envelopes;
            this._debug('Transport', this.getType(), 'opened', context, 'pending messages', envelopes);
            for (var key in envelopes) {
                if (envelopes.hasOwnProperty(key)) {
                    var element = envelopes[key];
                    var envelope = element[0];
                    var metaConnect = element[1];
                    // Store the success callback, which is independent from the envelope,
                    // so that it can be used to notify arrival of messages.
                    _successCallback = envelope.onSuccess;
                    _webSocketSend.call(this, context, envelope, metaConnect);
                }
            }
        };

        _self.onMessage = function(context, wsMessage) {
            this._debug('Transport', this.getType(), 'received websocket message', wsMessage, context);

            var close = false;
            var messages = this.convertToMessages(wsMessage.data);
            var messageIds = [];
            for (var i = 0; i < messages.length; ++i) {
                var message = messages[i];

                // Detect if the message is a response to a request we made.
                // If it's a meta message, for sure it's a response; otherwise it's
                // a publish message and publish responses don't have the data field.
                if (/^\/meta\//.test(message.channel) || message.data === undefined) {
                    if (message.id) {
                        messageIds.push(message.id);

                        var timeout = context.timeouts[message.id];
                        if (timeout) {
                            this.clearTimeout(timeout);
                            delete context.timeouts[message.id];
                            this._debug('Transport', this.getType(), 'removed timeout for message', message.id, ', timeouts', context.timeouts);
                        }
                    }
                }

                if ('/meta/connect' === message.channel) {
                    _connected = false;
                }
                if ('/meta/disconnect' === message.channel && !_connected) {
                    close = true;
                }
            }

            // Remove the envelope corresponding to the messages.
            var removed = false;
            var envelopes = context.envelopes;
            for (var j = 0; j < messageIds.length; ++j) {
                var id = messageIds[j];
                for (var key in envelopes) {
                    if (envelopes.hasOwnProperty(key)) {
                        var ids = key.split(',');
                        var index = Utils.inArray(id, ids);
                        if (index >= 0) {
                            removed = true;
                            ids.splice(index, 1);
                            var envelope = envelopes[key][0];
                            var metaConnect = envelopes[key][1];
                            delete envelopes[key];
                            if (ids.length > 0) {
                                envelopes[ids.join(',')] = [envelope, metaConnect];
                            }
                            break;
                        }
                    }
                }
            }
            if (removed) {
                this._debug('Transport', this.getType(), 'removed envelope, envelopes', envelopes);
            }

            this._notifySuccess(_successCallback, messages);

            if (close) {
                this.webSocketClose(context, 1000, 'Disconnect');
            }
        };

        _self.onClose = function(context, event) {
            this._debug('Transport', this.getType(), 'closed', context, event);

            if (_sameContext(context)) {
                // Remember if we were able to connect.
                // This close event could be due to server shutdown,
                // and if it restarts we want to try websocket again.
                _webSocketSupported = _stickyReconnect && _webSocketConnected;
                _connecting = null;
                _context = null;
            }

            var timeouts = context.timeouts;
            context.timeouts = {};
            for (var id in timeouts) {
                if (timeouts.hasOwnProperty(id)) {
                    this.clearTimeout(timeouts[id]);
                }
            }

            var envelopes = context.envelopes;
            context.envelopes = {};
            for (var key in envelopes) {
                if (envelopes.hasOwnProperty(key)) {
                    var envelope = envelopes[key][0];
                    var metaConnect = envelopes[key][1];
                    if (metaConnect) {
                        _connected = false;
                    }
                    var failure = {
                        websocketCode: event.code,
                        reason: event.reason
                    };
                    if (event.exception) {
                        failure.exception = event.exception;
                    }
                    this._notifyFailure(envelope.onFailure, context, envelope.messages, failure);
                }
            }
        };

        _self.registered = function(type, cometd) {
            _super.registered(type, cometd);
            _cometd = cometd;
        };

        _self.accept = function(version, crossDomain, url) {
            this._debug('Transport', this.getType(), 'accept, supported:', _webSocketSupported);
            // Using !! to return a boolean (and not the WebSocket object).
            return _webSocketSupported && !!window.WebSocket && _cometd.websocketEnabled !== false;
        };

        _self.send = function(envelope, metaConnect) {
            this._debug('Transport', this.getType(), 'sending', envelope, '/meta/connect =', metaConnect);
            _send.call(this, _context, envelope, metaConnect);
        };

        _self.webSocketClose = function(context, code, reason) {
            try {
                if (context.webSocket) {
                    context.webSocket.close(code, reason);
                }
            } catch (x) {
                this._debug(x);
            }
        };

        _self.abort = function() {
            _super.abort();
            _forceClose.call(this, _context, {code: 1000, reason: 'Abort'});
            this.reset(true);
        };

        return _self;
    };


    /**
     * The constructor for a CometD object, identified by an optional name.
     * The default name is the string 'default'.
     * @param name the optional name of this cometd object
     */
    var CometD = function(name) {
        var _scheduler = new Scheduler();
        var _cometd = this;
        var _name = name || 'default';
        var _crossDomain = false;
        var _transports = new TransportRegistry();
        var _transport;
        var _status = 'disconnected';
        var _messageId = 0;
        var _clientId = null;
        var _batch = 0;
        var _messageQueue = [];
        var _internalBatch = false;
        var _listenerId = 0;
        var _listeners = {};
        var _backoff = 0;
        var _scheduledSend = null;
        var _extensions = [];
        var _advice = {};
        var _handshakeProps;
        var _handshakeCallback;
        var _callbacks = {};
        var _remoteCalls = {};
        var _reestablish = false;
        var _connected = false;
        var _unconnectTime = 0;
        var _handshakeMessages = 0;
        var _metaConnect = null;
        var _config = {
            useWorkerScheduler: true,
            protocol: null,
            stickyReconnect: true,
            connectTimeout: 0,
            maxConnections: 2,
            backoffIncrement: 1000,
            maxBackoff: 60000,
            logLevel: 'info',
            maxNetworkDelay: 10000,
            requestHeaders: {},
            appendMessageTypeToURL: true,
            autoBatch: false,
            urls: {},
            maxURILength: 2000,
            advice: {
                timeout: 60000,
                interval: 0,
                reconnect: undefined,
                maxInterval: 0
            }
        };

        function _fieldValue(object, name) {
            try {
                return object[name];
            } catch (x) {
                return undefined;
            }
        }

        /**
         * Mixes in the given objects into the target object by copying the properties.
         * @param deep if the copy must be deep
         * @param target the target object
         * @param objects the objects whose properties are copied into the target
         */
        this._mixin = function(deep, target, objects) {
            var result = target || {};

            // Skip first 2 parameters (deep and target), and loop over the others
            for (var i = 2; i < arguments.length; ++i) {
                var object = arguments[i];

                if (object === undefined || object === null) {
                    continue;
                }

                for (var propName in object) {
                    if (object.hasOwnProperty(propName)) {
                        var prop = _fieldValue(object, propName);
                        var targ = _fieldValue(result, propName);

                        // Avoid infinite loops
                        if (prop === target) {
                            continue;
                        }
                        // Do not mixin undefined values
                        if (prop === undefined) {
                            continue;
                        }

                        if (deep && typeof prop === 'object' && prop !== null) {
                            if (prop instanceof Array) {
                                result[propName] = this._mixin(deep, targ instanceof Array ? targ : [], prop);
                            } else {
                                var source = typeof targ === 'object' && !(targ instanceof Array) ? targ : {};
                                result[propName] = this._mixin(deep, source, prop);
                            }
                        } else {
                            result[propName] = prop;
                        }
                    }
                }
            }

            return result;
        };

        function _isString(value) {
            return Utils.isString(value);
        }

        function _isFunction(value) {
            if (value === undefined || value === null) {
                return false;
            }
            return typeof value === 'function';
        }

        function _zeroPad(value, length) {
            var result = '';
            while (--length > 0) {
                if (value >= Math.pow(10, length)) {
                    break;
                }
                result += '0';
            }
            result += value;
            return result;
        }

        function _log(level, args) {
            if (window.console) {
                var logger = window.console[level];
                if (_isFunction(logger)) {
                    var now = new Date();
                    [].splice.call(args, 0, 0, _zeroPad(now.getHours(), 2) + ':' + _zeroPad(now.getMinutes(), 2) + ':' +
                        _zeroPad(now.getSeconds(), 2) + '.' + _zeroPad(now.getMilliseconds(), 3));
                    logger.apply(window.console, args);
                }
            }
        }

        this._warn = function() {
            _log('warn', arguments);
        };

        this._info = function() {
            if (_config.logLevel !== 'warn') {
                _log('info', arguments);
            }
        };

        this._debug = function() {
            if (_config.logLevel === 'debug') {
                _log('debug', arguments);
            }
        };

        function _splitURL(url) {
            // [1] = protocol://,
            // [2] = host:port,
            // [3] = host,
            // [4] = IPv6_host,
            // [5] = IPv4_host,
            // [6] = :port,
            // [7] = port,
            // [8] = uri,
            // [9] = rest (query / fragment)
            return new RegExp('(^https?://)?(((\\[[^\\]]+])|([^:/?#]+))(:(\\d+))?)?([^?#]*)(.*)?').exec(url);
        }

        /**
         * Returns whether the given hostAndPort is cross domain.
         * The default implementation checks against window.location.host
         * but this function can be overridden to make it work in non-browser
         * environments.
         *
         * @param hostAndPort the host and port in format host:port
         * @return whether the given hostAndPort is cross domain
         */
        this._isCrossDomain = function(hostAndPort) {
            if (window.location && window.location.host) {
                if (hostAndPort) {
                    return hostAndPort !== window.location.host;
                }
            }
            return false;
        };

        function _configure(configuration) {
            _cometd._debug('Configuring cometd object with', configuration);
            // Support old style param, where only the Bayeux server URL was passed.
            if (_isString(configuration)) {
                configuration = {
                    url: configuration
                };
            }
            if (!configuration) {
                configuration = {};
            }

            _config = _cometd._mixin(false, _config, configuration);

            var url = _cometd.getURL();
            if (!url) {
                throw 'Missing required configuration parameter \'url\' specifying the Bayeux server URL';
            }

            // Check if we're cross domain.
            var urlParts = _splitURL(url);
            var hostAndPort = urlParts[2];
            var uri = urlParts[8];
            var afterURI = urlParts[9];
            _crossDomain = _cometd._isCrossDomain(hostAndPort);

            // Check if appending extra path is supported.
            if (_config.appendMessageTypeToURL) {
                if (afterURI !== undefined && afterURI.length > 0) {
                    _cometd._info('Appending message type to URI ' + uri + afterURI + ' is not supported, disabling \'appendMessageTypeToURL\' configuration');
                    _config.appendMessageTypeToURL = false;
                } else {
                    var uriSegments = uri.split('/');
                    var lastSegmentIndex = uriSegments.length - 1;
                    if (uri.match(/\/$/)) {
                        lastSegmentIndex -= 1;
                    }
                    if (uriSegments[lastSegmentIndex].indexOf('.') >= 0) {
                        // Very likely the CometD servlet's URL pattern is mapped to an extension, such as *.cometd
                        // It will be difficult to add the extra path in this case
                        _cometd._info('Appending message type to URI ' + uri + ' is not supported, disabling \'appendMessageTypeToURL\' configuration');
                        _config.appendMessageTypeToURL = false;
                    }
                }
            }

            if (window.Worker && window.Blob && window.URL && _config.useWorkerScheduler) {
                var code = WorkerScheduler.toString();
                // Remove the function declaration, the opening brace and the closing brace.
                code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
                var blob = new window.Blob([code], {
                    type: 'application/json'
                });
                var blobURL = window.URL.createObjectURL(blob);
                var worker = new window.Worker(blobURL);
                _scheduler.setTimeout = function(funktion, delay) {
                    var id = _scheduler.register(funktion);
                    worker.postMessage({
                        id: id,
                        type: 'setTimeout',
                        delay: delay
                    });
                    return id;
                };
                _scheduler.clearTimeout = function(id) {
                    _scheduler.unregister(id);
                    worker.postMessage({
                        id: id,
                        type: 'clearTimeout'
                    });
                };
                worker.onmessage = function(e) {
                    var id = e.data.id;
                    var funktion = _scheduler.unregister(id);
                    if (funktion) {
                        funktion();
                    }
                };
            }
        }

        function _removeListener(subscription) {
            if (subscription) {
                var subscriptions = _listeners[subscription.channel];
                if (subscriptions && subscriptions[subscription.id]) {
                    delete subscriptions[subscription.id];
                    _cometd._debug('Removed', subscription.listener ? 'listener' : 'subscription', subscription);
                }
            }
        }

        function _removeSubscription(subscription) {
            if (subscription && !subscription.listener) {
                _removeListener(subscription);
            }
        }

        function _clearSubscriptions() {
            for (var channel in _listeners) {
                if (_listeners.hasOwnProperty(channel)) {
                    var subscriptions = _listeners[channel];
                    if (subscriptions) {
                        for (var id in subscriptions) {
                            if (subscriptions.hasOwnProperty(id)) {
                                _removeSubscription(subscriptions[id]);
                            }
                        }
                    }
                }
            }
        }

        function _setStatus(newStatus) {
            if (_status !== newStatus) {
                _cometd._debug('Status', _status, '->', newStatus);
                _status = newStatus;
            }
        }

        function _isDisconnected() {
            return _status === 'disconnecting' || _status === 'disconnected';
        }

        function _nextMessageId() {
            var result = ++_messageId;
            return '' + result;
        }

        function _applyExtension(scope, callback, name, message, outgoing) {
            try {
                return callback.call(scope, message);
            } catch (x) {
                var handler = _cometd.onExtensionException;
                if (_isFunction(handler)) {
                    _cometd._debug('Invoking extension exception handler', name, x);
                    try {
                        handler.call(_cometd, x, name, outgoing, message);
                    } catch (xx) {
                        _cometd._info('Exception during execution of extension exception handler', name, xx);
                    }
                } else {
                    _cometd._info('Exception during execution of extension', name, x);
                }
                return message;
            }
        }

        function _applyIncomingExtensions(message) {
            for (var i = 0; i < _extensions.length; ++i) {
                if (message === undefined || message === null) {
                    break;
                }

                var extension = _extensions[i];
                var callback = extension.extension.incoming;
                if (_isFunction(callback)) {
                    var result = _applyExtension(extension.extension, callback, extension.name, message, false);
                    message = result === undefined ? message : result;
                }
            }
            return message;
        }

        function _applyOutgoingExtensions(message) {
            for (var i = _extensions.length - 1; i >= 0; --i) {
                if (message === undefined || message === null) {
                    break;
                }

                var extension = _extensions[i];
                var callback = extension.extension.outgoing;
                if (_isFunction(callback)) {
                    var result = _applyExtension(extension.extension, callback, extension.name, message, true);
                    message = result === undefined ? message : result;
                }
            }
            return message;
        }

        function _notify(channel, message) {
            var subscriptions = _listeners[channel];
            if (subscriptions) {
                for (var id in subscriptions) {
                    if (subscriptions.hasOwnProperty(id)) {
                        var subscription = subscriptions[id];
                        // Subscriptions may come and go, so the array may have 'holes'
                        if (subscription) {
                            try {
                                subscription.callback.call(subscription.scope, message);
                            } catch (x) {
                                var handler = _cometd.onListenerException;
                                if (_isFunction(handler)) {
                                    _cometd._debug('Invoking listener exception handler', subscription, x);
                                    try {
                                        handler.call(_cometd, x, subscription, subscription.listener, message);
                                    } catch (xx) {
                                        _cometd._info('Exception during execution of listener exception handler', subscription, xx);
                                    }
                                } else {
                                    _cometd._info('Exception during execution of listener', subscription, message, x);
                                }
                            }
                        }
                    }
                }
            }
        }

        function _notifyListeners(channel, message) {
            // Notify direct listeners
            _notify(channel, message);

            // Notify the globbing listeners
            var channelParts = channel.split('/');
            var last = channelParts.length - 1;
            for (var i = last; i > 0; --i) {
                var channelPart = channelParts.slice(0, i).join('/') + '/*';
                // We don't want to notify /foo/* if the channel is /foo/bar/baz,
                // so we stop at the first non recursive globbing
                if (i === last) {
                    _notify(channelPart, message);
                }
                // Add the recursive globber and notify
                channelPart += '*';
                _notify(channelPart, message);
            }
        }

        function _cancelDelayedSend() {
            if (_scheduledSend !== null) {
                _cometd.clearTimeout(_scheduledSend);
            }
            _scheduledSend = null;
        }

        function _delayedSend(operation, delay) {
            _cancelDelayedSend();
            var time = _advice.interval + delay;
            _cometd._debug('Function scheduled in', time, 'ms, interval =', _advice.interval, 'backoff =', _backoff, operation);
            _scheduledSend = _cometd.setTimeout(operation, time);
        }

        // Needed to break cyclic dependencies between function definitions
        var _handleMessages;
        var _handleFailure;

        /**
         * Delivers the messages to the CometD server
         * @param messages the array of messages to send
         * @param metaConnect true if this send is on /meta/connect
         * @param extraPath an extra path to append to the Bayeux server URL
         */
        function _send(messages, metaConnect, extraPath) {
            // We must be sure that the messages have a clientId.
            // This is not guaranteed since the handshake may take time to return
            // (and hence the clientId is not known yet) and the application
            // may create other messages.
            for (var i = 0; i < messages.length; ++i) {
                var message = messages[i];
                var messageId = message.id;

                if (_clientId) {
                    message.clientId = _clientId;
                }

                message = _applyOutgoingExtensions(message);
                if (message !== undefined && message !== null) {
                    // Extensions may have modified the message id, but we need to own it.
                    message.id = messageId;
                    messages[i] = message;
                } else {
                    delete _callbacks[messageId];
                    messages.splice(i--, 1);
                }
            }

            if (messages.length === 0) {
                return;
            }

            if (metaConnect) {
                _metaConnect = messages[0];
            }

            var url = _cometd.getURL();
            if (_config.appendMessageTypeToURL) {
                // If url does not end with '/', then append it
                if (!url.match(/\/$/)) {
                    url = url + '/';
                }
                if (extraPath) {
                    url = url + extraPath;
                }
            }

            var envelope = {
                url: url,
                sync: false,
                messages: messages,
                onSuccess: function(rcvdMessages) {
                    try {
                        _handleMessages.call(_cometd, rcvdMessages);
                    } catch (x) {
                        _cometd._info('Exception during handling of messages', x);
                    }
                },
                onFailure: function(conduit, messages, failure) {
                    try {
                        var transport = _cometd.getTransport();
                        failure.connectionType = transport ? transport.getType() : "unknown";
                        _handleFailure.call(_cometd, conduit, messages, failure);
                    } catch (x) {
                        _cometd._info('Exception during handling of failure', x);
                    }
                }
            };
            _cometd._debug('Send', envelope);
            _transport.send(envelope, metaConnect);
        }

        function _queueSend(message) {
            if (_batch > 0 || _internalBatch === true) {
                _messageQueue.push(message);
            } else {
                _send([message], false);
            }
        }

        /**
         * Sends a complete bayeux message.
         * This method is exposed as a public so that extensions may use it
         * to send bayeux message directly, for example in case of re-sending
         * messages that have already been sent but that for some reason must
         * be resent.
         */
        this.send = _queueSend;

        function _resetBackoff() {
            _backoff = 0;
        }

        function _increaseBackoff() {
            if (_backoff < _config.maxBackoff) {
                _backoff += _config.backoffIncrement;
            }
            return _backoff;
        }

        /**
         * Starts a the batch of messages to be sent in a single request.
         * @see #_endBatch(sendMessages)
         */
        function _startBatch() {
            ++_batch;
            _cometd._debug('Starting batch, depth', _batch);
        }

        function _flushBatch() {
            var messages = _messageQueue;
            _messageQueue = [];
            if (messages.length > 0) {
                _send(messages, false);
            }
        }

        /**
         * Ends the batch of messages to be sent in a single request,
         * optionally sending messages present in the message queue depending
         * on the given argument.
         * @see #_startBatch()
         */
        function _endBatch() {
            --_batch;
            _cometd._debug('Ending batch, depth', _batch);
            if (_batch < 0) {
                throw 'Calls to startBatch() and endBatch() are not paired';
            }

            if (_batch === 0 && !_isDisconnected() && !_internalBatch) {
                _flushBatch();
            }
        }

        /**
         * Sends the connect message
         */
        function _connect() {
            if (!_isDisconnected()) {
                var bayeuxMessage = {
                    id: _nextMessageId(),
                    channel: '/meta/connect',
                    connectionType: _transport.getType()
                };

                // In case of reload or temporary loss of connection
                // we want the next successful connect to return immediately
                // instead of being held by the server, so that connect listeners
                // can be notified that the connection has been re-established
                if (!_connected) {
                    bayeuxMessage.advice = {
                        timeout: 0
                    };
                }

                _setStatus('connecting');
                _cometd._debug('Connect sent', bayeuxMessage);
                _send([bayeuxMessage], true, 'connect');
                _setStatus('connected');
            }
        }

        function _delayedConnect(delay) {
            _setStatus('connecting');
            _delayedSend(function() {
                _connect();
            }, delay);
        }

        function _updateAdvice(newAdvice) {
            if (newAdvice) {
                _advice = _cometd._mixin(false, {}, _config.advice, newAdvice);
                _cometd._debug('New advice', _advice);
            }
        }

        function _disconnect(abort) {
            _cancelDelayedSend();
            if (abort && _transport) {
                _transport.abort();
            }
            _crossDomain = false;
            _transport = null;
            _setStatus('disconnected');
            _clientId = null;
            _batch = 0;
            _resetBackoff();
            _reestablish = false;
            _connected = false;
            _unconnectTime = 0;
            _metaConnect = null;

            // Fail any existing queued message
            if (_messageQueue.length > 0) {
                var messages = _messageQueue;
                _messageQueue = [];
                _handleFailure.call(_cometd, undefined, messages, {
                    reason: 'Disconnected'
                });
            }
        }

        function _notifyTransportException(oldTransport, newTransport, failure) {
            var handler = _cometd.onTransportException;
            if (_isFunction(handler)) {
                _cometd._debug('Invoking transport exception handler', oldTransport, newTransport, failure);
                try {
                    handler.call(_cometd, failure, oldTransport, newTransport);
                } catch (x) {
                    _cometd._info('Exception during execution of transport exception handler', x);
                }
            }
        }

        /**
         * Sends the initial handshake message
         */
        function _handshake(handshakeProps, handshakeCallback) {
            if (_isFunction(handshakeProps)) {
                handshakeCallback = handshakeProps;
                handshakeProps = undefined;
            }

            _clientId = null;

            _clearSubscriptions();

            // Reset the transports if we're not retrying the handshake
            if (_isDisconnected()) {
                _transports.reset(true);
            }

            // Reset the advice.
            _updateAdvice({});

            _batch = 0;

            // Mark the start of an internal batch.
            // This is needed because handshake and connect are async.
            // It may happen that the application calls init() then subscribe()
            // and the subscribe message is sent before the connect message, if
            // the subscribe message is not held until the connect message is sent.
            // So here we start a batch to hold temporarily any message until
            // the connection is fully established.
            _internalBatch = true;

            // Save the properties provided by the user, so that
            // we can reuse them during automatic re-handshake
            _handshakeProps = handshakeProps;
            _handshakeCallback = handshakeCallback;

            var version = '1.0';

            // Figure out the transports to send to the server
            var url = _cometd.getURL();
            var transportTypes = _transports.findTransportTypes(version, _crossDomain, url);

            var bayeuxMessage = {
                id: _nextMessageId(),
                version: version,
                minimumVersion: version,
                channel: '/meta/handshake',
                supportedConnectionTypes: transportTypes,
                advice: {
                    timeout: _advice.timeout,
                    interval: _advice.interval
                }
            };
            // Do not allow the user to override important fields.
            var message = _cometd._mixin(false, {}, _handshakeProps, bayeuxMessage);

            // Save the callback.
            _cometd._putCallback(message.id, handshakeCallback);

            // Pick up the first available transport as initial transport
            // since we don't know if the server supports it
            if (!_transport) {
                _transport = _transports.negotiateTransport(transportTypes, version, _crossDomain, url);
                if (!_transport) {
                    var failure = 'Could not find initial transport among: ' + _transports.getTransportTypes();
                    _cometd._warn(failure);
                    throw failure;
                }
            }

            _cometd._debug('Initial transport is', _transport.getType());

            // We started a batch to hold the application messages,
            // so here we must bypass it and send immediately.
            _setStatus('handshaking');
            _cometd._debug('Handshake sent', message);
            _send([message], false, 'handshake');
        }

        function _delayedHandshake(delay) {
            _setStatus('handshaking');

            // We will call _handshake() which will reset _clientId, but we want to avoid
            // that between the end of this method and the call to _handshake() someone may
            // call publish() (or other methods that call _queueSend()).
            _internalBatch = true;

            _delayedSend(function() {
                _handshake(_handshakeProps, _handshakeCallback);
            }, delay);
        }

        function _notifyCallback(callback, message) {
            try {
                callback.call(_cometd, message);
            } catch (x) {
                var handler = _cometd.onCallbackException;
                if (_isFunction(handler)) {
                    _cometd._debug('Invoking callback exception handler', x);
                    try {
                        handler.call(_cometd, x, message);
                    } catch (xx) {
                        _cometd._info('Exception during execution of callback exception handler', xx);
                    }
                } else {
                    _cometd._info('Exception during execution of message callback', x);
                }
            }
        }

        this._getCallback = function(messageId) {
            return _callbacks[messageId];
        };

        this._putCallback = function(messageId, callback) {
            var result = this._getCallback(messageId);
            if (_isFunction(callback)) {
                _callbacks[messageId] = callback;
            }
            return result;
        };

        function _handleCallback(message) {
            var callback = _cometd._getCallback([message.id]);
            if (_isFunction(callback)) {
                delete _callbacks[message.id];
                _notifyCallback(callback, message);
            }
        }

        function _handleRemoteCall(message) {
            var context = _remoteCalls[message.id];
            delete _remoteCalls[message.id];
            if (context) {
                _cometd._debug('Handling remote call response for', message, 'with context', context);

                // Clear the timeout, if present.
                var timeout = context.timeout;
                if (timeout) {
                    _cometd.clearTimeout(timeout);
                }

                var callback = context.callback;
                if (_isFunction(callback)) {
                    _notifyCallback(callback, message);
                    return true;
                }
            }
            return false;
        }

        this.onTransportFailure = function(message, failureInfo, failureHandler) {
            this._debug('Transport failure', failureInfo, 'for', message);

            var transports = this.getTransportRegistry();
            var url = this.getURL();
            var crossDomain = this._isCrossDomain(_splitURL(url)[2]);
            var version = '1.0';
            var transportTypes = transports.findTransportTypes(version, crossDomain, url);

            if (failureInfo.action === 'none') {
                if (message.channel === '/meta/handshake') {
                    if (!failureInfo.transport) {
                        var failure = 'Could not negotiate transport, client=[' + transportTypes + '], server=[' + message.supportedConnectionTypes + ']';
                        this._warn(failure);
                        _notifyTransportException(_transport.getType(), null, {
                            reason: failure,
                            connectionType: _transport.getType(),
                            transport: _transport
                        });
                    }
                }
            } else {
                failureInfo.delay = this.getBackoffPeriod();
                // Different logic depending on whether we are handshaking or connecting.
                if (message.channel === '/meta/handshake') {
                    if (!failureInfo.transport) {
                        // The transport is invalid, try to negotiate again.
                        var oldTransportType = _transport ? _transport.getType() : null;
                        var newTransport = transports.negotiateTransport(transportTypes, version, crossDomain, url);
                        if (!newTransport) {
                            this._warn('Could not negotiate transport, client=[' + transportTypes + ']');
                            _notifyTransportException(oldTransportType, null, message.failure);
                            failureInfo.action = 'none';
                        } else {
                            var newTransportType = newTransport.getType();
                            this._debug('Transport', oldTransportType, '->', newTransportType);
                            _notifyTransportException(oldTransportType, newTransportType, message.failure);
                            failureInfo.action = 'handshake';
                            failureInfo.transport = newTransport;
                        }
                    }

                    if (failureInfo.action !== 'none') {
                        this.increaseBackoffPeriod();
                    }
                } else {
                    var now = new Date().getTime();

                    if (_unconnectTime === 0) {
                        _unconnectTime = now;
                    }

                    if (failureInfo.action === 'retry') {
                        failureInfo.delay = this.increaseBackoffPeriod();
                        // Check whether we may switch to handshaking.
                        var maxInterval = _advice.maxInterval;
                        if (maxInterval > 0) {
                            var expiration = _advice.timeout + _advice.interval + maxInterval;
                            var unconnected = now - _unconnectTime;
                            if (unconnected + _backoff > expiration) {
                                failureInfo.action = 'handshake';
                            }
                        }
                    }

                    if (failureInfo.action === 'handshake') {
                        failureInfo.delay = 0;
                        transports.reset(false);
                        this.resetBackoffPeriod();
                    }
                }
            }

            failureHandler.call(_cometd, failureInfo);
        };

        function _handleTransportFailure(failureInfo) {
            _cometd._debug('Transport failure handling', failureInfo);

            if (failureInfo.transport) {
                _transport = failureInfo.transport;
            }

            if (failureInfo.url) {
                _transport.setURL(failureInfo.url);
            }

            var action = failureInfo.action;
            var delay = failureInfo.delay || 0;
            switch (action) {
                case 'handshake':
                    _delayedHandshake(delay);
                    break;
                case 'retry':
                    _delayedConnect(delay);
                    break;
                case 'none':
                    _disconnect(true);
                    break;
                default:
                    throw 'Unknown action ' + action;
            }
        }

        function _failHandshake(message, failureInfo) {
            _handleCallback(message);
            _notifyListeners('/meta/handshake', message);
            _notifyListeners('/meta/unsuccessful', message);

            // The listeners may have disconnected.
            if (_isDisconnected()) {
                failureInfo.action = 'none';
            }

            _cometd.onTransportFailure.call(_cometd, message, failureInfo, _handleTransportFailure);
        }

        function _handshakeResponse(message) {
            var url = _cometd.getURL();
            if (message.successful) {
                var crossDomain = _cometd._isCrossDomain(_splitURL(url)[2]);
                var newTransport = _transports.negotiateTransport(message.supportedConnectionTypes, message.version, crossDomain, url);
                if (newTransport === null) {
                    message.successful = false;
                    _failHandshake(message, {
                        cause: 'negotiation',
                        action: 'none',
                        transport: null
                    });
                    return;
                } else if (_transport !== newTransport) {
                    _cometd._debug('Transport', _transport.getType(), '->', newTransport.getType());
                    _transport = newTransport;
                }

                _clientId = message.clientId;

                // End the internal batch and allow held messages from the application
                // to go to the server (see _handshake() where we start the internal batch).
                _internalBatch = false;
                _flushBatch();

                // Here the new transport is in place, as well as the clientId, so
                // the listeners can perform a publish() if they want.
                // Notify the listeners before the connect below.
                message.reestablish = _reestablish;
                _reestablish = true;

                _handleCallback(message);
                _notifyListeners('/meta/handshake', message);

                _handshakeMessages = message['x-messages'] || 0;

                var action = _isDisconnected() ? 'none' : _advice.reconnect || 'retry';
                switch (action) {
                    case 'retry':
                        _resetBackoff();
                        if (_handshakeMessages === 0) {
                            _delayedConnect(0);
                        } else {
                            _cometd._debug('Processing', _handshakeMessages, 'handshake-delivered messages');
                        }
                        break;
                    case 'none':
                        _disconnect(true);
                        break;
                    default:
                        throw 'Unrecognized advice action ' + action;
                }
            } else {
                _failHandshake(message, {
                    cause: 'unsuccessful',
                    action: _advice.reconnect || 'handshake',
                    transport: _transport
                });
            }
        }

        function _handshakeFailure(message) {
            _failHandshake(message, {
                cause: 'failure',
                action: 'handshake',
                transport: null
            });
        }

        function _matchMetaConnect(connect) {
            if (_status === 'disconnected') {
                return true;
            }
            if (_metaConnect && _metaConnect.id === connect.id) {
                _metaConnect = null;
                return true;
            }
            return false;
        }

        function _failConnect(message, failureInfo) {
            // Notify the listeners after the status change but before the next action.
            _notifyListeners('/meta/connect', message);
            _notifyListeners('/meta/unsuccessful', message);

            // The listeners may have disconnected.
            if (_isDisconnected()) {
                failureInfo.action = 'none';
            }

            _cometd.onTransportFailure.call(_cometd, message, failureInfo, _handleTransportFailure);
        }

        function _connectResponse(message) {
            if (_matchMetaConnect(message)) {
                _connected = message.successful;
                if (_connected) {
                    _notifyListeners('/meta/connect', message);

                    // Normally, the advice will say "reconnect: 'retry', interval: 0"
                    // and the server will hold the request, so when a response returns
                    // we immediately call the server again (long polling).
                    // Listeners can call disconnect(), so check the state after they run.
                    var action = _isDisconnected() ? 'none' : _advice.reconnect || 'retry';
                    switch (action) {
                        case 'retry':
                            _resetBackoff();
                            _delayedConnect(_backoff);
                            break;
                        case 'none':
                            _disconnect(false);
                            break;
                        default:
                            throw 'Unrecognized advice action ' + action;
                    }
                } else {
                    _failConnect(message, {
                        cause: 'unsuccessful',
                        action: _advice.reconnect || 'retry',
                        transport: _transport
                    });
                }
            } else {
                _cometd._debug('Mismatched /meta/connect reply', message);
            }
        }

        function _connectFailure(message) {
            if (_matchMetaConnect(message)) {
                _connected = false;
                _failConnect(message, {
                    cause: 'failure',
                    action: 'retry',
                    transport: null
                });
            } else {
                _cometd._debug('Mismatched /meta/connect failure', message);
            }
        }

        function _failDisconnect(message) {
            _disconnect(true);
            _handleCallback(message);
            _notifyListeners('/meta/disconnect', message);
            _notifyListeners('/meta/unsuccessful', message);
        }

        function _disconnectResponse(message) {
            if (message.successful) {
                // Wait for the /meta/connect to arrive.
                _disconnect(false);
                _handleCallback(message);
                _notifyListeners('/meta/disconnect', message);
            } else {
                _failDisconnect(message);
            }
        }

        function _disconnectFailure(message) {
            _failDisconnect(message);
        }

        function _failSubscribe(message) {
            var subscriptions = _listeners[message.subscription];
            if (subscriptions) {
                for (var id in subscriptions) {
                    if (subscriptions.hasOwnProperty(id)) {
                        var subscription = subscriptions[id];
                        if (subscription && !subscription.listener) {
                            delete subscriptions[id];
                            _cometd._debug('Removed failed subscription', subscription);
                        }
                    }
                }
            }
            _handleCallback(message);
            _notifyListeners('/meta/subscribe', message);
            _notifyListeners('/meta/unsuccessful', message);
        }

        function _subscribeResponse(message) {
            if (message.successful) {
                _handleCallback(message);
                _notifyListeners('/meta/subscribe', message);
            } else {
                _failSubscribe(message);
            }
        }

        function _subscribeFailure(message) {
            _failSubscribe(message);
        }

        function _failUnsubscribe(message) {
            _handleCallback(message);
            _notifyListeners('/meta/unsubscribe', message);
            _notifyListeners('/meta/unsuccessful', message);
        }

        function _unsubscribeResponse(message) {
            if (message.successful) {
                _handleCallback(message);
                _notifyListeners('/meta/unsubscribe', message);
            } else {
                _failUnsubscribe(message);
            }
        }

        function _unsubscribeFailure(message) {
            _failUnsubscribe(message);
        }

        function _failMessage(message) {
            if (!_handleRemoteCall(message)) {
                _handleCallback(message);
                _notifyListeners('/meta/publish', message);
                _notifyListeners('/meta/unsuccessful', message);
            }
        }

        function _messageResponse(message) {
            if (message.data !== undefined) {
                if (!_handleRemoteCall(message)) {
                    _notifyListeners(message.channel, message);
                    if (_handshakeMessages > 0) {
                        --_handshakeMessages;
                        if (_handshakeMessages === 0) {
                            _cometd._debug('Processed last handshake-delivered message');
                            _delayedConnect(0);
                        }
                    }
                }
            } else {
                if (message.successful === undefined) {
                    _cometd._warn('Unknown Bayeux Message', message);
                } else {
                    if (message.successful) {
                        _handleCallback(message);
                        _notifyListeners('/meta/publish', message);
                    } else {
                        _failMessage(message);
                    }
                }
            }
        }

        function _messageFailure(failure) {
            _failMessage(failure);
        }

        function _receive(message) {
            _unconnectTime = 0;

            message = _applyIncomingExtensions(message);
            if (message === undefined || message === null) {
                return;
            }

            _updateAdvice(message.advice);

            var channel = message.channel;
            switch (channel) {
                case '/meta/handshake':
                    _handshakeResponse(message);
                    break;
                case '/meta/connect':
                    _connectResponse(message);
                    break;
                case '/meta/disconnect':
                    _disconnectResponse(message);
                    break;
                case '/meta/subscribe':
                    _subscribeResponse(message);
                    break;
                case '/meta/unsubscribe':
                    _unsubscribeResponse(message);
                    break;
                default:
                    _messageResponse(message);
                    break;
            }
        }

        /**
         * Receives a message.
         * This method is exposed as a public so that extensions may inject
         * messages simulating that they had been received.
         */
        this.receive = _receive;

        _handleMessages = function(rcvdMessages) {
            _cometd._debug('Received', rcvdMessages);

            for (var i = 0; i < rcvdMessages.length; ++i) {
                var message = rcvdMessages[i];
                _receive(message);
            }
        };

        _handleFailure = function(conduit, messages, failure) {
            _cometd._debug('handleFailure', conduit, messages, failure);

            failure.transport = conduit;
            for (var i = 0; i < messages.length; ++i) {
                var message = messages[i];
                var failureMessage = {
                    id: message.id,
                    successful: false,
                    channel: message.channel,
                    failure: failure
                };
                failure.message = message;
                switch (message.channel) {
                    case '/meta/handshake':
                        _handshakeFailure(failureMessage);
                        break;
                    case '/meta/connect':
                        _connectFailure(failureMessage);
                        break;
                    case '/meta/disconnect':
                        _disconnectFailure(failureMessage);
                        break;
                    case '/meta/subscribe':
                        failureMessage.subscription = message.subscription;
                        _subscribeFailure(failureMessage);
                        break;
                    case '/meta/unsubscribe':
                        failureMessage.subscription = message.subscription;
                        _unsubscribeFailure(failureMessage);
                        break;
                    default:
                        _messageFailure(failureMessage);
                        break;
                }
            }
        };

        function _hasSubscriptions(channel) {
            var subscriptions = _listeners[channel];
            if (subscriptions) {
                for (var id in subscriptions) {
                    if (subscriptions.hasOwnProperty(id)) {
                        if (subscriptions[id]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function _resolveScopedCallback(scope, callback) {
            var delegate = {
                scope: scope,
                method: callback
            };
            if (_isFunction(scope)) {
                delegate.scope = undefined;
                delegate.method = scope;
            } else {
                if (_isString(callback)) {
                    if (!scope) {
                        throw 'Invalid scope ' + scope;
                    }
                    delegate.method = scope[callback];
                    if (!_isFunction(delegate.method)) {
                        throw 'Invalid callback ' + callback + ' for scope ' + scope;
                    }
                } else if (!_isFunction(callback)) {
                    throw 'Invalid callback ' + callback;
                }
            }
            return delegate;
        }

        function _addListener(channel, scope, callback, isListener) {
            // The data structure is a map<channel, subscription[]>, where each subscription
            // holds the callback to be called and its scope.

            var delegate = _resolveScopedCallback(scope, callback);
            _cometd._debug('Adding', isListener ? 'listener' : 'subscription', 'on', channel, 'with scope', delegate.scope, 'and callback', delegate.method);

            var id = ++_listenerId;
            var subscription = {
                id: id,
                channel: channel,
                scope: delegate.scope,
                callback: delegate.method,
                listener: isListener
            };

            var subscriptions = _listeners[channel];
            if (!subscriptions) {
                subscriptions = {};
                _listeners[channel] = subscriptions;
            }

            subscriptions[id] = subscription;

            _cometd._debug('Added', isListener ? 'listener' : 'subscription', subscription);

            return subscription;
        }

        //
        // PUBLIC API
        //

        /**
         * Registers the given transport under the given transport type.
         * The optional index parameter specifies the "priority" at which the
         * transport is registered (where 0 is the max priority).
         * If a transport with the same type is already registered, this function
         * does nothing and returns false.
         * @param type the transport type
         * @param transport the transport object
         * @param index the index at which this transport is to be registered
         * @return true if the transport has been registered, false otherwise
         * @see #unregisterTransport(type)
         */
        this.registerTransport = function(type, transport, index) {
            var result = _transports.add(type, transport, index);
            if (result) {
                this._debug('Registered transport', type);

                if (_isFunction(transport.registered)) {
                    transport.registered(type, this);
                }
            }
            return result;
        };

        /**
         * Unregisters the transport with the given transport type.
         * @param type the transport type to unregister
         * @return the transport that has been unregistered,
         * or null if no transport was previously registered under the given transport type
         */
        this.unregisterTransport = function(type) {
            var transport = _transports.remove(type);
            if (transport !== null) {
                this._debug('Unregistered transport', type);

                if (_isFunction(transport.unregistered)) {
                    transport.unregistered();
                }
            }
            return transport;
        };

        this.unregisterTransports = function() {
            _transports.clear();
        };

        /**
         * @return an array of all registered transport types
         */
        this.getTransportTypes = function() {
            return _transports.getTransportTypes();
        };

        this.findTransport = function(name) {
            return _transports.find(name);
        };

        /**
         * @returns the TransportRegistry object
         */
        this.getTransportRegistry = function() {
            return _transports;
        };

        /**
         * Configures the initial Bayeux communication with the Bayeux server.
         * Configuration is passed via an object that must contain a mandatory field <code>url</code>
         * of type string containing the URL of the Bayeux server.
         * @param configuration the configuration object
         */
        this.configure = function(configuration) {
            _configure.call(this, configuration);
        };

        /**
         * Configures and establishes the Bayeux communication with the Bayeux server
         * via a handshake and a subsequent connect.
         * @param configuration the configuration object
         * @param handshakeProps an object to be merged with the handshake message
         * @see #configure(configuration)
         * @see #handshake(handshakeProps)
         */
        this.init = function(configuration, handshakeProps) {
            this.configure(configuration);
            this.handshake(handshakeProps);
        };

        /**
         * Establishes the Bayeux communication with the Bayeux server
         * via a handshake and a subsequent connect.
         * @param handshakeProps an object to be merged with the handshake message
         * @param handshakeCallback a function to be invoked when the handshake is acknowledged
         */
        this.handshake = function(handshakeProps, handshakeCallback) {
            if (_status !== 'disconnected') {
                throw 'Illegal state: handshaken';
            }
            _handshake(handshakeProps, handshakeCallback);
        };

        /**
         * Disconnects from the Bayeux server.
         * @param disconnectProps an object to be merged with the disconnect message
         * @param disconnectCallback a function to be invoked when the disconnect is acknowledged
         */
        this.disconnect = function(disconnectProps, disconnectCallback) {
            if (_isDisconnected()) {
                return;
            }

            if (_isFunction(disconnectProps)) {
                disconnectCallback = disconnectProps;
                disconnectProps = undefined;
            }

            var bayeuxMessage = {
                id: _nextMessageId(),
                channel: '/meta/disconnect'
            };
            // Do not allow the user to override important fields.
            var message = this._mixin(false, {}, disconnectProps, bayeuxMessage);

            // Save the callback.
            _cometd._putCallback(message.id, disconnectCallback);

            _setStatus('disconnecting');
            _send([message], false, 'disconnect');
        };

        /**
         * Marks the start of a batch of application messages to be sent to the server
         * in a single request, obtaining a single response containing (possibly) many
         * application reply messages.
         * Messages are held in a queue and not sent until {@link #endBatch()} is called.
         * If startBatch() is called multiple times, then an equal number of endBatch()
         * calls must be made to close and send the batch of messages.
         * @see #endBatch()
         */
        this.startBatch = function() {
            _startBatch();
        };

        /**
         * Marks the end of a batch of application messages to be sent to the server
         * in a single request.
         * @see #startBatch()
         */
        this.endBatch = function() {
            _endBatch();
        };

        /**
         * Executes the given callback in the given scope, surrounded by a {@link #startBatch()}
         * and {@link #endBatch()} calls.
         * @param scope the scope of the callback, may be omitted
         * @param callback the callback to be executed within {@link #startBatch()} and {@link #endBatch()} calls
         */
        this.batch = function(scope, callback) {
            var delegate = _resolveScopedCallback(scope, callback);
            this.startBatch();
            try {
                delegate.method.call(delegate.scope);
                this.endBatch();
            } catch (x) {
                this._info('Exception during execution of batch', x);
                this.endBatch();
                throw x;
            }
        };

        /**
         * Adds a listener for bayeux messages, performing the given callback in the given scope
         * when a message for the given channel arrives.
         * @param channel the channel the listener is interested to
         * @param scope the scope of the callback, may be omitted
         * @param callback the callback to call when a message is sent to the channel
         * @returns the subscription handle to be passed to {@link #removeListener(object)}
         * @see #removeListener(subscription)
         */
        this.addListener = function(channel, scope, callback) {
            if (arguments.length < 2) {
                throw 'Illegal arguments number: required 2, got ' + arguments.length;
            }
            if (!_isString(channel)) {
                throw 'Illegal argument type: channel must be a string';
            }

            return _addListener(channel, scope, callback, true);
        };

        /**
         * Removes the subscription obtained with a call to {@link #addListener(string, object, function)}.
         * @param subscription the subscription to unsubscribe.
         * @see #addListener(channel, scope, callback)
         */
        this.removeListener = function(subscription) {
            // Beware of subscription.id == 0, which is falsy => cannot use !subscription.id
            if (!subscription || !subscription.channel || !("id" in subscription)) {
                throw 'Invalid argument: expected subscription, not ' + subscription;
            }

            _removeListener(subscription);
        };

        /**
         * Removes all listeners registered with {@link #addListener(channel, scope, callback)} or
         * {@link #subscribe(channel, scope, callback)}.
         */
        this.clearListeners = function() {
            _listeners = {};
        };

        /**
         * Subscribes to the given channel, performing the given callback in the given scope
         * when a message for the channel arrives.
         * @param channel the channel to subscribe to
         * @param scope the scope of the callback, may be omitted
         * @param callback the callback to call when a message is sent to the channel
         * @param subscribeProps an object to be merged with the subscribe message
         * @param subscribeCallback a function to be invoked when the subscription is acknowledged
         * @return the subscription handle to be passed to {@link #unsubscribe(object)}
         */
        this.subscribe = function(channel, scope, callback, subscribeProps, subscribeCallback) {
            if (arguments.length < 2) {
                throw 'Illegal arguments number: required 2, got ' + arguments.length;
            }
            if (!_isString(channel)) {
                throw 'Illegal argument type: channel must be a string';
            }
            if (_isDisconnected()) {
                throw 'Illegal state: disconnected';
            }

            // Normalize arguments
            if (_isFunction(scope)) {
                subscribeCallback = subscribeProps;
                subscribeProps = callback;
                callback = scope;
                scope = undefined;
            }
            if (_isFunction(subscribeProps)) {
                subscribeCallback = subscribeProps;
                subscribeProps = undefined;
            }

            // Only send the message to the server if this client has not yet subscribed to the channel
            var send = !_hasSubscriptions(channel);

            var subscription = _addListener(channel, scope, callback, false);

            if (send) {
                // Send the subscription message after the subscription registration to avoid
                // races where the server would send a message to the subscribers, but here
                // on the client the subscription has not been added yet to the data structures
                var bayeuxMessage = {
                    id: _nextMessageId(),
                    channel: '/meta/subscribe',
                    subscription: channel
                };
                // Do not allow the user to override important fields.
                var message = this._mixin(false, {}, subscribeProps, bayeuxMessage);

                // Save the callback.
                _cometd._putCallback(message.id, subscribeCallback);

                _queueSend(message);
            }

            return subscription;
        };

        /**
         * Unsubscribes the subscription obtained with a call to {@link #subscribe(string, object, function)}.
         * @param subscription the subscription to unsubscribe.
         * @param unsubscribeProps an object to be merged with the unsubscribe message
         * @param unsubscribeCallback a function to be invoked when the unsubscription is acknowledged
         */
        this.unsubscribe = function(subscription, unsubscribeProps, unsubscribeCallback) {
            if (arguments.length < 1) {
                throw 'Illegal arguments number: required 1, got ' + arguments.length;
            }
            if (_isDisconnected()) {
                throw 'Illegal state: disconnected';
            }

            if (_isFunction(unsubscribeProps)) {
                unsubscribeCallback = unsubscribeProps;
                unsubscribeProps = undefined;
            }

            // Remove the local listener before sending the message
            // This ensures that if the server fails, this client does not get notifications
            this.removeListener(subscription);

            var channel = subscription.channel;
            // Only send the message to the server if this client unsubscribes the last subscription
            if (!_hasSubscriptions(channel)) {
                var bayeuxMessage = {
                    id: _nextMessageId(),
                    channel: '/meta/unsubscribe',
                    subscription: channel
                };
                // Do not allow the user to override important fields.
                var message = this._mixin(false, {}, unsubscribeProps, bayeuxMessage);

                // Save the callback.
                _cometd._putCallback(message.id, unsubscribeCallback);

                _queueSend(message);
            }
        };

        this.resubscribe = function(subscription, subscribeProps) {
            _removeSubscription(subscription);
            if (subscription) {
                return this.subscribe(subscription.channel, subscription.scope, subscription.callback, subscribeProps);
            }
            return undefined;
        };

        /**
         * Removes all subscriptions added via {@link #subscribe(channel, scope, callback, subscribeProps)},
         * but does not remove the listeners added via {@link addListener(channel, scope, callback)}.
         */
        this.clearSubscriptions = function() {
            _clearSubscriptions();
        };

        /**
         * Publishes a message on the given channel, containing the given content.
         * @param channel the channel to publish the message to
         * @param content the content of the message
         * @param publishProps an object to be merged with the publish message
         * @param publishCallback a function to be invoked when the publish is acknowledged by the server
         */
        this.publish = function(channel, content, publishProps, publishCallback) {
            if (arguments.length < 1) {
                throw 'Illegal arguments number: required 1, got ' + arguments.length;
            }
            if (!_isString(channel)) {
                throw 'Illegal argument type: channel must be a string';
            }
            if (/^\/meta\//.test(channel)) {
                throw 'Illegal argument: cannot publish to meta channels';
            }
            if (_isDisconnected()) {
                throw 'Illegal state: disconnected';
            }

            if (_isFunction(content)) {
                publishCallback = content;
                content = {};
                publishProps = undefined;
            } else if (_isFunction(publishProps)) {
                publishCallback = publishProps;
                publishProps = undefined;
            }

            var bayeuxMessage = {
                id: _nextMessageId(),
                channel: channel,
                data: content
            };
            // Do not allow the user to override important fields.
            var message = this._mixin(false, {}, publishProps, bayeuxMessage);

            // Save the callback.
            _cometd._putCallback(message.id, publishCallback);

            _queueSend(message);
        };

        /**
         * Publishes a message with binary data on the given channel.
         * The binary data chunk may be an ArrayBuffer, a DataView, a TypedArray
         * (such as Uint8Array) or a plain integer array.
         * The meta data object may contain additional application data such as
         * a file name, a mime type, etc.
         * @param channel the channel to publish the message to
         * @param data the binary data to publish
         * @param last whether the binary data chunk is the last
         * @param meta an object containing meta data associated to the binary chunk
         * @param callback a function to be invoked when the publish is acknowledged by the server
         */
        this.publishBinary = function(channel, data, last, meta, callback) {
            if (_isFunction(data)) {
                callback = data;
                data = new ArrayBuffer(0);
                last = true;
                meta = undefined;
            } else if (_isFunction(last)) {
                callback = last;
                last = true;
                meta = undefined;
            } else if (_isFunction(meta)) {
                callback = meta;
                meta = undefined;
            }
            var content = {
                meta: meta,
                data: data,
                last: last
            };
            var ext = {
                ext: {
                    binary: {}
                }
            };
            this.publish(channel, content, ext, callback);
        };

        this.remoteCall = function(target, content, timeout, callProps, callback) {
            if (arguments.length < 1) {
                throw 'Illegal arguments number: required 1, got ' + arguments.length;
            }
            if (!_isString(target)) {
                throw 'Illegal argument type: target must be a string';
            }
            if (_isDisconnected()) {
                throw 'Illegal state: disconnected';
            }

            if (_isFunction(content)) {
                callback = content;
                content = {};
                timeout = _config.maxNetworkDelay;
                callProps = undefined;
            } else if (_isFunction(timeout)) {
                callback = timeout;
                timeout = _config.maxNetworkDelay;
                callProps = undefined;
            } else if (_isFunction(callProps)) {
                callback = callProps;
                callProps = undefined;
            }

            if (typeof timeout !== 'number') {
                throw 'Illegal argument type: timeout must be a number';
            }

            if (!target.match(/^\//)) {
                target = '/' + target;
            }
            var channel = '/service' + target;

            var bayeuxMessage = {
                id: _nextMessageId(),
                channel: channel,
                data: content
            };
            var message = this._mixin(false, {}, callProps, bayeuxMessage);

            var context = {
                callback: callback
            };
            if (timeout > 0) {
                context.timeout = _cometd.setTimeout(function() {
                    _cometd._debug('Timing out remote call', message, 'after', timeout, 'ms');
                    _failMessage({
                        id: message.id,
                        error: '406::timeout',
                        successful: false,
                        failure: {
                            message: message,
                            reason: 'Remote Call Timeout'
                        }
                    });
                }, timeout);
                _cometd._debug('Scheduled remote call timeout', message, 'in', timeout, 'ms');
            }
            _remoteCalls[message.id] = context;

            _queueSend(message);
        };

        this.remoteCallBinary = function(target, data, last, meta, timeout, callback) {
            if (_isFunction(data)) {
                callback = data;
                data = new ArrayBuffer(0);
                last = true;
                meta = undefined;
                timeout = _config.maxNetworkDelay;
            } else if (_isFunction(last)) {
                callback = last;
                last = true;
                meta = undefined;
                timeout = _config.maxNetworkDelay;
            } else if (_isFunction(meta)) {
                callback = meta;
                meta = undefined;
                timeout = _config.maxNetworkDelay;
            } else if (_isFunction(timeout)) {
                callback = timeout;
                timeout = _config.maxNetworkDelay;
            }

            var content = {
                meta: meta,
                data: data,
                last: last
            };
            var ext = {
                ext: {
                    binary: {}
                }
            };

            this.remoteCall(target, content, timeout, ext, callback);
        };

        /**
         * Returns a string representing the status of the bayeux communication with the Bayeux server.
         */
        this.getStatus = function() {
            return _status;
        };

        /**
         * Returns whether this instance has been disconnected.
         */
        this.isDisconnected = _isDisconnected;

        /**
         * Sets the backoff period used to increase the backoff time when retrying an unsuccessful or failed message.
         * Default value is 1 second, which means if there is a persistent failure the retries will happen
         * after 1 second, then after 2 seconds, then after 3 seconds, etc. So for example with 15 seconds of
         * elapsed time, there will be 5 retries (at 1, 3, 6, 10 and 15 seconds elapsed).
         * @param period the backoff period to set
         * @see #getBackoffIncrement()
         */
        this.setBackoffIncrement = function(period) {
            _config.backoffIncrement = period;
        };

        /**
         * Returns the backoff period used to increase the backoff time when retrying an unsuccessful or failed message.
         * @see #setBackoffIncrement(period)
         */
        this.getBackoffIncrement = function() {
            return _config.backoffIncrement;
        };

        /**
         * Returns the backoff period to wait before retrying an unsuccessful or failed message.
         */
        this.getBackoffPeriod = function() {
            return _backoff;
        };

        /**
         * Increases the backoff period up to the maximum value configured.
         * @returns the backoff period after increment
         * @see getBackoffIncrement
         */
        this.increaseBackoffPeriod = function() {
            return _increaseBackoff();
        };

        /**
         * Resets the backoff period to zero.
         */
        this.resetBackoffPeriod = function() {
            _resetBackoff();
        };

        /**
         * Sets the log level for console logging.
         * Valid values are the strings 'error', 'warn', 'info' and 'debug', from
         * less verbose to more verbose.
         * @param level the log level string
         */
        this.setLogLevel = function(level) {
            _config.logLevel = level;
        };

        /**
         * Registers an extension whose callbacks are called for every incoming message
         * (that comes from the server to this client implementation) and for every
         * outgoing message (that originates from this client implementation for the
         * server).
         * The format of the extension object is the following:
         * <pre>
         * {
         *     incoming: function(message) { ... },
         *     outgoing: function(message) { ... }
         * }
         * </pre>
         * Both properties are optional, but if they are present they will be called
         * respectively for each incoming message and for each outgoing message.
         * @param name the name of the extension
         * @param extension the extension to register
         * @return true if the extension was registered, false otherwise
         * @see #unregisterExtension(name)
         */
        this.registerExtension = function(name, extension) {
            if (arguments.length < 2) {
                throw 'Illegal arguments number: required 2, got ' + arguments.length;
            }
            if (!_isString(name)) {
                throw 'Illegal argument type: extension name must be a string';
            }

            var existing = false;
            for (var i = 0; i < _extensions.length; ++i) {
                var existingExtension = _extensions[i];
                if (existingExtension.name === name) {
                    existing = true;
                    break;
                }
            }
            if (!existing) {
                _extensions.push({
                    name: name,
                    extension: extension
                });
                this._debug('Registered extension', name);

                // Callback for extensions
                if (_isFunction(extension.registered)) {
                    extension.registered(name, this);
                }

                return true;
            } else {
                this._info('Could not register extension with name', name, 'since another extension with the same name already exists');
                return false;
            }
        };

        /**
         * Unregister an extension previously registered with
         * {@link #registerExtension(name, extension)}.
         * @param name the name of the extension to unregister.
         * @return true if the extension was unregistered, false otherwise
         */
        this.unregisterExtension = function(name) {
            if (!_isString(name)) {
                throw 'Illegal argument type: extension name must be a string';
            }

            var unregistered = false;
            for (var i = 0; i < _extensions.length; ++i) {
                var extension = _extensions[i];
                if (extension.name === name) {
                    _extensions.splice(i, 1);
                    unregistered = true;
                    this._debug('Unregistered extension', name);

                    // Callback for extensions
                    var ext = extension.extension;
                    if (_isFunction(ext.unregistered)) {
                        ext.unregistered();
                    }

                    break;
                }
            }
            return unregistered;
        };

        /**
         * Find the extension registered with the given name.
         * @param name the name of the extension to find
         * @return the extension found or null if no extension with the given name has been registered
         */
        this.getExtension = function(name) {
            for (var i = 0; i < _extensions.length; ++i) {
                var extension = _extensions[i];
                if (extension.name === name) {
                    return extension.extension;
                }
            }
            return null;
        };

        /**
         * Returns the name assigned to this CometD object, or the string 'default'
         * if no name has been explicitly passed as parameter to the constructor.
         */
        this.getName = function() {
            return _name;
        };

        /**
         * Returns the clientId assigned by the Bayeux server during handshake.
         */
        this.getClientId = function() {
            return _clientId;
        };

        /**
         * Returns the URL of the Bayeux server.
         */
        this.getURL = function() {
            if (_transport) {
                var url = _transport.getURL();
                if (url) {
                    return url;
                }
                url = _config.urls[_transport.getType()];
                if (url) {
                    return url;
                }
            }
            return _config.url;
        };

        this.getTransport = function() {
            return _transport;
        };

        this.getConfiguration = function() {
            return this._mixin(true, {}, _config);
        };

        this.getAdvice = function() {
            return this._mixin(true, {}, _advice);
        };

        this.setTimeout = function(funktion, delay) {
            return _scheduler.setTimeout(function() {
                try {
                    _cometd._debug('Invoking timed function', funktion);
                    funktion();
                } catch (x) {
                    _cometd._debug('Exception invoking timed function', funktion, x);
                }
            }, delay);
        };

        this.clearTimeout = function(id) {
            _scheduler.clearTimeout(id);
        };

        // Initialize transports.
        if (window.WebSocket) {
            this.registerTransport('websocket', new WebSocketTransport());
        }
        this.registerTransport('long-polling', new LongPollingTransport());
        this.registerTransport('callback-polling', new CallbackPollingTransport());
    };

    var _z85EncodeTable = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', '.', '-', ':', '+', '=', '^', '!', '/',
        '*', '?', '&', '<', '>', '(', ')', '[', ']', '{',
        '}', '@', '%', '$', '#'
    ];
    var _z85DecodeTable = [
        0x00, 0x44, 0x00, 0x54, 0x53, 0x52, 0x48, 0x00,
        0x4B, 0x4C, 0x46, 0x41, 0x00, 0x3F, 0x3E, 0x45,
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x40, 0x00, 0x49, 0x42, 0x4A, 0x47,
        0x51, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A,
        0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32,
        0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        0x3B, 0x3C, 0x3D, 0x4D, 0x00, 0x4E, 0x43, 0x00,
        0x00, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
        0x21, 0x22, 0x23, 0x4F, 0x00, 0x50, 0x00, 0x00
    ];
    var Z85 = {
        encode: function(bytes) {
            var buffer = null;
            if (bytes instanceof ArrayBuffer) {
                buffer = bytes;
            } else if (bytes.buffer instanceof ArrayBuffer) {
                buffer = bytes.buffer;
            } else if (Array.isArray(bytes)) {
                buffer = new Uint8Array(bytes).buffer;
            }
            if (buffer == null) {
                throw 'Cannot Z85 encode ' + bytes;
            }

            var length = buffer.byteLength;
            var remainder = length % 4;
            var padding = 4 - (remainder === 0 ? 4 : remainder);
            var view = new DataView(buffer);
            var result = '';
            var value = 0;
            for (var i = 0; i < length + padding; ++i) {
                var isPadding = i >= length;
                value = value * 256 + (isPadding ? 0 : view.getUint8(i));
                if ((i + 1) % 4 === 0) {
                    var divisor = 85 * 85 * 85 * 85;
                    for (var j = 5; j > 0; --j) {
                        if (!isPadding || j > padding) {
                            var code = Math.floor(value / divisor) % 85;
                            result += _z85EncodeTable[code];
                        }
                        divisor /= 85;
                    }
                    value = 0;
                }
            }

            return result;
        },
        decode: function(string) {
            var remainder = string.length % 5;
            var padding = 5 - (remainder === 0 ? 5 : remainder);
            for (var p = 0; p < padding; ++p) {
                string += _z85EncodeTable[_z85EncodeTable.length - 1];
            }
            var length = string.length;

            var buffer = new ArrayBuffer((length * 4 / 5) - padding);
            var view = new DataView(buffer);
            var value = 0;
            var charIdx = 0;
            var byteIdx = 0;
            for (var i = 0; i < length; ++i) {
                var code = string.charCodeAt(charIdx++) - 32;
                value = value * 85 + _z85DecodeTable[code];
                if (charIdx % 5 === 0) {
                    var divisor = 256 * 256 * 256;
                    while (divisor >= 1) {
                        if (byteIdx < view.byteLength) {
                            view.setUint8(byteIdx++, Math.floor(value / divisor) % 256);
                        }
                        divisor /= 256;
                    }
                    value = 0;
                }
            }

            return buffer;
        }
    };

    return {
        CometD: CometD,
        Transport: Transport,
        RequestTransport: RequestTransport,
        LongPollingTransport: LongPollingTransport,
        CallbackPollingTransport: CallbackPollingTransport,
        WebSocketTransport: WebSocketTransport,
        Utils: Utils,
        Z85: Z85
    };
}));


/***/ }),

/***/ "./node_modules/cross-fetch/dist/browser-ponyfill.js":
/*!***********************************************************!*\
  !*** ./node_modules/cross-fetch/dist/browser-ponyfill.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var __self__ = (function (root) {
function F() {
this.fetch = false;
this.DOMException = root.DOMException
}
F.prototype = root;
return new F();
})(typeof self !== 'undefined' ? self : this);
(function(self) {

var irrelevant = (function (exports) {

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  return exports;

}({}));
})(__self__);
delete __self__.fetch.polyfill
exports = __self__.fetch // To enable: import fetch from 'cross-fetch'
exports.default = __self__.fetch // For TypeScript consumers without esModuleInterop.
exports.fetch = __self__.fetch // To enable: import {fetch} from 'cross-fetch'
exports.Headers = __self__.Headers
exports.Request = __self__.Request
exports.Response = __self__.Response
module.exports = exports


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./src/adapters/account.js":
/*!*********************************!*\
  !*** ./src/adapters/account.js ***!
  \*********************************/
/*! exports provided: createAccount, updateAccount, removeAccount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAccount", function() { return createAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateAccount", function() { return updateAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeAccount", function() { return removeAccount; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");



/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

function createAccount() {
  return _createAccount.apply(this, arguments);
} // TODO -- just a copy-paste of create ATM; need to figuure out how to actually use

function _createAccount() {
  _createAccount = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    var optionals,
        _optionals$objectType,
        objectType,
        name,
        shortName,
        adminKey,
        subscriptionPlan,
        billingInterval,
        response,
        _args = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            _optionals$objectType = optionals.objectType, objectType = _optionals$objectType === void 0 ? 'personal' : _optionals$objectType, name = optionals.name, shortName = optionals.shortName, adminKey = optionals.adminKey, subscriptionPlan = optionals.subscriptionPlan, billingInterval = optionals.billingInterval;
            _context.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().post('/account', {
              body: {
                objectType: objectType,
                name: name,
                shortName: shortName,
                adminKey: adminKey,
                subscriptionPlan: subscriptionPlan,
                billingInterval: billingInterval
              }
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createAccount.apply(this, arguments);
}

function updateAccount() {
  return _updateAccount.apply(this, arguments);
}

function _updateAccount() {
  _updateAccount = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
    var optionals,
        _optionals$objectType2,
        objectType,
        name,
        shortName,
        adminKey,
        subscriptionPlan,
        billingInterval,
        response,
        _args2 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            _optionals$objectType2 = optionals.objectType, objectType = _optionals$objectType2 === void 0 ? 'personal' : _optionals$objectType2, name = optionals.name, shortName = optionals.shortName, adminKey = optionals.adminKey, subscriptionPlan = optionals.subscriptionPlan, billingInterval = optionals.billingInterval;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().patch('/account', {
              body: {
                objectType: objectType,
                name: name,
                shortName: shortName,
                adminKey: adminKey,
                subscriptionPlan: subscriptionPlan,
                billingInterval: billingInterval
              }
            }).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _updateAccount.apply(this, arguments);
}

function removeAccount(_x) {
  return _removeAccount.apply(this, arguments);
}

function _removeAccount() {
  _removeAccount = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(accountShortName) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName)["delete"]('/account').then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _removeAccount.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/authentication.js":
/*!****************************************!*\
  !*** ./src/adapters/authentication.js ***!
  \****************************************/
/*! exports provided: logout, login, upgrade, sso, getSession, getLocalSession */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "login", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "upgrade", function() { return upgrade; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sso", function() { return sso; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSession", function() { return getSession; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLocalSession", function() { return getLocalSession; });
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var adapters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! adapters */ "./src/adapters/index.js");





/**
 * Authentication API adapters -- for authentication
 * @namespace authAdapter
 */

/**
 * Logs out of current Epicenter session.
 *
 * @memberof authAdapter
 * @example
 *
 * epicenter.authAdapter.logout()
 *
 * @returns {Promise}   Promise resolving to successful logout
 */

function logout() {
  return _logout.apply(this, arguments);
}

function _logout() {
  _logout = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session = undefined;
            _context.next = 3;
            return adapters__WEBPACK_IMPORTED_MODULE_4__["cometdAdapter"].disconnect();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _logout.apply(this, arguments);
}

function login(_x) {
  return _login.apply(this, arguments);
}

function _login() {
  _login = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(options) {
    var handle, password, groupKey, _options$objectType, objectType, others, accountShortName, projectShortName, session;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            handle = options.handle, password = options.password, groupKey = options.groupKey, _options$objectType = options.objectType, objectType = _options$objectType === void 0 ? 'user' : _options$objectType, others = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(options, ["handle", "password", "groupKey", "objectType"]);
            accountShortName = others.accountShortName, projectShortName = others.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/authentication', {
              body: {
                objectType: objectType,
                handle: handle,
                password: password,
                groupKey: groupKey || undefined
              },
              includeAuthorization: false,
              inert: true
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            session = _context2.sent;
            _context2.next = 7;
            return logout();

          case 7:
            utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session = session;
            return _context2.abrupt("return", session);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _login.apply(this, arguments);
}

function upgrade(_x2, _x3) {
  return _upgrade.apply(this, arguments);
}

function _upgrade() {
  _upgrade = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(groupKey, options) {
    var _options$objectType2, objectType, inert, others, accountShortName, projectShortName, session;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _options$objectType2 = options.objectType, objectType = _options$objectType2 === void 0 ? 'user' : _options$objectType2, inert = options.inert, others = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(options, ["objectType", "inert"]);
            accountShortName = others.accountShortName, projectShortName = others.projectShortName;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch('/authentication', {
              body: {
                objectType: objectType,
                groupKey: groupKey
              },
              inert: inert
            }).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            session = _context3.sent;
            _context3.next = 7;
            return logout();

          case 7:
            utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session = session;
            return _context3.abrupt("return", session);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _upgrade.apply(this, arguments);
}

function sso(_x4) {
  return _sso.apply(this, arguments);
}

function _sso() {
  _sso = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(options) {
    var accountShortName, projectShortName, session;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accountShortName = options.accountShortName, projectShortName = options.projectShortName;
            _context4.next = 3;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get('/registration/sso').then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 3:
            session = _context4.sent;
            utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session = session;
            return _context4.abrupt("return", session);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _sso.apply(this, arguments);
}

function getSession() {
  return _getSession.apply(this, arguments);
}

function _getSession() {
  _getSession = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5() {
    var _yield$Router$get, body;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().get('/authentication');

          case 2:
            _yield$Router$get = _context5.sent;
            body = _yield$Router$get.body;
            utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session = body;
            return _context5.abrupt("return", body);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getSession.apply(this, arguments);
}

function getLocalSession() {
  return utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session;
}

/***/ }),

/***/ "./src/adapters/channel.js":
/*!*********************************!*\
  !*** ./src/adapters/channel.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Channel; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var adapters__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! adapters */ "./src/adapters/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");









var validateScope = function validateScope(scope) {
  if (!scope) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]('No scope found where one was required');
  var scopeBoundary = scope.scopeBoundary,
      scopeKey = scope.scopeKey,
      pushCategory = scope.pushCategory;
  if (!scopeBoundary) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]('Missing scope component: scopeBoundary');
  if (!scopeKey) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]('Missing scope component: scopeKey');
  if (!pushCategory) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]('Missing scope component: pushCategory');
  if (!utils_constants__WEBPACK_IMPORTED_MODULE_7__["SCOPE_BOUNDARY"].hasOwnProperty(scopeBoundary)) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]("Invalid scope boundary: ".concat(scopeBoundary));
  if (!utils_constants__WEBPACK_IMPORTED_MODULE_7__["PUSH_CATEGORY"].hasOwnProperty(pushCategory)) throw new utils__WEBPACK_IMPORTED_MODULE_5__["EpicenterError"]("Invalid push category: ".concat(pushCategory));
};
/** Channel thingy */


var Channel = /*#__PURE__*/function () {
  /**
   * Make a new channel
   * @param {*} scope wordsd here
   */
  function Channel(scope) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Channel);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "path", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "update", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "subscription", void 0);

    var scopeBoundary = scope.scopeBoundary,
        scopeKey = scope.scopeKey,
        pushCategory = scope.pushCategory;
    validateScope(scope);
    this.path = "/".concat(scopeBoundary.toLowerCase(), "/").concat(scopeKey, "/").concat(pushCategory.toLowerCase());

    if (adapters__WEBPACK_IMPORTED_MODULE_6__["cometdAdapter"].subscriptions.has(this.path)) {
      this.subscription = adapters__WEBPACK_IMPORTED_MODULE_6__["cometdAdapter"].subscriptions.get(this.path);
    }
  }
  /** This is the publis cahh
   * @param {*} content someom
   * @returns {Promise} something here
   */


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Channel, [{
    key: "publish",
    value: function publish(content) {
      return adapters__WEBPACK_IMPORTED_MODULE_6__["cometdAdapter"].publish(this, content);
    }
  }, {
    key: "subscribe",
    value: function () {
      var _subscribe = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(update, options) {
        var _this = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.subscription) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.unsubscribe();

              case 3:
                this.update = update;
                return _context.abrupt("return", adapters__WEBPACK_IMPORTED_MODULE_6__["cometdAdapter"].add(this, update, options).then(function (subscription) {
                  _this.subscription = subscription;
                  return subscription;
                }));

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function subscribe(_x, _x2) {
        return _subscribe.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: "unsubscribe",
    value: function () {
      var _unsubscribe = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.subscription) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 3;
                return adapters__WEBPACK_IMPORTED_MODULE_6__["cometdAdapter"].remove(this.subscription);

              case 3:
                this.subscription = null;

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function unsubscribe() {
        return _unsubscribe.apply(this, arguments);
      }

      return unsubscribe;
    }()
  }]);

  return Channel;
}();



/***/ }),

/***/ "./src/adapters/cometd.js":
/*!********************************!*\
  !*** ./src/adapters/cometd.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/wrapNativeSuper.js");
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var cometd_AckExtension__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! cometd/AckExtension */ "./node_modules/cometd/AckExtension.js");
/* harmony import */ var cometd_AckExtension__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(cometd_AckExtension__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var cometd_ReloadExtension__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! cometd/ReloadExtension */ "./node_modules/cometd/ReloadExtension.js");
/* harmony import */ var cometd_ReloadExtension__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(cometd_ReloadExtension__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var adapters_project__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! adapters/project */ "./src/adapters/project.js");











function _createSuper(Derived) { return function () { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_8___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_7___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }





var AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
var DISCONNECTED = 'disconnected';
var CONNECTED = 'connected';

var CometdError = /*#__PURE__*/function (_Error) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(CometdError, _Error);

  var _super = _createSuper(CometdError);

  function CometdError(reply) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default()(this, CometdError);

    _this = _super.call(this);
    var error = reply.error,
        successful = reply.successful;

    if (error && error.includes('403') && !successful) {
      _this.status = 401;
    }

    _this.information = reply;
    _this.message = error;
    return _this;
  }

  return CometdError;
}( /*#__PURE__*/_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_9___default()(Error));

var CometdAdapter = /*#__PURE__*/function () {
  function CometdAdapter() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5___default()(this, CometdAdapter);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "url", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "customCometd", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "defaultCometd", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "initialization", void 0);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "subscriptions", new Map());

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "state", DISCONNECTED);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "requireAcknowledgement", true);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(CometdAdapter, [{
    key: "startup",
    value: function () {
      var _startup = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee() {
        var _this2 = this;

        var options,
            enabled,
            cometd,
            apiProtocol,
            apiHost,
            apiVersion,
            _args = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {
                  logLevel: 'error'
                };
                _context.next = 3;
                return Object(adapters_project__WEBPACK_IMPORTED_MODULE_13__["channelsEnabled"])();

              case 3:
                enabled = _context.sent;

                if (enabled) {
                  _context.next = 6;
                  break;
                }

                throw new utils__WEBPACK_IMPORTED_MODULE_12__["EpicenterError"]('Push Channels are not enabled on this project');

              case 6:
                if (!Object(utils__WEBPACK_IMPORTED_MODULE_12__["isBrowser"])()) {
                  _context.next = 11;
                  break;
                }

                _context.next = 9;
                return Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(null, /*! cometd */ "./node_modules/cometd/cometd.js", 7));

              case 9:
                cometd = _context.sent;
                this.defaultCometd = new cometd.CometD();

              case 11:
                apiProtocol = utils__WEBPACK_IMPORTED_MODULE_12__["config"].apiProtocol, apiHost = utils__WEBPACK_IMPORTED_MODULE_12__["config"].apiHost, apiVersion = utils__WEBPACK_IMPORTED_MODULE_12__["config"].apiVersion;
                this.url = "".concat(apiProtocol, "://").concat(apiHost, "/push/v").concat(apiVersion, "/cometd");
                this.cometd.registerExtension('ack', new cometd_AckExtension__WEBPACK_IMPORTED_MODULE_10___default.a());
                this.cometd.registerExtension('reload', new cometd_ReloadExtension__WEBPACK_IMPORTED_MODULE_11___default.a());
                this.cometd.configure({
                  url: this.url,
                  logLevel: options.logLevel
                });

                if (Object(utils__WEBPACK_IMPORTED_MODULE_12__["isBrowser"])()) {
                  window.onunload = function () {
                    if (_this2.cometd.getStatus() === CONNECTED) {
                      _this2.cometd.reload();

                      _this2.cometd.getTransport().abort();
                    }
                  };
                }

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function startup() {
        return _startup.apply(this, arguments);
      }

      return startup;
    }()
  }, {
    key: "reinit",
    value: function () {
      var _reinit = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(customCometd, options) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.disconnect();

              case 2:
                this.initialization = undefined;
                this.customCometd = customCometd;
                return _context2.abrupt("return", this.init(options));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reinit(_x, _x2) {
        return _reinit.apply(this, arguments);
      }

      return reinit;
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(options) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.initialization) {
                  this.initialization = this.startup(options);
                }

                return _context3.abrupt("return", this.initialization);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init(_x3) {
        return _init.apply(this, arguments);
      }

      return init;
    }() // Connects to CometD server

  }, {
    key: "handshake",
    value: function () {
      var _handshake = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4() {
        var _this3 = this;

        var options,
            handshakeProps,
            session,
            _handshakeProps$ext,
            _args4 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                _context4.next = 3;
                return this.init();

              case 3:
                if (!(this.cometd.getStatus() !== DISCONNECTED)) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", Promise.resolve());

              case 5:
                handshakeProps = {};
                session = utils__WEBPACK_IMPORTED_MODULE_12__["identification"].session;

                if (session) {
                  handshakeProps.ext = (_handshakeProps$ext = {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(_handshakeProps$ext, AUTH_TOKEN_KEY, session.token), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(_handshakeProps$ext, "ack", this.requireAcknowledgement), _handshakeProps$ext);
                }

                this.cometd.ackEnabled = this.requireAcknowledgement;
                this.cometd.websocketEnabled = true;
                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                  return _this3.cometd.handshake(handshakeProps, function (handshakeReply) {
                    if (handshakeReply.successful) {
                      resolve(handshakeReply);
                      return;
                    }

                    var error = new CometdError(handshakeReply);

                    if (options.inert) {
                      reject(error);
                      return;
                    }

                    var retry = function retry() {
                      return _this3.handshake({
                        inert: true
                      });
                    };

                    try {
                      var result = utils__WEBPACK_IMPORTED_MODULE_12__["errorManager"].handle(error, retry);
                      resolve(result);
                    } catch (e) {
                      reject(e);
                    }
                  });
                }));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function handshake() {
        return _handshake.apply(this, arguments);
      }

      return handshake;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5() {
        var _this4 = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this.cometd) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", Promise.resolve());

              case 2:
                _context5.next = 4;
                return this.init();

              case 4:
                _context5.next = 6;
                return this.empty();

              case 6:
                if (!(this.cometd.getStatus() !== CONNECTED)) {
                  _context5.next = 8;
                  break;
                }

                return _context5.abrupt("return", Promise.resolve());

              case 8:
                return _context5.abrupt("return", new Promise(function (resolve, reject) {
                  return _this4.cometd.disconnect(function (disconnectReply) {
                    if (!disconnectReply.successful) {
                      reject(new utils__WEBPACK_IMPORTED_MODULE_12__["EpicenterError"]('Unable to disconnect from CometD server'));
                    } else {
                      resolve();
                    }
                  });
                }));

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "add",
    value: function () {
      var _add = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(channel, update) {
        var _this5 = this;

        var options,
            channels,
            subscriptionProps,
            session,
            handleCometdUpdate,
            promises,
            _args6 = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
                _context6.next = 3;
                return this.init();

              case 3:
                channels = [].concat(channel);

                if (!(this.cometd.getStatus() !== CONNECTED)) {
                  _context6.next = 7;
                  break;
                }

                _context6.next = 7;
                return this.handshake();

              case 7:
                subscriptionProps = {};
                session = utils__WEBPACK_IMPORTED_MODULE_12__["identification"].session;

                if (session) {
                  subscriptionProps.ext = _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()({}, AUTH_TOKEN_KEY, session.token);
                }

                handleCometdUpdate = function handleCometdUpdate(_ref) {
                  var channel = _ref.channel,
                      data = _ref.data;
                  data = typeof data === 'string' ? JSON.parse(data) : data;
                  return update(data);
                };

                promises = [];
                this.cometd.batch(function () {
                  return channels.forEach(function (_ref2) {
                    var path = _ref2.path;
                    return promises.push(new Promise(function (resolve, reject) {
                      var subscription = _this5.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, function (subscribeReply) {
                        if (subscribeReply.successful) {
                          _this5.subscriptions.set(subscription.channel, subscription);

                          resolve(subscription);
                          return;
                        }

                        var error = new CometdError(subscribeReply);

                        if (options.inert) {
                          reject(error);
                          return;
                        }

                        var retry = function retry() {
                          return _this5.add(channel, update, {
                            inert: true
                          });
                        };

                        try {
                          var result = utils__WEBPACK_IMPORTED_MODULE_12__["errorManager"].handle(error, retry);
                          resolve(result);
                        } catch (e) {
                          reject(e);
                        }
                      });
                    }));
                  });
                });
                return _context6.abrupt("return", promises.length === 1 ? Promise.all(promises).then(function (_ref3) {
                  var _ref4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref3, 1),
                      res = _ref4[0];

                  return res;
                }) : Promise.all(promises));

              case 14:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function add(_x4, _x5) {
        return _add.apply(this, arguments);
      }

      return add;
    }()
  }, {
    key: "publish",
    value: function () {
      var _publish = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee7(channel, content) {
        var _this6 = this;

        var options,
            channels,
            publishProps,
            session,
            promises,
            _args7 = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                options = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
                _context7.next = 3;
                return this.init();

              case 3:
                channels = [].concat(channel);

                if (!(this.cometd.getStatus() !== CONNECTED)) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 7;
                return this.handshake();

              case 7:
                publishProps = {};
                session = utils__WEBPACK_IMPORTED_MODULE_12__["identification"].session;

                if (session) {
                  publishProps.ext = _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()({}, AUTH_TOKEN_KEY, session.token);
                }

                promises = [];
                this.cometd.batch(function () {
                  return channels.forEach(function (_ref5) {
                    var path = _ref5.path;
                    return promises.push(new Promise(function (resolve, reject) {
                      _this6.cometd.publish(path, content, publishProps, function (publishReply) {
                        if (publishReply.successful) {
                          resolve(publishReply);
                          return;
                        }

                        var error = new CometdError(publishReply);

                        if (options.inert) {
                          reject(error);
                          return;
                        }

                        var retry = function retry() {
                          return _this6.publish(channel, content, {
                            inert: true
                          });
                        };

                        try {
                          var result = utils__WEBPACK_IMPORTED_MODULE_12__["errorManager"].handle(error, retry);
                          resolve(result);
                        } catch (e) {
                          reject(e);
                        }
                      });
                    }));
                  });
                });
                return _context7.abrupt("return", promises.length === 1 ? Promise.all(promises).then(function (_ref6) {
                  var _ref7 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref6, 1),
                      res = _ref7[0];

                  return res;
                }) : Promise.all(promises));

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function publish(_x6, _x7) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
  }, {
    key: "remove",
    value: function () {
      var _remove = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee8(subscription) {
        var _this7 = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.init();

              case 2:
                this.subscriptions["delete"](subscription.channel);
                return _context8.abrupt("return", new Promise(function (resolve, reject) {
                  return _this7.cometd.unsubscribe(subscription, function (unsubscribeReply) {
                    if (unsubscribeReply.successful) {
                      resolve(unsubscribeReply);
                    }

                    var error = new CometdError(unsubscribeReply);
                    reject(error);
                    /* Not using error handling here yet -- should we? */
                  });
                }));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function remove(_x8) {
        return _remove.apply(this, arguments);
      }

      return remove;
    }()
  }, {
    key: "empty",
    value: function () {
      var _empty = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee9() {
        var _this8 = this;

        var promises;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.init();

              case 2:
                promises = [];
                this.cometd.batch(function () {
                  return _this8.subscriptions.forEach(function (subscription) {
                    promises.push(_this8.remove(subscription));
                  });
                });
                return _context9.abrupt("return", Promise.all(promises));

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function empty() {
        return _empty.apply(this, arguments);
      }

      return empty;
    }()
  }, {
    key: "cometd",
    get: function get() {
      return this.customCometd || this.defaultCometd;
    }
  }]);

  return CometdAdapter;
}();

var cometdAdapter = new CometdAdapter();
/* harmony default export */ __webpack_exports__["default"] = (cometdAdapter);

/***/ }),

/***/ "./src/adapters/episode.js":
/*!*********************************!*\
  !*** ./src/adapters/episode.js ***!
  \*********************************/
/*! exports provided: create, get, query, forGroup, byName, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forGroup", function() { return forGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "byName", function() { return byName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");



/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace episodeAdapter
 */

/**
 * Create an episode.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.create('myEpisode', 'myGroupName', {
 *      runLimit: 20,
 *      draft: true,
 * });
 * @param {string}  name                Episode name
 * @param {object}  groupName           Group to make the episode under
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function create(_x, _x2) {
  return _create.apply(this, arguments);
}
/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.get('123124141241);
 *
 * @param {string}  episodeKey          The episode key
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function _create() {
  _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(name, groupName) {
    var optionals,
        accountShortName,
        projectShortName,
        draft,
        runLimit,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, draft = optionals.draft, runLimit = optionals.runLimit;
            _context.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/episode/".concat(groupName), {
              body: {
                name: name,
                draft: draft,
                runLimit: runLimit
              }
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _create.apply(this, arguments);
}

function get(_x3) {
  return _get.apply(this, arguments);
}
/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.get();
 * episodeAdapter.get({ episodeKey: 12321 });
 * episodeAdapter.get({ groupName: 'myGroupName', episodeName: 'myEpisodeName' });
 *
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function _get() {
  _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(episodeKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/".concat(episodeKey)).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _get.apply(this, arguments);
}

function query() {
  return _query.apply(this, arguments);
}
/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.withGroup('1231241342345');
 *
 * @param {string}  groupKey            The group key
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function _query() {
  _query = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
    var optionals,
        accountShortName,
        projectShortName,
        _optionals$filter,
        filter,
        _optionals$sort,
        sort,
        _optionals$first,
        first,
        _optionals$max,
        max,
        _args3 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, _optionals$filter = optionals.filter, filter = _optionals$filter === void 0 ? [] : _optionals$filter, _optionals$sort = optionals.sort, sort = _optionals$sort === void 0 ? [] : _optionals$sort, _optionals$first = optionals.first, first = _optionals$first === void 0 ? 0 : _optionals$first, _optionals$max = optionals.max, max = _optionals$max === void 0 ? 100 : _optionals$max;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              filter: filter.join(';'),
              sort: sort.join(';'),
              first: first,
              max: max
            }).get('/episode/search').then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _query.apply(this, arguments);
}

function forGroup(_x4) {
  return _forGroup.apply(this, arguments);
}
/**
 * Gets episode based on group name and episode name
 * Unsure where this would see use...
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.withName('myGroupName', 'myEpisodeName');
 *
 * @param {string}  groupName           The group name
 * @param {string}  episodeName         The episode name
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function _forGroup() {
  _forGroup = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(groupKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args4 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            optionals = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context4.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/in/".concat(groupKey)).then(function (_ref4) {
              var body = _ref4.body;
              return body;
            });

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _forGroup.apply(this, arguments);
}

function byName(_x5, _x6) {
  return _byName.apply(this, arguments);
}
/**
 * Deletes an episode
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * const episodeKey = 1234;
 * episodeAdapter.remove(episodeKey);
 *
 * @param {string}  episodeKey          Something meaningful about optionals
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function _byName() {
  _byName = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(groupName, episodeName) {
    var optionals,
        accountShortName,
        projectShortName,
        _args5 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            optionals = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context5.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/with/".concat(groupName, "/").concat(episodeName)).then(function (_ref5) {
              var body = _ref5.body;
              return body;
            });

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _byName.apply(this, arguments);
}

function remove(_x7) {
  return _remove.apply(this, arguments);
}

function _remove() {
  _remove = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(episodeKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args6 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            optionals = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context6.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)["delete"]("/episode/".concat(episodeKey)).then(function (_ref6) {
              var body = _ref6.body;
              return body;
            });

          case 4:
            return _context6.abrupt("return", _context6.sent);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _remove.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/group.js":
/*!*******************************!*\
  !*** ./src/adapters/group.js ***!
  \*******************************/
/*! exports provided: get, destroy, gather, update, create, search, withGroupName, forUserKey, getSessionGroups, register, addUser, updateUser, removeUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gather", function() { return gather; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update", function() { return update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "search", function() { return search; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withGroupName", function() { return withGroupName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forUserKey", function() { return forUserKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSessionGroups", function() { return getSessionGroups; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addUser", function() { return addUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateUser", function() { return updateUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeUser", function() { return removeUser; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");




/**
 * Group API adapters -- handles groups and group memberships
 * @namespace groupAdapter
 */

/**
 * Provides information on a particular Epicenter group.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group[/:member]/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * import { authAdapter, groupAdapter } from 'epicenter';
 * const session = authAdapter.getLocalSession();
 * const group = await groupAdapter.get(session.groupKey, {
 *      augment: 'MEMBERS'      // include members of the group in return
 * });
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.augment]             Augments the GET request to return additional information, one of [MEMBERS, QUANTIZED]
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group object
 */

function get(_x) {
  return _get.apply(this, arguments);
}
/**
 * Deletes the group; available only to Epicenter admins
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.destroy(group.groupKey);
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _get() {
  _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(groupKey) {
    var optionals,
        accountShortName,
        projectShortName,
        augment,
        uriComponent,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, augment = optionals.augment;
            uriComponent = '';
            if (augment === 'MEMBERS') uriComponent = '/member';
            if (augment === 'QUANTIZED') uriComponent = '/quantized';
            _context.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/group".concat(uriComponent, "/").concat(groupKey)).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 7:
            return _context.abrupt("return", _context.sent);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _get.apply(this, arguments);
}

function destroy(_x2) {
  return _destroy.apply(this, arguments);
}
/**
 * Provides information on for all groups in the project
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group?expired={BOOLEAN}`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.gather();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {boolean} [optionals.expired]             Indicates whether to include expired groups in the query
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                              List of groups
 */

function _destroy() {
  _destroy = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(groupKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)["delete"]("/group/".concat(groupKey)).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _destroy.apply(this, arguments);
}

function gather() {
  return _gather.apply(this, arguments);
}
/**
 * Updates fields for a particular group; available only to Epicenter admins.
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.update(groupKey, { event: 'Orientation Day' });
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  update                          Attributes you wish to update
 * @param {number}  update.runLimit                 Defines the upper limit of runs allowed in the group
 * @param {string}  update.organization             Name of the organization owning the group
 * @param {boolean} update.allowSelfRegistration    TODO
 * @param {object}  update.flightRecorder           TODO
 * @param {number}  update.flightRecorder.start     TODO
 * @param {number}  update.flightRecorder.stop      TODO
 * @param {boolean} update.flightRecorder.enabled   TODO
 * @param {string}  update.event                    Name of the event the group is playing for
 * @param {boolean} update.allowMembershipChanges   TODO
 * @param {object}  update.pricing                  TODO
 * @param {object}  update.startDate                TODO
 * @param {object}  update.expirationDate           TODO
 * @param {object}  update.capacity                 Defines the upper limit on the number of users allowed in the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group with updated attributes
 */

function _gather() {
  _gather = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
    var optionals,
        accountShortName,
        projectShortName,
        expired,
        _args3 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, expired = optionals.expired;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              expired: expired
            }).get('/group').then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _gather.apply(this, arguments);
}

function update(_x3, _x4) {
  return _update.apply(this, arguments);
}
/**
 * Creates a new group; available only to Epicenter admins
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.create({
 *      runLimit: 10,
 *      name: 'my-group-name',
 * });
 *
 * @param {object}  group                           Group object
 * @param {string}  group.name                      Group name (required)
 * @param {number}  group.runLimit                  Defines the upper limit on the number of runs allowed in the group
 * @param {string}  group.organization              Name of the organization owning the group
 * @param {string}  group.allowSelfRegistration     TODO
 * @param {object}  group.flightRecorder            TODO
 * @param {number}  group.flightRecorder.start      TODO
 * @param {number}  group.flightRecorder.stop       TODO
 * @param {boolean} group.flightRecorder.enabled    TODO
 * @param {string}  group.event                     Name of the event the group is playing for
 * @param {boolean} group.allowMembershipChanges    TODO
 * @param {object}  group.pricing                   TODO
 * @param {object}  group.startDate                 TODO
 * @param {object}  group.expirationDate            TODO
 * @param {object}  group.capacity                  Defines the upper limit on the number of users allowed in the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created group
 */

function _update() {
  _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(groupKey, update) {
    var optionals,
        runLimit,
        organization,
        allowSelfRegistration,
        flightRecorder,
        event,
        allowMembershipChanges,
        pricing,
        startDate,
        expirationDate,
        capacity,
        accountShortName,
        projectShortName,
        _args4 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            optionals = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            runLimit = update.runLimit, organization = update.organization, allowSelfRegistration = update.allowSelfRegistration, flightRecorder = update.flightRecorder, event = update.event, allowMembershipChanges = update.allowMembershipChanges, pricing = update.pricing, startDate = update.startDate, expirationDate = update.expirationDate, capacity = update.capacity;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context4.next = 5;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/group/".concat(groupKey), {
              body: {
                runLimit: runLimit,
                organization: organization,
                allowSelfRegistration: allowSelfRegistration,
                flightRecorder: flightRecorder,
                event: event,
                allowMembershipChanges: allowMembershipChanges,
                pricing: pricing,
                startDate: startDate,
                expirationDate: expirationDate,
                capacity: capacity
              }
            }).then(function (_ref4) {
              var body = _ref4.body;
              return body;
            });

          case 5:
            return _context4.abrupt("return", _context4.sent);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _update.apply(this, arguments);
}

function create(_x5) {
  return _create.apply(this, arguments);
}
/**
 * Queries for groups
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/search?filter={FILTER}&sort={SORT}&first={FIRST}&max={MAX}`
 *
 * @memberof groupAdapter
 * @example
 *
 * import { groupAdapter } from 'epicenter';
 * groupAdapter.search({
 *      filter: [
 *          'group.name|=group1|group2',    // look for groups whose name is 'group1' or 'group2'
 *          'permission.role=FACILITATOR',  // where there exists at least one facilitator user
 *          'user.userKey=0123',            // whose userKey is '0123'
 *      },
 *      sort: ['+group.name']               // sort all findings by group name ascending (lexigraphically)
 * });
 *
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string[]}    [optionals.filter]              List of conditionals to filter for
 * @param {string[]}    [optionals.sort]                List of values to sort by
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                    Group object
 */

function _create() {
  _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(group) {
    var optionals,
        name,
        runLimit,
        organization,
        allowSelfRegistration,
        flightRecorder,
        event,
        allowMembershipChanges,
        pricing,
        startDate,
        expirationDate,
        capacity,
        accountShortName,
        projectShortName,
        _args5 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            optionals = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
            name = group.name, runLimit = group.runLimit, organization = group.organization, allowSelfRegistration = group.allowSelfRegistration, flightRecorder = group.flightRecorder, event = group.event, allowMembershipChanges = group.allowMembershipChanges, pricing = group.pricing, startDate = group.startDate, expirationDate = group.expirationDate, capacity = group.capacity;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;

            if (name) {
              _context5.next = 5;
              break;
            }

            throw new utils__WEBPACK_IMPORTED_MODULE_2__["EpicenterError"]('Cannot create a group with no name');

          case 5:
            _context5.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/group', {
              body: {
                name: name,
                runLimit: runLimit,
                organization: organization,
                allowSelfRegistration: allowSelfRegistration,
                flightRecorder: flightRecorder,
                event: event,
                allowMembershipChanges: allowMembershipChanges,
                pricing: pricing,
                startDate: startDate,
                expirationDate: expirationDate,
                capacity: capacity
              }
            }).then(function (_ref5) {
              var body = _ref5.body;
              return body;
            });

          case 7:
            return _context5.abrupt("return", _context5.sent);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _create.apply(this, arguments);
}

function search() {
  return _search.apply(this, arguments);
}
/**
 * Retrieves a group with given group name
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/with/{GROUP_NAME}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.withGroupName(group.groupKey)
 *
 * @param {string}  name                            Name associated with the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group Object
 */

function _search() {
  _search = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6() {
    var optionals,
        _optionals$filter,
        filter,
        _optionals$sort,
        sort,
        first,
        max,
        quantized,
        accountShortName,
        projectShortName,
        searchParams,
        _args6 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            optionals = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
            _optionals$filter = optionals.filter, filter = _optionals$filter === void 0 ? [] : _optionals$filter, _optionals$sort = optionals.sort, sort = _optionals$sort === void 0 ? [] : _optionals$sort, first = optionals.first, max = optionals.max, quantized = optionals.quantized, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            searchParams = {
              filter: filter.join(';') || undefined,
              sort: sort.join(';') || undefined,
              first: first,
              max: max
            };
            _context6.next = 5;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/group".concat(quantized ? '/quantized' : '', "/search"), {
              paginated: true
            }).then(function (_ref6) {
              var body = _ref6.body;
              return body;
            });

          case 5:
            return _context6.abrupt("return", _context6.sent);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _search.apply(this, arguments);
}

function withGroupName(_x6) {
  return _withGroupName.apply(this, arguments);
}
/**
 * Retrieves the list of groups a particular user is in; intended for admin use
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/for/{USER_KEY}[?expired={BOOLEAN}&all={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.forUserKey(
 *      user.userKey,               // get groups where this user is a member of
 *      { role: ['FACILITATOR'] }   // where this user is a facilitator in the group
 * );
 *
 * @param {string}          userKey                         Name associated with the group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.expired]             Indicates whether to include expired groups in the query
 * @param {boolean}         [optionals.all]                 Indicates whether to include the other members in the group (by default, only the requested user appears)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */

function _withGroupName() {
  _withGroupName = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(name) {
    var optionals,
        accountShortName,
        projectShortName,
        _args7 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            optionals = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context7.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/group/with/".concat(name)).then(function (_ref7) {
              var body = _ref7.body;
              return body;
            });

          case 4:
            return _context7.abrupt("return", _context7.sent);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _withGroupName.apply(this, arguments);
}

function forUserKey(_x7) {
  return _forUserKey.apply(this, arguments);
}
/**
 * Retrieves the list of groups particular to the current session
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member[?expired={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.getSessionGroups();
 *
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.expired]             Indicates whether to include expired groups in the query (defaults to false)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */

function _forUserKey() {
  _forUserKey = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee8(userKey) {
    var optionals,
        expired,
        all,
        role,
        accountShortName,
        projectShortName,
        isMultiple,
        roleList,
        searchParams,
        _args8 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            optionals = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
            expired = optionals.expired, all = optionals.all, role = optionals.role, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            isMultiple = Array.isArray(role) && role.length > 0;
            roleList = isMultiple ? role : [role];
            searchParams = {
              expired: expired,
              all: all,
              role: role ? roleList : undefined
            };
            _context8.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/group/member/for/".concat(userKey)).then(function (_ref8) {
              var body = _ref8.body;
              return body;
            });

          case 7:
            return _context8.abrupt("return", _context8.sent);

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _forUserKey.apply(this, arguments);
}

function getSessionGroups() {
  return _getSessionGroups.apply(this, arguments);
}
/**
 * Self-application for membership in a group; will only work if the group has the self-registration setting turned on.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/selfRegistration/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.register(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */

function _getSessionGroups() {
  _getSessionGroups = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee9() {
    var optionals,
        expired,
        role,
        accountShortName,
        projectShortName,
        isMultiple,
        roleList,
        searchParams,
        _args9 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            optionals = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {};
            expired = optionals.expired, role = optionals.role, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            isMultiple = Array.isArray(role) && role.length > 0;
            roleList = isMultiple ? role : [role];
            searchParams = {
              expired: expired,
              role: role ? roleList : undefined
            };
            _context9.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get('/group/member').then(function (_ref9) {
              var body = _ref9.body;
              return body;
            });

          case 7:
            return _context9.abrupt("return", _context9.sent);

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getSessionGroups.apply(this, arguments);
}

function register(_x8) {
  return _register.apply(this, arguments);
}
/**
 * Adds a user to a group
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.addUser(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {string}          userKey                         Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.role]                User's role -- defaults to PARTICIPANT if unset; See [ROLE](#ROLE) for all types
 * @param {string}          [optionals.available]           Indicates whether or not the user is 'active' (for semantic labeling) -- defaults to true if unset
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Group the user was added to
 */

function _register() {
  _register = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee10(groupKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args10 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            optionals = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName; // TODO figure stufffffffff

            _context10.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/group/selfRegistration/".concat(groupKey)).then(function (_ref10) {
              var body = _ref10.body;
              return body;
            });

          case 4:
            return _context10.abrupt("return", _context10.sent);

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _register.apply(this, arguments);
}

function addUser(_x9, _x10) {
  return _addUser.apply(this, arguments);
}
/**
 * Updates a user's group membership information
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}/{USER_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.updateUser(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {string}          userKey                         Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.role]                User's role; See [ROLE](#ROLE) for all types
 * @param {string}          [optionals.available]           Indicates whether or not the user is 'active' (for semantic labeling)
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Group the user was added to
 */

function _addUser() {
  _addUser = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee11(groupKey, userKey) {
    var optionals,
        role,
        available,
        accountShortName,
        projectShortName,
        _args11 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            optionals = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {};
            role = optionals.role, available = optionals.available, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context11.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/group/member/".concat(groupKey), {
              body: {
                objectType: 'group',
                userKey: userKey,
                role: role !== null && role !== void 0 ? role : utils_constants__WEBPACK_IMPORTED_MODULE_3__["ROLE"].PARTICIPANT,
                available: available !== null && available !== void 0 ? available : true
              }
            }).then(function (_ref11) {
              var body = _ref11.body;
              return body;
            });

          case 4:
            return _context11.abrupt("return", _context11.sent);

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _addUser.apply(this, arguments);
}

function updateUser(_x11, _x12) {
  return _updateUser.apply(this, arguments);
}
/**
 * Removes user(s) from the group
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}[/{USER_KEY}][?userKey={USER_KEY}&userKey=...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * const userKeys = members.map(({ userKey }) => userKey);
 * epicenter.groupAdapter.removeUsers(group.groupKey, userKeys)
 *
 * @param {string}          groupKey                        Key associated with the group
 * @param {string|string[]} userKey                         Key associated with the user or an array of user keys to remove from group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _updateUser() {
  _updateUser = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee12(groupKey, userKey) {
    var optionals,
        role,
        available,
        accountShortName,
        projectShortName,
        _args12 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            optionals = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            role = optionals.role, available = optionals.available, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context12.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/group/member/".concat(groupKey, "/").concat(userKey), {
              body: {
                objectType: 'group',
                role: role,
                available: available
              }
            }).then(function (_ref12) {
              var body = _ref12.body;
              return body;
            });

          case 4:
            return _context12.abrupt("return", _context12.sent);

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _updateUser.apply(this, arguments);
}

function removeUser(_x13, _x14) {
  return _removeUser.apply(this, arguments);
}

function _removeUser() {
  _removeUser = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee13(groupKey, userKey) {
    var optionals,
        accountShortName,
        projectShortName,
        hasMultiple,
        uriComponent,
        searchParams,
        _args13 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            optionals = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            hasMultiple = Array.isArray(userKey) && userKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(userKey.length === 1 ? userKey[0] : userKey);
            searchParams = hasMultiple ? {
              userKey: userKey
            } : undefined;
            _context13.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams)["delete"]("/group/member/".concat(groupKey).concat(uriComponent)).then(function (_ref13) {
              var body = _ref13.body;
              return body;
            });

          case 7:
            return _context13.abrupt("return", _context13.sent);

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _removeUser.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/index.js":
/*!*******************************!*\
  !*** ./src/adapters/index.js ***!
  \*******************************/
/*! exports provided: accountAdapter, authAdapter, cometdAdapter, episodeAdapter, groupAdapter, presenceAdapter, projectAdapter, runAdapter, vaultAdapter, worldAdapter, Channel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./account */ "./src/adapters/account.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "accountAdapter", function() { return _account__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _authentication__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authentication */ "./src/adapters/authentication.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "authAdapter", function() { return _authentication__WEBPACK_IMPORTED_MODULE_1__; });
/* harmony import */ var _episode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./episode */ "./src/adapters/episode.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "episodeAdapter", function() { return _episode__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _group__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./group */ "./src/adapters/group.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "groupAdapter", function() { return _group__WEBPACK_IMPORTED_MODULE_3__; });
/* harmony import */ var _presence__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./presence */ "./src/adapters/presence.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "presenceAdapter", function() { return _presence__WEBPACK_IMPORTED_MODULE_4__; });
/* harmony import */ var _project__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./project */ "./src/adapters/project.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "projectAdapter", function() { return _project__WEBPACK_IMPORTED_MODULE_5__; });
/* harmony import */ var _run__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./run */ "./src/adapters/run.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "runAdapter", function() { return _run__WEBPACK_IMPORTED_MODULE_6__; });
/* harmony import */ var _vault__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vault */ "./src/adapters/vault.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vaultAdapter", function() { return _vault__WEBPACK_IMPORTED_MODULE_7__; });
/* harmony import */ var _world__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./world */ "./src/adapters/world.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "worldAdapter", function() { return _world__WEBPACK_IMPORTED_MODULE_8__; });
/* harmony import */ var _cometd__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./cometd */ "./src/adapters/cometd.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cometdAdapter", function() { return _cometd__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _channel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./channel */ "./src/adapters/channel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return _channel__WEBPACK_IMPORTED_MODULE_10__["default"]; });














/***/ }),

/***/ "./src/adapters/presence.js":
/*!**********************************!*\
  !*** ./src/adapters/presence.js ***!
  \**********************************/
/*! exports provided: connect, forGroup, forWorld */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forGroup", function() { return forGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forWorld", function() { return forWorld; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var adapters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! adapters */ "./src/adapters/index.js");




/**
 * Presence API adapters -- use this to track online/offline users
 * @namespace presenceAdapter
 */

/**
 * Makes a connection request to the cometd server; effectively marking the user as online; using [logout](#authAdapter-logout) will automatically disconnect for you.
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forWorld(world.worldKey)
 *
 * @returns {Promise}   Promise indicating whether or not the connection was successful
 */

function connect() {
  return _connect.apply(this, arguments);
}
/**
 * Retrieves the presence information for a particular group
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/presence/group/{GROUP_KEY}`
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forGroup(group.groupKey)
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                List of users online
 */

function _connect() {
  _connect = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", adapters__WEBPACK_IMPORTED_MODULE_3__["cometdAdapter"].handshake());

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _connect.apply(this, arguments);
}

function forGroup(_x) {
  return _forGroup.apply(this, arguments);
}
/**
 * Retrieves the presence information for a particular world
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/presence/world/{WORLD_KEY}`
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forWorld(world.worldKey)
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                List of users online
 */

function _forGroup() {
  _forGroup = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(groupKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/presence/group/".concat(groupKey)).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _forGroup.apply(this, arguments);
}

function forWorld(_x2) {
  return _forWorld.apply(this, arguments);
}

function _forWorld() {
  _forWorld = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(worldKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args3 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/presence/world/".concat(worldKey)).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _forWorld.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/project.js":
/*!*********************************!*\
  !*** ./src/adapters/project.js ***!
  \*********************************/
/*! exports provided: channelsEnabled */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "channelsEnabled", function() { return channelsEnabled; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");



/**
 * Project API adapters -- project stuff TODO
 * @namespace projectAdapter
 */

/**
 * Makes a connection request to the cometd server; effectively marking the user as online; using [logout](#authAdapter-logout) will automatically disconnect for you.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/project/channel/isEnabled`
 *
 * @memberof projectAdapter
 * @example
 *
 * epicenter.projectAdapter.channelsEnabled()
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {Promise}                               Promise resolving true/false whether or not the project supports the use of push channels
 */

function channelsEnabled() {
  return _channelsEnabled.apply(this, arguments);
}

function _channelsEnabled() {
  _channelsEnabled = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
    var optionals,
        accountShortName,
        projectShortName,
        response,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get('/project/channel/isEnabled').then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _channelsEnabled.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/run.js":
/*!*****************************!*\
  !*** ./src/adapters/run.js ***!
  \*****************************/
/*! exports provided: create, clone, restore, rewind, update, remove, get, query, introspect, operation, getVariables, getVariable, updateVariables, getMetadata, updateMetadata, action, getWithStrategy, retrieveFromWorld, removeFromWorld */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return clone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "restore", function() { return restore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rewind", function() { return rewind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update", function() { return update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "introspect", function() { return introspect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "operation", function() { return operation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVariables", function() { return getVariables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVariable", function() { return getVariable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateVariables", function() { return updateVariables; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMetadata", function() { return getMetadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateMetadata", function() { return updateMetadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "action", function() { return action; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWithStrategy", function() { return getWithStrategy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "retrieveFromWorld", function() { return retrieveFromWorld; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeFromWorld", function() { return removeFromWorld; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



/**
 * Run API adapters -- use this to create, update, delete, and manage your runs
 * @namespace runAdapter
 */

/**
 * Creates a run. By default, all runs are created with the user's ID (`userKey`) and user-only read-write permissions, except in the case of world-scoped runs. For more information on scopes,
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, SCOPE_BOUNDARY } from 'epicenter';
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '000001713a246b0b34b5b5d274c057a5b2a7'
 * });
 * @param {string}  model                           Name of your model file
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {string}  [optionals.userKey]             Key of the user creating the run, should be `undefined` if it's a world run
 * @param {boolean} [optionals.ephemeral]           Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param {string}  [optionals.trackingKey]         Tracking key
 * @param {object}  [optionals.modelContext]        .ctx2 file overrides, this is not tracked by clone operations
 * @param {object}  [optionals.executionContext]    Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created run
 */

function create(_x, _x2) {
  return _create.apply(this, arguments);
}
/**
 * Clone a run
 * @memberof runAdapter
 *
 * @param {string}  runKey          Run's key
 * @param {object}  [optionals={}]  Object for all optional fields
 * @returns {object}                Response with the run in the "body"
 */

function _create() {
  _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee(model, scope) {
    var optionals,
        scopeBoundary,
        scopeKey,
        readLock,
        writeLock,
        userKey,
        ephemeral,
        trackingKey,
        modelContext,
        executionContext,
        accountShortName,
        projectShortName,
        WORLD,
        PARTICIPANT,
        USER,
        defaultLock,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            scopeBoundary = scope.scopeBoundary, scopeKey = scope.scopeKey;
            readLock = optionals.readLock, writeLock = optionals.writeLock, userKey = optionals.userKey, ephemeral = optionals.ephemeral, trackingKey = optionals.trackingKey, modelContext = optionals.modelContext, executionContext = optionals.executionContext, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            WORLD = utils_constants__WEBPACK_IMPORTED_MODULE_4__["SCOPE_BOUNDARY"].WORLD;
            PARTICIPANT = utils_constants__WEBPACK_IMPORTED_MODULE_4__["ROLE"].PARTICIPANT, USER = utils_constants__WEBPACK_IMPORTED_MODULE_4__["ROLE"].USER;
            defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;
            _context.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/run', {
              body: {
                scope: {
                  scopeBoundary: scopeBoundary,
                  scopeKey: scopeKey,
                  userKey: scopeBoundary === WORLD ? undefined : userKey !== null && userKey !== void 0 ? userKey : utils__WEBPACK_IMPORTED_MODULE_3__["identification"].session.userKey
                },
                permit: {
                  readLock: readLock || defaultLock,
                  writeLock: writeLock || defaultLock
                },
                morphology: 'MANY',
                trackingKey: trackingKey,
                modelFile: model,
                modelContext: modelContext || {
                  /* Is not recorded for clone. Overrides model ctx2 file. */
                },
                executionContext: executionContext || {
                  /* Affected by clone. Carries arguments for model file worker on model initialization */
                },
                ephemeral: ephemeral
              }
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 8:
            return _context.abrupt("return", _context.sent);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _create.apply(this, arguments);
}

function clone(_x3) {
  return _clone.apply(this, arguments);
}

function _clone() {
  _clone = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee2(runKey) {
    var optionals,
        accountShortName,
        projectShortName,
        ephemeral,
        trackingKey,
        _optionals$modelConte,
        modelContext,
        _optionals$executionC,
        executionContext,
        _args2 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, ephemeral = optionals.ephemeral, trackingKey = optionals.trackingKey, _optionals$modelConte = optionals.modelContext, modelContext = _optionals$modelConte === void 0 ? {} : _optionals$modelConte, _optionals$executionC = optionals.executionContext, executionContext = _optionals$executionC === void 0 ? {} : _optionals$executionC;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/clone/".concat(runKey), {
              body: {
                trackingKey: trackingKey,
                modelContext: modelContext,
                executionContext: executionContext,
                ephemeral: ephemeral
              }
            }).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _clone.apply(this, arguments);
}

function restore(_x4) {
  return _restore.apply(this, arguments);
}

function _restore() {
  _restore = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee3(runKey) {
    var optionals,
        accountShortName,
        projectShortName,
        ephemeral,
        _optionals$modelConte2,
        modelContext,
        _optionals$executionC2,
        executionContext,
        _args3 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, ephemeral = optionals.ephemeral, _optionals$modelConte2 = optionals.modelContext, modelContext = _optionals$modelConte2 === void 0 ? {} : _optionals$modelConte2, _optionals$executionC2 = optionals.executionContext, executionContext = _optionals$executionC2 === void 0 ? {} : _optionals$executionC2;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/restore/".concat(runKey), {
              body: {
                modelContext: modelContext,
                executionContext: executionContext,
                ephemeral: ephemeral
              }
            }).then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _restore.apply(this, arguments);
}

function rewind(_x5, _x6) {
  return _rewind.apply(this, arguments);
}

function _rewind() {
  _rewind = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee4(runKey, steps) {
    var optionals,
        accountShortName,
        projectShortName,
        ephemeral,
        _optionals$modelConte3,
        modelContext,
        _args4 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            optionals = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, ephemeral = optionals.ephemeral, _optionals$modelConte3 = optionals.modelContext, modelContext = _optionals$modelConte3 === void 0 ? {} : _optionals$modelConte3;
            _context4.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/rewind/".concat(runKey), {
              body: {
                rewindCount: steps,
                modelContext: modelContext,
                ephemeral: ephemeral
              }
            }).then(function (_ref4) {
              var body = _ref4.body;
              return body;
            });

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _rewind.apply(this, arguments);
}

function update(_x7, _x8) {
  return _update.apply(this, arguments);
}
/**
 * *Does not actually delete the run*. The run is instead removed from memory. This can be used as a means of preserving server CPUs, and should be used when you do not expect to perform any addtional actions that would bring the run back into memory. (TODO: see David for details; is it just operations that bring the run into memory? what about clone... etc.)
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/{RUN_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * epicenter.runAdapter.remove(run.runKey);
 *
 * @param {string}  runKey                          Key associated with the run
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                TODO
 */

function _update() {
  _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee5(runKey, update) {
    var optionals,
        readLock,
        writeLock,
        trackingKey,
        marked,
        hidden,
        closed,
        accountShortName,
        projectShortName,
        hasMultiple,
        uriComponent,
        _args5 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            optionals = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            readLock = update.readLock, writeLock = update.writeLock, trackingKey = update.trackingKey, marked = update.marked, hidden = update.hidden, closed = update.closed;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            _context5.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(hasMultiple ? {
              runKey: runKey
            } : '').patch("/run".concat(uriComponent), {
              body: {
                readLock: readLock,
                writeLock: writeLock,
                trackingKey: trackingKey,
                marked: marked,
                hidden: hidden,
                closed: closed
              }
            }).then(function (_ref5) {
              var body = _ref5.body;
              return body;
            });

          case 7:
            return _context5.abrupt("return", _context5.sent);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _update.apply(this, arguments);
}

function remove(_x9) {
  return _remove.apply(this, arguments);
}

function _remove() {
  _remove = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee6(runKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args6 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            optionals = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context6.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)["delete"]("/run/".concat(runKey)).then(function (_ref6) {
              var body = _ref6.body;
              return body;
            });

          case 4:
            return _context6.abrupt("return", _context6.sent);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _remove.apply(this, arguments);
}

function get(_x10) {
  return _get.apply(this, arguments);
}
/**
 * Queries for runs.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{MODEL_FILE}?filter={FILTER}&sort={SORT}&first={FIRST}&max={MAX}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter } from 'epicenter';
 * runAdapter.query({
 *      filter: [
 *          'var.foo|=1|2|3',               // look for runs with a variable 'foo' with the values 1, 2, or 3
 *          'run.hidden=false',             // where the run's 'hidden' attribute is false
 *          'meta.classification~=bar-*'    // where the run metadata contains a 'classification' that begins with 'bar-'
 *      ],
 *      sort: ['+run.created']              // sort all findings by the 'created' field
 *      variables: ['foo', 'baz'],          // include the run variables for 'foo' and 'baz' in the response
 *      metadata: ['classification']        // include the run metadata for 'classification' in the response
 * });
 *
 * @param {string}      model                           Name of your model file
 * @param {object}      scope                           Scope associated with your run
 * @param {string}      scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}      scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string[]}    [optionals.filter]              List of conditionals to filter for
 * @param {string[]}    [optionals.sort]                List of values to sort by
 * @param {string[]}    [optionals.variables]           List of variables to include with the runs found
 * @param {string[]}    [optionals.metadata]            List of metadata to include with the runs found
 * @param {number}      [optionals.first]               The index from which we collect our runs from
 * @param {number}      [optionals.max]                 The maximum number of runs to return (upper limit: 200)
 * @param {number}      [optionals.timeout]             Number of seconds we're willing to wait for the response from the server
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                    TODO
 */

function _get() {
  _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee7(runKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args7 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            optionals = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context7.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/run/".concat(runKey)).then(function (_ref7) {
              var body = _ref7.body;
              return body;
            });

          case 4:
            return _context7.abrupt("return", _context7.sent);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _get.apply(this, arguments);
}

function query(_x11, _x12) {
  return _query.apply(this, arguments);
}

function _query() {
  _query = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee8(model, scope) {
    var optionals,
        scopeBoundary,
        scopeKey,
        _optionals$filter,
        filter,
        _optionals$sort,
        sort,
        first,
        max,
        timeout,
        _optionals$variables,
        variables,
        _optionals$metadata,
        metadata,
        accountShortName,
        projectShortName,
        searchParams,
        _args8 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            optionals = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            scopeBoundary = scope.scopeBoundary, scopeKey = scope.scopeKey;
            _optionals$filter = optionals.filter, filter = _optionals$filter === void 0 ? [] : _optionals$filter, _optionals$sort = optionals.sort, sort = _optionals$sort === void 0 ? [] : _optionals$sort, first = optionals.first, max = optionals.max, timeout = optionals.timeout, _optionals$variables = optionals.variables, variables = _optionals$variables === void 0 ? [] : _optionals$variables, _optionals$metadata = optionals.metadata, metadata = _optionals$metadata === void 0 ? [] : _optionals$metadata, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            searchParams = {
              filter: filter.join(';') || undefined,
              sort: sort.join(';') || undefined,
              "var": variables.join(';') || undefined,
              meta: metadata.join(';') || undefined,
              first: first,
              max: max,
              timeout: timeout
            };
            _context8.next = 6;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/".concat(scopeBoundary, "/").concat(scopeKey, "/").concat(model), {
              paginated: true,
              parsePage: function parsePage(values) {
                return values.map(function (run) {
                  run.variables = variables.reduce(function (variableMap, key, index) {
                    variableMap[key] = variables[index];
                    return variableMap;
                  }, {});
                  return run;
                });
              }
            }).then(function (_ref8) {
              var body = _ref8.body;
              return body;
            });

          case 6:
            return _context8.abrupt("return", _context8.sent);

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _query.apply(this, arguments);
}

function introspect(_x13) {
  return _introspect.apply(this, arguments);
}

function _introspect() {
  _introspect = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee9(model) {
    var optionals,
        accountShortName,
        projectShortName,
        _args9 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            optionals = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context9.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/run/introspect/".concat(model)).then(function (_ref9) {
              var body = _ref9.body;
              return body;
            });

          case 4:
            return _context9.abrupt("return", _context9.sent);

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _introspect.apply(this, arguments);
}

function operation(_x14, _x15) {
  return _operation.apply(this, arguments);
}

function _operation() {
  _operation = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee10(runKey, name) {
    var args,
        optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        hasMultiple,
        uriComponent,
        searchParams,
        _args10 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            args = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : [];
            optionals = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout
            } : {
              ritual: ritual,
              timeout: timeout
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            _context10.next = 9;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).post("/run/operation".concat(uriComponent), {
              body: {
                name: name,
                arguments: args,
                objectType: 'execute' // TODO: remove this when platform fixes this so that it's not manually required

              }
            }).then(function (_ref10) {
              var body = _ref10.body;
              return body;
            });

          case 9:
            return _context10.abrupt("return", _context10.sent);

          case 10:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _operation.apply(this, arguments);
}

function getVariables(_x16, _x17) {
  return _getVariables.apply(this, arguments);
}

function _getVariables() {
  _getVariables = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee11(runKey, variables) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        include,
        hasMultiple,
        uriComponent,
        searchParams,
        mappify,
        _args11 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            optionals = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            include = variables.join(';');
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout,
              include: include
            } : {
              ritual: ritual,
              timeout: timeout,
              include: include
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            mappify = function mappify(values) {
              return variables.reduce(function (variableMap, key, index) {
                variableMap[key] = values[index];
                return variableMap;
              }, {});
            };

            _context11.next = 10;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/variable".concat(uriComponent)).then(function (_ref11) {
              var body = _ref11.body;
              return !hasMultiple ? mappify(body) : Object.keys(body).map(function (runKey) {
                return {
                  runKey: runKey,
                  variables: mappify(body[runKey])
                };
              });
            });

          case 10:
            return _context11.abrupt("return", _context11.sent);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _getVariables.apply(this, arguments);
}

function getVariable(_x18, _x19) {
  return _getVariable.apply(this, arguments);
}
/**
 * Updates model variables for the run
 * @memberof runAdapter
 *
 * @param {string}  runKey      Identifier for your run
 * @param {object}  update      Object with the key-value pairs you would like to update in the model
 * @param {object}  optionals   Something meaningful about optionals
 * @returns {object}            Object with the variables & new values that were updated
 */

function _getVariable() {
  _getVariable = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee12(runKey, variable) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        variables,
        _args12 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            optionals = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;

            if (!(Array.isArray(runKey) || Array.isArray(variable))) {
              _context12.next = 5;
              break;
            }

            variables = Array.isArray(variable) ? variable : [variable];
            return _context12.abrupt("return", getVariables(runKey, variables, optionals));

          case 5:
            _context12.next = 7;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              timeout: timeout,
              ritual: ritual
            }).get("/run/variable/".concat(runKey, "/").concat(variable)).then(function (_ref12) {
              var body = _ref12.body;
              return body;
            });

          case 7:
            return _context12.abrupt("return", _context12.sent);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _getVariable.apply(this, arguments);
}

function updateVariables(_x20, _x21) {
  return _updateVariables.apply(this, arguments);
}

function _updateVariables() {
  _updateVariables = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee13(runKey, update) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        hasMultiple,
        uriComponent,
        searchParams,
        _args13 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            optionals = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout
            } : {
              ritual: ritual,
              timeout: timeout
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            _context13.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).patch("/run/variable".concat(uriComponent), {
              body: update
            }).then(function (_ref13) {
              var body = _ref13.body;
              return body;
            });

          case 8:
            return _context13.abrupt("return", _context13.sent);

          case 9:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _updateVariables.apply(this, arguments);
}

function getMetadata(_x22, _x23) {
  return _getMetadata.apply(this, arguments);
}

function _getMetadata() {
  _getMetadata = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee14(runKey, variables) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        include,
        hasMultiple,
        uriComponent,
        searchParams,
        _args14 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            optionals = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            include = variables.join(';');
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout,
              include: include
            } : {
              ritual: ritual,
              timeout: timeout,
              include: include
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            _context14.next = 9;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/meta".concat(uriComponent)).then(function (_ref14) {
              var body = _ref14.body;
              return body;
            });

          case 9:
            return _context14.abrupt("return", _context14.sent);

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));
  return _getMetadata.apply(this, arguments);
}

function updateMetadata(_x24, _x25) {
  return _updateMetadata.apply(this, arguments);
}

function _updateMetadata() {
  _updateMetadata = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee15(runKey, update) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        hasMultiple,
        uriComponent,
        searchParams,
        _args15 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            optionals = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout
            } : {
              ritual: ritual,
              timeout: timeout
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            _context15.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).patch("/run/meta".concat(uriComponent), {
              body: update
            }).then(function (_ref15) {
              var body = _ref15.body;
              return body;
            });

          case 8:
            return _context15.abrupt("return", _context15.sent);

          case 9:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));
  return _updateMetadata.apply(this, arguments);
}

function action(_x26, _x27) {
  return _action.apply(this, arguments);
}

function _action() {
  _action = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee16(runKey, actionList) {
    var optionals,
        accountShortName,
        projectShortName,
        timeout,
        ritual,
        hasMultiple,
        uriComponent,
        searchParams,
        _args16 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            optionals = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, timeout = optionals.timeout, ritual = optionals.ritual;
            hasMultiple = Array.isArray(runKey) && runKey.length > 1;
            uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
            searchParams = hasMultiple ? {
              runKey: runKey,
              timeout: timeout
            } : {
              ritual: ritual,
              timeout: timeout
            };

            if (ritual !== utils_constants__WEBPACK_IMPORTED_MODULE_4__["RITUAL"].EXORCISE && hasMultiple) {
              console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
            }

            _context16.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).post("/run/action".concat(uriComponent), {
              body: actionList
            }).then(function (_ref16) {
              var body = _ref16.body;
              return body;
            });

          case 8:
            return _context16.abrupt("return", _context16.sent);

          case 9:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));
  return _action.apply(this, arguments);
}

function serial(_x28, _x29) {
  return _serial.apply(this, arguments);
}

function _serial() {
  _serial = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee17(runKey, operations) {
    var optionals,
        normalizedOps,
        _args17 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            optionals = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : {};
            normalizedOps = operations.map(function (item) {
              return {
                name: typeof item === 'string' ? item : item.name,
                params: item.params
              };
            }); //Perform all operations, sequentially

            return _context17.abrupt("return", normalizedOps.reduce(function (promise, _ref17) {
              var name = _ref17.name,
                  params = _ref17.params;
              return promise.then(function () {
                return operation(runKey, name, params, optionals = {});
              });
            }, Promise.resolve()));

          case 3:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));
  return _serial.apply(this, arguments);
}

function getWithStrategy(_x30, _x31, _x32) {
  return _getWithStrategy.apply(this, arguments);
}
/**
 * Returns the run associated with the given world key; brings the run into memory, if the run does not exist, it will create it.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/world/{WORLD_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, authAdapter } from 'epicenter';
 * const worldKey = authAdapter.getLocalSession().worldKey
 * const run = await runAdapter.retrieveWithWorld('model.py', worldKey);
 *
 *
 * @param {string}  model                           Name of your model file
 * @param {object}  worldKey                        Key associated with the world you'd like a run from
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {boolean} [optionals.ephemeral]           Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param {string}  [optionals.trackingKey]         Tracking key
 * @param {object}  [optionals.modelContext]        .ctx2 file overrides, this is not tracked by clone operations
 * @param {object}  [optionals.executionContext]    Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Run retrieved from the world
 */

function _getWithStrategy() {
  _getWithStrategy = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee18(strategy, model, scope) {
    var optionals,
        _optionals,
        _optionals$initOperat,
        initOperations,
        runs,
        newRun,
        _newRun,
        _args18 = arguments;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            optionals = _args18.length > 3 && _args18[3] !== undefined ? _args18[3] : {};
            _optionals = optionals, _optionals$initOperat = _optionals.initOperations, initOperations = _optionals$initOperat === void 0 ? [] : _optionals$initOperat;

            if (!(strategy === 'reuse-across-sessions')) {
              _context18.next = 16;
              break;
            }

            _context18.next = 5;
            return query(model, scope, _objectSpread({}, optionals, {
              sort: ['-created']
            }));

          case 5:
            runs = _context18.sent;

            if (!runs.length) {
              _context18.next = 8;
              break;
            }

            return _context18.abrupt("return", runs[0]);

          case 8:
            _context18.next = 10;
            return create(model, scope, optionals = {});

          case 10:
            newRun = _context18.sent;
            _context18.next = 13;
            return serial(newRun.runKey, initOperations, optionals = {});

          case 13:
            return _context18.abrupt("return", newRun);

          case 16:
            if (!(strategy === 'reuse-never')) {
              _context18.next = 25;
              break;
            }

            _context18.next = 19;
            return create(model, scope, optionals = {});

          case 19:
            _newRun = _context18.sent;
            _context18.next = 22;
            return serial(_newRun.runKey, initOperations, optionals = {});

          case 22:
            return _context18.abrupt("return", _newRun);

          case 25:
            if (strategy === 'reuse-by-tracking-key') {//TBD write out if needed
              //Platform plans to introduce run limits into episode scope, differing from v2's implementation of runLimit via 'reuse-by-tracking-key'
            } else if (strategy === 'multiplayer') {//TODO when multiplayer API is ready
              //check the current world for this end user, return the current run for that world (if there is none, create a run for the world)
            }

          case 26:
            throw new utils__WEBPACK_IMPORTED_MODULE_3__["EpicenterError"]('Invalid run strategy.');

          case 27:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));
  return _getWithStrategy.apply(this, arguments);
}

function retrieveFromWorld(_x33, _x34) {
  return _retrieveFromWorld.apply(this, arguments);
}
/**
 * Deletes the run associated with the given world key
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/world/{WORLD_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, authAdapter } from 'epicenter';
 * const worldKey = authAdapter.getLocalSession().worldKey
 * const run = await runAdapter.removeFromWorld(worldKey);
 *
 *
 * @param {object}  worldKey                        Key associated with the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Run retrieved from the world
 */

function _retrieveFromWorld() {
  _retrieveFromWorld = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee19(model, worldKey) {
    var optionals,
        readLock,
        writeLock,
        ephemeral,
        trackingKey,
        modelContext,
        executionContext,
        accountShortName,
        projectShortName,
        PARTICIPANT,
        _args19 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            optionals = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : {};
            readLock = optionals.readLock, writeLock = optionals.writeLock, ephemeral = optionals.ephemeral, trackingKey = optionals.trackingKey, modelContext = optionals.modelContext, executionContext = optionals.executionContext, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            PARTICIPANT = utils_constants__WEBPACK_IMPORTED_MODULE_4__["ROLE"].PARTICIPANT;
            _context19.next = 5;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/world/".concat(worldKey), {
              body: {
                permit: {
                  readLock: readLock || PARTICIPANT,
                  writeLock: writeLock || PARTICIPANT
                },
                morphology: 'MANY',
                trackingKey: trackingKey,
                modelFile: model,
                modelContext: modelContext || {},
                executionContext: executionContext || {},
                ephemeral: ephemeral
              }
            }).then(function (_ref18) {
              var body = _ref18.body;
              return body;
            });

          case 5:
            return _context19.abrupt("return", _context19.sent);

          case 6:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  }));
  return _retrieveFromWorld.apply(this, arguments);
}

function removeFromWorld(_x35) {
  return _removeFromWorld.apply(this, arguments);
}

function _removeFromWorld() {
  _removeFromWorld = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.mark(function _callee20(worldKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args20 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default.a.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            optionals = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context20.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_3__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)["delete"]("/run/world/".concat(worldKey)).then(function (_ref19) {
              var body = _ref19.body;
              return body;
            });

          case 4:
            return _context20.abrupt("return", _context20.sent);

          case 5:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));
  return _removeFromWorld.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/vault.js":
/*!*******************************!*\
  !*** ./src/adapters/vault.js ***!
  \*******************************/
/*! exports provided: update, get, getWithScope, remove, create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update", function() { return update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWithScope", function() { return getWithScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");




/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace vaultAdapter
 */

/**
 * Create an episode.
 *
 * TODO -- add meaningful text here
 * @memberof vaultAdapter
 * @example
 *
 * import { vaultAdapter } from 'epicenter';
 * vaultAdapter.update
 *
 * @param {string}  vaultKey            Episode name
 * @param {object}  items               Group to make the episode under
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */

function update(_x, _x2) {
  return _update.apply(this, arguments);
}

function _update() {
  _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(vaultKey, items) {
    var _items$set, _items$push;

    var optionals,
        accountShortName,
        projectShortName,
        mutationKey,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, mutationKey = optionals.mutationKey;
            _context.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              MutationKey: mutationKey
            }).patch("/vault/".concat(vaultKey), {
              body: {
                set: (_items$set = items.set) !== null && _items$set !== void 0 ? _items$set : {},
                push: (_items$push = items.push) !== null && _items$push !== void 0 ? _items$push : {}
              }
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 4:
            return _context.abrupt("return", _context.sent);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _update.apply(this, arguments);
}

function get(_x3) {
  return _get.apply(this, arguments);
}

function _get() {
  _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(vaultKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/vault/".concat(vaultKey))["catch"](function (error) {
              if (error.status === 404) return {
                body: undefined
              };
              return Promise.reject(error);
            }).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _get.apply(this, arguments);
}

function getWithScope(_x4, _x5) {
  return _getWithScope.apply(this, arguments);
}

function _getWithScope() {
  _getWithScope = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(collection, scope) {
    var optionals,
        scopeBoundary,
        scopeKey,
        accountShortName,
        projectShortName,
        userKey,
        _args3 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            scopeBoundary = scope.scopeBoundary, scopeKey = scope.scopeKey;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            userKey = optionals.userKey ? "/".concat(optionals.userKey) : '';
            _context3.next = 6;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/vault/with/".concat(scopeBoundary, "/").concat(scopeKey).concat(userKey, "/").concat(collection))["catch"](function (error) {
              if (error.status === 404) return {
                body: undefined
              };
              return Promise.reject(error);
            }).then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getWithScope.apply(this, arguments);
}

function remove(_x6) {
  return _remove.apply(this, arguments);
}
/**
 * Creates a vault.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{COLLECTION_NAME}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, SCOPE_BOUNDARY } from 'epicenter';
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '000001713a246b0b34b5b5d274c057a5b2a7'
 * });
 * @param {string}  collection                      Name of the vault
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  items                           Defines the contents in the
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {string}  [optionals.userKey]             Key of the user creating the run, should be `undefined` if it's a world run
 * @param {number}  [optionals.ttlSeconds]          Life span of the vault -- default to null, minimum value of 1800 (30 minutes)
 * @param {string}  [optionals.mutationKey]         Initial mutation key
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created run
 */

function _remove() {
  _remove = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(vaultKey) {
    var optionals,
        accountShortName,
        projectShortName,
        mutationKey,
        _args4 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            optionals = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName, mutationKey = optionals.mutationKey;
            _context4.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              MutationKey: mutationKey
            })["delete"]("/vault/".concat(vaultKey)).then(function (_ref4) {
              var body = _ref4.body;
              return body;
            });

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _remove.apply(this, arguments);
}

function create(_x7, _x8, _x9) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(collection, scope, items) {
    var optionals,
        scopeBoundary,
        scopeKey,
        readLock,
        writeLock,
        userKey,
        ttlSeconds,
        mutationKey,
        accountShortName,
        projectShortName,
        WORLD,
        PARTICIPANT,
        USER,
        defaultLock,
        _args5 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            optionals = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
            scopeBoundary = scope.scopeBoundary, scopeKey = scope.scopeKey;
            readLock = optionals.readLock, writeLock = optionals.writeLock, userKey = optionals.userKey, ttlSeconds = optionals.ttlSeconds, mutationKey = optionals.mutationKey, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            WORLD = utils_constants__WEBPACK_IMPORTED_MODULE_3__["SCOPE_BOUNDARY"].WORLD;
            PARTICIPANT = utils_constants__WEBPACK_IMPORTED_MODULE_3__["ROLE"].PARTICIPANT, USER = utils_constants__WEBPACK_IMPORTED_MODULE_3__["ROLE"].USER;
            defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;
            _context5.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/vault/".concat(collection), {
              body: {
                scope: {
                  scopeBoundary: scopeBoundary,
                  scopeKey: scopeKey,
                  userKey: scopeBoundary === WORLD ? undefined : userKey
                },
                permit: {
                  readLock: readLock || defaultLock,
                  writeLock: writeLock || defaultLock
                },
                ttlSeconds: ttlSeconds,
                mutationKey: mutationKey,
                items: items
              }
            }).then(function (_ref5) {
              var body = _ref5.body;
              return body;
            });

          case 8:
            return _context5.abrupt("return", _context5.sent);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _create.apply(this, arguments);
}

/***/ }),

/***/ "./src/adapters/world.js":
/*!*******************************!*\
  !*** ./src/adapters/world.js ***!
  \*******************************/
/*! exports provided: update, destroy, create, get, selfAssign, assignUsers, updateUsers, getAssignments, removeUsers, editPersonas */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "update", function() { return update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroy", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selfAssign", function() { return selfAssign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assignUsers", function() { return assignUsers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateUsers", function() { return updateUsers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAssignments", function() { return getAssignments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeUsers", function() { return removeUsers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "editPersonas", function() { return editPersonas; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");




/**
 * World API adapters -- handles worlds and user role/assignments
 * @namespace worldAdapter
 */

/**
 * Updates fields for a particular world.
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * epicenter.worldAdapter.update(world.worldKey, { name: 'World A1' });
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  update                          Attributes you wish to update
 * @param {string}  [update.name]                   Name of the world
 * @param {string}  [update.runKey]                 Key of the run associated with the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group with updated attributes
 */

function update(_x, _x2) {
  return _update.apply(this, arguments);
}
/**
 * Deletes a world
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * epicenter.worldAdapter.destroy(world.worldKey);
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _update() {
  _update = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(worldKey, update) {
    var optionals,
        name,
        runKey,
        accountShortName,
        projectShortName,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            optionals = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            name = update.name, runKey = update.runKey;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context.next = 5;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/world/".concat(worldKey), {
              body: {
                name: name,
                runKey: runKey
              }
            }).then(function (_ref) {
              var body = _ref.body;
              return body;
            });

          case 5:
            return _context.abrupt("return", _context.sent);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _update.apply(this, arguments);
}

function destroy(_x3) {
  return _destroy.apply(this, arguments);
}
/**
 * Creates a world
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * worldAdapter.create({ name: 'Whole New World' });
 *
 * @param {object}  world                           New world object
 * @param {string}  world.name                      Name of the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _destroy() {
  _destroy = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(worldKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            optionals = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context2.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)["delete"]("/world/".concat(worldKey)).then(function (_ref2) {
              var body = _ref2.body;
              return body;
            });

          case 4:
            return _context2.abrupt("return", _context2.sent);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _destroy.apply(this, arguments);
}

function create(_x4) {
  return _create.apply(this, arguments);
}
/**
 * Fetches the worlds in a group
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.get();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                              List of worlds
 */

function _create() {
  _create = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(world) {
    var _identification$sessi;

    var optionals,
        groupName,
        episodeName,
        accountShortName,
        projectShortName,
        _args3 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            optionals = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            groupName = optionals.groupName, episodeName = optionals.episodeName, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context3.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi = utils__WEBPACK_IMPORTED_MODULE_2__["identification"].session) === null || _identification$sessi === void 0 ? void 0 : _identification$sessi.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
              body: world
            }).then(function (_ref3) {
              var body = _ref3.body;
              return body;
            });

          case 4:
            return _context3.abrupt("return", _context3.sent);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _create.apply(this, arguments);
}

function get() {
  return _get.apply(this, arguments);
}
/**
 * Automatically assigns the current session's user to a world
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/selfassign/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const myWorld = await worldAdapter.selfAssign('cartographer');
 *
 * @param {string}  role                            Role to assign for, can be undefined
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {boolean} [optionals.exceedMinimums]      Indicates something... TODO
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                World users were assigned to
 */

function _get() {
  _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4() {
    var _identification$sessi2;

    var optionals,
        groupName,
        episodeName,
        accountShortName,
        projectShortName,
        _args4 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            optionals = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
            groupName = optionals.groupName, episodeName = optionals.episodeName, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context4.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/world/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi2 = utils__WEBPACK_IMPORTED_MODULE_2__["identification"].session) === null || _identification$sessi2 === void 0 ? void 0 : _identification$sessi2.groupName).concat(episodeName ? "/".concat(episodeName) : '')).then(function (_ref4) {
              var body = _ref4.body;
              return body;
            });

          case 4:
            return _context4.abrupt("return", _context4.sent);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _get.apply(this, arguments);
}

function selfAssign(_x5) {
  return _selfAssign.apply(this, arguments);
}
/**
 * Assigns a list of users to a world.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.assignUsers([
 *      { userKey: '123', role: 'locksmith' },
 *      { userKey: '456', role: 'cartographer' },
 * ]);
 *
 * @param {object[]}    assignments                         List of users to assign where each item contains a `userKey` and optional `role`
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.groupName]               Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]             Name of the episode
 * @param {boolean}     [optionals.exceedMinimums]          Indicates something... TODO
 * @param {boolean}     [optionals.requireAllAssignments]   Indicates something... TODO
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of worlds assigned to
 */

function _selfAssign() {
  _selfAssign = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(role) {
    var _identification$sessi3;

    var optionals,
        groupName,
        episodeName,
        exceedMinimums,
        accountShortName,
        projectShortName,
        _args5 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            optionals = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
            groupName = optionals.groupName, episodeName = optionals.episodeName, exceedMinimums = optionals.exceedMinimums, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context5.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/selfassign/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi3 = utils__WEBPACK_IMPORTED_MODULE_2__["identification"].session) === null || _identification$sessi3 === void 0 ? void 0 : _identification$sessi3.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
              body: {
                role: role,
                exceedMinimums: exceedMinimums
              }
            }).then(function (_ref5) {
              var body = _ref5.body;
              return body;
            });

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _selfAssign.apply(this, arguments);
}

function assignUsers(_x6) {
  return _assignUsers.apply(this, arguments);
}
/**
 * Updates a world's user assignments. Users who have previously been assigned to a different world, will be automatically unassigned and reassigned to the provided world.
 *
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.updateUsers(world.worldKey, [
 *      { userKey: '123', role: 'locksmith' },
 *      { userKey: '456', role: 'cartographer' },
 * ]);
 *
 * @param {string}      worldKey                            Key associated with the world
 * @param {object[]}    assignments                         List of users to assign where each item contains a `userKey` and optional `role`
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {boolean}     [optionals.exceedMinimums]          Indicates something... TODO
 * @param {boolean}     [optionals.requireAllAssignments]   Indicates something... TODO
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Updated world object
 */

function _assignUsers() {
  _assignUsers = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee6(assignments) {
    var _identification$sessi4;

    var optionals,
        groupName,
        episodeName,
        exceedMinimums,
        requireAllAssignments,
        accountShortName,
        projectShortName,
        _args6 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            optionals = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
            groupName = optionals.groupName, episodeName = optionals.episodeName, exceedMinimums = optionals.exceedMinimums, requireAllAssignments = optionals.requireAllAssignments, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context6.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/assignment/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi4 = utils__WEBPACK_IMPORTED_MODULE_2__["identification"].session) === null || _identification$sessi4 === void 0 ? void 0 : _identification$sessi4.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
              body: {
                assignments: assignments,
                exceedMinimums: exceedMinimums,
                requireAllAssignments: requireAllAssignments
              }
            }).then(function (_ref6) {
              var body = _ref6.body;
              return body;
            });

          case 4:
            return _context6.abrupt("return", _context6.sent);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _assignUsers.apply(this, arguments);
}

function updateUsers(_x7, _x8) {
  return _updateUsers.apply(this, arguments);
}
/**
 * Retrieves the current assignment information for a given world
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const assignments = await worldAdapter.getAssignments(world.worldKey);
 *
 * @param {string}      worldKey                            Key associated with the world
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of assignment objects containing user and role information
 */

function _updateUsers() {
  _updateUsers = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee7(worldKey, assignments) {
    var optionals,
        exceedMinimums,
        requireAllAssignments,
        accountShortName,
        projectShortName,
        _args7 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            optionals = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            exceedMinimums = optionals.exceedMinimums, requireAllAssignments = optionals.requireAllAssignments, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context7.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).put("/world/assignment/".concat(worldKey), {
              body: {
                assignments: assignments,
                exceedMinimums: exceedMinimums,
                requireAllAssignments: requireAllAssignments
              }
            }).then(function (_ref7) {
              var body = _ref7.body;
              return body;
            });

          case 4:
            return _context7.abrupt("return", _context7.sent);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _updateUsers.apply(this, arguments);
}

function getAssignments(_x9) {
  return _getAssignments.apply(this, arguments);
}
/**
 * Removes a user or list of users the all worlds in a given group or episode. Any worlds that do not contain users within them will be automatically deleted in the process.
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment?userKey={USER_KEY}[&userKey={USER_KEY}&userKey=...]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * await worldAdapter.removeUser(user.userKey);
 *
 * @param {string[]}    userKeys                        List of keys associated with users to remove from worlds
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string}      [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]         Name of the episode
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _getAssignments() {
  _getAssignments = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee8(worldKey) {
    var optionals,
        accountShortName,
        projectShortName,
        _args8 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            optionals = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context8.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/world/assignment/".concat(worldKey)).then(function (_ref8) {
              var body = _ref8.body;
              return body;
            });

          case 4:
            return _context8.abrupt("return", _context8.sent);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _getAssignments.apply(this, arguments);
}

function removeUsers(_x10) {
  return _removeUsers.apply(this, arguments);
}
/**
 * Edits the personas of a given scope (project, group, episode, world). Personas correspond to a role the a user in the world can be assigned to.
 *
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/persona/{SCOPE_BOUNDARY}[/{SCOPE_KEY}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * await worldAdapter.editPersonas([
 *
 * ]);
 *
 * @param {object[]}    personas                        List of persona objects containing `role`, `minimum`, and `maximum`
 * @param {object}      [scope={}]                      Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param {string}      [scope.scopeBoundary]           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}      [scope.scopeKey]                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */

function _removeUsers() {
  _removeUsers = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee9(userKeys) {
    var _identification$sessi5;

    var optionals,
        groupName,
        episodeName,
        accountShortName,
        projectShortName,
        _args9 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            optionals = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};
            groupName = optionals.groupName, episodeName = optionals.episodeName, accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            _context9.next = 4;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
              userKey: userKeys
            }).get("/world/assignment/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi5 = utils__WEBPACK_IMPORTED_MODULE_2__["identification"].session) === null || _identification$sessi5 === void 0 ? void 0 : _identification$sessi5.groupName).concat(episodeName ? "/".concat(episodeName) : '')).then(function (_ref9) {
              var body = _ref9.body;
              return body;
            });

          case 4:
            return _context9.abrupt("return", _context9.sent);

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _removeUsers.apply(this, arguments);
}

function editPersonas(_x11) {
  return _editPersonas.apply(this, arguments);
}

function _editPersonas() {
  _editPersonas = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee10(personas) {
    var scope,
        optionals,
        scopeBoundary,
        scopeKey,
        accountShortName,
        projectShortName,
        boundary,
        uriComponent,
        _args10 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            scope = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : {};
            optionals = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : {};
            scopeBoundary = scope.scopeBoundary, scopeKey = scope.scopeKey;
            accountShortName = optionals.accountShortName, projectShortName = optionals.projectShortName;
            boundary = scopeBoundary || utils_constants__WEBPACK_IMPORTED_MODULE_3__["SCOPE_BOUNDARY"].PROJECT;
            uriComponent = boundary === utils_constants__WEBPACK_IMPORTED_MODULE_3__["SCOPE_BOUNDARY"].PROJECT ? '' : "/".concat(scopeKey);
            _context10.next = 8;
            return new utils__WEBPACK_IMPORTED_MODULE_2__["Router"]().withAccountShortName(accountShortName).withProjectShortName(projectShortName)
            /* We will at some point remove the need to explicitly lower case this */
            .put("/world/persona/".concat(boundary.toLowerCase()).concat(uriComponent), {
              body: personas
            }).then(function (_ref10) {
              var body = _ref10.body;
              return body;
            });

          case 8:
            return _context10.abrupt("return", _context10.sent);

          case 9:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _editPersonas.apply(this, arguments);
}

/***/ }),

/***/ "./src/epicenter.js":
/*!**************************!*\
  !*** ./src/epicenter.js ***!
  \**************************/
/*! exports provided: version, SCOPE_BOUNDARY, RITUAL, PUSH_CATEGORY, ROLE, config, errorManager, Router, Channel, accountAdapter, authAdapter, episodeAdapter, groupAdapter, presenceAdapter, projectAdapter, runAdapter, vaultAdapter, worldAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "version", function() { return version; });
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SCOPE_BOUNDARY", function() { return utils_constants__WEBPACK_IMPORTED_MODULE_0__["SCOPE_BOUNDARY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RITUAL", function() { return utils_constants__WEBPACK_IMPORTED_MODULE_0__["RITUAL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PUSH_CATEGORY", function() { return utils_constants__WEBPACK_IMPORTED_MODULE_0__["PUSH_CATEGORY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ROLE", function() { return utils_constants__WEBPACK_IMPORTED_MODULE_0__["ROLE"]; });

/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "config", function() { return utils__WEBPACK_IMPORTED_MODULE_1__["config"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "errorManager", function() { return utils__WEBPACK_IMPORTED_MODULE_1__["errorManager"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return utils__WEBPACK_IMPORTED_MODULE_1__["Router"]; });

/* harmony import */ var adapters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! adapters */ "./src/adapters/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Channel", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["Channel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "accountAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["accountAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "authAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["authAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "episodeAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["episodeAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "groupAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["groupAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "presenceAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["presenceAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "projectAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["projectAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "runAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["runAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vaultAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["vaultAdapter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "worldAdapter", function() { return adapters__WEBPACK_IMPORTED_MODULE_2__["worldAdapter"]; });

/* Main file; defines public APIs & load order */
var version = "3.2.0-alpha";





/***/ }),

/***/ "./src/utils/config.js":
/*!*****************************!*\
  !*** ./src/utils/config.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! utils */ "./src/utils/index.js");





var API_VERSION = 3;

var Config = /*#__PURE__*/function () {
  function Config() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, Config);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_3___default()(this, "_apiVersion", API_VERSION);

    if (Object(utils__WEBPACK_IMPORTED_MODULE_4__["isBrowser"])()) return this.loadBrowser();
    if (Object(utils__WEBPACK_IMPORTED_MODULE_4__["isNode"])()) return this.loadNode();
    throw new utils__WEBPACK_IMPORTED_MODULE_4__["EpicenterError"]('Could not identify environment; no configuration was setup');
  }
  /**
   * Protocol used to make network requests (whether `http://` or `https://`). It is typically set on-load based on your browser's URL. For local development, this is defaulted to `https`, and can be overwritten if desired.
   * @memberof config
   * @type {string}
   *  */


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(Config, [{
    key: "isLocal",

    /**
     * Use to determines whether or not the environment is local.
     * @memberof config
     * @return {Boolean} whether or not environment is local.
     */
    value: function isLocal() {
      if (!Object(utils__WEBPACK_IMPORTED_MODULE_4__["isBrowser"])()) return false;
      var host = window.location.host;
      return host === '127.0.0.1' || host.indexOf('local.') === 0 || host.indexOf('ngrok') !== -1 || host.indexOf('localhost') === 0;
    }
  }, {
    key: "loadNode",
    value: function loadNode() {
      // TODO -- use process env variables instead here for Node server
      this.apiProtocol = 'https';
      this.apiHost = 'test.forio.com';
      return;
    }
  }, {
    key: "loadBrowser",
    value: function loadBrowser() {
      var isLocal = this.isLocal();
      var _window$location = window.location,
          protocol = _window$location.protocol,
          pathname = _window$location.pathname,
          host = _window$location.host;
      this.apiProtocol = isLocal ? 'https' : protocol;
      this.apiHost = isLocal ? 'forio.com' : host;
      var match = pathname.match(/\/app\/([\w-]+)\/([\w-]+)/);

      if (match) {
        var _match$slice = match.slice(1),
            _match$slice2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_match$slice, 2),
            account = _match$slice2[0],
            project = _match$slice2[1];

        this.accountShortName = account;
        this.projectShortName = project;
      }
    }
  }, {
    key: "apiProtocol",
    get: function get() {
      return this._apiProtocol;
    },
    set: function set(apiProtocol) {
      if (!apiProtocol.startsWith('http')) return;

      if (apiProtocol.endsWith(':')) {
        apiProtocol = apiProtocol.slice(0, -1);
      }

      this._apiProtocol = apiProtocol;
    }
    /**
     * Hostname used to make network requests. It is typically set on-load based on your browser's URL. For local development, this is defaulted to `forio.com`, and can be overwritten if desired.
     * @memberof config
     * @type {string}
     *  */

  }, {
    key: "apiHost",
    get: function get() {
      return this._apiHost;
    },
    set: function set(apiHost) {
      this._apiHost = apiHost;
    }
    /**
     * Version used to make network requests. This is read-only variable intended for internal use.
     * @memberof config
     * @type {number}
     */

  }, {
    key: "apiVersion",
    get: function get() {
      return this._apiVersion;
    },
    set: function set(apiVersion) {
      return;
    }
    /**
     * Account name used for making network requests. This is the default value used by Epicenter API adapters when making network requests without explicitly defining an account to use. It is defined on-load based on your browser's URL, and can be overwritten for local development.
     * @example
     * // with browser URL: https://forio.com/app/acme-simulations/foobar-game
     *
     * console.log(epicenter.config.accountShortName);
     * // should log 'acme-simulations'
     *
     * epicenter.runAdapter.get(123);
     * // instantiates a GET call with the URL: https://forio.com/api/v3/acme-simulations/foobar-game/run/123
     *
     * epicenter.config.accountShortName = 'globex-simuations';
     * epicenter.runAdapter.get(123);
     * // now instantiates a GET with the URL: https://forio.com/api/v3/globex-simulations/foobar-game/run/123
     *
     * epicenter.runAdapter.get(123, { accountShortName: 'initech-simulations' });
     * // now instantiates a GET with the URL: https://forio.com/api/v3/initech-simulations/foobar-game/run/123
     *
     * @memberof config
     * @type {string}
     */

  }, {
    key: "accountShortName",
    get: function get() {
      return this._accountShortName;
    },
    set: function set(accountShortName) {
      this._accountShortName = accountShortName;
    }
    /**
     * Project name used for making network requests. This is the default value used by Epicenter API adapters when making network requests without explicitly defining an account to use. It is defined on-load based on your browser's URL, and can be overwritten for local development.
     * @example
     * // with browser URL: https://forio.com/app/acme-simulations/foobar-game
     *
     * console.log(epicenter.config.projectShortName);
     * // should log 'foobar-game'
     *
     * epicenter.runAdapter.get(123);
     * // instantiates a GET call with the URL: https://forio.com/api/v3/acme-simulations/foobar-game/run/123
     *
     * epicenter.config.projectShortName = 'barfoo-game';
     * epicenter.runAdapter.get(123);
     * // now instantiates a GET with the URL: https://forio.com/api/v3/acme-simulations/barfoo-game/run/123
     *
     * epicenter.runAdapter.get(123, { projectShortName: 'barbaz-game' });
     * // now instantiates a GET with the URL: https://forio.com/api/v3/acme-simulations/barbaz-game/run/123
     *
     * @memberof config
     * @type {string}
     */

  }, {
    key: "projectShortName",
    get: function get() {
      return this._projectShortName;
    },
    set: function set(projectShortName) {
      this._projectShortName = projectShortName;
    }
  }]);

  return Config;
}();

var config = new Config();
/**
 * Configuration -- used to set up and configure global settings for Epicenter JS libs.
 * @namespace config
 */

/* harmony default export */ __webpack_exports__["default"] = (config);

/***/ }),

/***/ "./src/utils/constants.js":
/*!********************************!*\
  !*** ./src/utils/constants.js ***!
  \********************************/
/*! exports provided: BROWSER_STORAGE_TYPE, SCOPE_BOUNDARY, RITUAL, PUSH_CATEGORY, ROLE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BROWSER_STORAGE_TYPE", function() { return BROWSER_STORAGE_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SCOPE_BOUNDARY", function() { return SCOPE_BOUNDARY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RITUAL", function() { return RITUAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PUSH_CATEGORY", function() { return PUSH_CATEGORY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROLE", function() { return ROLE; });
var BROWSER_STORAGE_TYPE = {
  COOKIE: 'COOKIE',
  SESSION: 'SESSION'
};
/**
 * Scope boundaries are values associated with runs. They help to define the *default* user permissions used when a run is created, althought further permission configuration can be done with {@link #ROLE lock types}. Scopes also provide an index that in which a run can be queried for.
 *
 * Three parts -- boundary: level of hierarchy (ontology) that a piece of data belongs to. Specifically, a run, an asset, or a vault data
 * Boundary in which a piece of data (run, asset, vault) is ID-ed to (see scopeKey).
 *
 * psuedonymKey, goes in tandem w/ permit (lock types) --
 * Data lives and dies with scope, delete the scope, you lose the data and associated scopes
 * @enum {string}
 */

var SCOPE_BOUNDARY = {
  /**
   * Runs scoped by project, users and facilitators are allowed access so long as they are a user in a group on the project.
   * @constant
   * @type {string}
   */
  PROJECT: 'PROJECT',

  /**
   * Runs scoped by group, users and facilitators are allowed access only if they are in the associated group
   * Groups are scoped by projects
   * @constant
   * @type {string}
   */
  GROUP: 'GROUP',

  /**
   * Runs scoped by episode, not sure what this one is permission-wise
   * Episodes are scoped by groups
   * @constant
   * @type {string}
   */
  EPISODE: 'EPISODE',

  /**
   * Runs scoped by world, users are only allowed access to the if they are assigned to the associated world. Facilitators need only to belong on the group that created the world
   * Worlds can be scoped by group or episode
   * @constant
   * @type {string}
   */
  WORLD: 'WORLD'
};
/**
 * Rituals are used to define the way in which the Epicenter stores a run while running actions like getting variables, saving meta data, and call model operations. Runs can exist in-memory for a certain amount of time before expiring, and requiring their revival again before use.
 * @enum {string}
 */

var RITUAL = {
  /**
   * Allow GET action against archive, no revival of run
   * @constant
   * @type {string}
   */
  NONE: 'NONE',

  /**
   * A run with this ritual will be pulled into memory as needed, and will stay in memory until it's lifespan (defined in your project Settings) has expired.
   * @constant
   * @type {string}
   */
  REANIMATE: 'REANIMATE',

  /**
   * A run with this ritual will be pulled into memory as needed, and removed from memory afterwards.
   * @constant
   * @type {string}
   */
  EXORCISE: 'EXORCISE'
};
/**
 * Push categories are pre-defined channels types in which one might use to receive push channel updates
 * @enum {string}
 */

var PUSH_CATEGORY = {
  /**
   * intended for messaging users
   * yes pub
   * @constant
   * @type {string}
   */
  CHAT: 'CHAT',

  /**
   * Used for the {@link https://github.com/forio Consensus API}
   * no pub
   * @constant
   * @type {string}
   */
  CONSENSUS: 'CONSENSUS',

  /**
   * intended for general non-chat, sim-level communication
   * yes pub
   * @constant
   * @type {string}
   */
  CONTROL: 'CONTROL',

  /**
   * Used for the {@link https://github.com/forio Presence API}
   * no pub
   * @constant
   * @type {string}
   */
  PRESENCE: 'PRESENCE',

  /**
   * intended for awaiting entering games
   * yes pub
   * @constant
   * @type {string}
   */
  LOBBY: 'LOBBY',

  /**
   * Used for the {@link https://github.com/forio Run API}
   * no pub
   * @constant
   * @type {string}
   */
  RUN: 'RUN',

  /**
   * internal
   * @constant
   * @type {string}
   */
  SYSTEM: 'SYSTEM'
};
/**
 * Roles are used to define permissions on resources in Epicenter.
 * @enum {string}
 */

var ROLE = {
  /**
   * System -- Epicenter Manager
   * @constant
   * @type {string}
   */
  SYSTEM: 'system',

  /**
   * System minus -- read-only system access, write for certain accounts; think Geromel
   * @constant
   * @type {string}
   */
  MONITOR: 'monitor',

  /**
   * Author -- Team Members (and node server API keys)
   * tied to one account (personal + current account)
   * @constant
   * @type {string}
   */
  AUTHOR: 'author',

  /**
   * Author minus
   * @constant
   * @type {string}
   */
  SUPPORT: 'support',

  /**
   * Facilitators
   * @constant
   * @type {string}
   */
  FACILITATOR: 'facilitator',

  /**
   * Reviewers (weaker facilitator)
   * Facilitator minus
   * @constant
   * @type {string}
   */
  REVIEWER: 'reviewer',

  /**
   * Users -- psuedonymKey (userKey) required in scope
   * e.g., an avatar -- GROUP scope, PARTICIPANT read, USER write, userKey pseudonymKey
   * @constant
   * @type {string}
   */
  USER: 'user',

  /**
   * Leader
   * Participant plus
   * @constant
   * @type {string}
   */
  LEADER: 'leader',

  /**
   * Participant
   * @constant
   * @type {string}
   */
  PARTICIPANT: 'participant',

  /**
   * Anonymous
   * @constant
   * @type {string}
   */
  ANONYMOUS: 'anonymous'
};

/***/ }),

/***/ "./src/utils/cookies.js":
/*!******************************!*\
  !*** ./src/utils/cookies.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// Modified version of https://github.com/madmurphy/cookies.js
var getExpiration = function getExpiration(vEnd) {
  if (!vEnd) return '';

  switch (vEnd.constructor) {
    case Number:
      return vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : "; max-age=".concat(vEnd);

    /*
        Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
        version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
        the end parameter might not work as expected. A possible solution might be to convert the the
        relative time to an absolute time. For instance, replacing the previous line with:
    */

    /*
        case Number: return vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; expires=${(new Date(vEnd * 1e3 + Date.now())).toUTCString()}`;
    */

    case String:
      return "; expires=".concat(vEnd);

    case Date:
      return "; expires=".concat(vEnd.toUTCString());

    default:
      return '';
  }
};

/* harmony default export */ __webpack_exports__["default"] = ({
  getItem: function getItem(key) {
    if (!key) return null;
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*".concat(encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&'), "\\s*\\=\\s*([^;]*).*$)|^.*$")), '$1')) || null;
  },
  setItem: function setItem(key, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;
    var path = options.path,
        domain = options.domain,
        end = options.end,
        secure = options.secure,
        samesite = options.samesite;
    var expireStr = getExpiration(end);
    var domainStr = domain ? "; domain=".concat(domain) : '';
    var pathStr = path ? "; path=".concat(path) : '';
    var secureStr = secure ? '; secure' : '';
    var samesiteStr = samesite ? '; samesite' : '';
    document.cookie = "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value)).concat(expireStr).concat(domainStr).concat(pathStr).concat(secureStr).concat(samesiteStr);
    return true;
  },
  removeItem: function removeItem(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!this.hasItem(key)) return false;
    var path = options.path,
        domain = options.domain;
    var domainStr = domain ? "; domain=".concat(domain) : '';
    var pathStr = path ? "; path=".concat(path) : '';
    document.cookie = "".concat(encodeURIComponent(key), "=; expires=Thu, 01 Jan 1970 00:00:00 GMT").concat(domainStr).concat(pathStr);
    return true;
  },
  hasItem: function hasItem(key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;
    return new RegExp("(?:^|;\\s*)".concat(encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&'), "\\s*\\=")).test(document.cookie);
  },
  clear: function clear() {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);

    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      this.removeItem(aKeys[nIdx]);
    }

    return aKeys;
  }
});

/***/ }),

/***/ "./src/utils/error-manager.js":
/*!************************************!*\
  !*** ./src/utils/error-manager.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var adapters__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! adapters */ "./src/adapters/index.js");
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! utils */ "./src/utils/index.js");








var handleByRelog = function handleByRelog(error) {
  var query = '';

  if (error.code) {
    query = query.concat("?error=".concat(error.code));
  }

  return adapters__WEBPACK_IMPORTED_MODULE_5__["authAdapter"].logout().then(function () {
    return window.location.href = "/login.html".concat(query);
  });
};

var handleSSO = function handleSSO() {
  return adapters__WEBPACK_IMPORTED_MODULE_5__["authAdapter"].logout();
};

var handleUnknown = function handleUnknown() {
  return adapters__WEBPACK_IMPORTED_MODULE_5__["authAdapter"].logout().then(function () {
    return window.location.href = '/unknown.html';
  });
};

var handleByLoginMethod = function handleByLoginMethod(error) {
  var _session$loginMethod;

  var session = utils__WEBPACK_IMPORTED_MODULE_6__["identification"].session;
  var loginType = session === null || session === void 0 ? void 0 : (_session$loginMethod = session.loginMethod) === null || _session$loginMethod === void 0 ? void 0 : _session$loginMethod.objectType;

  switch (loginType) {
    case 'sso':
      return handleSSO(error);

    case 'none':
      return handleUnknown(error);

    case 'native':
    default:
      return handleByRelog(error);
  }
};

var UNAUTHORIZED = 401;

var ErrorManager = /*#__PURE__*/function () {
  function ErrorManager() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, ErrorManager);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_4___default()(this, "_handlers", [{
      /* Default Unauthorized (401) Error Handler */
      identifier: function identifier(error) {
        return error.status === UNAUTHORIZED;
      },
      handle: function handle(error, retry) {
        if (error.code === 'AUTHENTICATION_INVALIDATED') {
          var groupKey = utils__WEBPACK_IMPORTED_MODULE_6__["identification"].session.groupKey;
          return adapters__WEBPACK_IMPORTED_MODULE_5__["authAdapter"].upgrade(groupKey, {
            objectType: 'user',
            inert: true
          }).then(function () {
            return retry();
          })["catch"](function () {
            return handleByLoginMethod(error);
          });
        }

        if (Object(utils__WEBPACK_IMPORTED_MODULE_6__["isNode"])()) return Promise.reject(error);
        return handleByLoginMethod(error);
      }
    }]);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(ErrorManager, [{
    key: "registerHandler",
    value: function registerHandler(identifier, handleFn) {
      this.handlers.unshift({
        identifier: identifier,
        handle: handleFn
      });
    }
  }, {
    key: "handle",
    value: function () {
      var _handle = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(error, retryFn, handlers
      /* which is undefined unless recursing */
      ) {
        var index, handler, remainingHandlers, promise;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                handlers = handlers || this.handlers;
                index = handlers.findIndex(function (_ref) {
                  var identifier = _ref.identifier;
                  return identifier(error);
                });
                handler = handlers[index];
                remainingHandlers = index > 0 ? handlers.slice(index + 1) : [];

                if (handler) {
                  _context.next = 6;
                  break;
                }

                throw error;

              case 6:
                _context.prev = 6;
                _context.next = 9;
                return handler.handle(error, retryFn)["catch"](function (err) {
                  /* This catch call ensures that handle always returns a promise,
                  otherwise it'd be caught in the catch block below */
                  throw err;
                });

              case 9:
                promise = _context.sent;
                _context.next = 17;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](6);
                _context.next = 16;
                return this.handle(error, retryFn, remainingHandlers);

              case 16:
                promise = _context.sent;

              case 17:
                return _context.abrupt("return", promise);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 12]]);
      }));

      function handle(_x, _x2, _x3) {
        return _handle.apply(this, arguments);
      }

      return handle;
    }()
  }, {
    key: "handlers",
    get: function get() {
      return this._handlers;
    }
  }]);

  return ErrorManager;
}();

var errorManager = new ErrorManager();
/**
 * Configuration -- used to set up and configure global settings for Epicenter JS libs.
 * @namespace errorManager
 */

/* harmony default export */ __webpack_exports__["default"] = (errorManager);

/***/ }),

/***/ "./src/utils/error.js":
/*!****************************!*\
  !*** ./src/utils/error.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EpicenterError; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/wrapNativeSuper.js");
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_4__);






function _createSuper(Derived) { return function () { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* Generic throwable error */
var EpicenterError = /*#__PURE__*/function (_Error) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1___default()(EpicenterError, _Error);

  var _super = _createSuper(EpicenterError);

  function EpicenterError(message) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, EpicenterError);

    return _super.call(this, message);
  }

  return EpicenterError;
}( /*#__PURE__*/_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_4___default()(Error));



/***/ }),

/***/ "./src/utils/fault.js":
/*!****************************!*\
  !*** ./src/utils/fault.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Fault; });
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ "./node_modules/@babel/runtime/helpers/objectWithoutProperties.js");
/* harmony import */ var _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/wrapNativeSuper.js");
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__);







function _createSuper(Derived) { return function () { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

/* For failed network calls */
var Fault = /*#__PURE__*/function (_Error) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2___default()(Fault, _Error);

  var _super = _createSuper(Fault);

  function Fault(body, response) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, Fault);

    _this = _super.call(this);
    var status = response.status;
    var information = body.information,
        message = body.message,
        cause = body.cause;
    _this.status = status;
    _this.message = message;

    if (information) {
      var code = information.code,
          rest = _babel_runtime_helpers_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0___default()(information, ["code"]);

      _this.code = code;
      _this.information = rest;
    }

    if (cause) {
      _this.cause = new Fault(cause);
    }

    return _this;
  }

  return Fault;
}( /*#__PURE__*/_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5___default()(Error));



/***/ }),

/***/ "./src/utils/helpers.js":
/*!******************************!*\
  !*** ./src/utils/helpers.js ***!
  \******************************/
/*! exports provided: isBrowser, isNode, last, prefix, access */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNode", function() { return isNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return last; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prefix", function() { return prefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "access", function() { return access; });
/* eslint-disable no-new-func */
var isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
var isNode = new Function('try {return this===global;}catch(e){return false;}');
var last = function last(strOrArr) {
  return strOrArr[strOrArr.length - 1];
};
var prefix = function prefix(pre, str) {
  return str.startsWith(pre) ? str : "".concat(pre).concat(str);
}; // Tries to return value at the end of a sequence of keys.
// E.g. given an obj and keys = ['1', '2', '3'], it will try to
// return obj['1']['2']['3']. Uses the defaultValue on error.

var access = function access(obj, keys, defaultValue) {
  var ref = obj;

  try {
    keys.forEach(function (key) {
      return ref = ref[key];
    });
  } catch (err) {
    if (err instanceof TypeError) {
      return defaultValue;
    }

    throw err;
  }

  if (ref === undefined) return defaultValue;
  return ref;
};

/***/ }),

/***/ "./src/utils/identification.js":
/*!*************************************!*\
  !*** ./src/utils/identification.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! utils */ "./src/utils/index.js");
/* harmony import */ var utils_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! utils/constants */ "./src/utils/constants.js");





var COOKIE = utils_constants__WEBPACK_IMPORTED_MODULE_4__["BROWSER_STORAGE_TYPE"].COOKIE,
    SESSION = utils_constants__WEBPACK_IMPORTED_MODULE_4__["BROWSER_STORAGE_TYPE"].SESSION;
var SESSION_KEY = Symbol('com.forio.epicenter.session');
var EPI_SSO_KEY = 'epicenter.v3.sso';

var Identification = /*#__PURE__*/function () {
  function Identification(storeType) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Identification);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()(this, "type", void 0);

    if (storeType !== COOKIE && storeType !== SESSION) {
      throw new utils__WEBPACK_IMPORTED_MODULE_3__["EpicenterError"]("Invalid Storage Type: \"".concat(storeType, "\", please use \"").concat(COOKIE, "\" or \"").concat(SESSION, "\"."));
    }

    this.type = storeType;
    this.consumeSSO();
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(Identification, [{
    key: "getStore",
    value: function getStore() {
      if (Object(utils__WEBPACK_IMPORTED_MODULE_3__["isNode"])()) return utils__WEBPACK_IMPORTED_MODULE_3__["NodeStore"];

      switch (this.type) {
        case SESSION:
          return utils__WEBPACK_IMPORTED_MODULE_3__["SessionStore"];

        case COOKIE:
        default:
          return utils__WEBPACK_IMPORTED_MODULE_3__["CookieStore"];
      }
    }
    /* Generates the appropriate path for storing your session (applicable only to cookies) */

  }, {
    key: "getSessionPath",
    value: function getSessionPath(session) {
      var mySession = session || this.session;
      if (!mySession || Object(utils__WEBPACK_IMPORTED_MODULE_3__["isNode"])()) return '';
      var accountShortName = mySession.accountShortName,
          projectShortName = mySession.projectShortName,
          objectType = mySession.objectType;
      var isLocal = utils__WEBPACK_IMPORTED_MODULE_3__["config"].isLocal();
      var isCustomDomain = !isLocal && window.location.pathname.split('/')[1] !== 'app';
      var isEpicenterDomain = !isLocal && !isCustomDomain;

      if (objectType === 'user' && accountShortName && projectShortName && isEpicenterDomain) {
        return "/app/".concat(accountShortName, "/").concat(projectShortName);
      }
      /* Admins and any custom domains (ones that don't use 'app/account/project') get the root path */


      return '/';
    }
  }, {
    key: "consumeSSO",
    value: function consumeSSO() {
      if (Object(utils__WEBPACK_IMPORTED_MODULE_3__["isNode"])()) return;
      /* Double parse here b/c the backend serializes it as a string; the first parse
       * converts it into a json string, the second parse converts the json string into
       * json. Yes, it's weird, no, we can't change it (unless we want to rewrite
       * Interface Builder code to accommodate) */

      var session = JSON.parse(JSON.parse("\"".concat(utils__WEBPACK_IMPORTED_MODULE_3__["cookies"].getItem(EPI_SSO_KEY), "\"")));

      if (session) {
        var accountShortName = session.accountShortName,
            projectShortName = session.projectShortName;
        this.session = session;
        utils__WEBPACK_IMPORTED_MODULE_3__["cookies"].removeItem(EPI_SSO_KEY, {
          domain: ".".concat(window.location.hostname),
          path: "/app/".concat(accountShortName, "/").concat(projectShortName)
        });
      }
    }
  }, {
    key: "session",
    get: function get() {
      var Store = this.getStore();
      return new Store().getItem(SESSION_KEY.description);
    },
    set: function set(session) {
      var Store = this.getStore();
      var path = this.getSessionPath(session);

      if (session) {
        new Store({
          path: path
        }).setItem(SESSION_KEY.description, session);
      } else if (this.session) {
        new Store({
          path: path
        }).removeItem(SESSION_KEY.description);
      }
    }
  }]);

  return Identification;
}();

var identification = new Identification(COOKIE);
/* harmony default export */ __webpack_exports__["default"] = (identification);

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: BROWSER_STORAGE_TYPE, SCOPE_BOUNDARY, RITUAL, PUSH_CATEGORY, ROLE, isBrowser, isNode, last, prefix, access, NodeStore, SessionStore, CookieStore, cookies, EpicenterError, Fault, Result, config, identification, errorManager, Router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/utils/constants.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BROWSER_STORAGE_TYPE", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["BROWSER_STORAGE_TYPE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SCOPE_BOUNDARY", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["SCOPE_BOUNDARY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RITUAL", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["RITUAL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PUSH_CATEGORY", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["PUSH_CATEGORY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ROLE", function() { return _constants__WEBPACK_IMPORTED_MODULE_0__["ROLE"]; });

/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/utils/helpers.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return _helpers__WEBPACK_IMPORTED_MODULE_1__["isBrowser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isNode", function() { return _helpers__WEBPACK_IMPORTED_MODULE_1__["isNode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "last", function() { return _helpers__WEBPACK_IMPORTED_MODULE_1__["last"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "prefix", function() { return _helpers__WEBPACK_IMPORTED_MODULE_1__["prefix"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "access", function() { return _helpers__WEBPACK_IMPORTED_MODULE_1__["access"]; });

/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store */ "./src/utils/store.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NodeStore", function() { return _store__WEBPACK_IMPORTED_MODULE_2__["NodeStore"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SessionStore", function() { return _store__WEBPACK_IMPORTED_MODULE_2__["SessionStore"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CookieStore", function() { return _store__WEBPACK_IMPORTED_MODULE_2__["CookieStore"]; });

/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cookies */ "./src/utils/cookies.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cookies", function() { return _cookies__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./error */ "./src/utils/error.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "EpicenterError", function() { return _error__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _fault__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fault */ "./src/utils/fault.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Fault", function() { return _fault__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./result */ "./src/utils/result.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Result", function() { return _result__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./config */ "./src/utils/config.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "config", function() { return _config__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _identification__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./identification */ "./src/utils/identification.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "identification", function() { return _identification__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony import */ var _error_manager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./error-manager */ "./src/utils/error-manager.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "errorManager", function() { return _error_manager__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./router */ "./src/utils/router.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return _router__WEBPACK_IMPORTED_MODULE_10__["default"]; });













/***/ }),

/***/ "./src/utils/result.js":
/*!*****************************!*\
  !*** ./src/utils/result.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Result; });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);


/* For network call responses */
var Result = function Result(body, response) {
  _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Result);

  var status = response.status,
      headers = response.headers;
  this.status = status;
  this.headers = headers;
  this.body = body;
};



/***/ }),

/***/ "./src/utils/router.js":
/*!*****************************!*\
  !*** ./src/utils/router.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Router; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var cross_fetch__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! cross-fetch */ "./node_modules/cross-fetch/dist/browser-ponyfill.js");
/* harmony import */ var cross_fetch__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(cross_fetch__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! utils */ "./src/utils/index.js");









function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_7___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }



var DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
var DEFAULT_PROJECT_SHORT_NAME = 'manager';
var MAX_URL_LENGTH = 2048;

function paginate(json, url, options) {
  var _options$parsePage;

  var parsePage = (_options$parsePage = options.parsePage) !== null && _options$parsePage !== void 0 ? _options$parsePage : function (i) {
    return i;
  };

  var page = _objectSpread({}, json, {
    values: parsePage(json.values)
  });

  var prev = /*#__PURE__*/function () {
    var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee() {
      var searchParams, first, max, prevPage;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              searchParams = new URLSearchParams(url.search);

              if (!(page.firstResult === 0)) {
                _context.next = 4;
                break;
              }

              console.warn('Pagination: cannot call "prev" on first page');
              return _context.abrupt("return", []);

            case 4:
              first = page.firstResult - page.maxResults;
              max = page.maxResults + (first < 0 ? first : 0);
              searchParams.set('first', Math.max(first, 0));
              searchParams.set('max', max);
              url.search = searchParams; // eslint-disable-next-line no-use-before-define

              _context.next = 11;
              return request(url, _objectSpread({}, options, {
                paginated: false
              })).then(function (_ref2) {
                var body = _ref2.body;
                return body;
              });

            case 11:
              prevPage = _context.sent;
              prevPage.values = parsePage(prevPage.values);
              Object.assign(page, prevPage);
              return _context.abrupt("return", page.values);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function prev() {
      return _ref.apply(this, arguments);
    };
  }();

  var next = /*#__PURE__*/function () {
    var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee2() {
      var searchParams, first, nextPage;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              searchParams = new URLSearchParams(url.search);
              first = page.firstResult + page.maxResults;

              if (!(first >= page.totalResults)) {
                _context2.next = 5;
                break;
              }

              console.warn('Pagination: cannot call "next" on final page');
              return _context2.abrupt("return", []);

            case 5:
              searchParams.set('first', first);
              url.search = searchParams; // eslint-disable-next-line no-use-before-define

              _context2.next = 9;
              return request(url, _objectSpread({}, options, {
                paginated: false
              })).then(function (_ref4) {
                var body = _ref4.body;
                return body;
              });

            case 9:
              nextPage = _context2.sent;
              nextPage.values = parsePage(nextPage.values);
              Object.assign(page, nextPage);
              return _context2.abrupt("return", page.values);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function next() {
      return _ref3.apply(this, arguments);
    };
  }();

  var initialTotal = json.totalResults;

  var all = /*#__PURE__*/function () {
    var _ref5 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee3() {
      var first,
          allValues,
          searchParams,
          nextPage,
          _args3 = arguments;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              first = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : 0;
              allValues = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : [];

              if (!(first >= initialTotal)) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt("return", allValues);

            case 4:
              searchParams = new URLSearchParams(url.search);
              searchParams.set('first', first);
              searchParams["delete"]('max');
              url.search = searchParams; // eslint-disable-next-line no-use-before-define

              _context3.next = 10;
              return request(url, _objectSpread({}, options, {
                paginated: false
              })).then(function (_ref6) {
                var body = _ref6.body;
                return body;
              });

            case 10:
              nextPage = _context3.sent;
              allValues.push.apply(allValues, _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default()(parsePage(nextPage.values)));
              return _context3.abrupt("return", all(first + nextPage.maxResults, allValues));

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function all() {
      return _ref5.apply(this, arguments);
    };
  }();

  page.prev = prev;
  page.next = next;
  page.all = all;
  return page;
}

var createHeaders = function createHeaders(includeAuthorization) {
  var headers = {
    'Content-type': 'application/json; charset=UTF-8'
  };
  var session = utils__WEBPACK_IMPORTED_MODULE_9__["identification"].session;

  if (includeAuthorization && session) {
    headers.Authorization = "Bearer ".concat(session.token);
  }

  if (includeAuthorization && utils__WEBPACK_IMPORTED_MODULE_9__["config"].tokenOverride) {
    headers.Authorization = "Bearer ".concat(utils__WEBPACK_IMPORTED_MODULE_9__["config"].tokenOverride);
  }

  return headers;
};

function request(_x, _x2) {
  return _request.apply(this, arguments);
}
/**
 * Used to make the network calls in all API adapters
 */


function _request() {
  _request = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee9(url, options) {
    var method, body, includeAuthorization, inert, paginated, headers, response, contentType, json, result, fault, retry;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            method = options.method, body = options.body, includeAuthorization = options.includeAuthorization, inert = options.inert, paginated = options.paginated;
            headers = createHeaders(includeAuthorization);
            _context9.next = 4;
            return cross_fetch__WEBPACK_IMPORTED_MODULE_8___default()(url, {
              method: method,
              cache: 'no-cache',
              headers: headers,
              redirect: 'follow',
              body: body ? JSON.stringify(body) : null
            });

          case 4:
            response = _context9.sent;
            contentType = response.headers.get('content-type');

            if (!(!contentType || !contentType.includes('application/json'))) {
              _context9.next = 8;
              break;
            }

            throw new utils__WEBPACK_IMPORTED_MODULE_9__["EpicenterError"]("Response content-type '".concat(contentType, "' does not include 'application/json'"));

          case 8:
            _context9.next = 10;
            return response.json();

          case 10:
            json = _context9.sent;

            if (!(response.status >= 200 && response.status < 400)) {
              _context9.next = 14;
              break;
            }

            result = new utils__WEBPACK_IMPORTED_MODULE_9__["Result"](paginated ? paginate(json, url, options) : json, response);
            return _context9.abrupt("return", result);

          case 14:
            fault = new utils__WEBPACK_IMPORTED_MODULE_9__["Fault"](json, response);

            if (!inert) {
              _context9.next = 17;
              break;
            }

            throw fault;

          case 17:
            retry = function retry() {
              return request(url, _objectSpread({}, options, {
                inert: true
              }));
            };

            return _context9.abrupt("return", utils__WEBPACK_IMPORTED_MODULE_9__["errorManager"].handle(fault, retry));

          case 19:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _request.apply(this, arguments);
}

var Router = /*#__PURE__*/function () {
  function Router() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Router);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Router, [{
    key: "withServer",

    /**
     * Sets the root path. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [server] Root path to use
     * @returns {Router}        The Router instance
     */
    value: function withServer(server) {
      if (typeof server !== 'undefined') this.server = server;
      return this;
    }
    /**
     * Sets the version. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [version]    Version to use
     * @returns {Router}            The Router instance
     */

  }, {
    key: "withVersion",
    value: function withVersion(version) {
      if (typeof version !== 'undefined') this.version = version;
      return this;
    }
    /**
     * Sets the account. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [accountShortName]   Account name to use
     * @returns {Router}                    The Router instance
     */

  }, {
    key: "withAccountShortName",
    value: function withAccountShortName(accountShortName) {
      if (typeof accountShortName !== 'undefined') this.accountShortName = accountShortName;
      return this;
    }
    /**
     * Sets the project. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [projectShortName]   Project name to use
     * @returns {Router}                    The Router instance
     */

  }, {
    key: "withProjectShortName",
    value: function withProjectShortName(projectShortName) {
      if (typeof projectShortName !== 'undefined') this.projectShortName = projectShortName;
      return this;
    }
    /**
     * Sets the search parameters. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string|array|object|URLSearchParams} [searchParams]  Search parameters to use, utilizes the same setter as [searchParams](#Router-searchParams)
     * @returns {Router}                                            The Router instance
     */

  }, {
    key: "withSearchParams",
    value: function withSearchParams(searchParams) {
      if (typeof searchParams !== 'undefined') this.searchParams = searchParams;
      return this;
    }
  }, {
    key: "getURL",
    value: function getURL(uriComponent) {
      var _this$searchParams;

      if (!this.server) this.withServer("".concat(utils__WEBPACK_IMPORTED_MODULE_9__["config"].apiProtocol, "://").concat(utils__WEBPACK_IMPORTED_MODULE_9__["config"].apiHost));
      if (!this.accountShortName) this.withAccountShortName(utils__WEBPACK_IMPORTED_MODULE_9__["config"].accountShortName);
      if (!this.projectShortName) this.withProjectShortName(utils__WEBPACK_IMPORTED_MODULE_9__["config"].projectShortName);
      if (!this.version) this.withVersion(utils__WEBPACK_IMPORTED_MODULE_9__["config"].apiVersion);
      var url = new URL("".concat(this.server));
      url.pathname = "api/v".concat(this.version, "/").concat(this.accountShortName, "/").concat(this.projectShortName).concat(Object(utils__WEBPACK_IMPORTED_MODULE_9__["prefix"])('/', uriComponent));
      url.search = (_this$searchParams = this.searchParams) !== null && _this$searchParams !== void 0 ? _this$searchParams : new URLSearchParams();
      return url;
    } //Network Requests

  }, {
    key: "get",
    value: function () {
      var _get = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee4(uriComponent, options) {
        var url, newURL;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = this.getURL(uriComponent);
                /* Handle sufficiently large GET requests with POST calls instead */

                if (!(url.href.length > MAX_URL_LENGTH)) {
                  _context4.next = 4;
                  break;
                }

                newURL = new URL(url.href.split('?')[0]);
                return _context4.abrupt("return", this.post(newURL, _objectSpread({}, options, {
                  body: url.search
                })));

              case 4:
                return _context4.abrupt("return", request(url, _objectSpread({
                  includeAuthorization: true
                }, options, {
                  method: 'GET'
                })));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function get(_x3, _x4) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee5(uriComponent, options) {
        var url;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                url = this.getURL(uriComponent);
                return _context5.abrupt("return", request(url, _objectSpread({
                  includeAuthorization: true
                }, options, {
                  method: 'DELETE'
                })));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _delete(_x5, _x6) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  }, {
    key: "patch",
    value: function () {
      var _patch = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee6(uriComponent, options) {
        var url;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                url = this.getURL(uriComponent);
                return _context6.abrupt("return", request(url, _objectSpread({
                  includeAuthorization: true
                }, options, {
                  method: 'PATCH'
                })));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function patch(_x7, _x8) {
        return _patch.apply(this, arguments);
      }

      return patch;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee7(uriComponent, options) {
        var url;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                url = this.getURL(uriComponent);
                return _context7.abrupt("return", request(url, _objectSpread({
                  includeAuthorization: true
                }, options, {
                  method: 'POST'
                })));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function post(_x9, _x10) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "put",
    value: function () {
      var _put = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_6___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.mark(function _callee8(uriComponent, options) {
        var url;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_5___default.a.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                url = this.getURL(uriComponent);
                return _context8.abrupt("return", request(url, _objectSpread({
                  includeAuthorization: true
                }, options, {
                  method: 'PUT'
                })));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function put(_x11, _x12) {
        return _put.apply(this, arguments);
      }

      return put;
    }()
  }, {
    key: "server",

    /**
     * The root path used for the call, essentially protocol + hostname
     * @type {string}
     */
    get: function get() {
      return this._server;
    },
    set: function set(value) {
      this._server = value;
    }
    /**
     * The version of the Epicenter APIs being invoked; expected to stay at `3`
     * @type {number}
     */

  }, {
    key: "version",
    get: function get() {
      return this._version;
    },
    set: function set(value) {
      this._version = value;
    }
    /**
     * Name of the account; for administrative use, this value should be set to 'epicenter'
     * @type {string}
     */

  }, {
    key: "accountShortName",
    get: function get() {
      return this._accountShortName;
    },
    set: function set(value) {
      this._accountShortName = value;
    }
    /**
     * Name of the project; for administrative use, this value should be set to 'manager'
     * @type {string}
     */

  }, {
    key: "projectShortName",
    get: function get() {
      return this._projectShortName;
    },
    set: function set(value) {
      this._projectShortName = value;
    }
    /**
     * The search parameters for to use when making a network request. This property has should always return an instance of URLSearchParams or undefined. It has unique properties when used with the assignment operator (`=`); see the examples below for more details.
     * @type {URLSearchParams}
     *
     * @example
     * const router = new Router();
     * router.searchParams = '?foo=123';
     * console.log(router.searchParams);                            // always returns an instance object: URLSearchParams {}
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * router.searchParams = 'foo=123';                             // can omit the question mark
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * router.searchParams = [['foo', '123'], ['bar', '456']];      // can accept arrays
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=456'
     *
     * router.searchParams = { foo: '123', bar: '456' };            // can accept objects
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=456'
     *
     * router.searchParams = { foo: '123', bar: ['4', '5', '6'] };  // can accept objects with arrayed values
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=4&bar=5&bar=6'
     *
     * router.searchParams = new URLSearchParams('foo=123');        // can accept instances of URLSearchParams
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * @param {object|array|string|URLSearchParams} query   Value used to set the search parameters
     */

  }, {
    key: "searchParams",
    get: function get() {
      return this._searchParams;
    },
    set: function set(query) {
      if (query.constructor === URLSearchParams) {
        this._searchParams = query;
        return;
      }
      /* 'query' should be either an array, or string. Objects will be coerced into [key, value] arrays */


      if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_1___default()(query) === 'object' && query.constructor === Object) {
        query = Object.entries(query).reduce(function (arr, _ref7) {
          var _ref8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref7, 2),
              key = _ref8[0],
              value = _ref8[1];

          if (Array.isArray(value)) {
            /* Special case for arrayed param values: use duplicated params here */
            return [].concat(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default()(arr), _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_4___default()(value.map(function (v) {
              return [key, v];
            })));
          }

          if (value === undefined || value === null) {
            /* Skip nullish values */
            return arr;
          }

          arr.push([key, value]);
          return arr;
        }, []);
      }

      this._searchParams = new URLSearchParams(query);
    }
  }]);

  return Router;
}();



/***/ }),

/***/ "./src/utils/store.js":
/*!****************************!*\
  !*** ./src/utils/store.js ***!
  \****************************/
/*! exports provided: NodeStore, SessionStore, CookieStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeStore", function() { return NodeStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SessionStore", function() { return SessionStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CookieStore", function() { return CookieStore; });
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/get.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! utils */ "./src/utils/index.js");








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { return function () { var Super = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }



var Store = /*#__PURE__*/function () {
  function Store(store) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4___default()(this, Store);

    _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_6___default()(this, "_store", void 0);

    this._store = store;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5___default()(Store, [{
    key: "clear",
    value: function clear() {
      this._store.clear();
    }
  }, {
    key: "store",
    get: function get() {
      return this._store;
    },
    set: function set(store) {
      this._store = store;
    }
  }]);

  return Store;
}();

var nodeMap = new Map();
var NodeStore = /*#__PURE__*/function (_Store) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1___default()(NodeStore, _Store);

  var _super = _createSuper(NodeStore);

  function NodeStore() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4___default()(this, NodeStore);

    return _super.call(this, nodeMap);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5___default()(NodeStore, [{
    key: "getItem",
    value: function getItem(key) {
      return _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(NodeStore.prototype), "store", this).get(key);
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      return _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(NodeStore.prototype), "store", this).set(key, value);
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      return _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(NodeStore.prototype), "store", this)["delete"](key);
    }
  }]);

  return NodeStore;
}(Store);
var SessionStore = /*#__PURE__*/function (_Store2) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_1___default()(SessionStore, _Store2);

  var _super2 = _createSuper(SessionStore);

  function SessionStore() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4___default()(this, SessionStore);

    return _super2.call(this, window.sessionStorage);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5___default()(SessionStore, [{
    key: "getItem",
    value: function getItem(key) {
      return JSON.parse(_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SessionStore.prototype), "store", this).getItem(key.toString()));
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      return _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SessionStore.prototype), "store", this).setItem(key.toString(), JSON.stringify(value));
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      return _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(SessionStore.prototype), "store", this).removeItem(key.toString());
    }
  }]);

  return SessionStore;
}(Store);
var CookieStore = /*#__PURE__*/function () {
  function CookieStore(options) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_4___default()(this, CookieStore);

    var defaults = {
      domain: ".".concat(window.location.hostname),
      path: '/'
    };
    this.options = _objectSpread({}, defaults, {}, options);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_5___default()(CookieStore, [{
    key: "getItem",
    value: function getItem(key) {
      return JSON.parse(utils__WEBPACK_IMPORTED_MODULE_7__["cookies"].getItem(key.toString()));
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      return utils__WEBPACK_IMPORTED_MODULE_7__["cookies"].setItem(key.toString(), JSON.stringify(value), this.options);
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      return utils__WEBPACK_IMPORTED_MODULE_7__["cookies"].removeItem(key.toString(), this.options);
    }
  }, {
    key: "clear",
    value: function clear() {
      return utils__WEBPACK_IMPORTED_MODULE_7__["cookies"].clear();
    }
  }]);

  return CookieStore;
}();

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./src/epicenter.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/epicenter.js */"./src/epicenter.js");


/***/ })

/******/ });
});
//# sourceMappingURL=epicenter.js.map