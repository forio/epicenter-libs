'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var Stream = require('stream');
var http = require('http');
var Url = require('url');
var https = require('https');
var zlib = require('zlib');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);
var Stream__default = /*#__PURE__*/_interopDefaultLegacy(Stream);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var Url__default = /*#__PURE__*/_interopDefaultLegacy(Url);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
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
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
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
        context.arg = undefined$1;
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

          next.value = undefined$1;
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
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
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
          context.arg = undefined$1;
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
        this.arg = undefined$1;
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
   module.exports 
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
});

let BROWSER_STORAGE_TYPE;
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

(function (BROWSER_STORAGE_TYPE) {
  BROWSER_STORAGE_TYPE["COOKIE"] = "COOKIE";
  BROWSER_STORAGE_TYPE["SESSION"] = "SESSION";
})(BROWSER_STORAGE_TYPE || (BROWSER_STORAGE_TYPE = {}));

(function (SCOPE_BOUNDARY) {
  SCOPE_BOUNDARY["PROJECT"] = "PROJECT";
  SCOPE_BOUNDARY["GROUP"] = "GROUP";
  SCOPE_BOUNDARY["EPISODE"] = "EPISODE";
  SCOPE_BOUNDARY["WORLD"] = "WORLD";
  SCOPE_BOUNDARY["RUN"] = "RUN";
})(exports.SCOPE_BOUNDARY || (exports.SCOPE_BOUNDARY = {}));

(function (RITUAL) {
  RITUAL["NONE"] = "NONE";
  RITUAL["REANIMATE"] = "REANIMATE";
  RITUAL["EXORCISE"] = "EXORCISE";
})(exports.RITUAL || (exports.RITUAL = {}));

(function (PUSH_CATEGORY) {
  PUSH_CATEGORY["CHAT"] = "CHAT";
  PUSH_CATEGORY["CONSENSUS"] = "CONSENSUS";
  PUSH_CATEGORY["CONTROL"] = "CONTROL";
  PUSH_CATEGORY["PRESENCE"] = "PRESENCE";
  PUSH_CATEGORY["LOBBY"] = "LOBBY";
  PUSH_CATEGORY["RUN"] = "RUN";
  PUSH_CATEGORY["VAULT"] = "VAULT";
  PUSH_CATEGORY["WORLD"] = "WORLD";
  PUSH_CATEGORY["SYSTEM"] = "SYSTEM";
})(exports.PUSH_CATEGORY || (exports.PUSH_CATEGORY = {}));

(function (ROLE) {
  ROLE["SYSTEM"] = "SYSTEM";
  ROLE["MONITOR"] = "MONITOR";
  ROLE["AUTHOR"] = "AUTHOR";
  ROLE["SUPPORT"] = "SUPPORT";
  ROLE["FACILITATOR"] = "FACILITATOR";
  ROLE["REVIEWER"] = "REVIEWER";
  ROLE["USER"] = "USER";
  ROLE["LEADER"] = "LEADER";
  ROLE["PARTICIPANT"] = "PARTICIPANT";
  ROLE["ANONYMOUS"] = "ANONYMOUS";
})(exports.ROLE || (exports.ROLE = {}));

/* eslint-disable no-new-func */
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
const isNode = new Function('try {return this===global;}catch(e){return false;}');
const prefix = (pre, str) => str.startsWith(pre) ? str : "".concat(pre).concat(str);

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  (function () { return this; })() || Function('return this')();

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isPure = false;

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.8.2',
  mode:  'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var hiddenKeys = {};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var html = getBuiltIn('document', 'documentElement');

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var iterators = {};

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var defineProperty = objectDefineProperty.f;



var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$1]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$1, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

var UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

var floor$1 = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor$1(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var max$1 = Math.max;
var min$2 = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max$1(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
});

// Modified version of https://github.com/madmurphy/cookies.js
const getExpiration = vEnd => {
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

var cookies = {
  getItem(key) {
    if (!key) return null;
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*".concat(encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&'), "\\s*\\=\\s*([^;]*).*$)|^.*$")), '$1')) || null;
  },

  setItem(key, value, options = {}) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;
    const {
      path,
      domain,
      end,
      secure,
      samesite
    } = options;
    const expireStr = getExpiration(end);
    const domainStr = domain ? "; domain=".concat(domain) : '';
    const pathStr = path ? "; path=".concat(path) : '';
    const secureStr = secure ? '; secure' : '';
    const samesiteStr = samesite ? '; samesite' : '';
    document.cookie = "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value)).concat(expireStr).concat(domainStr).concat(pathStr).concat(secureStr).concat(samesiteStr);
    return true;
  },

  removeItem(key, options = {}) {
    if (!this.hasItem(key)) return false;
    const {
      path,
      domain
    } = options;
    const domainStr = domain ? "; domain=".concat(domain) : '';
    const pathStr = path ? "; path=".concat(path) : '';
    document.cookie = "".concat(encodeURIComponent(key), "=; expires=Thu, 01 Jan 1970 00:00:00 GMT").concat(domainStr).concat(pathStr);
    return true;
  },

  hasItem(key) {
    if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) return false;
    return new RegExp("(?:^|;\\s*)".concat(encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&'), "\\s*\\=")).test(document.cookie);
  },

  clear() {
    const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);

    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
      this.removeItem(aKeys[nIdx]);
    }

    return aKeys;
  }

};

class Store {
  constructor(store) {
    _defineProperty__default['default'](this, "_store", void 0);

    this._store = store;
  }

  clear() {
    this._store.clear();
  }

  get store() {
    return this._store;
  }

  set store(store) {
    this._store = store;
  }

}

const nodeMap = new Map();
class NodeStore extends Store {
  constructor() {
    super(nodeMap);
  }

  getItem(key) {
    return super.store.get(key);
  }

  setItem(key, value) {
    return super.store.set(key, value);
  }

  removeItem(key) {
    return super.store.delete(key);
  }

}
class SessionStore extends Store {
  constructor() {
    super(window.sessionStorage);
  }

  getItem(key) {
    return JSON.parse(super.store.getItem(key));
  }

  setItem(key, value) {
    return super.store.setItem(key, JSON.stringify(value));
  }

  removeItem(key) {
    return super.store.removeItem(key);
  }

}
class CookieStore {
  constructor(options = {}) {
    _defineProperty__default['default'](this, "options", {});

    const defaults = {
      domain: ".".concat(window.location.hostname),
      path: '/'
    };
    this.options = { ...defaults,
      ...options
    };
  }

  getItem(key) {
    const item = cookies.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key, value) {
    return cookies.setItem(key, JSON.stringify(value), this.options);
  }

  removeItem(key) {
    return cookies.removeItem(key, this.options);
  }

  clear() {
    return cookies.clear();
  }

}

/* Generic throwable error */
class EpicenterError extends Error {
  constructor(message) {
    super(message);
  }

}

/* For failed network calls */
class Fault extends Error {
  constructor(body, response = {}) {
    super();

    _defineProperty__default['default'](this, "status", void 0);

    _defineProperty__default['default'](this, "code", void 0);

    _defineProperty__default['default'](this, "information", void 0);

    _defineProperty__default['default'](this, "cause", void 0);

    const {
      status
    } = response;
    const {
      information,
      message,
      cause
    } = body;
    this.status = status;
    this.message = message;

    if (information) {
      const {
        code,
        ...rest
      } = information;
      this.code = code;
      this.information = rest;
    }

    if (cause) {
      this.cause = new Fault(cause);
    }
  }

}

/* For network call responses */
class Result {
  constructor(body, response) {
    const {
      status,
      headers
    } = response;
    this.status = status;
    this.headers = headers;
    this.body = body;
  }

}

const API_VERSION = 3;

class Config {
  constructor() {
    _defineProperty__default['default'](this, "_apiVersion", API_VERSION);

    _defineProperty__default['default'](this, "_apiProtocol", '');

    _defineProperty__default['default'](this, "_apiHost", '');

    _defineProperty__default['default'](this, "_accountShortName", '');

    _defineProperty__default['default'](this, "_projectShortName", '');

    _defineProperty__default['default'](this, "tokenOverride", void 0);

    if (isBrowser()) {
      this.loadBrowser();
      return;
    }

    if (isNode()) {
      this.loadNode();
      return;
    }

    throw new EpicenterError('Could not identify environment; no configuration was setup');
  }
  /**
   * Protocol used to make network requests (whether `http://` or `https://`). It is typically set on-load based on your browser's URL. For local development, this is defaulted to `https`, and can be overwritten if desired.
   * @memberof config
   * @type {string}
   *  */


  get apiProtocol() {
    return this._apiProtocol;
  }

  set apiProtocol(apiProtocol) {
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


  get apiHost() {
    return this._apiHost;
  }

  set apiHost(apiHost) {
    this._apiHost = apiHost;
  }
  /**
   * Version used to make network requests. This is read-only variable intended for internal use.
   * @memberof config
   * @type {number}
   */


  get apiVersion() {
    return this._apiVersion;
  }

  set apiVersion(_apiVersion) {
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


  get accountShortName() {
    return this._accountShortName;
  }

  set accountShortName(accountShortName) {
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


  get projectShortName() {
    return this._projectShortName;
  }

  set projectShortName(projectShortName) {
    this._projectShortName = projectShortName;
  }
  /**
   * Use to determines whether or not the environment is local.
   * @memberof config
   * @return {Boolean} whether or not environment is local.
   */


  isLocal() {
    if (!isBrowser()) return false;
    const host = window.location.host;
    return host === '127.0.0.1' || host.indexOf('local.') === 0 || host.indexOf('ngrok') !== -1 || host.indexOf('localhost') === 0;
  }

  loadNode() {
    // TODO -- use process env variables instead here for Node server
    this.apiProtocol = 'https';
    this.apiHost = 'forio.com';
    return;
  }

  loadBrowser() {
    const isLocal = this.isLocal();
    const {
      protocol,
      pathname,
      host
    } = window.location;
    this.apiProtocol = isLocal ? 'https' : protocol;
    this.apiHost = isLocal ? 'forio.com' : host;
    const match = pathname.match(/\/app\/([\w-]+)\/([\w-]+)/);

    if (match) {
      const [account, project] = match.slice(1);
      this.accountShortName = account;
      this.projectShortName = project;
    }
  }

}

const config = new Config();

const {
  COOKIE,
  SESSION
} = BROWSER_STORAGE_TYPE;
const SESSION_KEY = 'com.forio.epicenter.session';
const EPI_SSO_KEY = 'epicenter.v3.sso';

class Identification {
  constructor(storeType) {
    _defineProperty__default['default'](this, "type", void 0);

    if (storeType !== COOKIE && storeType !== SESSION) {
      throw new EpicenterError("Invalid Storage Type: \"".concat(storeType, "\", please use \"").concat(COOKIE, "\" or \"").concat(SESSION, "\"."));
    }

    this.type = storeType;
    this.consumeSSO();
  }

  get session() {
    const Store = this.getStore();
    return new Store().getItem(SESSION_KEY);
  }

  set session(session) {
    const Store = this.getStore();
    const path = this.getSessionPath(session);

    if (session) {
      new Store({
        path
      }).setItem(SESSION_KEY, session);
    } else if (this.session) {
      new Store({
        path
      }).removeItem(SESSION_KEY);
    }
  }

  getStore() {
    if (isNode()) return NodeStore;

    switch (this.type) {
      case SESSION:
        return SessionStore;

      case COOKIE:
      default:
        return CookieStore;
    }
  }
  /* Generates the appropriate path for storing your session (applicable only to cookies) */


  getSessionPath(session) {
    const mySession = session || this.session;
    if (!mySession || isNode()) return '';
    const {
      accountShortName,
      projectShortName,
      objectType
    } = mySession;
    const isLocal = config.isLocal();
    const isCustomDomain = !isLocal && window.location.pathname.split('/')[1] !== 'app';
    const isEpicenterDomain = !isLocal && !isCustomDomain;

    if (objectType === 'user' && accountShortName && projectShortName && isEpicenterDomain) {
      return "/app/".concat(accountShortName, "/").concat(projectShortName);
    }
    /* Admins and any custom domains (ones that don't use 'app/account/project') get the root path */


    return '/';
  }

  consumeSSO() {
    if (isNode()) return;
    /* Double parse here b/c the backend serializes it as a string; the first parse
     * converts it into a json string, the second parse converts the json string into
     * json. Yes, it's weird, no, we can't change it (unless we want to rewrite
     * Interface Builder code to accommodate) */

    const session = JSON.parse(JSON.parse("\"".concat(cookies.getItem(EPI_SSO_KEY), "\"")));

    if (session) {
      const {
        accountShortName,
        projectShortName
      } = session;
      this.session = session;
      cookies.removeItem(EPI_SSO_KEY, {
        domain: ".".concat(window.location.hostname),
        path: "/app/".concat(accountShortName, "/").concat(projectShortName)
      });
    }
  }

}

const identification = new Identification(COOKIE);

var nativePromiseConstructor = global_1.Promise;

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var SPECIES$1 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$1]) {
    defineProperty(Constructor, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var ITERATOR$3 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$3] === it);
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$2] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$3)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var ITERATOR$4 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$4]
    || it['@@iterator']
    || iterators[classof(it)];
};

var iteratorClose = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

var Result$1 = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator);
    return new Result$1(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result$1) return result;
      } return new Result$1(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result$1) return result;
  } return new Result$1(false);
};

var ITERATOR$5 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$5] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$5] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var SPECIES$2 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$2]) == undefined ? defaultConstructor : aFunction$1(S);
};

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

var engineIsNode = classofRaw(global_1.process) == 'process';

var location = global_1.location;
var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$1,
  clear: clear
};

var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var macrotask = task.set;




var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var document$2 = global_1.document;
var process$1 = global_1.process;
var Promise$1 = global_1.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (engineIsNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
    toggle = true;
    node = document$2.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (engineIsNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
var f$5 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$5
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var process$2 = global_1.process;
var versions = process$2 && process$2.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

var task$1 = task.set;











var SPECIES$3 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState$1 = internalState.get;
var setInternalState$1 = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var PromiseConstructor = nativePromiseConstructor;
var TypeError$1 = global_1.TypeError;
var document$3 = global_1.document;
var process$3 = global_1.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced_1(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (engineV8Version === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!engineIsNode && !NATIVE_REJECTION_EVENT) return true;
  }
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$3] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$3.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global_1['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (engineIsNode) {
          process$3.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task$1.call(global_1, function () {
    var promise = state.facade;
    if (engineIsNode) {
      process$3.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction$1(executor);
    Internal.call(this);
    var state = getInternalState$1(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState$1(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = engineIsNode ? process$3.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState$1(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if ( typeof nativePromiseConstructor == 'function') {
    nativeThen = nativePromiseConstructor.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
      }
    });
  }
}

_export({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced:  FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

/**
 * Account API adapters -- account stuff TODO
 * @namespace accountAdapter
 */

async function createAccount(optionals = {}) {
  const {
    objectType = 'personal',
    name,
    shortName,
    adminKey,
    subscriptionPlan,
    billingInterval
  } = optionals;
  const response = await new Router().post('/account', {
    body: {
      objectType,
      name,
      shortName,
      adminKey,
      subscriptionPlan,
      billingInterval
    }
  }).then(({
    body
  }) => body);
  return response;
} // TODO -- just a copy-paste of create ATM; need to figuure out how to actually use

async function updateAccount(optionals = {}) {
  const {
    objectType = 'personal',
    name,
    shortName,
    adminKey,
    subscriptionPlan,
    billingInterval
  } = optionals;
  const response = await new Router().patch('/account', {
    body: {
      objectType,
      name,
      shortName,
      adminKey,
      subscriptionPlan,
      billingInterval
    }
  }).then(({
    body
  }) => body);
  return response;
}
async function removeAccount(accountShortName) {
  return await new Router().withAccountShortName(accountShortName).delete('/account').then(({
    body
  }) => body);
}

var account = /*#__PURE__*/Object.freeze({
	__proto__: null,
	createAccount: createAccount,
	updateAccount: updateAccount,
	removeAccount: removeAccount
});

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
async function logout() {
  identification.session = undefined;
  await cometdAdapter.disconnect();
}
async function login(credentials, optionals = {}) {
  const {
    handle,
    password,
    groupKey
  } = credentials;
  const {
    objectType = 'user',
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const session = await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/authentication', {
    inert: true,
    includeAuthorization: false,
    body: {
      objectType,
      handle,
      password,
      groupKey: groupKey || undefined
    }
  }).then(({
    body
  }) => body);
  await logout();
  identification.session = session;
  return session;
}
async function upgrade(groupKey, optionals = {}) {
  const {
    objectType = 'user',
    inert,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const session = await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch('/authentication', {
    inert,
    body: {
      objectType,
      groupKey
    }
  }).then(({
    body
  }) => body);
  await logout();
  identification.session = session;
  return session;
}
async function sso(optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const session = await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).get('/registration/sso').then(({
    body
  }) => body);
  identification.session = session;
  return session;
}
async function getSession() {
  const {
    body
  } = await new Router().get('/authentication');
  identification.session = body;
  return body;
}
function getLocalSession() {
  return identification.session;
}
function setLocalSession(session) {
  return identification.session = session;
}

var authentication = /*#__PURE__*/Object.freeze({
	__proto__: null,
	logout: logout,
	login: login,
	upgrade: upgrade,
	sso: sso,
	getSession: getSession,
	getLocalSession: getLocalSession,
	setLocalSession: setLocalSession
});

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

async function create(name, groupName, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    draft,
    runLimit
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/episode/".concat(groupName), {
    body: {
      name,
      draft,
      runLimit
    }
  }).then(({
    body
  }) => body);
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

async function get$1(episodeKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/".concat(episodeKey)).then(({
    body
  }) => body);
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

async function query(optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    filter = [],
    sort = [],
    first = 0,
    max = 100
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    filter: filter.join(';'),
    sort: sort.join(';'),
    first,
    max
  }).get('/episode/search').then(({
    body
  }) => body);
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

async function forGroup(groupKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/in/".concat(groupKey)).then(({
    body
  }) => body);
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

async function byName(groupName, episodeName, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/episode/with/".concat(groupName, "/").concat(episodeName)).then(({
    body
  }) => body);
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

async function remove(episodeKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).delete("/episode/".concat(episodeKey)).then(({
    body
  }) => body);
}

var episode = /*#__PURE__*/Object.freeze({
	__proto__: null,
	create: create,
	get: get$1,
	query: query,
	forGroup: forGroup,
	byName: byName,
	remove: remove
});

/**
 * Group API adapters -- handles groups and group memberships
 * @namespace groupAdapter
 */

var AUGMENT;

(function (AUGMENT) {
  AUGMENT["MEMBERS"] = "MEMBERS";
  AUGMENT["QUANTIZED"] = "QUANTIZED";
})(AUGMENT || (AUGMENT = {}));

/**
 * Provides information on a particular Epicenter group.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group[/(member|quantized)]/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * import { authAdapter, groupAdapter } from 'epicenter';
 * const session = authAdapter.getLocalSession();
 * const group = await groupAdapter.get(session.groupKey, {
 *      augment: 'MEMBERS'      // include members of the group in the response
 * });
 *
 * const group = await groupAdapter.get(session.groupKey, {
 *      augment: 'QUANTIZED'    // include metrics relating to the group in the response
 * });
 *
 */
async function get$2(groupKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server,
    augment
  } = optionals;
  let uriComponent = '';
  if (augment === AUGMENT.MEMBERS) uriComponent = '/member';
  if (augment === AUGMENT.QUANTIZED) uriComponent = '/quantized';
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/group".concat(uriComponent, "/").concat(groupKey)).then(({
    body
  }) => body);
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

async function destroy(groupKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).delete("/group/".concat(groupKey)).then(({
    body
  }) => body);
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

async function gather(optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server,
    expired
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    expired
  }).get('/group').then(({
    body
  }) => body);
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
 * @param {object}  update.flightRecorder           Diagnostic tool for loggin http requests for the server
 * @param {number}  update.flightRecorder.start     Start time (epoch time)
 * @param {number}  update.flightRecorder.stop      End time (epoch time)
 * @param {boolean} update.flightRecorder.enabled   TODO
 * @param {string}  update.event                    Name of the event the group is playing for
 * @param {boolean} update.allowMembershipChanges   TODO
 * @param {object}  update.pricing                  TODO
 * @param {number}  update.pricing.number           TODO
 * @param {object}  update.startDate                TODO
 * @param {object}  update.expirationDate           TODO
 * @param {object}  update.capacity                 Defines the upper limit on the number of users allowed in the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group with updated attributes
 */

async function update(groupKey, update, optionals = {}) {
  const {
    runLimit,
    organization,
    allowSelfRegistration,
    flightRecorder,
    event,
    allowMembershipChanges,
    pricing,
    startDate,
    expirationDate,
    capacity
  } = update;
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/group/".concat(groupKey), {
    body: {
      runLimit,
      organization,
      allowSelfRegistration,
      flightRecorder,
      event,
      allowMembershipChanges,
      pricing,
      startDate,
      expirationDate,
      capacity
    }
  }).then(({
    body
  }) => body);
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
 * @param {object}  group.flightRecorder            Diagnostic tool for loggin http requests for the server
 * @param {number}  group.flightRecorder.start      Start time (epoch time)
 * @param {number}  group.flightRecorder.stop       End time (epoch time)
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

async function create$1(group, optionals = {}) {
  const {
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
    capacity
  } = group;
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  if (!name) throw new EpicenterError('Cannot create a group with no name');
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/group', {
    body: {
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
      capacity
    }
  }).then(({
    body
  }) => body);
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

async function search(optionals = {}) {
  const {
    filter = [],
    sort = [],
    first,
    max,
    quantized,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const searchParams = {
    filter: filter.join(';') || undefined,
    sort: sort.join(';') || undefined,
    first,
    max
  };
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/group".concat(quantized ? '/quantized' : '', "/search"), {
    paginated: true
  }).then(({
    body
  }) => body);
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

async function withGroupName(name, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/group/with/".concat(name)).then(({
    body
  }) => body);
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

async function forUserKey(userKey, optionals = {}) {
  const {
    expired,
    all,
    role,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const isMultiple = Array.isArray(role) && role.length > 0;
  const roleList = isMultiple ? role : [role];
  const searchParams = {
    expired,
    all,
    role: role ? roleList : undefined
  };
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/group/member/for/".concat(userKey)).then(({
    body
  }) => body);
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

async function getSessionGroups(optionals = {}) {
  const {
    expired,
    role,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const isMultiple = Array.isArray(role) && role.length > 0;
  const roleList = isMultiple ? role : [role];
  const searchParams = {
    expired,
    role: role ? roleList : undefined
  };
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get('/group/member').then(({
    body
  }) => body);
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

async function register(groupKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/group/selfRegistration/".concat(groupKey)).then(({
    body
  }) => body);
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

async function addUser(groupKey, userKey, optionals = {}) {
  const {
    role,
    available,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/group/member/".concat(groupKey), {
    body: {
      objectType: 'group',
      userKey,
      role: role !== null && role !== void 0 ? role : exports.ROLE.PARTICIPANT,
      available: available !== null && available !== void 0 ? available : true
    }
  }).then(({
    body
  }) => body);
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

async function updateUser(groupKey, userKey, optionals = {}) {
  const {
    role,
    available,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/group/member/".concat(groupKey, "/").concat(userKey), {
    body: {
      objectType: 'group',
      role,
      available
    }
  }).then(({
    body
  }) => body);
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

async function removeUser(groupKey, userKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(userKey) && userKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(userKey.length === 1 ? userKey[0] : userKey);
  const searchParams = hasMultiple ? {
    userKey
  } : undefined;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).delete("/group/member/".concat(groupKey).concat(uriComponent)).then(({
    body
  }) => body);
}

var group = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get$2,
	destroy: destroy,
	gather: gather,
	update: update,
	create: create$1,
	search: search,
	withGroupName: withGroupName,
	forUserKey: forUserKey,
	getSessionGroups: getSessionGroups,
	register: register,
	addUser: addUser,
	updateUser: updateUser,
	removeUser: removeUser
});

/**
 * Leaderboard API adapter
 * @namespace leaderboardAdapter
 */

/**
 * Updates leaderboard information
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/leaderboard`
 *
 * @memberof leaderboardAdapter
 * @example
 *
 * import { leaderboardAdapter } from 'epicenter';
 * const leaderboard = await leaderboardAdapter.post();
 */
async function update$1(collection, scores, scope, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    tags,
    userKey
  } = optionals;
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/leaderboard', {
    body: {
      scope: {
        scopeBoundary,
        scopeKey,
        userKey: userKey !== null && userKey !== void 0 ? userKey : identification.session.userKey
      },
      collection,
      scores,
      tags
    }
  }).then(({
    body
  }) => body);
}
/**
 * Gathers leaderboard information
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/leaderboard/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{COLLECTION}`
 *
 * @memberof leaderboardAdapter
 * @example
 *
 * import { leaderboardAdapter } from 'epicenter';
 * const leaderboard = await leaderboardAdapter.get('myLeaderboard', {
 *      filter: [
 *          'tag.role=doctor',  // look for leaderboard entries tagged with role=doctor
 *          'score.total>0'     // where the users scored a total higher than 0
 *      ],
 *      sort: ['+score.total'], // sort results by 'total' in ascending order,
 *      first: 0,
 *      max: 20                 // retrieve only the first 20 entries
 * });
 */

async function get$3(collection, scope, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    filter = [],
    sort = [],
    first,
    max,
    accountShortName,
    projectShortName
  } = optionals;
  const searchParams = {
    filter: filter.join(';') || undefined,
    sort: sort.join(';') || undefined,
    first,
    max
  };
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/leaderboard/".concat(scopeBoundary, "/").concat(scopeKey, "/").concat(collection)).then(({
    body
  }) => body);
}

var leaderboard = /*#__PURE__*/Object.freeze({
	__proto__: null,
	update: update$1,
	get: get$3
});

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

async function connect() {
  return cometdAdapter.handshake();
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

async function forGroup$1(groupKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/presence/group/".concat(groupKey)).then(({
    body
  }) => body);
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

async function forWorld(worldKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/presence/world/".concat(worldKey)).then(({
    body
  }) => body);
}

var presence = /*#__PURE__*/Object.freeze({
	__proto__: null,
	connect: connect,
	forGroup: forGroup$1,
	forWorld: forWorld
});

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

async function channelsEnabled(optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  const response = await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get('/project/channel/isEnabled').then(({
    body
  }) => body);
  return response;
}

var project = /*#__PURE__*/Object.freeze({
	__proto__: null,
	channelsEnabled: channelsEnabled
});

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
async function create$2(model, scope, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    readLock,
    writeLock,
    userKey,
    ephemeral,
    trackingKey,
    modelContext,
    executionContext,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const {
    WORLD
  } = exports.SCOPE_BOUNDARY;
  const {
    PARTICIPANT,
    USER
  } = exports.ROLE;
  const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post('/run', {
    body: {
      scope: {
        scopeBoundary,
        scopeKey,
        userKey: scopeBoundary === WORLD ? undefined : userKey !== null && userKey !== void 0 ? userKey : identification.session.userKey
      },
      permit: {
        readLock: readLock || defaultLock,
        writeLock: writeLock || defaultLock
      },
      morphology: 'MANY',
      trackingKey,
      modelFile: model,
      modelContext: modelContext || {
        /* Is not recorded for clone. Overrides model ctx2 file. */
      },
      executionContext: executionContext || {
        /* Affected by clone. Carries arguments for model file worker on model initialization */
      },
      ephemeral
    }
  }).then(({
    body
  }) => body);
}
/**
 * Clone a run
 * @memberof runAdapter
 *
 * @param {string}  runKey          Run's key
 * @param {object}  [optionals={}]  Object for all optional fields
 * @returns {object}                Response with the run in the "body"
 */

async function clone(runKey, optionals = {}) {
  const {
    ephemeral,
    trackingKey,
    modelContext = {},
    executionContext = {},
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/clone/".concat(runKey), {
    body: {
      trackingKey,
      modelContext,
      executionContext,
      ephemeral
    }
  }).then(({
    body
  }) => body);
}
async function restore(runKey, optionals = {}) {
  const {
    ephemeral,
    modelContext = {},
    executionContext = {},
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/restore/".concat(runKey), {
    body: {
      modelContext,
      executionContext,
      ephemeral
    }
  }).then(({
    body
  }) => body);
}
async function rewind(runKey, steps, optionals = {}) {
  const {
    ephemeral,
    modelContext = {},
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/rewind/".concat(runKey), {
    body: {
      rewindCount: steps,
      modelContext,
      ephemeral
    }
  }).then(({
    body
  }) => body);
}
async function update$2(runKey, update, optionals = {}) {
  const {
    readLock,
    writeLock,
    trackingKey,
    marked,
    hidden,
    closed
  } = update;
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(hasMultiple ? {
    runKey
  } : '').patch("/run".concat(uriComponent), {
    body: {
      readLock,
      writeLock,
      trackingKey,
      marked,
      hidden,
      closed
    }
  }).then(({
    body
  }) => body);
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

async function remove$1(runKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).delete("/run/".concat(runKey)).then(({
    body
  }) => body);
}
async function get$4(runKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/run/".concat(runKey)).then(({
    body
  }) => body);
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

async function query$1(model, scope, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    filter = [],
    sort = [],
    first,
    max,
    timeout,
    variables = [],
    metadata = [],
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const searchParams = {
    filter: filter.join(';') || undefined,
    sort: sort.join(';') || undefined,
    var: variables.join(';') || undefined,
    meta: metadata.join(';') || undefined,
    first,
    max,
    timeout
  };
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/".concat(scopeBoundary, "/").concat(scopeKey, "/").concat(model), {
    paginated: true,
    parsePage: values => {
      return values.map(run => {
        run.variables = variables.reduce((variableMap, key, index) => {
          variableMap[key] = variables[index];
          return variableMap;
        }, {});
        return run;
      });
    }
  }).then(({
    body
  }) => body);
}
async function introspect(model, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/run/introspect/".concat(model)).then(({
    body
  }) => body);
}
async function operation(runKey, name, args = [], optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout
  } : {
    ritual,
    timeout
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).post("/run/operation".concat(uriComponent), {
    body: {
      name,
      arguments: args,
      objectType: 'execute' // TODO: remove this when platform fixes this so that it's not manually required

    }
  }).then(({
    body
  }) => body);
}
async function getVariables(runKey, variables, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const include = variables.join(';');
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout,
    include
  } : {
    ritual,
    timeout,
    include
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  const mappify = values => variables.reduce((variableMap, key, index) => {
    variableMap[key] = values[index];
    return variableMap;
  }, {});

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/variable".concat(uriComponent)).then(({
    body
  }) => {
    return !hasMultiple ? mappify(body) : Object.keys(body).map(runKey => ({
      runKey,
      variables: mappify(body[runKey])
    }));
  });
}
async function getVariable(runKey, variable, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;

  if (Array.isArray(runKey) || Array.isArray(variable)) {
    const variables = Array.isArray(variable) ? variable : [variable];
    return getVariables(runKey, variables, optionals);
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    timeout,
    ritual
  }).get("/run/variable/".concat(runKey, "/").concat(variable)).then(({
    body
  }) => body);
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

async function updateVariables(runKey, update, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout
  } : {
    ritual,
    timeout
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).patch("/run/variable".concat(uriComponent), {
    body: update
  }).then(({
    body
  }) => body);
}
async function getMetadata(runKey, metadata, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const include = metadata.join(';');
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout,
    include
  } : {
    ritual,
    timeout,
    include
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).get("/run/meta".concat(uriComponent)).then(({
    body
  }) => body);
}
async function updateMetadata(runKey, update, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout
  } : {
    ritual,
    timeout
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).patch("/run/meta".concat(uriComponent), {
    body: update
  }).then(({
    body
  }) => body);
}
async function action(runKey, actionList, optionals = {}) {
  const {
    timeout,
    ritual,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
  const uriComponent = hasMultiple ? '' : "/".concat(runKey.length === 1 ? runKey[0] : runKey);
  const searchParams = hasMultiple ? {
    runKey,
    timeout
  } : {
    ritual,
    timeout
  };

  if (ritual !== exports.RITUAL.EXORCISE && hasMultiple) {
    console.warn("Detected ritual: ".concat(ritual, " usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE"));
  }

  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams(searchParams).post("/run/action".concat(uriComponent), {
    body: actionList
  }).then(({
    body
  }) => body);
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
 * const run = await runAdapter.retrieveFromWorld('model.py', worldKey);
 *
 *
 * @param {object}  worldKey                        Key associated with the world you'd like a run from
 * @param {string}  model                           Name of model file you'd use to create the run if needed
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

async function retrieveFromWorld(worldKey, model, optionals = {}) {
  const {
    readLock,
    writeLock,
    ephemeral,
    trackingKey,
    modelContext,
    executionContext,
    accountShortName,
    projectShortName,
    server
  } = optionals;
  const {
    PARTICIPANT
  } = exports.ROLE;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/run/world/".concat(worldKey), {
    body: {
      permit: {
        readLock: readLock || PARTICIPANT,
        writeLock: writeLock || PARTICIPANT
      },
      morphology: 'MANY',
      trackingKey,
      modelFile: model,
      modelContext: modelContext || {},
      executionContext: executionContext || {},
      ephemeral
    }
  }).then(({
    body
  }) => body);
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

async function removeFromWorld(worldKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    server
  } = optionals;
  return await new Router().withServer(server).withAccountShortName(accountShortName).withProjectShortName(projectShortName).delete("/run/world/".concat(worldKey)).then(({
    body
  }) => body);
}

async function serial(runKey, operations, optionals = {}) {
  const normalizedOps = operations.map(item => ({
    name: typeof item === 'string' ? item : item.name,
    params: item.params
  })); //Perform all operations, sequentially

  return normalizedOps.reduce((promise, {
    name,
    params
  }) => {
    return promise.then(() => operation(runKey, name, params, optionals = {}));
  }, Promise.resolve());
}

async function getWithStrategy(strategy, model, scope, optionals = {}) {
  const {
    initOperations = []
  } = optionals;

  if (strategy === 'reuse-across-sessions') {
    const runs = await query$1(model, scope, { ...optionals,
      sort: ['-created']
    });

    if (runs.length) {
      return runs[0];
    }

    const newRun = await create$2(model, scope, optionals = {});
    await serial(newRun.runKey, initOperations, optionals = {});
    return newRun;
  } else if (strategy === 'reuse-never') {
    const newRun = await create$2(model, scope, optionals = {});
    await serial(newRun.runKey, initOperations, optionals = {});
    return newRun;
  } else ;

  throw new EpicenterError('Invalid run strategy.');
}

var run$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	create: create$2,
	clone: clone,
	restore: restore,
	rewind: rewind,
	update: update$2,
	remove: remove$1,
	get: get$4,
	query: query$1,
	introspect: introspect,
	operation: operation,
	getVariables: getVariables,
	getVariable: getVariable,
	updateVariables: updateVariables,
	getMetadata: getMetadata,
	updateMetadata: updateMetadata,
	action: action,
	retrieveFromWorld: retrieveFromWorld,
	removeFromWorld: removeFromWorld,
	getWithStrategy: getWithStrategy
});

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

async function update$3(vaultKey, items, optionals = {}) {
  var _items$set, _items$push;

  const {
    accountShortName,
    projectShortName,
    mutationKey
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    MutationKey: mutationKey
  }).patch("/vault/".concat(vaultKey), {
    body: {
      set: (_items$set = items.set) !== null && _items$set !== void 0 ? _items$set : {},
      push: (_items$push = items.push) !== null && _items$push !== void 0 ? _items$push : {}
    }
  }).then(({
    body
  }) => body);
}
async function get$5(vaultKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/vault/".concat(vaultKey)).catch(error => {
    if (error.status === 404) return {
      body: undefined
    };
    return Promise.reject(error);
  }).then(({
    body
  }) => body);
}
async function getWithScope(collection, scope, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    accountShortName,
    projectShortName
  } = optionals;
  const userKey = optionals.userKey ? "/".concat(optionals.userKey) : '';
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/vault/with/".concat(scopeBoundary, "/").concat(scopeKey).concat(userKey, "/").concat(collection)).catch(error => {
    if (error.status === 404) return {
      body: undefined
    };
    return Promise.reject(error);
  }).then(({
    body
  }) => body);
}
async function remove$2(vaultKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName,
    mutationKey
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    MutationKey: mutationKey
  }).delete("/vault/".concat(vaultKey)).then(({
    body
  }) => body);
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

async function create$3(collection, scope, items, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    readLock,
    writeLock,
    userKey,
    ttlSeconds,
    mutationKey,
    accountShortName,
    projectShortName
  } = optionals;
  const {
    WORLD
  } = exports.SCOPE_BOUNDARY;
  const {
    PARTICIPANT,
    USER
  } = exports.ROLE;
  const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/vault/".concat(collection), {
    body: {
      scope: {
        scopeBoundary,
        scopeKey,
        userKey: scopeBoundary === WORLD ? undefined : userKey
      },
      permit: {
        readLock: readLock || defaultLock,
        writeLock: writeLock || defaultLock
      },
      ttlSeconds,
      mutationKey,
      items
    }
  }).then(({
    body
  }) => body);
}

var vault = /*#__PURE__*/Object.freeze({
	__proto__: null,
	update: update$3,
	get: get$5,
	getWithScope: getWithScope,
	remove: remove$2,
	create: create$3
});

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

async function update$4(worldKey, update, optionals = {}) {
  const {
    name,
    runKey
  } = update;
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).patch("/world/".concat(worldKey), {
    body: {
      name,
      runKey
    }
  }).then(({
    body
  }) => body);
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

async function destroy$1(worldKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).delete("/world/".concat(worldKey)).then(({
    body
  }) => body);
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

async function create$4(world, optionals = {}) {
  var _identification$sessi;

  const {
    groupName,
    episodeName,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi = identification.session) === null || _identification$sessi === void 0 ? void 0 : _identification$sessi.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
    body: world
  }).then(({
    body
  }) => body);
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

async function get$6(optionals = {}) {
  var _identification$sessi2;

  const {
    groupName,
    episodeName,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/world/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi2 = identification.session) === null || _identification$sessi2 === void 0 ? void 0 : _identification$sessi2.groupName).concat(episodeName ? "/".concat(episodeName) : '')).then(({
    body
  }) => body);
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

async function selfAssign(role, optionals = {}) {
  var _identification$sessi3;

  const {
    groupName,
    episodeName,
    exceedMinimums,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/selfassign/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi3 = identification.session) === null || _identification$sessi3 === void 0 ? void 0 : _identification$sessi3.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
    body: {
      role,
      exceedMinimums
    }
  }).then(({
    body
  }) => body);
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

async function assignUsers(assignments, optionals = {}) {
  var _identification$sessi4;

  const {
    groupName,
    episodeName,
    exceedMinimums,
    requireAllAssignments,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).post("/world/assignment/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi4 = identification.session) === null || _identification$sessi4 === void 0 ? void 0 : _identification$sessi4.groupName).concat(episodeName ? "/".concat(episodeName) : ''), {
    body: {
      assignments,
      exceedMinimums,
      requireAllAssignments
    }
  }).then(({
    body
  }) => body);
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

async function updateUsers(worldKey, assignments, optionals = {}) {
  const {
    exceedMinimums,
    requireAllAssignments,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).put("/world/assignment/".concat(worldKey), {
    body: {
      assignments,
      exceedMinimums,
      requireAllAssignments
    }
  }).then(({
    body
  }) => body);
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

async function getAssignments(worldKey, optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get("/world/assignment/".concat(worldKey)).then(({
    body
  }) => body);
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

async function removeUsers(userKeys, optionals = {}) {
  var _identification$sessi5;

  const {
    groupName,
    episodeName,
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).withSearchParams({
    userKey: userKeys
  }).get("/world/assignment/".concat(groupName !== null && groupName !== void 0 ? groupName : (_identification$sessi5 = identification.session) === null || _identification$sessi5 === void 0 ? void 0 : _identification$sessi5.groupName).concat(episodeName ? "/".concat(episodeName) : '')).then(({
    body
  }) => body);
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

async function editPersonas(personas, scope = {}, optionals = {}) {
  const {
    scopeBoundary,
    scopeKey
  } = scope;
  const {
    accountShortName,
    projectShortName
  } = optionals;
  const boundary = scopeBoundary || exports.SCOPE_BOUNDARY.PROJECT;
  const uriComponent = boundary === exports.SCOPE_BOUNDARY.PROJECT ? '' : "/".concat(scopeKey);
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName)
  /* We will at some point remove the need to explicitly lower case this */
  .put("/world/persona/".concat(boundary.toLowerCase()).concat(uriComponent), {
    body: personas
  }).then(({
    body
  }) => body);
}

var world = /*#__PURE__*/Object.freeze({
	__proto__: null,
	update: update$4,
	destroy: destroy$1,
	create: create$4,
	get: get$6,
	selfAssign: selfAssign,
	assignUsers: assignUsers,
	updateUsers: updateUsers,
	getAssignments: getAssignments,
	removeUsers: removeUsers,
	editPersonas: editPersonas
});

/**
 * Time API adapter -- handles getting the current server time
 * @namespace timeAdapter
 */

/**
 * Fetches the current server time
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/time`
 *
 * @memberof timeAdapter
 * @example
 *
 * import { timeAdapter } from 'epicenter';
 * const worlds = await timeAdapter.get();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {string}                                The current server time, in ISO 8601 format
 */

async function get$7(optionals = {}) {
  const {
    accountShortName,
    projectShortName
  } = optionals;
  return await new Router().withAccountShortName(accountShortName).withProjectShortName(projectShortName).get('/time').catch(error => {
    if (error.status === 404) return {
      body: undefined
    };
    return Promise.reject(error);
  }).then(({
    body
  }) => body);
}

var time = /*#__PURE__*/Object.freeze({
	__proto__: null,
	get: get$7
});

var cometd = createCommonjsModule(function (module, exports) {
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
    {
        // CommonJS.
        module.exports = factory();
    }
}(commonjsGlobal, function() {
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
});

var AckExtension = createCommonjsModule(function (module, exports) {
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
    {
        module.exports = factory(cometd);
    }
}(commonjsGlobal, function(cometdModule) {
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
});

var ReloadExtension = createCommonjsModule(function (module, exports) {
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
    {
        module.exports = factory(cometd);
    }
}(commonjsGlobal, function(cometdModule) {
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
                }
            }
            return message;
        };

        _configure(configuration);
    };
}));
});

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';

class CometdError extends Error {
  constructor(reply) {
    super();

    _defineProperty__default['default'](this, "status", void 0);

    _defineProperty__default['default'](this, "information", void 0);

    _defineProperty__default['default'](this, "message", void 0);

    const {
      error = '',
      successful
    } = reply;

    if (error && error.includes('403') && !successful) {
      this.status = 401;
    }

    this.information = reply;
    this.message = error;
  }

}

// TODO -- split this code so that people who don't use channels do not import this by default
// https://levelup.gitconnected.com/code-splitting-for-libraries-bundling-for-npm-with-rollup-1-0-2522c7437697
class CometdAdapter {
  constructor() {
    _defineProperty__default['default'](this, "url", '');

    _defineProperty__default['default'](this, "customCometd", void 0);

    _defineProperty__default['default'](this, "defaultCometd", void 0);

    _defineProperty__default['default'](this, "initialization", false);

    _defineProperty__default['default'](this, "subscriptions", new Map());

    _defineProperty__default['default'](this, "state", DISCONNECTED);

    _defineProperty__default['default'](this, "requireAcknowledgement", true);
  }

  get cometd() {
    return this.customCometd || this.defaultCometd;
  }

  async startup(options = {
    logLevel: 'error'
  }) {
    const enabled = await channelsEnabled();
    if (!enabled) throw new EpicenterError('Push Channels are not enabled on this project');
    this.defaultCometd = new cometd.CometD();
    const {
      apiProtocol,
      apiHost,
      apiVersion
    } = config;
    this.url = "".concat(apiProtocol, "://").concat(apiHost, "/push/v").concat(apiVersion, "/cometd");
    this.cometd.registerExtension('ack', new AckExtension());

    if (isBrowser()) {
      this.cometd.registerExtension('reload', new ReloadExtension());

      window.onunload = () => {
        if (this.cometd.getStatus() === CONNECTED) {
          this.cometd.reload();
          this.cometd.getTransport().abort();
        }
      };
    } // if (isNode()) {
    //     const { adapt } = await import('cometd-nodejs-client');
    //     adapt();
    // }


    this.cometd.configure({
      url: this.url,
      logLevel: options.logLevel
    });
    return true;
  }

  async reinit(customCometd, options) {
    await this.disconnect();
    this.initialization = false;
    this.customCometd = customCometd;
    return this.init(options);
  }

  async init(options) {
    if (!this.initialization) {
      this.initialization = await this.startup(options);
    }

    return this.initialization;
  } // Connects to CometD server


  async handshake(options = {}) {
    await this.init();

    if (this.cometd.getStatus() !== DISCONNECTED) {
      return Promise.resolve();
    }

    const handshakeProps = {};
    const {
      session
    } = identification;

    if (session) {
      handshakeProps.ext = {
        [AUTH_TOKEN_KEY]: session.token,
        ack: this.requireAcknowledgement
      };
    }

    this.cometd.ackEnabled = this.requireAcknowledgement;
    this.cometd.websocketEnabled = true;
    return new Promise((resolve, reject) => this.cometd.handshake(handshakeProps, handshakeReply => {
      if (handshakeReply.successful) {
        resolve(handshakeReply);
        return;
      }

      const error = new CometdError(handshakeReply);

      if (options.inert) {
        reject(error);
        return;
      }

      const retry = () => this.handshake({
        inert: true
      });

      try {
        const result = errorManager.handle(error, retry);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }));
  }

  async disconnect() {
    if (!this.cometd) return Promise.resolve();
    await this.init();
    await this.empty();
    if (this.cometd.getStatus() !== CONNECTED) return Promise.resolve();
    return new Promise((resolve, reject) => this.cometd.disconnect(disconnectReply => {
      if (!disconnectReply.successful) {
        reject(new EpicenterError('Unable to disconnect from CometD server'));
      } else {
        resolve();
      }
    }));
  }

  async add(channel, update, options = {}) {
    await this.init();
    const channels = [].concat(channel);

    if (this.cometd.getStatus() !== CONNECTED) {
      await this.handshake();
    }

    const subscriptionProps = {};
    const {
      session
    } = identification;

    if (session) {
      subscriptionProps.ext = {
        [AUTH_TOKEN_KEY]: session.token
      };
    }

    const handleCometdUpdate = ({
      data
    }) => {
      // TODO -- figure out why there's ambiguity here and try to remove it
      data = typeof data === 'string' ? JSON.parse(data) : data;
      return update(data);
    };

    const promises = [];
    this.cometd.batch(() => channels.forEach(({
      path
    }) => promises.push(new Promise((resolve, reject) => {
      const subscription = this.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, subscribeReply => {
        if (subscribeReply.successful) {
          this.subscriptions.set(subscription.channel, subscription);
          resolve(subscription);
          return;
        }

        const error = new CometdError(subscribeReply);

        if (options.inert) {
          reject(error);
          return;
        }

        const retry = () => this.add(channel, update, {
          inert: true
        });

        try {
          const result = errorManager.handle(error, retry);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }))));
    return promises.length === 1 ? Promise.all(promises).then(([res]) => res) : Promise.all(promises);
  }

  async publish(channel, content, options = {}) {
    await this.init();
    const channels = [].concat(channel);

    if (this.cometd.getStatus() !== CONNECTED) {
      await this.handshake();
    }

    const {
      session
    } = identification;
    const publishProps = {
      ext: session ? {
        [AUTH_TOKEN_KEY]: session.token
      } : undefined
    };
    const promises = [];
    this.cometd.batch(() => channels.forEach(({
      path
    }) => promises.push(new Promise((resolve, reject) => {
      this.cometd.publish(path, content, publishProps, publishReply => {
        if (publishReply.successful) {
          resolve(publishReply);
          return;
        }

        const error = new CometdError(publishReply);

        if (options.inert) {
          reject(error);
          return;
        }

        const retry = () => this.publish(channel, content, {
          inert: true
        });

        try {
          const result = errorManager.handle(error, retry);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }))));
    return promises.length === 1 ? Promise.all(promises).then(([res]) => res) : Promise.all(promises);
  }

  async remove(subscription) {
    await this.init();
    this.subscriptions.delete(subscription.channel);
    return new Promise((resolve, reject) => this.cometd.unsubscribe(subscription, unsubscribeReply => {
      if (unsubscribeReply.successful) {
        resolve(unsubscribeReply);
      }

      const error = new CometdError(unsubscribeReply);
      reject(error);
      /* Not using error handling here yet -- should we? */
    }));
  }

  async empty() {
    await this.init();
    const promises = [];
    this.cometd.batch(() => this.subscriptions.forEach(subscription => {
      promises.push(this.remove(subscription));
    }));
    return Promise.all(promises);
  }

}

const cometdAdapter = new CometdAdapter();

const validateScope = scope => {
  if (!scope) throw new EpicenterError('No scope found where one was required');
  const {
    scopeBoundary,
    scopeKey,
    pushCategory
  } = scope;
  if (!scopeBoundary) throw new EpicenterError('Missing scope component: scopeBoundary');
  if (!scopeKey) throw new EpicenterError('Missing scope component: scopeKey');
  if (!pushCategory) throw new EpicenterError('Missing scope component: pushCategory');
  if (!exports.SCOPE_BOUNDARY.hasOwnProperty(scopeBoundary)) throw new EpicenterError("Invalid scope boundary: ".concat(scopeBoundary));
  if (!exports.PUSH_CATEGORY.hasOwnProperty(pushCategory)) throw new EpicenterError("Invalid push category: ".concat(pushCategory));
};
/** Channel thingy */


class Channel {
  /**
   * Make a new channel
   * @param {*} scope wordsd here
   */
  constructor(scope) {
    _defineProperty__default['default'](this, "path", void 0);

    _defineProperty__default['default'](this, "update", void 0);

    _defineProperty__default['default'](this, "subscription", void 0);

    const {
      scopeBoundary,
      scopeKey,
      pushCategory
    } = scope;
    validateScope(scope);
    this.path = "/".concat(scopeBoundary.toLowerCase(), "/").concat(scopeKey, "/").concat(pushCategory.toLowerCase());

    if (cometdAdapter.subscriptions.has(this.path)) {
      this.subscription = cometdAdapter.subscriptions.get(this.path);
    }
  }
  /** This is the publis cahh
   * @param {*} content someom
   * @returns {Promise} something here
   */


  publish(content) {
    return cometdAdapter.publish(this, content);
  }

  async subscribe(update, options) {
    if (this.subscription) await this.unsubscribe();
    this.update = update;
    return cometdAdapter.add(this, update, options).then(subscription => {
      this.subscription = subscription;
      return subscription;
    });
  }

  async unsubscribe() {
    if (this.subscription) {
      await cometdAdapter.remove(this.subscription);
      this.subscription = null;
    }
  }

}

const handleByRelog = error => {
  let query = '';

  if (error.code) {
    query = query.concat("?error=".concat(error.code));
  }

  return logout().then(() => window.location.href = "/login.html".concat(query));
};

const handleSSO = () => {
  return logout();
};

const handleUnknown = () => {
  return logout().then(() => window.location.href = '/unknown.html');
};

const handleByLoginMethod = error => {
  var _session$loginMethod;

  const {
    session
  } = identification;
  const loginType = session === null || session === void 0 ? void 0 : (_session$loginMethod = session.loginMethod) === null || _session$loginMethod === void 0 ? void 0 : _session$loginMethod.objectType;

  switch (loginType) {
    case 'sso':
      return handleSSO();

    case 'none':
      return handleUnknown();

    case 'native':
    default:
      return handleByRelog(error);
  }
};

const UNAUTHORIZED = 401;

class ErrorManager {
  constructor() {
    _defineProperty__default['default'](this, "_handlers", [{
      /* Default Unauthorized (401) Error Handler */
      identifier: error => error.status === UNAUTHORIZED,
      handle: (error, retry) => {
        if (error.code === 'AUTHENTICATION_INVALIDATED') {
          const groupKey = identification.session.groupKey;
          return upgrade(groupKey, {
            objectType: 'user',
            inert: true
          }).then(() => retry()).catch(() => {
            handleByLoginMethod(error);
          });
        }

        if (isNode()) return Promise.reject(error);
        return handleByLoginMethod(error);
      }
    }]);
  }

  get handlers() {
    return this._handlers;
  }

  registerHandler(identifier, handleFn) {
    this.handlers.unshift({
      identifier,
      handle: handleFn
    });
  }

  async handle(error, retryFn, handlers) {
    handlers = handlers || this.handlers;
    const index = handlers.findIndex(({
      identifier
    }) => identifier(error));
    const handler = handlers[index];
    const remainingHandlers = index > 0 ? handlers.slice(index + 1) : [];
    if (!handler) throw error;
    let promise;

    try {
      promise = await handler.handle(error, retryFn).catch(err => {
        /* This catch call ensures that handle always returns a promise,
        otherwise it'd be caught in the catch block below */
        throw err;
      });
    } catch (e) {
      promise = await this.handle(error, retryFn, remainingHandlers);
    }

    return promise;
  }

}

const errorManager = new ErrorManager();

var charAt$1 = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$2(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$2(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$1(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var ITERATOR$6 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$6]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

var nativeAssign = Object.assign;
var defineProperty$1 = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$1({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$1(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$2 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$2(delta / damp) : delta >> 1;
  delta += floor$2(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$2(delta / baseMinusTMin);
  }
  return floor$2(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$2((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$2(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch$1 = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR$7 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$3 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace$1 = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace$1[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$3(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$3(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$7, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
  _export({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = objectCreate(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch$1.apply(this, args);
    }
  });
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;





var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$4 = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor$3 = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor$3(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState$4(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream__default['default'].Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream__default['default'].PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream__default['default']) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream__default['default']) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream__default['default'])) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone$1(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream__default['default'] && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream__default['default']) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find$1(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers$1 {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers$1) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find$1(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find$1(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find$1(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find$1(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find$1(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers$1.prototype.entries = Headers$1.prototype[Symbol.iterator];

Object.defineProperty(Headers$1.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers$1.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find$1(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers$1();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__default['default'].STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers$1(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone$1(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url__default['default'].parse;
const format_url = Url__default['default'].format;

const streamDestructionSupported = 'destroy' in Stream__default['default'].Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone$1(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers$1(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers$1(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream__default['default'].Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream__default['default'].PassThrough;
const resolve_url = Url__default['default'].resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default['default'] : http__default['default']).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream__default['default'].Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers$1(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__default['default'].Z_SYNC_FLUSH,
				finishFlush: zlib__default['default'].Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__default['default'].createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__default['default'].createInflate());
					} else {
						body = body.pipe(zlib__default['default'].createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__default['default'].createBrotliDecompress === 'function') {
				body = body.pipe(zlib__default['default'].createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

var lib = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': fetch,
	Headers: Headers$1,
	Request: Request,
	Response: Response,
	FetchError: FetchError
});

var nodeFetch = /*@__PURE__*/getAugmentedNamespace(lib);

var nodePonyfill = createCommonjsModule(function (module, exports) {
var realFetch = nodeFetch.default || nodeFetch;

var fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options)
};

module.exports = exports = fetch;
exports.fetch = fetch;
exports.Headers = nodeFetch.Headers;
exports.Request = nodeFetch.Request;
exports.Response = nodeFetch.Response;

// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch;
});

const MAX_URL_LENGTH = 2048;

function paginate(json, url, options) {
  var _options$parsePage;

  const parsePage = (_options$parsePage = options.parsePage) !== null && _options$parsePage !== void 0 ? _options$parsePage : i => i;
  const page = { ...json,
    values: parsePage(json.values)
  };

  const prev = async function () {
    const searchParams = new URLSearchParams(url.search);

    if (page.firstResult === 0) {
      console.warn('Pagination: cannot call "prev" on first page');
      return [];
    }

    const first = page.firstResult - page.maxResults;
    const max = page.maxResults + (first < 0 ? first : 0);
    searchParams.set('first', Math.max(first, 0).toString());
    searchParams.set('max', max.toString());
    url.search = searchParams.toString(); // eslint-disable-next-line no-use-before-define

    const prevPage = await request(url, { ...options,
      paginated: false
    }).then(({
      body
    }) => body);
    prevPage.values = parsePage(prevPage.values);
    Object.assign(page, prevPage);
    return page.values;
  };

  const next = async function () {
    const searchParams = new URLSearchParams(url.search);
    const first = page.firstResult + page.maxResults;

    if (first >= page.totalResults) {
      console.warn('Pagination: cannot call "next" on final page');
      return [];
    }

    searchParams.set('first', first.toString());
    url.search = searchParams.toString(); // eslint-disable-next-line no-use-before-define

    const nextPage = await request(url, { ...options,
      paginated: false
    }).then(({
      body
    }) => body);
    nextPage.values = parsePage(nextPage.values);
    Object.assign(page, nextPage);
    return page.values;
  };

  const initialTotal = json.totalResults;

  const all = async function (first = 0, allValues = []) {
    if (first >= initialTotal) return allValues;
    const searchParams = new URLSearchParams(url.search);
    searchParams.set('first', first.toString());
    searchParams.delete('max');
    url.search = searchParams.toString(); // eslint-disable-next-line no-use-before-define

    const nextPage = await request(url, { ...options,
      paginated: false
    }).then(({
      body
    }) => body);
    allValues.push(...parsePage(nextPage.values));
    return all(first + nextPage.maxResults, allValues);
  };

  page.prev = prev;
  page.next = next;
  page.all = all;
  return page;
}

const createHeaders = includeAuthorization => {
  const headers = {
    'Content-type': 'application/json; charset=UTF-8'
  };
  const {
    session
  } = identification;

  if (includeAuthorization && session) {
    headers.Authorization = "Bearer ".concat(session.token);
  }

  if (includeAuthorization && config.tokenOverride) {
    headers.Authorization = "Bearer ".concat(config.tokenOverride);
  }

  return headers;
};

const NO_CONTENT = 204;

async function request(url, options) {
  const {
    method,
    body,
    includeAuthorization,
    inert,
    paginated
  } = options;
  const headers = createHeaders(includeAuthorization);
  console.log('%c calling to url', 'font-size: 20px; color: #FB15B9FF;', url.toString());
  const response = await nodePonyfill(url.toString(), {
    method: method,
    cache: 'no-cache',
    headers: headers,
    redirect: 'follow',
    body: body ? JSON.stringify(body) : null
  });

  if (response.status === NO_CONTENT) {
    return new Result(undefined, response);
  }

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    throw new EpicenterError("Response content-type '".concat(contentType, "' does not include 'application/json'"));
  }

  const json = await response.json();

  if (response.status >= 200 && response.status < 400) {
    const result = new Result(paginated ? paginate(json, url, options) : json, response);
    return result;
  }

  const fault = new Fault(json, response);
  if (inert) throw fault;

  const retry = () => request(url, { ...options,
    inert: true
  });

  return errorManager.handle(fault, retry);
}
/**
 * Used to make the network calls in all API adapters
 */


class Router {
  constructor() {
    _defineProperty__default['default'](this, "_searchParams", undefined);

    _defineProperty__default['default'](this, "_server", undefined);

    _defineProperty__default['default'](this, "_version", undefined);

    _defineProperty__default['default'](this, "_accountShortName", undefined);

    _defineProperty__default['default'](this, "_projectShortName", undefined);
  }

  /**
   * The root path used for the call, essentially protocol + hostname
   * @type {string}
   */
  get server() {
    return this._server;
  }

  set server(value) {
    this._server = value;
  }
  /**
   * The version of the Epicenter APIs being invoked; expected to stay at `3`
   * @type {number}
   */


  get version() {
    return this._version;
  }

  set version(value) {
    this._version = value;
  }
  /**
   * Name of the account; for administrative use, this value should be set to 'epicenter'
   * @type {string}
   */


  get accountShortName() {
    return this._accountShortName;
  }

  set accountShortName(value) {
    this._accountShortName = value;
  }
  /**
   * Name of the project; for administrative use, this value should be set to 'manager'
   * @type {string}
   */


  get projectShortName() {
    return this._projectShortName;
  }

  set projectShortName(value) {
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


  get searchParams() {
    return this._searchParams;
  }

  set searchParams(query) {
    if (query.constructor === URLSearchParams) {
      this._searchParams = query;
      return;
    }
    /* 'query' should be either an array, or string. Objects will be coerced into [key, value] arrays */


    if (typeof query === 'object' && query.constructor === Object) {
      query = Object.entries(query).reduce((arr, [key, value]) => {
        if (Array.isArray(value)) {
          /* Special case for arrayed param values: use duplicated params here */
          return [...arr, ...value.map(v => [key, v])];
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
  /**
   * Sets the root path. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
   * @param {string} [server] Root path to use
   * @returns {Router}        The Router instance
   */


  withServer(server) {
    if (typeof server !== 'undefined') this.server = server;
    return this;
  }
  /**
   * Sets the version. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
   * @param {string} [version]    Version to use
   * @returns {Router}            The Router instance
   */


  withVersion(version) {
    if (typeof version !== 'undefined') this.version = version;
    return this;
  }
  /**
   * Sets the account. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
   * @param {string} [accountShortName]   Account name to use
   * @returns {Router}                    The Router instance
   */


  withAccountShortName(accountShortName) {
    if (typeof accountShortName !== 'undefined') this.accountShortName = accountShortName;
    return this;
  }
  /**
   * Sets the project. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
   * @param {string} [projectShortName]   Project name to use
   * @returns {Router}                    The Router instance
   */


  withProjectShortName(projectShortName) {
    if (typeof projectShortName !== 'undefined') this.projectShortName = projectShortName;
    return this;
  }
  /**
   * Sets the search parameters. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
   * @param {string|array|object|URLSearchParams} [searchParams]  Search parameters to use, utilizes the same setter as [searchParams](#Router-searchParams)
   * @returns {Router}                                            The Router instance
   */


  withSearchParams(searchParams) {
    if (typeof searchParams !== 'undefined') this.searchParams = searchParams;
    return this;
  }

  getURL(uriComponent) {
    var _this$server, _this$accountShortNam, _this$projectShortNam, _this$version, _this$searchParams;

    const server = (_this$server = this.server) !== null && _this$server !== void 0 ? _this$server : "".concat(config.apiProtocol, "://").concat(config.apiHost);
    const accountShortName = (_this$accountShortNam = this.accountShortName) !== null && _this$accountShortNam !== void 0 ? _this$accountShortNam : config.accountShortName;
    const projectShortName = (_this$projectShortNam = this.projectShortName) !== null && _this$projectShortNam !== void 0 ? _this$projectShortNam : config.projectShortName;
    const version = (_this$version = this.version) !== null && _this$version !== void 0 ? _this$version : config.apiVersion;
    const url = new URL("".concat(server));
    url.pathname = "api/v".concat(version, "/").concat(accountShortName, "/").concat(projectShortName).concat(prefix('/', uriComponent));
    url.search = (_this$searchParams = this.searchParams) !== null && _this$searchParams !== void 0 ? _this$searchParams : new URLSearchParams();
    return url;
  } //Network Requests


  async get(uriComponent, options = {}) {
    const url = this.getURL(uriComponent);
    /* Handle sufficiently large GET requests with POST calls instead */

    if (url.href.length > MAX_URL_LENGTH) {
      this.searchParams = '';
      return this.post(uriComponent, { ...options,
        body: url.search
      });
    }

    return request(url, {
      includeAuthorization: true,
      ...options,
      method: 'GET'
    });
  }

  async delete(uriComponent, options = {}) {
    const url = this.getURL(uriComponent);
    return request(url, {
      includeAuthorization: true,
      ...options,
      method: 'DELETE'
    });
  }

  async patch(uriComponent, options = {}) {
    const url = this.getURL(uriComponent);
    return request(url, {
      includeAuthorization: true,
      ...options,
      method: 'PATCH'
    });
  }

  async post(uriComponent, options = {}) {
    const url = this.getURL(uriComponent);
    return request(url, {
      includeAuthorization: true,
      ...options,
      method: 'POST'
    });
  }

  async put(uriComponent, options = {}) {
    const url = this.getURL(uriComponent);
    return request(url, {
      includeAuthorization: true,
      ...options,
      method: 'PUT'
    });
  }

}

/* Main file; defines public APIs & load order */

const version$1 = '3.3.0-alpha';

exports.Channel = Channel;
exports.Router = Router;
exports.accountAdapter = account;
exports.authAdapter = authentication;
exports.config = config;
exports.episodeAdapter = episode;
exports.errorManager = errorManager;
exports.groupAdapter = group;
exports.leaderboardAdapter = leaderboard;
exports.presenceAdapter = presence;
exports.projectAdapter = project;
exports.runAdapter = run$1;
exports.timeAdapter = time;
exports.vaultAdapter = vault;
exports.version = version$1;
exports.worldAdapter = world;
//# sourceMappingURL=epicenter.cjs.js.map
