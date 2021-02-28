// Copyright 2010 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// {{PRE_JSES}}

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = function(status, toThrow) {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_HAS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === 'object';
ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// A web environment like Electron.js can have Node enabled, so we must
// distinguish between Node-enabled environments and Node environments per se.
// This will allow the former to do things like mount NODEFS.
// Extended check using process.versions fixes issue #8816.
// (Also makes redundant the original check that 'require' is a function.)
ENVIRONMENT_HAS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
}



// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

var nodeFS;
var nodePath;

if (ENVIRONMENT_IS_NODE) {
  scriptDirectory = __dirname + '/';


  read_ = function shell_read(filename, binary) {
    var ret = tryParseAsDataURI(filename);
    if (ret) {
      return binary ? ret : ret.toString();
    }
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
  };

  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };




  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  process['on']('unhandledRejection', abort);

  quit_ = function(status) {
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };


} else
if (ENVIRONMENT_IS_SHELL) {


  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      var data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    var data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit === 'function') {
    quit_ = function(status) {
      quit(status);
    };
  }

  if (typeof print !== 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console === 'undefined') console = {};
    console.log = print;
    console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print;
  }
} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_HAS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }


  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {


  read_ = function shell_read(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  };

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = function readBinary(url) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };




  }

  setWindowTitle = function(title) { document.title = title };
} else
{
  throw new Error('environment detection error');
}


// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
if (Module['arguments']) arguments_ = Module['arguments'];if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) Object.defineProperty(Module, 'arguments', { configurable: true, get: function() { abort('Module.arguments has been replaced with plain arguments_') } });
if (Module['thisProgram']) thisProgram = Module['thisProgram'];if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) Object.defineProperty(Module, 'thisProgram', { configurable: true, get: function() { abort('Module.thisProgram has been replaced with plain thisProgram') } });
if (Module['quit']) quit_ = Module['quit'];if (!Object.getOwnPropertyDescriptor(Module, 'quit')) Object.defineProperty(Module, 'quit', { configurable: true, get: function() { abort('Module.quit has been replaced with plain quit_') } });

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] === 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
if (!Object.getOwnPropertyDescriptor(Module, 'read')) Object.defineProperty(Module, 'read', { configurable: true, get: function() { abort('Module.read has been replaced with plain read_') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) Object.defineProperty(Module, 'readAsync', { configurable: true, get: function() { abort('Module.readAsync has been replaced with plain readAsync') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) Object.defineProperty(Module, 'readBinary', { configurable: true, get: function() { abort('Module.readBinary has been replaced with plain readBinary') } });
// TODO: add when SDL2 is fixed if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) Object.defineProperty(Module, 'setWindowTitle', { configurable: true, get: function() { abort('Module.setWindowTitle has been replaced with plain setWindowTitle') } });
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';


// TODO remove when SDL2 is fixed (also see above)



// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

// stack management, and other functionality that is provided by the compiled code,
// should not be used before it is ready
stackSave = stackRestore = stackAlloc = function() {
  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
};

function staticAlloc(size) {
  abort('staticAlloc is no longer available at runtime; instead, perform static allocations at compile time (using makeStaticAlloc)');
}

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  if (end > _emscripten_get_heap_size()) {
    abort('failure to dynamicAlloc - memory growth etc. is not supported there, call malloc/sbrk directly');
  }
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}





// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {
  return func;
}

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  var table = wasmTable;
  var ret = table.length;

  // Grow the table
  try {
    table.grow(1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    throw 'Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.';
  }

  // Insert new element
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    table.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction');
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }

  return ret;
}

function removeFunctionWasm(index) {
  // TODO(sbc): Look into implementing this to allow re-using of table slots
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {
  assert(typeof func !== 'undefined');

  return addFunctionWasm(func, sig);
}

function removeFunction(index) {
  removeFunctionWasm(index);
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    assert(args.length == sig.length-1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};

function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

var Runtime = {
  // helpful errors
  getTempRet0: function() { abort('getTempRet0() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  staticAlloc: function() { abort('staticAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  stackAlloc: function() { abort('stackAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;




// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


var wasmBinary;if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) Object.defineProperty(Module, 'wasmBinary', { configurable: true, get: function() { abort('Module.wasmBinary has been replaced with plain wasmBinary') } });
var noExitRuntime;if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) Object.defineProperty(Module, 'noExitRuntime', { configurable: true, get: function() { abort('Module.noExitRuntime has been replaced with plain noExitRuntime') } });


// wasm2js.js - enough of a polyfill for the WebAssembly object so that we can load
// wasm2js code that way.


// Emit "var WebAssembly" if definitely using wasm2js. Otherwise, in MAYBE_WASM2JS
// mode, we can't use a "var" since it would prevent normal wasm from working.
var
WebAssembly = {
  Memory: function(opts) {
    return {
      buffer: new ArrayBuffer(opts['initial'] * 65536),
      grow: function(amount) {
        var oldBuffer = this.buffer;
        var ret = __growWasmMemory(amount);
        assert(this.buffer !== oldBuffer); // the call should have updated us
        return ret;
      }
    };
  },

  Table: function(opts) {
    var ret = new Array(opts['initial']);
    ret.grow = function(by) {
      if (ret.length >= 71 + 0) {
        abort('Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.')
      }
      ret.push(null);
    };
    ret.set = function(i, func) {
      ret[i] = func;
    };
    ret.get = function(i) {
      return ret[i];
    };
    return ret;
  },

  Module: function(binary) {
    // TODO: use the binary and info somehow - right now the wasm2js output is embedded in
    // the main JS
    return {};
  },

  Instance: function(module, info) {
    // TODO: use the module and info somehow - right now the wasm2js output is embedded in
    // the main JS
    // XXX hack to get an atob implementation

// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {String} input The string to decode.
 */
var decodeBase64 = typeof atob === 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, 'base64');
    } catch (_) {
      buf = new Buffer(s, 'base64');
    }
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


    var atob = decodeBase64;
    // This will be replaced by the actual wasm2js code.
    var exports = (
function instantiate(asmLibraryArg, wasmMemory, wasmTable) {


  var scratchBuffer = new ArrayBuffer(8);
  var i32ScratchView = new Int32Array(scratchBuffer);
  var f32ScratchView = new Float32Array(scratchBuffer);
  var f64ScratchView = new Float64Array(scratchBuffer);
  
  function wasm2js_scratch_load_i32(index) {
    return i32ScratchView[index];
  }
      
  function wasm2js_scratch_store_i32(index, value) {
    i32ScratchView[index] = value;
  }
      
  function wasm2js_scratch_load_f64() {
    return f64ScratchView[0];
  }
      
  function wasm2js_scratch_store_f64(value) {
    f64ScratchView[0] = value;
  }
      
  function legalimport$wasm2js_scratch_store_i64(low, high) {
    i32ScratchView[0] = low;
    i32ScratchView[1] = high;
  }
      
function asmFunc(global, env, buffer) {
 var memory = env.memory;
 var FUNCTION_TABLE = wasmTable;
 var HEAP8 = new global.Int8Array(buffer);
 var HEAP16 = new global.Int16Array(buffer);
 var HEAP32 = new global.Int32Array(buffer);
 var HEAPU8 = new global.Uint8Array(buffer);
 var HEAPU16 = new global.Uint16Array(buffer);
 var HEAPU32 = new global.Uint32Array(buffer);
 var HEAPF32 = new global.Float32Array(buffer);
 var HEAPF64 = new global.Float64Array(buffer);
 var Math_imul = global.Math.imul;
 var Math_fround = global.Math.fround;
 var Math_abs = global.Math.abs;
 var Math_clz32 = global.Math.clz32;
 var Math_min = global.Math.min;
 var Math_max = global.Math.max;
 var Math_floor = global.Math.floor;
 var Math_ceil = global.Math.ceil;
 var Math_sqrt = global.Math.sqrt;
 var abort = env.abort;
 var nan = global.NaN;
 var infinity = global.Infinity;
 var fimport$1 = env.__assert_fail;
 var fimport$2 = env._embind_register_function;
 var fimport$3 = env._embind_register_class;
 var fimport$4 = env._embind_register_value_object;
 var fimport$5 = env._embind_register_value_object_field;
 var fimport$6 = env._embind_finalize_value_object;
 var fimport$7 = env.__cxa_allocate_exception;
 var fimport$8 = env.__cxa_throw;
 var fimport$9 = env._embind_register_class_constructor;
 var fimport$10 = env._embind_register_class_function;
 var fimport$11 = env._emval_incref;
 var fimport$12 = env._emval_decref;
 var fimport$13 = env._emval_take_value;
 var fimport$14 = env.abort;
 var fimport$15 = env.__lock;
 var fimport$16 = env.__unlock;
 var fimport$17 = env.fd_close;
 var fimport$18 = env.fd_write;
 var fimport$19 = env._embind_register_void;
 var fimport$20 = env._embind_register_bool;
 var fimport$21 = env._embind_register_std_string;
 var fimport$22 = env._embind_register_std_wstring;
 var fimport$23 = env._embind_register_emval;
 var fimport$24 = env._embind_register_integer;
 var fimport$25 = env._embind_register_float;
 var fimport$26 = env._embind_register_memory_view;
 var fimport$27 = env.emscripten_resize_heap;
 var fimport$28 = env.emscripten_memcpy_big;
 var fimport$29 = env.__handle_stack_overflow;
 var fimport$30 = env.setTempRet0;
 var fimport$31 = env.fd_seek;
 var global$0 = 5249696;
 var global$1 = 6812;
 var global$2 = 0;
 var i64toi32_i32$HIGH_BITS = 0;
 // EMSCRIPTEN_START_FUNCS;
 function $0() {
  return 6816 | 0;
 }
 
 function $1() {
  $677();
  $766();
  $1039();
 }
 
 function $2() {
  $4(6176 | 0, 1024 | 0) | 0;
  return;
 }
 
 function $3($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $832(6176 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $4($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $5($5_1 | 0) | 0;
  $817($5_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, $6(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $5($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $346($4_1 | 0) | 0;
  $347($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $6($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $767(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $7($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $156_1 = 0, $155_1 = 0, $152_1 = 0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $155_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $155_1;
  }
  HEAP32[($7_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $4_1;
  HEAP32[(0 + 6188 | 0) >> 2] = (HEAP32[(0 + 6188 | 0) >> 2] | 0) + 1 | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0) <= (0 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($7_1 + 44 | 0) >> 2] = (HEAP32[($7_1 + 40 | 0) >> 2] | 0) + (HEAP32[($8($7_1 + 36 | 0 | 0, $7_1 + 32 | 0 | 0) | 0) >> 2] | 0) | 0;
    break label$3;
   }
   HEAP32[($7_1 + 20 | 0) >> 2] = 1e5;
   label$5 : {
    if (!((HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[($7_1 + 16 | 0) >> 2] = $7((HEAP32[($7_1 + 40 | 0) >> 2] | 0) - 1 | 0 | 0, (HEAP32[($7_1 + 36 | 0) >> 2] | 0) + 1 | 0 | 0, HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) - 1 | 0 | 0) | 0;
    HEAP32[($7_1 + 20 | 0) >> 2] = HEAP32[($9($7_1 + 20 | 0 | 0, $7_1 + 16 | 0 | 0) | 0) >> 2] | 0;
   }
   label$6 : {
    if (!((HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
     break label$6
    }
    HEAP32[($7_1 + 12 | 0) >> 2] = $7(HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 36 | 0) >> 2] | 0) - 1 | 0 | 0, (HEAP32[($7_1 + 32 | 0) >> 2] | 0) + 1 | 0 | 0, HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) - 1 | 0 | 0) | 0;
    HEAP32[($7_1 + 20 | 0) >> 2] = HEAP32[($9($7_1 + 20 | 0 | 0, $7_1 + 12 | 0 | 0) | 0) >> 2] | 0;
   }
   label$7 : {
    if (!((HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
     break label$7
    }
    HEAP32[($7_1 + 8 | 0) >> 2] = $7(HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 32 | 0) >> 2] | 0) - 1 | 0 | 0, (HEAP32[($7_1 + 28 | 0) >> 2] | 0) + 1 | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) - 1 | 0 | 0) | 0;
    HEAP32[($7_1 + 20 | 0) >> 2] = HEAP32[($9($7_1 + 20 | 0 | 0, $7_1 + 8 | 0 | 0) | 0) >> 2] | 0;
   }
   label$8 : {
    if (!((HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
     break label$8
    }
    HEAP32[($7_1 + 4 | 0) >> 2] = $7(HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) - 1 | 0 | 0) | 0;
    HEAP32[($7_1 + 20 | 0) >> 2] = HEAP32[($9($7_1 + 20 | 0 | 0, $7_1 + 4 | 0 | 0) | 0) >> 2] | 0;
   }
   HEAP32[$7_1 >> 2] = $7((HEAP32[($7_1 + 40 | 0) >> 2] | 0) + 1 | 0 | 0, HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) - 1 | 0 | 0) | 0;
   HEAP32[($7_1 + 20 | 0) >> 2] = HEAP32[($9($7_1 + 20 | 0 | 0, $7_1 | 0) | 0) >> 2] | 0;
   HEAP32[($7_1 + 44 | 0) >> 2] = HEAP32[($7_1 + 20 | 0) >> 2] | 0;
  }
  $152_1 = HEAP32[($7_1 + 44 | 0) >> 2] | 0;
  label$9 : {
   $156_1 = $7_1 + 48 | 0;
   if ($156_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $156_1;
  }
  return $152_1 | 0;
 }
 
 function $8($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $10(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $9($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $11(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $10($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!(($349($4_1 + 8 | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $14_1 = HEAP32[$4_1 >> 2] | 0;
    break label$3;
   }
   $14_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  }
  $16_1 = $14_1;
  label$5 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $11($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!(($349($4_1 + 8 | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $14_1 = HEAP32[$4_1 >> 2] | 0;
    break label$3;
   }
   $14_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  }
  $16_1 = $14_1;
  label$5 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $12($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $81_1 = 0, $102_1 = 0, $101_1 = 0, $98_1 = 0;
  $4_1 = global$0 - 64 | 0;
  label$1 : {
   $101_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $101_1;
  }
  HEAP32[($4_1 + 60 | 0) >> 2] = $1_1;
  $13($4_1 + 56 | 0 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = 1;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) <= (4 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[(($4_1 + 32 | 0) + ((HEAP32[($4_1 + 28 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] = 0;
    HEAP32[($4_1 + 28 | 0) >> 2] = (HEAP32[($4_1 + 28 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $14($0_1 | 0) | 0;
  HEAP32[($4_1 + 56 | 0) >> 2] = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$5 : {
   label$6 : while (1) {
    HEAP32[($4_1 + 16 | 0) >> 2] = $15($0_1 | 0) | 0;
    if (!(($16($4_1 + 56 | 0 | 0, $4_1 + 16 | 0 | 0) | 0) & 1 | 0)) {
     break label$5
    }
    label$7 : {
     label$8 : {
      if (!((HEAP32[($17($4_1 + 56 | 0 | 0) | 0) >> 2] | 0 | 0) >= (15 | 0) & 1 | 0)) {
       break label$8
      }
      break label$7;
     }
     label$9 : {
      label$10 : {
       if (!(($18(($17($4_1 + 56 | 0 | 0) | 0) + 4 | 0 | 0) | 0) >>> 0 <= 3 >>> 0 & 1 | 0)) {
        break label$10
       }
       $81_1 = ($4_1 + 32 | 0) + (($18(($17($4_1 + 56 | 0 | 0) | 0) + 4 | 0 | 0) | 0) << 2 | 0) | 0;
       HEAP32[$81_1 >> 2] = (HEAP32[$81_1 >> 2] | 0) + 1 | 0;
       break label$9;
      }
      HEAP32[($4_1 + 48 | 0) >> 2] = (HEAP32[($4_1 + 48 | 0) >> 2] | 0) + 1 | 0;
     }
    }
    HEAP32[($4_1 + 8 | 0) >> 2] = $19($4_1 + 56 | 0 | 0, 0 | 0) | 0;
    continue label$6;
   };
  }
  $98_1 = $7(HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 44 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 48 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 60 | 0) >> 2] | 0 | 0) | 0;
  label$11 : {
   $102_1 = $4_1 + 64 | 0;
   if ($102_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $102_1;
  }
  return $98_1 | 0;
 }
 
 function $13($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $20($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $14($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $21(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $22($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $15($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $24(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $22($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $16($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $9_1 = ($23(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $17($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $26($25(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $18($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($27(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $19($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = HEAP32[$8_1 >> 2] | 0;
  $28($8_1 | 0) | 0;
  $10_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $20($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $21($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $351($3_1 + 8 | 0 | 0, HEAP32[($350(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $22($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[$8_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $8_1 | 0;
 }
 
 function $23($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $11_1 = (($354(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $24($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $351($3_1 + 8 | 0 | 0, $352(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $25($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $357(($356(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 16 | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $26($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $27($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $359((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $28($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $355($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $29($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = +$0_1;
  $1_1 = +$1_1;
  $2_1 = +$2_1;
  $3_1 = +$3_1;
  $4_1 = +$4_1;
  var $7_1 = 0, $18_1 = 0, $17_1 = 0, $33_1 = 0.0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $17_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAPF64[($7_1 + 40 | 0) >> 3] = $0_1;
  HEAPF64[($7_1 + 32 | 0) >> 3] = $1_1;
  HEAPF64[($7_1 + 24 | 0) >> 3] = $2_1;
  HEAPF64[($7_1 + 16 | 0) >> 3] = $3_1;
  HEAPF64[($7_1 + 8 | 0) >> 3] = $4_1;
  label$3 : {
   if (+HEAPF64[($7_1 + 40 | 0) >> 3] < +HEAPF64[($7_1 + 32 | 0) >> 3] & 1 | 0) {
    break label$3
   }
   fimport$1(1030 | 0, 1036 | 0, 148 | 0, 1049 | 0);
   abort();
  }
  $33_1 = (+HEAPF64[($7_1 + 8 | 0) >> 3] - +HEAPF64[($7_1 + 40 | 0) >> 3]) * (+HEAPF64[($7_1 + 16 | 0) >> 3] - +HEAPF64[($7_1 + 24 | 0) >> 3]) / (+HEAPF64[($7_1 + 32 | 0) >> 3] - +HEAPF64[($7_1 + 40 | 0) >> 3]) + +HEAPF64[($7_1 + 24 | 0) >> 3];
  label$4 : {
   $18_1 = $7_1 + 48 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return +$33_1;
 }
 
 function $30($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1, $7_1, $8_1, $9_1, $10_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  $7_1 = $7_1 | 0;
  $8_1 = $8_1 | 0;
  $9_1 = $9_1 | 0;
  $10_1 = $10_1 | 0;
  var $13_1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, $262_1 = 0, $14_1 = 0, $51_1 = 0, $62_1 = 0, $99_1 = 0, $169_1 = 0, $170_1 = 0, $176_1 = 0, $305_1 = 0, $304_1 = 0, $308_1 = 0.0, $653_1 = 0, $175_1 = 0, $684_1 = 0, $281_1 = 0;
  $13_1 = global$0 - 288 | 0;
  label$1 : {
   $304_1 = $13_1;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $304_1;
  }
  HEAP8[($13_1 + 287 | 0) >> 0] = $0_1;
  HEAP32[($13_1 + 280 | 0) >> 2] = $1_1;
  HEAP32[($13_1 + 276 | 0) >> 2] = $2_1;
  HEAP32[($13_1 + 272 | 0) >> 2] = $3_1;
  HEAP32[($13_1 + 268 | 0) >> 2] = $4_1;
  HEAP32[($13_1 + 264 | 0) >> 2] = $5_1;
  HEAP32[($13_1 + 260 | 0) >> 2] = $6_1;
  HEAP32[($13_1 + 256 | 0) >> 2] = $7_1;
  HEAP32[($13_1 + 252 | 0) >> 2] = $8_1;
  HEAP32[($13_1 + 248 | 0) >> 2] = $9_1;
  HEAP32[($13_1 + 244 | 0) >> 2] = $10_1;
  $14_1 = HEAP32[($13_1 + 272 | 0) >> 2] | 0;
  HEAP32[$14_1 >> 2] = (HEAP32[$14_1 >> 2] | 0) + 1 | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($13_1 + 268 | 0) >> 2] | 0 | 0) > (HEAP32[(HEAP32[($13_1 + 272 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$4
    }
    break label$3;
   }
   label$5 : {
    if (!((HEAP32[($13_1 + 268 | 0) >> 2] | 0 | 0) < (HEAP32[(HEAP32[($13_1 + 272 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[(HEAP32[($13_1 + 264 | 0) >> 2] | 0) >> 2] = 1;
   }
   HEAP32[($13_1 + 240 | 0) >> 2] = HEAP32[(HEAP32[($13_1 + 264 | 0) >> 2] | 0) >> 2] | 0;
   label$6 : while (1) {
    if (!((((HEAP32[($13_1 + 240 | 0) >> 2] | 0) + (HEAP32[($13_1 + 280 | 0) >> 2] | 0) | 0) - 1 | 0 | 0) <= (14 | 0) & 1 | 0)) {
     break label$3
    }
    $51_1 = $13_1 + 224 | 0;
    $31($51_1 | 0) | 0;
    HEAP32[($13_1 + 220 | 0) >> 2] = 0;
    $62_1 = 24;
    HEAP8[($13_1 + 219 | 0) >> 0] = ($695(HEAP32[($13_1 + 260 | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 256 | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 280 | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 276 | 0) >> 2] | 0 | 0, ((HEAPU8[($13_1 + 287 | 0) >> 0] | 0) << $62_1 | 0) >> $62_1 | 0 | 0, $51_1 | 0, $13_1 + 220 | 0 | 0) | 0) & 1 | 0;
    label$7 : {
     if (!((HEAPU8[($13_1 + 219 | 0) >> 0] | 0) & 1 | 0)) {
      break label$7
     }
     $713(HEAP32[($13_1 + 260 | 0) >> 2] | 0 | 0, $13_1 + 224 | 0 | 0) | 0;
     $32($13_1 + 192 | 0 | 0) | 0;
     label$8 : {
      label$9 : {
       if (!((HEAP32[($13_1 + 280 | 0) >> 2] | 0 | 0) == (5 | 0) & 1 | 0)) {
        break label$9
       }
       if (!((HEAP32[($13_1 + 276 | 0) >> 2] | 0 | 0) == (1 | 0) & 1 | 0)) {
        break label$9
       }
       $99_1 = 24;
       $680($13_1 + 176 | 0 | 0, ((((HEAPU8[($13_1 + 287 | 0) >> 0] | 0) << $99_1 | 0) >> $99_1 | 0 | 0) != (65 | 0) & 1 | 0 ? 8 : 5) | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0);
       break label$8;
      }
      label$10 : {
       label$11 : {
        if (!((HEAP32[($13_1 + 280 | 0) >> 2] | 0 | 0) == (3 | 0) & 1 | 0)) {
         break label$11
        }
        if (!((HEAP32[($13_1 + 276 | 0) >> 2] | 0 | 0) == (2 | 0) & 1 | 0)) {
         break label$11
        }
        $680($13_1 + 176 | 0 | 0, 6 | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0);
        break label$10;
       }
       label$12 : {
        label$13 : {
         if (!((HEAP32[($13_1 + 280 | 0) >> 2] | 0 | 0) == (2 | 0) & 1 | 0)) {
          break label$13
         }
         if (!((HEAP32[($13_1 + 276 | 0) >> 2] | 0 | 0) == (3 | 0) & 1 | 0)) {
          break label$13
         }
         $680($13_1 + 176 | 0 | 0, 7 | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0);
         break label$12;
        }
        $680($13_1 + 176 | 0 | 0, 0 | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0);
       }
      }
     }
     $308_1 = +$33(HEAP32[($13_1 + 260 | 0) >> 2] | 0 | 0, $13_1 + 192 | 0 | 0, (HEAP32[($13_1 + 256 | 0) >> 2] | 0) - (HEAP32[($13_1 + 220 | 0) >> 2] | 0) | 0 | 0, HEAP32[($13_1 + 252 | 0) >> 2] | 0 | 0, HEAP32[(HEAP32[($13_1 + 272 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 240 | 0) >> 2] | 0 | 0);
     $169_1 = HEAP32[($13_1 + 252 | 0) >> 2] | 0;
     i64toi32_i32$2 = $13_1 + 176 | 0;
     i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
     i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
     $653_1 = i64toi32_i32$0;
     i64toi32_i32$0 = $13_1 + 152 | 0;
     HEAP32[i64toi32_i32$0 >> 2] = $653_1;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     $170_1 = 8;
     HEAP32[(i64toi32_i32$0 + $170_1 | 0) >> 2] = HEAP32[(i64toi32_i32$2 + $170_1 | 0) >> 2] | 0;
     $175_1 = HEAP32[(HEAP32[$169_1 >> 2] | 0) >> 2] | 0;
     $176_1 = 8;
     HEAP32[($13_1 + $176_1 | 0) >> 2] = HEAP32[(($13_1 + 152 | 0) + $176_1 | 0) >> 2] | 0;
     i64toi32_i32$2 = $13_1;
     i64toi32_i32$1 = HEAP32[($13_1 + 152 | 0) >> 2] | 0;
     i64toi32_i32$0 = HEAP32[($13_1 + 156 | 0) >> 2] | 0;
     $684_1 = i64toi32_i32$1;
     i64toi32_i32$1 = $13_1;
     HEAP32[$13_1 >> 2] = $684_1;
     HEAP32[($13_1 + 4 | 0) >> 2] = i64toi32_i32$0;
     HEAPF64[($13_1 + 168 | 0) >> 3] = $308_1 + +FUNCTION_TABLE[$175_1]($169_1, $13_1);
     label$14 : {
      if (!(+HEAPF64[($13_1 + 168 | 0) >> 3] <= +HEAPF64[(HEAP32[($13_1 + 244 | 0) >> 2] | 0) >> 3] & 1 | 0)) {
       break label$14
      }
      label$15 : {
       if (!(+HEAPF64[($13_1 + 168 | 0) >> 3] < +HEAPF64[(HEAP32[($13_1 + 244 | 0) >> 2] | 0) >> 3] & 1 | 0)) {
        break label$15
       }
       $34(HEAP32[($13_1 + 248 | 0) >> 2] | 0 | 0);
      }
      HEAPF64[(HEAP32[($13_1 + 244 | 0) >> 2] | 0) >> 3] = +HEAPF64[($13_1 + 168 | 0) >> 3];
      HEAP32[($13_1 + 144 | 0) >> 2] = $35($13_1 + 192 | 0 | 0) | 0;
      label$16 : while (1) {
       HEAP32[($13_1 + 136 | 0) >> 2] = $36($13_1 + 192 | 0 | 0) | 0;
       label$17 : {
        if (!(($37($13_1 + 144 | 0 | 0, $13_1 + 136 | 0 | 0) | 0) & 1 | 0)) {
         break label$17
        }
        $38($13_1 + 72 | 0 | 0, $13_1 + 224 | 0 | 0) | 0;
        $689($13_1 + 88 | 0 | 0, $13_1 + 72 | 0 | 0, HEAP32[($13_1 + 220 | 0) >> 2] | 0 | 0);
        $39($13_1 + 104 | 0 | 0, 1056 | 0, $13_1 + 88 | 0 | 0);
        $40($13_1 + 120 | 0 | 0, $13_1 + 104 | 0 | 0, 1059 | 0);
        $42($41($13_1 + 144 | 0 | 0) | 0 | 0, $13_1 + 120 | 0 | 0) | 0;
        $832($13_1 + 120 | 0 | 0) | 0;
        $832($13_1 + 104 | 0 | 0) | 0;
        $832($13_1 + 88 | 0 | 0) | 0;
        $43($13_1 + 72 | 0 | 0) | 0;
        HEAP32[($13_1 + 64 | 0) >> 2] = $44($13_1 + 144 | 0 | 0, 0 | 0) | 0;
        continue label$16;
       }
       break label$16;
      };
      $262_1 = $13_1 + 192 | 0;
      $281_1 = HEAP32[($13_1 + 248 | 0) >> 2] | 0;
      HEAP32[($13_1 + 48 | 0) >> 2] = $36(HEAP32[($13_1 + 248 | 0) >> 2] | 0 | 0) | 0;
      $45($13_1 + 56 | 0 | 0, $13_1 + 48 | 0 | 0) | 0;
      HEAP32[($13_1 + 32 | 0) >> 2] = $35($262_1 | 0) | 0;
      $45($13_1 + 40 | 0 | 0, $13_1 + 32 | 0 | 0) | 0;
      HEAP32[($13_1 + 16 | 0) >> 2] = $36($262_1 | 0) | 0;
      $45($13_1 + 24 | 0 | 0, $13_1 + 16 | 0 | 0) | 0;
      $46($281_1 | 0, HEAP32[($13_1 + 56 | 0) >> 2] | 0 | 0, $262_1 | 0, HEAP32[($13_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($13_1 + 24 | 0) >> 2] | 0 | 0);
     }
     $718(HEAP32[($13_1 + 260 | 0) >> 2] | 0 | 0, $13_1 + 224 | 0 | 0) | 0;
     $47($13_1 + 192 | 0 | 0) | 0;
    }
    $43($13_1 + 224 | 0 | 0) | 0;
    HEAP32[($13_1 + 240 | 0) >> 2] = (HEAP32[($13_1 + 240 | 0) >> 2] | 0) + 1 | 0;
    continue label$6;
   };
  }
  label$18 : {
   $305_1 = $13_1 + 288 | 0;
   if ($305_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $305_1;
  }
  return;
 }
 
 function $31($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $6_1 = 0, $7_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  $6_1 = $3_1 + 8 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $48($6_1 | 0) | 0;
  $49($7_1 | 0, $6_1 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $32($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $50($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $33($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $8_1 = 0, $14_1 = 0, $19_1 = 0, $84_1 = 0, $90_1 = 0, $91_1 = 0, $92_1 = 0, $95_1 = 0, $98_1 = 0, $101_1 = 0, $107_1 = 0, $115_1 = 0, $121_1 = 0, $120_1 = 0, $24_1 = 0, $123_1 = 0.0;
  $8_1 = global$0 - 128 | 0;
  label$1 : {
   $120_1 = $8_1;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $120_1;
  }
  $14_1 = $8_1 + 16 | 0;
  HEAP32[($8_1 + 124 | 0) >> 2] = $0_1;
  HEAP32[($8_1 + 120 | 0) >> 2] = $1_1;
  HEAP32[($8_1 + 116 | 0) >> 2] = $2_1;
  HEAP32[($8_1 + 112 | 0) >> 2] = $3_1;
  HEAP32[($8_1 + 108 | 0) >> 2] = $4_1;
  HEAP32[($8_1 + 104 | 0) >> 2] = $5_1;
  $13($8_1 + 96 | 0 | 0) | 0;
  HEAP32[($8_1 + 92 | 0) >> 2] = 0;
  $19_1 = HEAP32[($8_1 + 112 | 0) >> 2] | 0;
  HEAPF64[($8_1 + 80 | 0) >> 3] = +FUNCTION_TABLE[HEAP32[((HEAP32[$19_1 >> 2] | 0) + 4 | 0) >> 2] | 0]($19_1, HEAP32[($8_1 + 124 | 0) >> 2] | 0, HEAP32[($8_1 + 116 | 0) >> 2] | 0);
  $24_1 = HEAP32[($8_1 + 120 | 0) >> 2] | 0;
  $38($14_1 | 0, HEAP32[($8_1 + 124 | 0) >> 2] | 0 | 0) | 0;
  $689($8_1 + 32 | 0 | 0, $14_1 | 0, HEAP32[($8_1 + 116 | 0) >> 2] | 0 | 0);
  $39($8_1 + 48 | 0 | 0, 1056 | 0, $8_1 + 32 | 0 | 0);
  $40($8_1 + 64 | 0 | 0, $8_1 + 48 | 0 | 0, 1059 | 0);
  $51($24_1 | 0, $8_1 + 64 | 0 | 0);
  $832($8_1 + 64 | 0 | 0) | 0;
  $832($8_1 + 48 | 0 | 0) | 0;
  $832($8_1 + 32 | 0 | 0) | 0;
  $43($8_1 + 16 | 0 | 0) | 0;
  HEAP32[($8_1 + 4 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($8_1 + 4 | 0) >> 2] | 0 | 0) < (5 | 0) & 1 | 0)) {
     break label$3
    }
    $84_1 = 24;
    $30(((HEAPU8[($52(6176 | 0, HEAP32[($8_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 0] | 0) << $84_1 | 0) >> $84_1 | 0 | 0, 5 | 0, 1 | 0, $8_1 + 92 | 0 | 0, HEAP32[($8_1 + 108 | 0) >> 2] | 0 | 0, $8_1 + 104 | 0 | 0, HEAP32[($8_1 + 124 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 116 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 112 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 120 | 0) >> 2] | 0 | 0, $8_1 + 80 | 0 | 0);
    HEAP32[($8_1 + 4 | 0) >> 2] = (HEAP32[($8_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  $90_1 = 65;
  $91_1 = 2;
  $92_1 = 3;
  $95_1 = $8_1 + 92 | 0;
  $98_1 = $8_1 + 104 | 0;
  $101_1 = $8_1 + 80 | 0;
  $107_1 = 24;
  $30(($90_1 << $107_1 | 0) >> $107_1 | 0 | 0, $92_1 | 0, $91_1 | 0, $95_1 | 0, HEAP32[($8_1 + 108 | 0) >> 2] | 0 | 0, $98_1 | 0, HEAP32[($8_1 + 124 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 116 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 112 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 120 | 0) >> 2] | 0 | 0, $101_1 | 0);
  $115_1 = 24;
  $30(($90_1 << $115_1 | 0) >> $115_1 | 0 | 0, $91_1 | 0, $92_1 | 0, $95_1 | 0, HEAP32[($8_1 + 108 | 0) >> 2] | 0 | 0, $98_1 | 0, HEAP32[($8_1 + 124 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 116 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 112 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 120 | 0) >> 2] | 0 | 0, $101_1 | 0);
  $123_1 = +HEAPF64[($8_1 + 80 | 0) >> 3];
  label$5 : {
   $121_1 = $8_1 + 128 | 0;
   if ($121_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $121_1;
  }
  return +$123_1;
 }
 
 function $34($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $53(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $35($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $54(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $36($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $56(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $37($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $11_1 = (($55(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $38($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $16_1 = 0, $15_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $15_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 28 | 0) >> 2] | 0;
  $59($5_1 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $60(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $61(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $62($5_1 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $16_1 = $4_1 + 32 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $5_1 | 0;
 }
 
 function $39($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $58($0_1 | 0, $57($855(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $40($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $58($0_1 | 0, $57($852(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $13_1 = $5_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $41($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = ($63(HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) | 0) + 8 | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $42($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $64(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $43($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $65($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $44($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = HEAP32[$8_1 >> 2] | 0;
  $66($8_1 | 0) | 0;
  $10_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $45($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $46($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $14_1 = 0, $50_1 = 0, $54_1 = 0, $65_1 = 0, $64_1 = 0, $48_1 = 0, $53_1 = 0;
  $7_1 = global$0 - 64 | 0;
  label$1 : {
   $64_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $64_1;
  }
  HEAP32[($7_1 + 56 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 48 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 40 | 0) >> 2] = $4_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $2_1;
  $14_1 = HEAP32[($7_1 + 36 | 0) >> 2] | 0;
  label$3 : {
   if (!(($67($7_1 + 48 | 0 | 0, $7_1 + 40 | 0 | 0) | 0) & 1 | 0)) {
    break label$3
   }
   HEAP32[($7_1 + 28 | 0) >> 2] = HEAP32[($7_1 + 48 | 0) >> 2] | 0;
   $68($7_1 + 40 | 0 | 0) | 0;
   HEAP32[($7_1 + 24 | 0) >> 2] = HEAP32[($7_1 + 40 | 0) >> 2] | 0;
   label$4 : {
    if (!(($14_1 | 0) != (HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($7_1 + 16 | 0) >> 2] = HEAP32[($7_1 + 48 | 0) >> 2] | 0;
    HEAP32[($7_1 + 8 | 0) >> 2] = HEAP32[($7_1 + 40 | 0) >> 2] | 0;
    HEAP32[($7_1 + 20 | 0) >> 2] = ($69(HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 8 | 0) >> 2] | 0 | 0) | 0) + 1 | 0;
    $48_1 = HEAP32[($7_1 + 20 | 0) >> 2] | 0;
    $50_1 = $70(HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0;
    HEAP32[$50_1 >> 2] = (HEAP32[$50_1 >> 2] | 0) - $48_1 | 0;
    $53_1 = HEAP32[($7_1 + 20 | 0) >> 2] | 0;
    $54_1 = $70($14_1 | 0) | 0;
    HEAP32[$54_1 >> 2] = (HEAP32[$54_1 >> 2] | 0) + $53_1 | 0;
   }
   $71(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0);
   $72(HEAP32[($7_1 + 56 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0);
  }
  label$5 : {
   $65_1 = $7_1 + 64 | 0;
   if ($65_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $65_1;
  }
  return;
 }
 
 function $47($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $73($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $48($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0;
 }
 
 function $49($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $20_1 = 0, $19_1 = 0, $15_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $428($5_1 + 4 | 0 | 0) | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  $364($5_1 + 8 | 0 | 0, $4_1 + 4 | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $15_1 = $352($5_1 | 0) | 0;
  HEAP32[($350($5_1 | 0) | 0) >> 2] = $15_1;
  label$3 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $5_1 | 0;
 }
 
 function $50($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $14_1 = 0, $13_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $431($4_1 | 0) | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = 0;
  $432($4_1 + 8 | 0 | 0, $3_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $4_1 | 0;
 }
 
 function $51($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $7_1 = 0, $30_1 = 0, $31_1 = 0, $38_1 = 0, $37_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $37_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  $7_1 = $4_1 + 8 | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 28 | 0) >> 2] | 0;
  HEAP32[($4_1 + 20 | 0) >> 2] = $74($8_1 | 0) | 0;
  $75($7_1 | 0, $8_1 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
  $78(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, $77(($76($7_1 | 0) | 0) + 8 | 0 | 0) | 0 | 0, $57(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0 | 0);
  $81($8_1 | 0, $80($79($4_1 + 8 | 0 | 0) | 0 | 0) | 0 | 0, $80($79($4_1 + 8 | 0 | 0) | 0 | 0) | 0 | 0);
  $30_1 = $4_1 + 8 | 0;
  $31_1 = $70($8_1 | 0) | 0;
  HEAP32[$31_1 >> 2] = (HEAP32[$31_1 >> 2] | 0) + 1 | 0;
  $82($30_1 | 0) | 0;
  $83($30_1 | 0) | 0;
  label$3 : {
   $38_1 = $4_1 + 32 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $52($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = ($84(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + (HEAP32[($4_1 + 8 | 0) >> 2] | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $53($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $38_1 = 0, $37_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $37_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  HEAP32[($3_1 + 28 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 28 | 0) >> 2] | 0;
  label$3 : {
   if (($195($4_1 | 0) | 0) & 1 | 0) {
    break label$3
   }
   HEAP32[($3_1 + 24 | 0) >> 2] = $74($4_1 | 0) | 0;
   HEAP32[($3_1 + 20 | 0) >> 2] = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
   HEAP32[($3_1 + 16 | 0) >> 2] = $196($4_1 | 0) | 0;
   $71(HEAP32[($3_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[(HEAP32[($3_1 + 16 | 0) >> 2] | 0) >> 2] | 0 | 0);
   HEAP32[($70($4_1 | 0) | 0) >> 2] = 0;
   label$4 : {
    label$5 : while (1) {
     if (!((HEAP32[($3_1 + 20 | 0) >> 2] | 0 | 0) != (HEAP32[($3_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
      break label$4
     }
     HEAP32[($3_1 + 12 | 0) >> 2] = $63(HEAP32[($3_1 + 20 | 0) >> 2] | 0 | 0) | 0;
     HEAP32[($3_1 + 20 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 20 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
     $197(HEAP32[($3_1 + 24 | 0) >> 2] | 0 | 0, $77((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0 | 0);
     $198(HEAP32[($3_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 1 | 0);
     continue label$5;
    };
   }
   $199($4_1 | 0);
  }
  label$6 : {
   $38_1 = $3_1 + 32 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $54($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $435($3_1 + 8 | 0 | 0, HEAP32[((HEAP32[($3_1 + 4 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $55($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $56($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $435($3_1 + 8 | 0 | 0, $196(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $57($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $58($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $7_1 = 0, $8_1 = 0, $16_1 = 0, $15_1 = 0, i64toi32_i32$1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $7_1 = $436(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  i64toi32_i32$1 = HEAP32[($7_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[$7_1 >> 2] | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = i64toi32_i32$1;
  $8_1 = 8;
  HEAP32[($5_1 + $8_1 | 0) >> 2] = HEAP32[($7_1 + $8_1 | 0) >> 2] | 0;
  $437(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $16_1 = $4_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $5_1 | 0;
 }
 
 function $59($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $8_1 = 0, $26_1 = 0, $25_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  $8_1 = 0;
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $12_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  HEAP32[$12_1 >> 2] = $8_1;
  $361($360(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0);
  $362($12_1 + 4 | 0 | 0, $4_1 + 24 | 0 | 0) | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $8_1;
  $364($12_1 + 8 | 0 | 0, $4_1 + 12 | 0 | 0, $363(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $21_1 = $352($12_1 | 0) | 0;
  HEAP32[($350($12_1 | 0) | 0) >> 2] = $21_1;
  label$3 : {
   $26_1 = $4_1 + 48 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return $12_1 | 0;
 }
 
 function $60($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $225(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $226($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $61($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $227(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $226($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $62($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $40_1 = 0, $39_1 = 0, $31_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $39_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $39_1;
  }
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = $365($6_1 | 0) | 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($216($5_1 + 40 | 0 | 0, $5_1 + 32 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($5_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
    $226($5_1 + 16 | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0;
    $31_1 = $217($5_1 + 40 | 0 | 0) | 0;
    HEAP32[$5_1 >> 2] = $366($6_1 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $31_1 | 0) | 0;
    $219($5_1 + 40 | 0 | 0) | 0;
    continue label$4;
   };
  }
  label$5 : {
   $40_1 = $5_1 + 48 | 0;
   if ($40_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $40_1;
  }
  return;
 }
 
 function $63($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $202(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $64($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $10_1 = $851(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $84(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, $89(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $65($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $160($4_1 | 0, $159($4_1 | 0) | 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $4_1 | 0;
 }
 
 function $66($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = HEAP32[((HEAP32[$4_1 >> 2] | 0) + 4 | 0) >> 2] | 0;
  return $4_1 | 0;
 }
 
 function $67($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $11_1 = (($451(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $68($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = HEAP32[(HEAP32[$4_1 >> 2] | 0) >> 2] | 0;
  return $4_1 | 0;
 }
 
 function $69($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = HEAP32[($4_1 + 32 | 0) >> 2] | 0;
  $21_1 = $452(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $25_1 = $4_1 + 48 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $70($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $204((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $71($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  HEAP32[(HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) >> 2] = HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  return;
 }
 
 function $72($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[((HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  HEAP32[((HEAP32[($5_1 + 4 | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  return;
 }
 
 function $73($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $53($4_1 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $74($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $201((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $75($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $9_1 = 0, $19_1 = 0, $18_1 = 0, $14_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  $8_1 = $5_1 + 8 | 0;
  $9_1 = 1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $454(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, $9_1 | 0) | 0;
  HEAP32[(HEAP32[($5_1 + 16 | 0) >> 2] | 0) >> 2] = 0;
  $14_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
  $455($8_1 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, $9_1 | 0) | 0;
  $456($0_1 | 0, $14_1 | 0, $8_1 | 0) | 0;
  label$3 : {
   $19_1 = $5_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $76($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($459(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $77($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $78($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $458(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $79($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($459(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $80($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $202(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $81($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $18_1 = 0, $17_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $17_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $7_1 = $196($6_1 | 0) | 0;
  HEAP32[((HEAP32[($5_1 + 4 | 0) >> 2] | 0) + 4 | 0) >> 2] = $7_1;
  HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] = HEAP32[$6_1 >> 2] | 0;
  HEAP32[((HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  label$3 : {
   $18_1 = $5_1 + 16 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return;
 }
 
 function $82($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[($460($5_1 | 0) | 0) >> 2] | 0;
  HEAP32[($460($5_1 | 0) | 0) >> 2] = 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $83($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $461($5_1 | 0, 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $84($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $441($440(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $85($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $32_1 = 0, $36_1 = 0, $46_1 = 0, $59_1 = 0, $62_1 = 0, $77_1 = 0, $76_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $76_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $76_1;
  }
  $6_1 = 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP8[($5_1 + 27 | 0) >> 0] = $2_1;
  HEAP8[($5_1 + 26 | 0) >> 0] = 0 & 1 | 0;
  $31($0_1 | 0) | 0;
  HEAP32[($0_1 + 12 | 0) >> 2] = $6_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $6_1;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0) >>> 0 < (($86($1_1 | 0) | 0) >>> 1 | 0) >>> 0 & 1 | 0)) {
     break label$3
    }
    HEAP8[($5_1 + 19 | 0) >> 0] = HEAPU8[($87($1_1 | 0, (HEAP32[($5_1 + 20 | 0) >> 2] | 0) << 1 | 0 | 0) | 0) >> 0] | 0;
    HEAP8[($5_1 + 18 | 0) >> 0] = HEAPU8[($87($1_1 | 0, ((HEAP32[($5_1 + 20 | 0) >> 2] | 0) << 1 | 0) + 1 | 0 | 0) | 0) >> 0] | 0;
    $32_1 = 24;
    $36_1 = 24;
    label$5 : {
     label$6 : {
      if (!((((HEAPU8[($5_1 + 19 | 0) >> 0] | 0) << $32_1 | 0) >> $32_1 | 0 | 0) == (((HEAPU8[($5_1 + 27 | 0) >> 0] | 0) << $36_1 | 0) >> $36_1 | 0 | 0) & 1 | 0)) {
       break label$6
      }
      $46_1 = 24;
      if (!((((HEAPU8[($5_1 + 18 | 0) >> 0] | 0) << $46_1 | 0) >> $46_1 | 0 | 0) == (72 | 0) & 1 | 0)) {
       break label$6
      }
      HEAP32[($0_1 + 12 | 0) >> 2] = (HEAP32[($0_1 + 12 | 0) >> 2] | 0) + 1 | 0;
      break label$5;
     }
     $59_1 = 24;
     $62_1 = 24;
     $711($0_1 | 0, ((HEAPU8[($5_1 + 19 | 0) >> 0] | 0) << $59_1 | 0) >> $59_1 | 0 | 0, ((HEAPU8[($5_1 + 18 | 0) >> 0] | 0) << $62_1 | 0) >> $62_1 | 0 | 0);
    }
    HEAP32[($5_1 + 20 | 0) >> 2] = (HEAP32[($5_1 + 20 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  HEAP8[($5_1 + 26 | 0) >> 0] = 1 & 1 | 0;
  label$7 : {
   if ((HEAPU8[($5_1 + 26 | 0) >> 0] | 0) & 1 | 0) {
    break label$7
   }
   $88($0_1 | 0) | 0;
  }
  label$8 : {
   $77_1 = $5_1 + 32 | 0;
   if ($77_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $77_1;
  }
  return;
 }
 
 function $86($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $89(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $87($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = ($90(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + (HEAP32[($4_1 + 8 | 0) >> 2] | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $88($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $43($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $89($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!(($442($4_1 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $9_1 = $443($4_1 | 0) | 0;
    break label$3;
   }
   $9_1 = $444($4_1 | 0) | 0;
  }
  $11_1 = $9_1;
  label$5 : {
   $15_1 = $3_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $90($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!(($442($4_1 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $9_1 = $476($4_1 | 0) | 0;
    break label$3;
   }
   $9_1 = $477($4_1 | 0) | 0;
  }
  $11_1 = $9_1;
  label$5 : {
   $15_1 = $3_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $91($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $36_1 = 0, $50_1 = 0, $12_1 = 0, $15_1 = 0, $22_1 = 0, $26_1 = 0, $48_1 = 0, $65_1 = 0, $83_1 = 0, $102_1 = 0, $101_1 = 0, $28_1 = 0;
  $6_1 = global$0 - 144 | 0;
  label$1 : {
   $101_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $101_1;
  }
  $12_1 = $6_1 + 104 | 0;
  HEAP32[($6_1 + 140 | 0) >> 2] = $0_1;
  HEAP8[($6_1 + 139 | 0) >> 0] = $2_1;
  HEAP8[($6_1 + 138 | 0) >> 0] = $3_1;
  $814($12_1 | 0, $1_1 | 0) | 0;
  $15_1 = 24;
  $85($6_1 + 120 | 0 | 0, $12_1 | 0, ((HEAPU8[($6_1 + 139 | 0) >> 0] | 0) << $15_1 | 0) >> $15_1 | 0 | 0);
  $832($6_1 + 104 | 0 | 0) | 0;
  $22_1 = 24;
  $26_1 = 0;
  HEAP32[($6_1 + 92 | 0) >> 2] = $710(((HEAPU8[($6_1 + 139 | 0) >> 0] | 0) << $22_1 | 0) >> $22_1 | 0 | 0) | 0;
  HEAP32[($6_1 + 88 | 0) >> 2] = HEAP32[($6_1 + 92 | 0) >> 2] | 0;
  $28_1 = HEAPU8[($6_1 + 138 | 0) >> 0] | 0;
  HEAP8[($6_1 + 75 | 0) >> 0] = $26_1 & 1 | 0;
  HEAP8[($6_1 + 59 | 0) >> 0] = $26_1 & 1 | 0;
  label$3 : {
   label$4 : {
    if (!($28_1 & 1 | 0)) {
     break label$4
    }
    $36_1 = $768(8 | 0) | 0;
    HEAP32[($6_1 + 76 | 0) >> 2] = $36_1;
    HEAP8[($6_1 + 75 | 0) >> 0] = 1 & 1 | 0;
    HEAP32[($6_1 + 64 | 0) >> 2] = HEAP32[($6_1 + 88 | 0) >> 2] | 0;
    $92($36_1 | 0, HEAP32[($6_1 + 64 | 0) >> 2] | 0 | 0) | 0;
    $48_1 = $36_1;
    break label$3;
   }
   $50_1 = $768(8 | 0) | 0;
   HEAP32[($6_1 + 60 | 0) >> 2] = $50_1;
   HEAP8[($6_1 + 59 | 0) >> 0] = 1 & 1 | 0;
   HEAP32[($6_1 + 48 | 0) >> 2] = HEAP32[($6_1 + 88 | 0) >> 2] | 0;
   $93($50_1 | 0, HEAP32[($6_1 + 48 | 0) >> 2] | 0 | 0) | 0;
   $48_1 = $50_1;
  }
  $65_1 = $6_1 + 80 | 0;
  $94($65_1 | 0, $48_1 | 0) | 0;
  $32($6_1 + 32 | 0 | 0) | 0;
  HEAP32[(0 + 6188 | 0) >> 2] = 0;
  $83_1 = $6_1 + 32 | 0;
  HEAPF64[($6_1 + 24 | 0) >> 3] = +$33($6_1 + 120 | 0 | 0, $6_1 + 32 | 0 | 0, HEAP32[($6_1 + 132 | 0) >> 2] | 0 | 0, $95($65_1 | 0) | 0 | 0, 0 | 0, 1 | 0);
  HEAPF64[$0_1 >> 3] = +HEAPF64[($6_1 + 24 | 0) >> 3];
  HEAP32[($6_1 + 16 | 0) >> 2] = $35($83_1 | 0) | 0;
  HEAP32[($6_1 + 8 | 0) >> 2] = $36($83_1 | 0) | 0;
  $96($0_1 + 8 | 0 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $47($6_1 + 32 | 0 | 0) | 0;
  $97($6_1 + 80 | 0 | 0) | 0;
  $88($6_1 + 120 | 0 | 0) | 0;
  label$5 : {
   $102_1 = $6_1 + 144 | 0;
   if ($102_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $102_1;
  }
  return;
 }
 
 function $92($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $19_1 = 0, $18_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $18_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $12_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  $98($12_1 | 0) | 0;
  HEAP32[$12_1 >> 2] = 1116 + 8 | 0;
  HEAP32[($12_1 + 4 | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $19_1 = $4_1 + 16 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $12_1 | 0;
 }
 
 function $93($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $19_1 = 0, $18_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $18_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $12_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  $98($12_1 | 0) | 0;
  HEAP32[$12_1 >> 2] = 1572 + 8 | 0;
  HEAP32[($12_1 + 4 | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $19_1 = $4_1 + 16 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $12_1 | 0;
 }
 
 function $94($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $99($8_1 | 0, $4_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $95($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($100(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $96($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $18_1 = 0, $51_1 = 0, $50_1 = 0, $47_1 = 0;
  $5_1 = global$0 - 64 | 0;
  label$1 : {
   $50_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $50_1;
  }
  HEAP32[($5_1 + 56 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 48 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  $18_1 = HEAP32[($5_1 + 44 | 0) >> 2] | 0;
  HEAP32[($5_1 + 60 | 0) >> 2] = $18_1;
  $101($18_1 | 0) | 0;
  HEAP32[($5_1 + 32 | 0) >> 2] = HEAP32[($5_1 + 56 | 0) >> 2] | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = HEAP32[($5_1 + 48 | 0) >> 2] | 0;
  HEAP32[($5_1 + 40 | 0) >> 2] = $102(HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   if (!((HEAP32[($5_1 + 40 | 0) >> 2] | 0) >>> 0 > 0 >>> 0 & 1 | 0)) {
    break label$3
   }
   $103($18_1 | 0, HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0);
   HEAP32[($5_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 56 | 0) >> 2] | 0;
   HEAP32[$5_1 >> 2] = HEAP32[($5_1 + 48 | 0) >> 2] | 0;
   $104($18_1 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0, HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0);
  }
  $47_1 = HEAP32[($5_1 + 60 | 0) >> 2] | 0;
  label$4 : {
   $51_1 = $5_1 + 64 | 0;
   if ($51_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $51_1;
  }
  return $47_1 | 0;
 }
 
 function $97($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $105($5_1 | 0, 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $98($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$8_1 >> 2] = 1204 + 8 | 0;
  return $8_1 | 0;
 }
 
 function $99($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $480($5_1 | 0, $479(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $100($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $486(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $101($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $14_1 = 0, $13_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $487($4_1 | 0) | 0;
  $8_1 = 0;
  HEAP32[$4_1 >> 2] = $8_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $8_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $8_1;
  $488($4_1 + 8 | 0 | 0, $3_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $4_1 | 0;
 }
 
 function $102($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = HEAP32[($4_1 + 32 | 0) >> 2] | 0;
  $21_1 = $489(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $25_1 = $4_1 + 48 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $103($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $16_1 = 0, $26_1 = 0, $25_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0) >>> 0 > ($490($5_1 | 0) | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $864($5_1 | 0);
   abort();
  }
  $16_1 = $492($491($5_1 | 0) | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = $16_1;
  HEAP32[$5_1 >> 2] = $16_1;
  $21_1 = (HEAP32[$5_1 >> 2] | 0) + Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 12) | 0;
  HEAP32[($493($5_1 | 0) | 0) >> 2] = $21_1;
  $494($5_1 | 0, 0 | 0);
  label$4 : {
   $26_1 = $4_1 + 16 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return;
 }
 
 function $104($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $20_1 = 0, $9_1 = 0, $33_1 = 0, $32_1 = 0, $23_1 = 0;
  $6_1 = global$0 - 48 | 0;
  label$1 : {
   $32_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $32_1;
  }
  $9_1 = $6_1 + 16 | 0;
  HEAP32[($6_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 32 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 24 | 0) >> 2] = $3_1;
  $20_1 = HEAP32[($6_1 + 28 | 0) >> 2] | 0;
  HEAP32[($6_1 + 20 | 0) >> 2] = $491($20_1 | 0) | 0;
  $495($9_1 | 0, $20_1 | 0, HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $23_1 = HEAP32[($6_1 + 20 | 0) >> 2] | 0;
  HEAP32[($6_1 + 8 | 0) >> 2] = HEAP32[($6_1 + 40 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($6_1 + 32 | 0) >> 2] | 0;
  $496($23_1 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[$6_1 >> 2] | 0 | 0, $20_1 + 4 | 0 | 0);
  $497($9_1 | 0);
  label$3 : {
   $33_1 = $6_1 + 48 | 0;
   if ($33_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  return;
 }
 
 function $105($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $22_1 = 0, $21_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $21_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($481($6_1 | 0) | 0) >> 2] | 0;
  $9_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  HEAP32[($481($6_1 | 0) | 0) >> 2] = $9_1;
  label$3 : {
   if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $483($482($6_1 | 0) | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  label$4 : {
   $22_1 = $4_1 + 16 | 0;
   if ($22_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  return;
 }
 
 function $106() {
  FUNCTION_TABLE[2](6192) | 0;
  return;
 }
 
 function $107($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $6_1 = 0, $23_1 = 0, $22_1 = 0, $13_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $22_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  $6_1 = $3_1 + 16 | 0;
  HEAP32[($3_1 + 28 | 0) >> 2] = $0_1;
  $13_1 = HEAP32[($3_1 + 28 | 0) >> 2] | 0;
  $108(1061 | 0, 3 | 0);
  $109(1066 | 0);
  $110($6_1 | 0, 1081 | 0) | 0;
  $112($111($6_1 | 0, 1096 | 0, 0 | 0) | 0 | 0, 1105 | 0, 8 | 0) | 0;
  $113($3_1 + 16 | 0 | 0) | 0;
  label$3 : {
   $23_1 = $3_1 + 32 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $13_1 | 0;
 }
 
 function $108($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $19_1 = 0, $18_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  $7_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 4;
  $9_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $10_1 = $115($7_1 | 0) | 0;
  $11_1 = $116($7_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$2($9_1 | 0, $10_1 | 0, $11_1 | 0, $117() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
  label$3 : {
   $19_1 = $4_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $109($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $4_1 = 0, $81_1 = 0, $80_1 = 0, $8_1 = 0, $15_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0, $20_1 = 0, $21_1 = 0, $23_1 = 0, $24_1 = 0, $26_1 = 0, $27_1 = 0, $28_1 = 0, $36_1 = 0, $38_1 = 0, $204_1 = 0, $40_1 = 0, $41_1 = 0, $43_1 = 0, $44_1 = 0, $45_1 = 0, $232_1 = 0, $49_1 = 0, $249_1 = 0, $51_1 = 0, $52_1 = 0, $54_1 = 0, $55_1 = 0, $56_1 = 0, $277_1 = 0, $58_1 = 0, $291_1 = 0, $60_1 = 0, $61_1 = 0, $63_1 = 0, $64_1 = 0, $65_1 = 0, $319_1 = 0, $73_1 = 0;
  $3_1 = global$0 - 256 | 0;
  label$1 : {
   $80_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $80_1;
  }
  HEAP32[($3_1 + 80 | 0) >> 2] = $0_1;
  $4_1 = 0;
  HEAP32[($3_1 + 76 | 0) >> 2] = $4_1;
  HEAP32[($3_1 + 72 | 0) >> 2] = 5;
  HEAP32[($3_1 + 68 | 0) >> 2] = $4_1;
  HEAP32[($3_1 + 64 | 0) >> 2] = 6;
  HEAP32[($3_1 + 60 | 0) >> 2] = $4_1;
  HEAP32[($3_1 + 56 | 0) >> 2] = 7;
  $8_1 = HEAP32[($3_1 + 80 | 0) >> 2] | 0;
  HEAP32[($3_1 + 104 | 0) >> 2] = $3_1 + 48 | 0;
  HEAP32[($3_1 + 100 | 0) >> 2] = $8_1;
  $121();
  HEAP32[($3_1 + 96 | 0) >> 2] = 8;
  HEAP32[($3_1 + 92 | 0) >> 2] = $123() | 0;
  HEAP32[($3_1 + 88 | 0) >> 2] = $124() | 0;
  HEAP32[($3_1 + 84 | 0) >> 2] = 9;
  $15_1 = $126() | 0;
  $16_1 = $127() | 0;
  $17_1 = $128() | 0;
  $18_1 = $129() | 0;
  HEAP32[($3_1 + 108 | 0) >> 2] = HEAP32[($3_1 + 96 | 0) >> 2] | 0;
  $20_1 = $130() | 0;
  $21_1 = HEAP32[($3_1 + 96 | 0) >> 2] | 0;
  HEAP32[($3_1 + 112 | 0) >> 2] = HEAP32[($3_1 + 92 | 0) >> 2] | 0;
  $23_1 = $131() | 0;
  $24_1 = HEAP32[($3_1 + 92 | 0) >> 2] | 0;
  HEAP32[($3_1 + 116 | 0) >> 2] = HEAP32[($3_1 + 88 | 0) >> 2] | 0;
  $26_1 = $131() | 0;
  $27_1 = HEAP32[($3_1 + 88 | 0) >> 2] | 0;
  $28_1 = HEAP32[($3_1 + 100 | 0) >> 2] | 0;
  HEAP32[($3_1 + 120 | 0) >> 2] = HEAP32[($3_1 + 84 | 0) >> 2] | 0;
  fimport$3($15_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $20_1 | 0, $21_1 | 0, $23_1 | 0, $24_1 | 0, $26_1 | 0, $27_1 | 0, $28_1 | 0, $132() | 0 | 0, HEAP32[($3_1 + 84 | 0) >> 2] | 0 | 0);
  HEAP32[($3_1 + 124 | 0) >> 2] = $3_1 + 48 | 0;
  HEAP32[($3_1 + 132 | 0) >> 2] = HEAP32[($3_1 + 124 | 0) >> 2] | 0;
  HEAP32[($3_1 + 128 | 0) >> 2] = 10;
  $36_1 = HEAP32[($3_1 + 132 | 0) >> 2] | 0;
  $134(HEAP32[($3_1 + 128 | 0) >> 2] | 0 | 0);
  $38_1 = HEAP32[($3_1 + 72 | 0) >> 2] | 0;
  HEAP32[($3_1 + 44 | 0) >> 2] = HEAP32[($3_1 + 76 | 0) >> 2] | 0;
  HEAP32[($3_1 + 40 | 0) >> 2] = $38_1;
  i64toi32_i32$0 = HEAP32[($3_1 + 40 | 0) >> 2] | 0;
  i64toi32_i32$1 = HEAP32[($3_1 + 44 | 0) >> 2] | 0;
  $204_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $3_1;
  HEAP32[($3_1 + 136 | 0) >> 2] = $204_1;
  HEAP32[($3_1 + 140 | 0) >> 2] = i64toi32_i32$1;
  $40_1 = HEAP32[($3_1 + 136 | 0) >> 2] | 0;
  $41_1 = HEAP32[($3_1 + 140 | 0) >> 2] | 0;
  HEAP32[($3_1 + 164 | 0) >> 2] = $36_1;
  HEAP32[($3_1 + 160 | 0) >> 2] = 1818;
  HEAP32[($3_1 + 156 | 0) >> 2] = $41_1;
  HEAP32[($3_1 + 152 | 0) >> 2] = $40_1;
  $43_1 = HEAP32[($3_1 + 164 | 0) >> 2] | 0;
  $44_1 = HEAP32[($3_1 + 160 | 0) >> 2] | 0;
  $45_1 = HEAP32[($3_1 + 152 | 0) >> 2] | 0;
  HEAP32[($3_1 + 148 | 0) >> 2] = HEAP32[($3_1 + 156 | 0) >> 2] | 0;
  HEAP32[($3_1 + 144 | 0) >> 2] = $45_1;
  i64toi32_i32$1 = HEAP32[($3_1 + 144 | 0) >> 2] | 0;
  i64toi32_i32$0 = HEAP32[($3_1 + 148 | 0) >> 2] | 0;
  $232_1 = i64toi32_i32$1;
  i64toi32_i32$1 = $3_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $232_1;
  HEAP32[($3_1 + 12 | 0) >> 2] = i64toi32_i32$0;
  $135($44_1 | 0, $3_1 + 8 | 0 | 0);
  $49_1 = HEAP32[($3_1 + 64 | 0) >> 2] | 0;
  HEAP32[($3_1 + 36 | 0) >> 2] = HEAP32[($3_1 + 68 | 0) >> 2] | 0;
  HEAP32[($3_1 + 32 | 0) >> 2] = $49_1;
  i64toi32_i32$0 = HEAP32[($3_1 + 32 | 0) >> 2] | 0;
  i64toi32_i32$1 = HEAP32[($3_1 + 36 | 0) >> 2] | 0;
  $249_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $3_1;
  HEAP32[($3_1 + 168 | 0) >> 2] = $249_1;
  HEAP32[($3_1 + 172 | 0) >> 2] = i64toi32_i32$1;
  $51_1 = HEAP32[($3_1 + 168 | 0) >> 2] | 0;
  $52_1 = HEAP32[($3_1 + 172 | 0) >> 2] | 0;
  HEAP32[($3_1 + 196 | 0) >> 2] = $43_1;
  HEAP32[($3_1 + 192 | 0) >> 2] = 1828;
  HEAP32[($3_1 + 188 | 0) >> 2] = $52_1;
  HEAP32[($3_1 + 184 | 0) >> 2] = $51_1;
  $54_1 = HEAP32[($3_1 + 196 | 0) >> 2] | 0;
  $55_1 = HEAP32[($3_1 + 192 | 0) >> 2] | 0;
  $56_1 = HEAP32[($3_1 + 184 | 0) >> 2] | 0;
  HEAP32[($3_1 + 180 | 0) >> 2] = HEAP32[($3_1 + 188 | 0) >> 2] | 0;
  HEAP32[($3_1 + 176 | 0) >> 2] = $56_1;
  i64toi32_i32$1 = HEAP32[($3_1 + 176 | 0) >> 2] | 0;
  i64toi32_i32$0 = HEAP32[($3_1 + 180 | 0) >> 2] | 0;
  $277_1 = i64toi32_i32$1;
  i64toi32_i32$1 = $3_1;
  HEAP32[$3_1 >> 2] = $277_1;
  HEAP32[($3_1 + 4 | 0) >> 2] = i64toi32_i32$0;
  $136($55_1 | 0, $3_1 | 0);
  $58_1 = HEAP32[($3_1 + 56 | 0) >> 2] | 0;
  HEAP32[($3_1 + 28 | 0) >> 2] = HEAP32[($3_1 + 60 | 0) >> 2] | 0;
  HEAP32[($3_1 + 24 | 0) >> 2] = $58_1;
  i64toi32_i32$0 = HEAP32[($3_1 + 24 | 0) >> 2] | 0;
  i64toi32_i32$1 = HEAP32[($3_1 + 28 | 0) >> 2] | 0;
  $291_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $3_1;
  HEAP32[($3_1 + 200 | 0) >> 2] = $291_1;
  HEAP32[($3_1 + 204 | 0) >> 2] = i64toi32_i32$1;
  $60_1 = HEAP32[($3_1 + 200 | 0) >> 2] | 0;
  $61_1 = HEAP32[($3_1 + 204 | 0) >> 2] | 0;
  HEAP32[($3_1 + 228 | 0) >> 2] = $54_1;
  HEAP32[($3_1 + 224 | 0) >> 2] = 1835;
  HEAP32[($3_1 + 220 | 0) >> 2] = $61_1;
  HEAP32[($3_1 + 216 | 0) >> 2] = $60_1;
  $63_1 = HEAP32[($3_1 + 228 | 0) >> 2] | 0;
  $64_1 = HEAP32[($3_1 + 224 | 0) >> 2] | 0;
  $65_1 = HEAP32[($3_1 + 216 | 0) >> 2] | 0;
  HEAP32[($3_1 + 212 | 0) >> 2] = HEAP32[($3_1 + 220 | 0) >> 2] | 0;
  HEAP32[($3_1 + 208 | 0) >> 2] = $65_1;
  i64toi32_i32$1 = HEAP32[($3_1 + 208 | 0) >> 2] | 0;
  i64toi32_i32$0 = HEAP32[($3_1 + 212 | 0) >> 2] | 0;
  $319_1 = i64toi32_i32$1;
  i64toi32_i32$1 = $3_1;
  HEAP32[($3_1 + 16 | 0) >> 2] = $319_1;
  HEAP32[($3_1 + 20 | 0) >> 2] = i64toi32_i32$0;
  $137($64_1 | 0, $3_1 + 16 | 0 | 0);
  HEAP32[($3_1 + 240 | 0) >> 2] = $63_1;
  HEAP32[($3_1 + 236 | 0) >> 2] = 1840;
  HEAP32[($3_1 + 232 | 0) >> 2] = 12;
  $73_1 = HEAP32[($3_1 + 240 | 0) >> 2] | 0;
  $140(HEAP32[($3_1 + 236 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 232 | 0) >> 2] | 0 | 0);
  HEAP32[($3_1 + 252 | 0) >> 2] = $73_1;
  HEAP32[($3_1 + 248 | 0) >> 2] = 1844;
  HEAP32[($3_1 + 244 | 0) >> 2] = 11;
  $141(HEAP32[($3_1 + 248 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 244 | 0) >> 2] | 0 | 0);
  label$3 : {
   $81_1 = $3_1 + 256 | 0;
   if ($81_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $81_1;
  }
  return;
 }
 
 function $110($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $19_1 = 0, $18_1 = 0, $8_1 = 0, $9_1 = 0, $11_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  $7_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  $144($7_1 | 0) | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = 14;
  HEAP32[($4_1 + 8 | 0) >> 2] = 13;
  $8_1 = $145() | 0;
  $9_1 = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $11_1 = $146() | 0;
  $12_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  fimport$4($8_1 | 0, $9_1 | 0, $11_1 | 0, $12_1 | 0, $132() | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $19_1 = $4_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $7_1 | 0;
 }
 
 function $111($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $27_1 = 0, $26_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0, $14_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $26_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  $8_1 = $5_1 + 12 | 0;
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $11_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = 16;
  HEAP32[($5_1 + 4 | 0) >> 2] = 15;
  $12_1 = $145() | 0;
  $13_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
  $14_1 = $149() | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  $16_1 = $150() | 0;
  $17_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  $18_1 = $151($8_1 | 0) | 0;
  $19_1 = $149() | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  fimport$5($12_1 | 0, $13_1 | 0, $14_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $19_1 | 0, $152() | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, $151($8_1 | 0) | 0 | 0);
  label$3 : {
   $27_1 = $5_1 + 32 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return $11_1 | 0;
 }
 
 function $112($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $27_1 = 0, $26_1 = 0, $11_1 = 0, $12_1 = 0, $13_1 = 0, $14_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $26_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  $8_1 = $5_1 + 12 | 0;
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $11_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = 18;
  HEAP32[($5_1 + 4 | 0) >> 2] = 17;
  $12_1 = $145() | 0;
  $13_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
  $14_1 = $126() | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  $16_1 = $155() | 0;
  $17_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  $18_1 = $156($8_1 | 0) | 0;
  $19_1 = $126() | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  fimport$5($12_1 | 0, $13_1 | 0, $14_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $19_1 | 0, $157() | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, $156($8_1 | 0) | 0 | 0);
  label$3 : {
   $27_1 = $5_1 + 32 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return $11_1 | 0;
 }
 
 function $113($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  fimport$6($145() | 0 | 0);
  $158($4_1 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $4_1 | 0;
 }
 
 function $114($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $14_1 = 0, $28_1 = 0, $46_1 = 0, $45_1 = 0, $11_1 = 0, $36_1 = 0;
  $6_1 = global$0 - 64 | 0;
  label$1 : {
   $45_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $45_1;
  }
  HEAP32[($6_1 + 60 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 56 | 0) >> 2] = $1_1;
  HEAP8[($6_1 + 55 | 0) >> 0] = $2_1;
  HEAP8[($6_1 + 54 | 0) >> 0] = $3_1;
  $11_1 = HEAP32[($6_1 + 60 | 0) >> 2] | 0;
  $538($6_1 + 8 | 0 | 0, HEAP32[($6_1 + 56 | 0) >> 2] | 0 | 0);
  $14_1 = 24;
  $28_1 = 24;
  FUNCTION_TABLE[$11_1]($6_1 + 24 | 0, $6_1 + 8 | 0, (($539(((HEAPU8[($6_1 + 55 | 0) >> 0] | 0) << $14_1 | 0) >> $14_1 | 0 | 0) | 0) << $28_1 | 0) >> $28_1 | 0, ($540((HEAPU8[($6_1 + 54 | 0) >> 0] | 0) & 1 | 0 | 0) | 0) & 1 | 0);
  $36_1 = $541($6_1 + 24 | 0 | 0) | 0;
  $542($6_1 + 24 | 0 | 0) | 0;
  $832($6_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $46_1 = $6_1 + 64 | 0;
   if ($46_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $46_1;
  }
  return $36_1 | 0;
 }
 
 function $115($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 4 | 0;
 }
 
 function $116($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $543() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $117() {
  return 1812 | 0;
 }
 
 function $118($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $27_1 = 0, $26_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $26_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) != (HEAP32[($493($5_1 | 0) | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$4
    }
    $495($4_1 | 0, $5_1 | 0, 1 | 0) | 0;
    $555($491($5_1 | 0) | 0 | 0, $525(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
    $497($4_1 | 0);
    HEAP32[($5_1 + 4 | 0) >> 2] = (HEAP32[($5_1 + 4 | 0) >> 2] | 0) + 12 | 0;
    break label$3;
   }
   $556($5_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  }
  label$5 : {
   $27_1 = $4_1 + 16 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return;
 }
 
 function $119($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $34_1 = 0, $33_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $33_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $120($6_1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[$5_1 >> 2] | 0) >>> 0 < (HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
     break label$4
    }
    $557($6_1 | 0, (HEAP32[($5_1 + 8 | 0) >> 2] | 0) - (HEAP32[$5_1 >> 2] | 0) | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
    break label$3;
   }
   label$5 : {
    if (!((HEAP32[$5_1 >> 2] | 0) >>> 0 > (HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
     break label$5
    }
    $558($6_1 | 0, (HEAP32[$6_1 >> 2] | 0) + Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, 12) | 0 | 0);
   }
  }
  label$6 : {
   $34_1 = $5_1 + 16 | 0;
   if ($34_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $34_1;
  }
  return;
 }
 
 function $120($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  return ((HEAP32[($4_1 + 4 | 0) >> 2] | 0) - (HEAP32[$4_1 >> 2] | 0) | 0 | 0) / (12 | 0) | 0 | 0;
 }
 
 function $121() {
  return;
 }
 
 function $122($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $598(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $123() {
  return 0 | 0;
 }
 
 function $124() {
  return 0 | 0;
 }
 
 function $125($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (($5_1 | 0) == (0 | 0) & 1 | 0) {
    break label$3
   }
   $547($5_1 | 0) | 0;
   $769($5_1 | 0);
  }
  label$4 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $126() {
  return $599() | 0 | 0;
 }
 
 function $127() {
  return $600() | 0 | 0;
 }
 
 function $128() {
  return $601() | 0 | 0;
 }
 
 function $129() {
  return 0 | 0;
 }
 
 function $130() {
  return 2332 | 0;
 }
 
 function $131() {
  return 2335 | 0;
 }
 
 function $132() {
  return 2337 | 0;
 }
 
 function $133() {
  var $1_1 = 0;
  $1_1 = $768(12 | 0) | 0;
  $602($1_1 | 0) | 0;
  return $1_1 | 0;
 }
 
 function $134($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $6_1 = 0, $18_1 = 0, $17_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $17_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  $6_1 = $3_1 + 16 | 0;
  HEAP32[($3_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 12 | 0) >> 2] = 19;
  $8_1 = $126() | 0;
  $9_1 = $604($6_1 | 0) | 0;
  $10_1 = $605($6_1 | 0) | 0;
  HEAP32[($3_1 + 28 | 0) >> 2] = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  fimport$9($8_1 | 0, $9_1 | 0, $10_1 | 0, $130() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 24 | 0) >> 2] | 0 | 0);
  label$3 : {
   $18_1 = $3_1 + 32 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return;
 }
 
 function $135($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $26_1 = 0, $25_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  $11_1 = $4_1 + 8 | 0;
  $13_1 = HEAP32[$1_1 >> 2] | 0;
  $14_1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $14_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $13_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 20;
  $15_1 = $126() | 0;
  $16_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $17_1 = $609($11_1 | 0) | 0;
  $18_1 = $610($11_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$10($15_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $157() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $611($4_1 + 16 | 0 | 0) | 0 | 0, 0 | 0);
  label$3 : {
   $26_1 = $4_1 + 32 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return;
 }
 
 function $136($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $26_1 = 0, $25_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  $11_1 = $4_1 + 8 | 0;
  $13_1 = HEAP32[$1_1 >> 2] | 0;
  $14_1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $14_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $13_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 21;
  $15_1 = $126() | 0;
  $16_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $17_1 = $615($11_1 | 0) | 0;
  $18_1 = $616($11_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$10($15_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $617() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $618($4_1 + 16 | 0 | 0) | 0 | 0, 0 | 0);
  label$3 : {
   $26_1 = $4_1 + 32 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return;
 }
 
 function $137($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $26_1 = 0, $25_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0, $17_1 = 0, $18_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  $11_1 = $4_1 + 8 | 0;
  $13_1 = HEAP32[$1_1 >> 2] | 0;
  $14_1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $14_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $13_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 22;
  $15_1 = $126() | 0;
  $16_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $17_1 = $622($11_1 | 0) | 0;
  $18_1 = $623($11_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$10($15_1 | 0, $16_1 | 0, $17_1 | 0, $18_1 | 0, $155() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $624($4_1 + 16 | 0 | 0) | 0 | 0, 0 | 0);
  label$3 : {
   $26_1 = $4_1 + 32 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return;
 }
 
 function $138($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $16_1 = 0, $15_1 = 0, $7_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $7_1 = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  $837($562(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, $7_1 | 0) | 0;
  $12_1 = 1 & 1 | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $139($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $20_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 4 | 0) >> 2] | 0) >>> 0 < ($120(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0) >>> 0 & 1 | 0)) {
     break label$4
    }
    $560($0_1 | 0, $559(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
    break label$3;
   }
   $561($0_1 | 0);
  }
  label$5 : {
   $20_1 = $5_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return;
 }
 
 function $140($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $24_1 = 0, $23_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $23_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  $11_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 23;
  $13_1 = $126() | 0;
  $14_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $15_1 = $629($11_1 | 0) | 0;
  $16_1 = $630($11_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$10($13_1 | 0, $14_1 | 0, $15_1 | 0, $16_1 | 0, $631() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $632($4_1 + 20 | 0 | 0) | 0 | 0, 0 | 0);
  label$3 : {
   $24_1 = $4_1 + 32 | 0;
   if ($24_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  return;
 }
 
 function $141($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $24_1 = 0, $23_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $23_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  $11_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = 24;
  $13_1 = $126() | 0;
  $14_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  $15_1 = $648($11_1 | 0) | 0;
  $16_1 = $649($11_1 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  fimport$10($13_1 | 0, $14_1 | 0, $15_1 | 0, $16_1 | 0, $117() | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, $650($4_1 + 20 | 0 | 0) | 0 | 0, 0 | 0);
  label$3 : {
   $24_1 = $4_1 + 32 | 0;
   if ($24_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  return;
 }
 
 function $142($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (($5_1 | 0) == (0 | 0) & 1 | 0) {
    break label$3
   }
   $542($5_1 | 0) | 0;
   $769($5_1 | 0);
  }
  label$4 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $143() {
  var i64toi32_i32$1 = 0, $1_1 = 0, i64toi32_i32$0 = 0, $6_1 = 0;
  $1_1 = $768(24 | 0) | 0;
  i64toi32_i32$0 = 0;
  $6_1 = 0;
  i64toi32_i32$1 = $1_1;
  HEAP32[i64toi32_i32$1 >> 2] = $6_1;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$1 = i64toi32_i32$1 + 16 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $6_1;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$1 = $1_1 + 8 | 0;
  HEAP32[i64toi32_i32$1 >> 2] = $6_1;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  $653($1_1 | 0) | 0;
  return $1_1 | 0;
 }
 
 function $144($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $145() {
  return $654() | 0 | 0;
 }
 
 function $146() {
  return 2480 | 0;
 }
 
 function $147($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = +$2_1;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0, $15_1 = 0.0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAPF64[$5_1 >> 3] = $2_1;
  $15_1 = +$656(+(+HEAPF64[$5_1 >> 3]));
  HEAPF64[((HEAP32[($5_1 + 8 | 0) >> 2] | 0) + (HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0) | 0) >> 3] = $15_1;
  label$3 : {
   $13_1 = $5_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $148($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $13_1 = 0.0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $13_1 = +$655((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) | 0 | 0);
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return +$13_1;
 }
 
 function $149() {
  return $657() | 0 | 0;
 }
 
 function $150() {
  return 2482 | 0;
 }
 
 function $151($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(4 | 0) | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $152() {
  return 2486 | 0;
 }
 
 function $153($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $15_1 = 0, $14_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $7_1 = $633(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $659((HEAP32[($5_1 + 8 | 0) >> 2] | 0) + (HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0) | 0 | 0, $7_1 | 0) | 0;
  label$3 : {
   $15_1 = $5_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return;
 }
 
 function $154($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $9_1 = $658((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) | 0 | 0) | 0;
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $155() {
  return 2400 | 0;
 }
 
 function $156($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(4 | 0) | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $157() {
  return 2356 | 0;
 }
 
 function $158($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $159($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($165(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $160($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $29_1 = 0, $28_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $28_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $160($6_1 | 0, HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0);
   $160($6_1 | 0, HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0);
   HEAP32[($4_1 + 4 | 0) >> 2] = $161($6_1 | 0) | 0;
   $163(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, $162((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 16 | 0 | 0) | 0 | 0);
   $164(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 1 | 0);
  }
  label$4 : {
   $29_1 = $4_1 + 16 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return;
 }
 
 function $161($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $166((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $162($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $168($26(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $163($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $167(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 32 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $164($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $169(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $165($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $191($194((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $166($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $170(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $167($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $171(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $4_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $168($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $169($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $186(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 4 | 0) >> 2] | 0) << 5 | 0 | 0, 4 | 0);
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $170($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $171($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $172($4_1 + 4 | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $172($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $173($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $173($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $175($4_1 | 0, $174($4_1 | 0) | 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $4_1 | 0;
 }
 
 function $174($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($180(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $175($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $29_1 = 0, $28_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $28_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $175($6_1 | 0, HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0);
   $175($6_1 | 0, HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0);
   HEAP32[($4_1 + 4 | 0) >> 2] = $176($6_1 | 0) | 0;
   $178(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, $177((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 13 | 0 | 0) | 0 | 0);
   $179(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 1 | 0);
  }
  label$4 : {
   $29_1 = $4_1 + 16 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return;
 }
 
 function $176($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $181((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $177($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $183(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $178($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $182(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 32 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $179($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $184(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $180($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $191($190((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $181($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $185(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $182($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  return;
 }
 
 function $183($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $184($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $186(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 4 | 0) >> 2] | 0) << 4 | 0 | 0, 4 | 0);
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $185($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $186($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $187(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $187($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $188(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $11_1 = $5_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return;
 }
 
 function $188($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $189(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $9_1 = $4_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $189($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $769(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $190($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $193(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $191($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $192(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $192($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $193($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $194($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $193(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $195($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $12_1 = (HEAP32[($200(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0;
  label$3 : {
   $16_1 = $3_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $196($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $203($202(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $197($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $205(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 32 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $198($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $206(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $199($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return;
 }
 
 function $200($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $207((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $201($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $209(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $202($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $210(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $203($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $204($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $212(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $205($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $832(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $4_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $206($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $186(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, Math_imul(HEAP32[($5_1 + 4 | 0) >> 2] | 0, 20) | 0, 4 | 0);
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $207($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $208(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $208($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $209($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $210($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $211(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $211($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $212($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $213($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $20_1 = 0, $158_1 = 0.0, $27_1 = 0, $45_1 = 0, $183_1 = 0.0, $190_1 = 0.0, $197_1 = 0.0, $204_1 = 0.0, $211_1 = 0.0, $146_1 = 0, $154_1 = 0, $153_1 = 0, $5_1 = 0, $227_1 = 0.0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $153_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $153_1;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $682(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $684($5_1 + 4 | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  $15_1 = (HEAP32[$1_1 >> 2] | 0) + -1 | 0;
  label$3 : {
   label$4 : {
    if ($15_1 >>> 0 > 9 >>> 0) {
     break label$4
    }
    label$5 : {
     switch ($15_1 | 0) {
     default:
      $20_1 = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -12 | 0;
      label$14 : {
       if ($20_1 >>> 0 > 2 >>> 0) {
        break label$14
       }
       label$15 : {
        switch ($20_1 | 0) {
        case 2:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -1.0;
         break label$3;
        case 1:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -.2;
         break label$3;
        default:
         break label$15;
        };
       }
       HEAPF64[($4_1 + 24 | 0) >> 3] = -.1;
       break label$3;
      }
      $158_1 = +(0 | 0);
      HEAPF64[($4_1 + 24 | 0) >> 3] = +$29(+$158_1, +(11.0), +(1.3), +$158_1, +(+(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 1:
      $27_1 = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -11 | 0;
      label$18 : {
       if ($27_1 >>> 0 > 3 >>> 0) {
        break label$18
       }
       label$19 : {
        switch ($27_1 | 0) {
        case 3:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -1.0;
         break label$3;
        case 2:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -.9;
         break label$3;
        case 1:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -.8;
         break label$3;
        default:
         break label$19;
        };
       }
       HEAPF64[($4_1 + 24 | 0) >> 3] = -.5;
       break label$3;
      }
      HEAPF64[($4_1 + 24 | 0) >> 3] = +$29(+(+(0 | 0)), +(10.0), +(1.0), +(-.1), +(+(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 2:
     case 3:
      label$23 : {
       if ((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) <= (12 | 0) & 1 | 0) {
        break label$23
       }
       fimport$1(1228 | 0, 1036 | 0, 191 | 0, 1240 | 0);
       abort();
      }
      $45_1 = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -10 | 0;
      label$24 : {
       if ($45_1 >>> 0 > 2 >>> 0) {
        break label$24
       }
       label$25 : {
        switch ($45_1 | 0) {
        case 2:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -.9;
         break label$3;
        case 1:
         HEAPF64[($4_1 + 24 | 0) >> 3] = -.8;
         break label$3;
        default:
         break label$25;
        };
       }
       HEAPF64[($4_1 + 24 | 0) >> 3] = -.6;
       break label$3;
      }
      HEAPF64[($4_1 + 24 | 0) >> 3] = +$29(+(+(0 | 0)), +(9.0), +(1.0), +(-.3), +(+(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 4:
      label$28 : {
       label$29 : {
        if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
         break label$29
        }
        if ((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) <= (10 | 0) & 1 | 0) {
         break label$28
        }
       }
       fimport$1(1249 | 0, 1036 | 0, 204 | 0, 1240 | 0);
       abort();
      }
      $183_1 = 1.0;
      HEAPF64[($4_1 + 24 | 0) >> 3] = .6 * +$29(+$183_1, +(10.0), +$183_1, +(-1.0), +(+(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 5:
      label$30 : {
       label$31 : {
        if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
         break label$31
        }
        if ((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) <= (12 | 0) & 1 | 0) {
         break label$30
        }
       }
       fimport$1(1285 | 0, 1036 | 0, 208 | 0, 1240 | 0);
       abort();
      }
      $190_1 = 1.0;
      HEAPF64[($4_1 + 24 | 0) >> 3] = .4 * +$29(+$190_1, +(12.0), +$190_1, +(-1.0), +(+(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 6:
      label$32 : {
       label$33 : {
        if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
         break label$33
        }
        if ((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) <= (13 | 0) & 1 | 0) {
         break label$32
        }
       }
       fimport$1(1321 | 0, 1036 | 0, 212 | 0, 1240 | 0);
       abort();
      }
      $197_1 = 1.0;
      HEAPF64[($4_1 + 24 | 0) >> 3] = .3 * +$29(+$197_1, +(13.0), +$197_1, +(-1.0), +(+(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 8:
      label$34 : {
       label$35 : {
        if (!((HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0) >= (6 | 0) & 1 | 0)) {
         break label$35
        }
        $204_1 = -1.9;
        break label$34;
       }
       label$36 : {
        label$37 : {
         if (!((HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0) == (5 | 0) & 1 | 0)) {
          break label$37
         }
         $211_1 = +$29(+(+(0 | 0)), +(12.0), +(-1.5), +(-1.7), +(+(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0)));
         break label$36;
        }
        $211_1 = +$29(+(+(0 | 0)), +(12.0), +(-1.0), +(-1.3), +(+(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0)));
       }
       $204_1 = $211_1;
      }
      HEAPF64[($4_1 + 24 | 0) >> 3] = $204_1;
      break label$3;
     case 7:
      label$38 : {
       label$39 : {
        if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
         break label$39
        }
        if ((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) <= (10 | 0) & 1 | 0) {
         break label$38
        }
       }
       fimport$1(1249 | 0, 1036 | 0, 221 | 0, 1240 | 0);
       abort();
      }
      HEAPF64[($4_1 + 24 | 0) >> 3] = +$29(+(5.0), +(14.0), +(-1.3), +(-1.5), +(+(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0)));
      break label$3;
     case 9:
      break label$5;
     };
    }
    HEAPF64[($4_1 + 24 | 0) >> 3] = -2.0;
    break label$3;
   }
   $146_1 = fimport$7(8 | 0) | 0;
   $214($146_1 | 0, 1357 | 0) | 0;
   fimport$8($146_1 | 0, 3532 | 0, 25 | 0);
   abort();
  }
  $227_1 = +HEAPF64[($4_1 + 24 | 0) >> 3];
  label$40 : {
   $154_1 = $4_1 + 32 | 0;
   if ($154_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $154_1;
  }
  return +$227_1;
 }
 
 function $214($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $14_1 = 0, $13_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $9_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $773($9_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$9_1 >> 2] = 3488 + 8 | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $9_1 | 0;
 }
 
 function $215($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $46_1 = 0, $67_1 = 0, $66_1 = 0, $9_1 = 0, $52_1 = 0, $68_1 = 0.0;
  $5_1 = global$0 - 128 | 0;
  label$1 : {
   $66_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $66_1;
  }
  HEAP32[($5_1 + 124 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 120 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 116 | 0) >> 2] = $2_1;
  $9_1 = HEAP32[($5_1 + 124 | 0) >> 2] | 0;
  $1044($5_1 + 48 | 0 | 0, 0 | 0, 68 | 0) | 0;
  HEAP32[($5_1 + 44 | 0) >> 2] = HEAP32[($5_1 + 120 | 0) >> 2] | 0;
  HEAP32[($5_1 + 40 | 0) >> 2] = $60(HEAP32[($5_1 + 44 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 32 | 0) >> 2] = $61(HEAP32[($5_1 + 44 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($216($5_1 + 40 | 0 | 0, $5_1 + 32 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    $218($5_1 + 16 | 0 | 0, $217($5_1 + 40 | 0 | 0) | 0 | 0) | 0;
    label$5 : {
     if ((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) <= (16 | 0) & 1 | 0) {
      break label$5
     }
     fimport$1(1388 | 0, 1036 | 0, 234 | 0, 1412 | 0);
     abort();
    }
    $46_1 = $5_1 + 16 | 0;
    $52_1 = $18($46_1 + 4 | 0 | 0) | 0;
    HEAP32[(($5_1 + 48 | 0) + ((HEAP32[($5_1 + 16 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] = $52_1;
    $171($46_1 | 0) | 0;
    $219($5_1 + 40 | 0 | 0) | 0;
    continue label$4;
   };
  }
  $68_1 = +$220($9_1 | 0, $5_1 + 48 | 0 | 0, HEAP32[($5_1 + 116 | 0) >> 2] | 0 | 0);
  label$6 : {
   $67_1 = $5_1 + 128 | 0;
   if ($67_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $67_1;
  }
  return +$68_1;
 }
 
 function $216($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $9_1 = ($228(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $217($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $230($229(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $218($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $16_1 = 0, $15_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0;
  $231($5_1 + 4 | 0 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $16_1 = $4_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $5_1 | 0;
 }
 
 function $219($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $232($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $220($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $7_1 = 0, $20_1 = 0, $50_1 = 0, $72_1 = 0, $82_1 = 0, $99_1 = 0, $283_1 = 0.0, $113_1 = 0, $177_1 = 0, $199_1 = 0, $218_1 = 0, $246_1 = 0, $259_1 = 0, $269_1 = 0, $268_1 = 0, $49_1 = 0, $421_1 = 0, $277_1 = 0.0, $81_1 = 0, $503_1 = 0, $280_1 = 0.0, $98_1 = 0, $550_1 = 0, $109_1 = 0, $176_1 = 0, $709_1 = 0, $289_1 = 0.0, $292_1 = 0.0, $198_1 = 0, $767_1 = 0, $294_1 = 0.0, $297_1 = 0.0, $217_1 = 0, $821_1 = 0, $299_1 = 0.0, $307_1 = 0.0;
  $5_1 = global$0 - 256 | 0;
  label$1 : {
   $268_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $268_1;
  }
  HEAP32[($5_1 + 244 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 240 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 236 | 0) >> 2] = $2_1;
  $7_1 = HEAP32[($5_1 + 244 | 0) >> 2] | 0;
  label$3 : {
   if ((HEAP32[($5_1 + 236 | 0) >> 2] | 0 | 0) >= (0 | 0) & 1 | 0) {
    break label$3
   }
   fimport$1(1494 | 0, 1036 | 0, 242 | 0, 1509 | 0);
   abort();
  }
  label$4 : {
   label$5 : {
    if (HEAP32[($5_1 + 236 | 0) >> 2] | 0) {
     break label$5
    }
    $20_1 = 0;
    HEAP32[($5_1 + 232 | 0) >> 2] = $20_1;
    HEAPF64[($5_1 + 224 | 0) >> 3] = +($20_1 | 0);
    HEAP32[($5_1 + 220 | 0) >> 2] = 1;
    label$6 : {
     label$7 : while (1) {
      if (!((HEAP32[($5_1 + 220 | 0) >> 2] | 0 | 0) <= (13 | 0) & 1 | 0)) {
       break label$6
      }
      label$8 : {
       if (!((HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 220 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0 | 0) == (3 | 0) & 1 | 0)) {
        break label$8
       }
       HEAP32[($5_1 + 232 | 0) >> 2] = (HEAP32[($5_1 + 232 | 0) >> 2] | 0) + 1 | 0;
       $680($5_1 + 208 | 0 | 0, 3 | 0, HEAP32[($5_1 + 220 | 0) >> 2] | 0 | 0);
       $49_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
       $50_1 = 8;
       HEAP32[($5_1 + $50_1 | 0) >> 2] = HEAP32[(($5_1 + 208 | 0) + $50_1 | 0) >> 2] | 0;
       i64toi32_i32$0 = HEAP32[($5_1 + 208 | 0) >> 2] | 0;
       i64toi32_i32$1 = HEAP32[($5_1 + 212 | 0) >> 2] | 0;
       $421_1 = i64toi32_i32$0;
       i64toi32_i32$0 = $5_1;
       HEAP32[$5_1 >> 2] = $421_1;
       HEAP32[($5_1 + 4 | 0) >> 2] = i64toi32_i32$1;
       $277_1 = +FUNCTION_TABLE[$49_1]($7_1, $5_1);
       HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + $277_1;
      }
      HEAP32[($5_1 + 220 | 0) >> 2] = (HEAP32[($5_1 + 220 | 0) >> 2] | 0) + 1 | 0;
      continue label$7;
     };
    }
    HEAP32[($5_1 + 204 | 0) >> 2] = 1;
    label$9 : {
     label$10 : while (1) {
      if (!((HEAP32[($5_1 + 204 | 0) >> 2] | 0 | 0) <= (13 | 0) & 1 | 0)) {
       break label$9
      }
      $72_1 = HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 204 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0;
      label$11 : {
       label$12 : {
        if ($72_1 >>> 0 > 3 >>> 0) {
         break label$12
        }
        label$13 : {
         switch ($72_1 | 0) {
         case 1:
          $680($5_1 + 184 | 0 | 0, 1 | 0, HEAP32[($5_1 + 204 | 0) >> 2] | 0 | 0);
          $81_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
          $82_1 = 8;
          HEAP32[(($5_1 + 32 | 0) + $82_1 | 0) >> 2] = HEAP32[(($5_1 + 184 | 0) + $82_1 | 0) >> 2] | 0;
          i64toi32_i32$1 = HEAP32[($5_1 + 184 | 0) >> 2] | 0;
          i64toi32_i32$0 = HEAP32[($5_1 + 188 | 0) >> 2] | 0;
          $503_1 = i64toi32_i32$1;
          i64toi32_i32$1 = $5_1;
          HEAP32[($5_1 + 32 | 0) >> 2] = $503_1;
          HEAP32[($5_1 + 36 | 0) >> 2] = i64toi32_i32$0;
          $280_1 = +FUNCTION_TABLE[$81_1]($7_1, $5_1 + 32 | 0);
          HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + $280_1;
          break label$11;
         case 2:
          $680($5_1 + 168 | 0 | 0, 2 | 0, HEAP32[($5_1 + 204 | 0) >> 2] | 0 | 0);
          $98_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
          $99_1 = 8;
          HEAP32[(($5_1 + 48 | 0) + $99_1 | 0) >> 2] = HEAP32[(($5_1 + 168 | 0) + $99_1 | 0) >> 2] | 0;
          i64toi32_i32$0 = HEAP32[($5_1 + 168 | 0) >> 2] | 0;
          i64toi32_i32$1 = HEAP32[($5_1 + 172 | 0) >> 2] | 0;
          $550_1 = i64toi32_i32$0;
          i64toi32_i32$0 = $5_1;
          HEAP32[($5_1 + 48 | 0) >> 2] = $550_1;
          HEAP32[($5_1 + 52 | 0) >> 2] = i64toi32_i32$1;
          $283_1 = +FUNCTION_TABLE[$98_1]($7_1, $5_1 + 48 | 0);
          $109_1 = 0;
          label$17 : {
           label$18 : {
            if (!(Math_abs($283_1) < 2147483648.0)) {
             break label$18
            }
            $113_1 = ~~$283_1;
            break label$17;
           }
           $113_1 = -2147483648;
          }
          HEAP32[($5_1 + 200 | 0) >> 2] = $113_1;
          label$19 : {
           label$20 : {
            if (!((HEAP32[($5_1 + 200 | 0) >> 2] | 0 | 0) > ($109_1 | 0) & 1 | 0)) {
             break label$20
            }
            if (!((HEAP32[($5_1 + 232 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
             break label$20
            }
            HEAP32[($5_1 + 232 | 0) >> 2] = (HEAP32[($5_1 + 232 | 0) >> 2] | 0) + -1 | 0;
            break label$19;
           }
           HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + +(HEAP32[($5_1 + 200 | 0) >> 2] | 0 | 0);
          }
          break label$11;
         case 3:
          break label$11;
         default:
          break label$13;
         };
        }
        break label$11;
       }
       label$21 : {
        if ((HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 204 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0 | 0) >= (0 | 0) & 1 | 0) {
         break label$21
        }
        fimport$1(1526 | 0, 1036 | 0, 274 | 0, 1509 | 0);
        abort();
       }
       label$22 : {
        if ((HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 204 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0 | 0) <= (10 | 0) & 1 | 0) {
         break label$22
        }
        fimport$1(1548 | 0, 1036 | 0, 276 | 0, 1509 | 0);
        abort();
       }
       $681($5_1 + 152 | 0 | 0, HEAP32[($5_1 + 204 | 0) >> 2] | 0 | 0, HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 204 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0 | 0);
       $176_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
       $177_1 = 8;
       HEAP32[(($5_1 + 16 | 0) + $177_1 | 0) >> 2] = HEAP32[(($5_1 + 152 | 0) + $177_1 | 0) >> 2] | 0;
       i64toi32_i32$1 = HEAP32[($5_1 + 152 | 0) >> 2] | 0;
       i64toi32_i32$0 = HEAP32[($5_1 + 156 | 0) >> 2] | 0;
       $709_1 = i64toi32_i32$1;
       i64toi32_i32$1 = $5_1;
       HEAP32[($5_1 + 16 | 0) >> 2] = $709_1;
       HEAP32[($5_1 + 20 | 0) >> 2] = i64toi32_i32$0;
       $289_1 = +FUNCTION_TABLE[$176_1]($7_1, $5_1 + 16 | 0);
       HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + $289_1;
      }
      HEAP32[($5_1 + 204 | 0) >> 2] = (HEAP32[($5_1 + 204 | 0) >> 2] | 0) + 1 | 0;
      continue label$10;
     };
    }
    $292_1 = +(HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + 60 | 0) >> 2] | 0 | 0);
    $680($5_1 + 136 | 0 | 0, 1 | 0, 15 | 0);
    $198_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
    $199_1 = 8;
    HEAP32[(($5_1 + 64 | 0) + $199_1 | 0) >> 2] = HEAP32[(($5_1 + 136 | 0) + $199_1 | 0) >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($5_1 + 136 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($5_1 + 140 | 0) >> 2] | 0;
    $767_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $5_1;
    HEAP32[($5_1 + 64 | 0) >> 2] = $767_1;
    HEAP32[($5_1 + 68 | 0) >> 2] = i64toi32_i32$1;
    $294_1 = $292_1 * +FUNCTION_TABLE[$198_1]($7_1, $5_1 + 64 | 0);
    HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + $294_1;
    $297_1 = +(HEAP32[((HEAP32[($5_1 + 240 | 0) >> 2] | 0) + 64 | 0) >> 2] | 0 | 0);
    $680($5_1 + 120 | 0 | 0, 1 | 0, 16 | 0);
    $217_1 = HEAP32[(HEAP32[$7_1 >> 2] | 0) >> 2] | 0;
    $218_1 = 8;
    HEAP32[(($5_1 + 80 | 0) + $218_1 | 0) >> 2] = HEAP32[(($5_1 + 120 | 0) + $218_1 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($5_1 + 120 | 0) >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($5_1 + 124 | 0) >> 2] | 0;
    $821_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $5_1;
    HEAP32[($5_1 + 80 | 0) >> 2] = $821_1;
    HEAP32[($5_1 + 84 | 0) >> 2] = i64toi32_i32$0;
    $299_1 = $297_1 * +FUNCTION_TABLE[$217_1]($7_1, $5_1 + 80 | 0);
    HEAPF64[($5_1 + 224 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3] + $299_1;
    HEAPF64[($5_1 + 248 | 0) >> 3] = +HEAPF64[($5_1 + 224 | 0) >> 3];
    break label$4;
   }
   HEAPF64[($5_1 + 112 | 0) >> 3] = 1.0e7;
   HEAP32[($5_1 + 108 | 0) >> 2] = 1;
   label$23 : {
    label$24 : while (1) {
     if (!((HEAP32[($5_1 + 108 | 0) >> 2] | 0 | 0) <= (13 | 0) & 1 | 0)) {
      break label$23
     }
     $246_1 = (HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 108 | 0) >> 2] | 0) << 2 | 0) | 0;
     HEAP32[$246_1 >> 2] = (HEAP32[$246_1 >> 2] | 0) + 1 | 0;
     HEAPF64[($5_1 + 96 | 0) >> 3] = +$220($7_1 | 0, HEAP32[($5_1 + 240 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 236 | 0) >> 2] | 0) - 1 | 0 | 0);
     HEAPF64[($5_1 + 112 | 0) >> 3] = +HEAPF64[($233($5_1 + 112 | 0 | 0, $5_1 + 96 | 0 | 0) | 0) >> 3];
     $259_1 = (HEAP32[($5_1 + 240 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 108 | 0) >> 2] | 0) << 2 | 0) | 0;
     HEAP32[$259_1 >> 2] = (HEAP32[$259_1 >> 2] | 0) + -1 | 0;
     HEAP32[($5_1 + 108 | 0) >> 2] = (HEAP32[($5_1 + 108 | 0) >> 2] | 0) + 1 | 0;
     continue label$24;
    };
   }
   HEAPF64[($5_1 + 248 | 0) >> 3] = +HEAPF64[($5_1 + 112 | 0) >> 3];
  }
  $307_1 = +HEAPF64[($5_1 + 248 | 0) >> 3];
  label$25 : {
   $269_1 = $5_1 + 256 | 0;
   if ($269_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $269_1;
  }
  return +$307_1;
 }
 
 function $221($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $222($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $222($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $223($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $221($4_1 | 0) | 0;
  $769($4_1 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $224($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  abort();
 }
 
 function $225($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $235($3_1 + 8 | 0 | 0, HEAP32[($234(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $226($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[$8_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $8_1 | 0;
 }
 
 function $227($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $235($3_1 + 8 | 0 | 0, $165(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $228($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $11_1 = (($236(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $229($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $238(($237(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 16 | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $230($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $231($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $24_1 = 0, $23_1 = 0, $13_1 = 0;
  $4_1 = global$0 - 64 | 0;
  label$1 : {
   $23_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  HEAP32[($4_1 + 60 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 56 | 0) >> 2] = $1_1;
  $11_1 = HEAP32[($4_1 + 60 | 0) >> 2] | 0;
  $13_1 = $240(HEAP32[($4_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  $241(HEAP32[($4_1 + 56 | 0) >> 2] | 0 | 0);
  $242($4_1 + 40 | 0 | 0);
  $243($11_1 | 0, $13_1 | 0, $4_1 + 48 | 0 | 0) | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $244(HEAP32[($4_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $245(HEAP32[($4_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  $246($11_1 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $24_1 = $4_1 + 64 | 0;
   if ($24_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  return $11_1 | 0;
 }
 
 function $232($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $280(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $233($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $340(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $234($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $235($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $236($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $237($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $238($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $239(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $239($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $240($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $247((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $241($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $250($3_1 + 8 | 0 | 0, $249(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $242($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 28 | 0) >> 2] = $0_1;
  $248(HEAP32[($3_1 + 28 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 32 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $243($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $9_1 = 0, $12_1 = 0, $25_1 = 0, $24_1 = 0, $20_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $24_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  $9_1 = 0;
  $12_1 = $5_1 + 8 | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $13_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[$13_1 >> 2] = $9_1;
  $251($12_1 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0;
  $252($13_1 + 4 | 0 | 0, $12_1 | 0) | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = $9_1;
  $253($13_1 + 8 | 0 | 0, $5_1 + 4 | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $20_1 = $254($13_1 | 0) | 0;
  HEAP32[($255($13_1 | 0) | 0) >> 2] = $20_1;
  label$3 : {
   $25_1 = $5_1 + 32 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $13_1 | 0;
 }
 
 function $244($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $261(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $245($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $262(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $246($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $36_1 = 0, $35_1 = 0, $27_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $35_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $35_1;
  }
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = $256($6_1 | 0) | 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($257($5_1 + 40 | 0 | 0, $5_1 + 32 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($5_1 + 16 | 0) >> 2] = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
    $27_1 = $258($5_1 + 40 | 0 | 0) | 0;
    HEAP32[($5_1 + 8 | 0) >> 2] = $259($6_1 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $27_1 | 0) | 0;
    $260($5_1 + 40 | 0 | 0) | 0;
    continue label$4;
   };
  }
  label$5 : {
   $36_1 = $5_1 + 48 | 0;
   if ($36_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  return;
 }
 
 function $247($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $263(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $248($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 4 | 0) >> 2] = $0_1;
  return;
 }
 
 function $249($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $264((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $250($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $251($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $252($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  $266($5_1 | 0) | 0;
  $268($5_1 | 0, $267(HEAP32[$4_1 >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $253($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $270($6_1 | 0, $269(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $272($6_1 | 0, $271(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $6_1 | 0;
 }
 
 function $254($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $191($273((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $255($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $256($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $245(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $257($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $11_1 = (($276(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $258($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = ($279(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 13 | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $259($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $20_1 = 0, $19_1 = 0, $10_1 = 0, $13_1 = 0, $16_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $19_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
  $10_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
  $13_1 = $277(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = $278($10_1 | 0, HEAP32[$5_1 >> 2] | 0 | 0, $13_1 | 0) | 0;
  $16_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $20_1 = $5_1 + 32 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $260($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $280(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $261($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $339($3_1 + 8 | 0 | 0, HEAP32[($338(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $262($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $339($3_1 + 8 | 0 | 0, $180(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $263($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $264($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $265(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $265($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $266($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $274($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $267($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $268($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $267(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $269($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $270($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($269(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $271($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $272($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $271(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $273($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $275(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $274($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = 0;
  return $5_1 | 0;
 }
 
 function $275($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $276($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $277($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $278($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $15_1 = 0, $30_1 = 0, $8_1 = 0, $42_1 = 0, $41_1 = 0, $22_1 = 0, $38_1 = 0;
  $5_1 = global$0 - 64 | 0;
  label$1 : {
   $41_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $41_1;
  }
  $8_1 = $5_1 + 24 | 0;
  HEAP32[($5_1 + 48 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $2_1;
  $15_1 = HEAP32[($5_1 + 44 | 0) >> 2] | 0;
  $281($8_1 | 0, $15_1 | 0, $277(HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP32[($5_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 48 | 0) >> 2] | 0;
  $22_1 = $283(($282($8_1 | 0) | 0) + 13 | 0 | 0) | 0;
  $30_1 = $5_1 + 24 | 0;
  HEAP32[($5_1 + 16 | 0) >> 2] = $284($15_1 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $5_1 + 20 | 0 | 0, $22_1 | 0) | 0;
  $286($15_1 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $285($30_1 | 0) | 0 | 0);
  $288($5_1 + 56 | 0 | 0, $287($30_1 | 0) | 0 | 0) | 0;
  $289($30_1 | 0) | 0;
  $38_1 = HEAP32[($5_1 + 56 | 0) >> 2] | 0;
  label$3 : {
   $42_1 = $5_1 + 64 | 0;
   if ($42_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $42_1;
  }
  return $38_1 | 0;
 }
 
 function $279($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $280($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $29_1 = 0, $28_1 = 0, $25_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $28_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  label$3 : {
   label$4 : {
    if (!((HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = $337(HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) | 0;
    break label$3;
   }
   label$5 : {
    label$6 : while (1) {
     if (!((($328(HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0)) {
      break label$5
     }
     HEAP32[($3_1 + 8 | 0) >> 2] = $329(HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) | 0;
     continue label$6;
    };
   }
   HEAP32[($3_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0;
  }
  $25_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$7 : {
   $29_1 = $3_1 + 16 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return $25_1 | 0;
 }
 
 function $281($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $9_1 = 0, $38_1 = 0, $37_1 = 0, $16_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $37_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  $8_1 = $5_1 + 16 | 0;
  $9_1 = 0;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $176(HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  HEAP8[($5_1 + 31 | 0) >> 0] = $9_1 & 1 | 0;
  $16_1 = $290(HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, 1 | 0) | 0;
  $291($8_1 | 0, HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, $9_1 & 1 | 0 | 0) | 0;
  $292($0_1 | 0, $16_1 | 0, $8_1 | 0) | 0;
  $293(HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, $177(($282($0_1 | 0) | 0) + 13 | 0 | 0) | 0 | 0, $277(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP8[(($294($0_1 | 0) | 0) + 4 | 0) >> 0] = 1;
  HEAP8[($5_1 + 31 | 0) >> 0] = 1 & 1 | 0;
  label$3 : {
   if ((HEAPU8[($5_1 + 31 | 0) >> 0] | 0) & 1 | 0) {
    break label$3
   }
   $289($0_1 | 0) | 0;
  }
  label$4 : {
   $38_1 = $5_1 + 48 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $282($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($303(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $283($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $284($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $14_1 = 0, $13_1 = 0, $20_1 = 0, $36_1 = 0, $39_1 = 0, $49_1 = 0, $90_1 = 0, $89_1 = 0, $86_1 = 0;
  $6_1 = global$0 - 64 | 0;
  label$1 : {
   $89_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $89_1;
  }
  $13_1 = $6_1 + 40 | 0;
  HEAP32[($6_1 + 56 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 52 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 48 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 44 | 0) >> 2] = $3_1;
  $14_1 = HEAP32[($6_1 + 52 | 0) >> 2] | 0;
  HEAP32[($6_1 + 32 | 0) >> 2] = $295($14_1 | 0) | 0;
  $296($13_1 | 0, HEAP32[($6_1 + 32 | 0) >> 2] | 0 | 0) | 0;
  $20_1 = 1;
  label$3 : {
   if (($276($6_1 + 56 | 0 | 0, $13_1 | 0) | 0) & 1 | 0) {
    break label$3
   }
   $20_1 = ($298($297($14_1 | 0) | 0 | 0, $258($6_1 + 56 | 0 | 0) | 0 | 0, HEAP32[($6_1 + 44 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0;
  }
  label$4 : {
   label$5 : {
    if (!($20_1 & 1 | 0)) {
     break label$5
    }
    $36_1 = $6_1 + 24 | 0;
    $39_1 = $6_1 + 16 | 0;
    HEAP32[$36_1 >> 2] = HEAP32[($6_1 + 56 | 0) >> 2] | 0;
    HEAP32[($6_1 + 8 | 0) >> 2] = $299($14_1 | 0) | 0;
    $296($39_1 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0;
    $49_1 = 1;
    label$6 : {
     if (($276($36_1 | 0, $39_1 | 0) | 0) & 1 | 0) {
      break label$6
     }
     $49_1 = ($298($297($14_1 | 0) | 0 | 0, HEAP32[($6_1 + 44 | 0) >> 2] | 0 | 0, $258($300($6_1 + 24 | 0 | 0) | 0 | 0) | 0 | 0) | 0) ^ -1 | 0;
    }
    label$7 : {
     if (!($49_1 & 1 | 0)) {
      break label$7
     }
     label$8 : {
      if (!((HEAP32[(HEAP32[($6_1 + 56 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
       break label$8
      }
      HEAP32[(HEAP32[($6_1 + 48 | 0) >> 2] | 0) >> 2] = HEAP32[($6_1 + 56 | 0) >> 2] | 0;
      HEAP32[($6_1 + 60 | 0) >> 2] = HEAP32[(HEAP32[($6_1 + 48 | 0) >> 2] | 0) >> 2] | 0;
      break label$4;
     }
     HEAP32[(HEAP32[($6_1 + 48 | 0) >> 2] | 0) >> 2] = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
     HEAP32[($6_1 + 60 | 0) >> 2] = (HEAP32[($6_1 + 24 | 0) >> 2] | 0) + 4 | 0;
     break label$4;
    }
    HEAP32[($6_1 + 60 | 0) >> 2] = $301($14_1 | 0, HEAP32[($6_1 + 48 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 44 | 0) >> 2] | 0 | 0) | 0;
    break label$4;
   }
   HEAP32[($6_1 + 60 | 0) >> 2] = $302($14_1 | 0, HEAP32[($6_1 + 48 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 44 | 0) >> 2] | 0 | 0) | 0;
  }
  $86_1 = HEAP32[($6_1 + 60 | 0) >> 2] | 0;
  label$9 : {
   $90_1 = $6_1 + 64 | 0;
   if ($90_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $90_1;
  }
  return $86_1 | 0;
 }
 
 function $285($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($303(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $286($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $8_1 = 0, $7_1 = 0, $31_1 = 0, $38_1 = 0, $37_1 = 0, $25_1 = 0;
  $6_1 = global$0 - 16 | 0;
  label$1 : {
   $37_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  $7_1 = 0;
  HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$6_1 >> 2] = $3_1;
  $8_1 = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
  HEAP32[(HEAP32[$6_1 >> 2] | 0) >> 2] = $7_1;
  HEAP32[((HEAP32[$6_1 >> 2] | 0) + 4 | 0) >> 2] = $7_1;
  HEAP32[((HEAP32[$6_1 >> 2] | 0) + 8 | 0) >> 2] = HEAP32[($6_1 + 8 | 0) >> 2] | 0;
  HEAP32[(HEAP32[($6_1 + 4 | 0) >> 2] | 0) >> 2] = HEAP32[$6_1 >> 2] | 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($255($8_1 | 0) | 0) >> 2] | 0) >> 2] | 0 | 0) != ($7_1 | 0) & 1 | 0)) {
    break label$3
   }
   $25_1 = HEAP32[(HEAP32[($255($8_1 | 0) | 0) >> 2] | 0) >> 2] | 0;
   HEAP32[($255($8_1 | 0) | 0) >> 2] = $25_1;
  }
  $304(HEAP32[($254($8_1 | 0) | 0) >> 2] | 0 | 0, HEAP32[(HEAP32[($6_1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0);
  $31_1 = $305($8_1 | 0) | 0;
  HEAP32[$31_1 >> 2] = (HEAP32[$31_1 >> 2] | 0) + 1 | 0;
  label$4 : {
   $38_1 = $6_1 + 16 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $287($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[($306($5_1 | 0) | 0) >> 2] | 0;
  HEAP32[($306($5_1 | 0) | 0) >> 2] = 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $288($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $289($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $307($5_1 | 0, 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $290($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = $308(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $291($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP8[($5_1 + 7 | 0) >> 0] = $2_1;
  $7_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$7_1 >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP8[($7_1 + 4 | 0) >> 0] = (HEAPU8[($5_1 + 7 | 0) >> 0] | 0) & 1 | 0;
  return $7_1 | 0;
 }
 
 function $292($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $9_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $310($9_1 | 0, $5_1 + 8 | 0 | 0, $309(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $15_1 = $5_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $9_1 | 0;
 }
 
 function $293($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $311(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $277(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $294($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $312(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $295($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $323($3_1 + 8 | 0 | 0, $254(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $296($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $297($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $324((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $298($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $8_1 = 24;
  $13_1 = 24;
  return (((HEAPU8[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $8_1 | 0) >> $8_1 | 0 | 0) < (((HEAPU8[(HEAP32[($5_1 + 4 | 0) >> 2] | 0) >> 0] | 0) << $13_1 | 0) >> $13_1 | 0 | 0) & 1 | 0 | 0;
 }
 
 function $299($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $323($3_1 + 8 | 0 | 0, HEAP32[($255(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $300($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $325(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $301($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $7_1 = 0, $60_1 = 0, $59_1 = 0, $52_1 = 0, $56_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $59_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $59_1;
  }
  HEAP32[($5_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $2_1;
  $7_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $174($7_1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    label$5 : while (1) {
     label$6 : {
      label$7 : {
       if (!(($298($297($7_1 | 0) | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0) | 0) & 1 | 0)) {
        break label$7
       }
       label$8 : {
        label$9 : {
         if (!((HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
          break label$9
         }
         HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
         break label$8;
        }
        HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
        HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
        break label$3;
       }
       break label$6;
      }
      label$10 : {
       label$11 : {
        if (!((HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
         break label$11
        }
        HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
        break label$10;
       }
       HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
       HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0;
       break label$3;
      }
     }
     continue label$5;
    };
   }
   $52_1 = $254($7_1 | 0) | 0;
   HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = $52_1;
   HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
  }
  $56_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  label$12 : {
   $60_1 = $5_1 + 32 | 0;
   if ($60_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $60_1;
  }
  return $56_1 | 0;
 }
 
 function $302($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $7_1 = 0, $60_1 = 0, $59_1 = 0, $52_1 = 0, $56_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $59_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $59_1;
  }
  HEAP32[($5_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $2_1;
  $7_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $174($7_1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    label$5 : while (1) {
     label$6 : {
      label$7 : {
       if (!(($298($297($7_1 | 0) | 0 | 0, (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
        break label$7
       }
       label$8 : {
        label$9 : {
         if (!((HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
          break label$9
         }
         HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
         break label$8;
        }
        HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
        HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0;
        break label$3;
       }
       break label$6;
      }
      label$10 : {
       label$11 : {
        if (!((HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
         break label$11
        }
        HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
        break label$10;
       }
       HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
       HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
       break label$3;
      }
     }
     continue label$5;
    };
   }
   $52_1 = $254($7_1 | 0) | 0;
   HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = $52_1;
   HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
  }
  $56_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  label$12 : {
   $60_1 = $5_1 + 32 | 0;
   if ($60_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $60_1;
  }
  return $56_1 | 0;
 }
 
 function $303($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $330(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $304($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $21_1 = 0, $132_1 = 0, $131_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $131_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $131_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0;
  label$3 : while (1) {
   $21_1 = 0;
   label$4 : {
    if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$4
    }
    $21_1 = (HEAPU8[(($329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] | 0) ^ -1 | 0;
   }
   label$5 : {
    if (!($21_1 & 1 | 0)) {
     break label$5
    }
    label$6 : {
     label$7 : {
      if (!(($328($329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0) & 1 | 0)) {
       break label$7
      }
      HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[(($329($329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0) + 4 | 0) >> 2] | 0;
      label$8 : {
       label$9 : {
        if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
         break label$9
        }
        if ((HEAPU8[((HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0) {
         break label$9
        }
        HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
        HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
        HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
        HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0;
        HEAP8[((HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
        break label$8;
       }
       label$10 : {
        if (($328(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) & 1 | 0) {
         break label$10
        }
        HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
        $331(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
       }
       HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
       HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
       HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
       HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
       $332(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
       break label$5;
      }
      break label$6;
     }
     HEAP32[$4_1 >> 2] = HEAP32[(HEAP32[(($329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) + 8 | 0) >> 2] | 0) >> 2] | 0;
     label$11 : {
      label$12 : {
       if (!((HEAP32[$4_1 >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
        break label$12
       }
       if ((HEAPU8[((HEAP32[$4_1 >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0) {
        break label$12
       }
       HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
       HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
       HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
       HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0;
       HEAP8[((HEAP32[$4_1 >> 2] | 0) + 12 | 0) >> 0] = 1;
       break label$11;
      }
      label$13 : {
       if (!(($328(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
        break label$13
       }
       HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
       $332(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
      }
      HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
      HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
      HEAP32[($4_1 + 8 | 0) >> 2] = $329(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
      HEAP8[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
      $331(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
      break label$5;
     }
    }
    continue label$3;
   }
   break label$3;
  };
  label$14 : {
   $132_1 = $4_1 + 16 | 0;
   if ($132_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $132_1;
  }
  return;
 }
 
 function $305($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $333((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $306($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $335(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $307($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $22_1 = 0, $21_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $21_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($306($6_1 | 0) | 0) >> 2] | 0;
  $9_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  HEAP32[($306($6_1 | 0) | 0) >> 2] = $9_1;
  label$3 : {
   if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $336($312($6_1 | 0) | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  label$4 : {
   $22_1 = $4_1 + 16 | 0;
   if ($22_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  return;
 }
 
 function $308($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $23_1 = 0, $22_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $22_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 > ($313(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $314(1426 | 0);
   abort();
  }
  $19_1 = $315((HEAP32[($5_1 + 8 | 0) >> 2] | 0) << 4 | 0 | 0, 4 | 0) | 0;
  label$4 : {
   $23_1 = $5_1 + 16 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $19_1 | 0;
 }
 
 function $309($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $310($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $318($6_1 | 0, $317(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $320($6_1 + 4 | 0 | 0, $319(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $311($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $321(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $277(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $312($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $322((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $313($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 268435455 | 0;
 }
 
 function $314($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = fimport$7(8 | 0) | 0;
  $316($5_1 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  fimport$8($5_1 | 0, 3584 | 0, 25 | 0);
  abort();
 }
 
 function $315($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = $768(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $316($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $14_1 = 0, $13_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $9_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $773($9_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$9_1 >> 2] = 3544 + 8 | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $9_1 | 0;
 }
 
 function $317($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $318($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($317(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $319($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $320($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, i64toi32_i32$0 = 0, $5_1 = 0, i64toi32_i32$2 = 0, $11_1 = 0, $10_1 = 0, i64toi32_i32$1 = 0, $35_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  i64toi32_i32$2 = $319(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $35_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $5_1;
  HEAP32[i64toi32_i32$0 >> 2] = $35_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $321($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  HEAP8[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 0] = HEAPU8[($277(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 0] | 0;
  label$3 : {
   $13_1 = $5_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $322($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $323($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $324($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $326(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $325($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $28_1 = 0, $27_1 = 0, $24_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $27_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  label$3 : {
   label$4 : {
    if (!((HEAP32[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = $327(HEAP32[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) | 0;
    break label$3;
   }
   HEAP32[($3_1 + 4 | 0) >> 2] = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
   label$5 : {
    label$6 : while (1) {
     if (!(($328(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
      break label$5
     }
     HEAP32[($3_1 + 4 | 0) >> 2] = $329(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
     continue label$6;
    };
   }
   HEAP32[($3_1 + 12 | 0) >> 2] = $329(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  }
  $24_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$7 : {
   $28_1 = $3_1 + 16 | 0;
   if ($28_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  return $24_1 | 0;
 }
 
 function $326($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $327($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
    continue label$2;
   };
  }
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $328($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return (HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $329($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0 | 0;
 }
 
 function $330($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $331($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $40_1 = 0, $39_1 = 0, $30_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $39_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $39_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $334(HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  }
  HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 8 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0;
  label$4 : {
   label$5 : {
    if (!(($328(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[(HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
    break label$4;
   }
   $30_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
   HEAP32[(($329(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] = $30_1;
  }
  HEAP32[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $334(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0);
  label$6 : {
   $40_1 = $3_1 + 16 | 0;
   if ($40_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $40_1;
  }
  return;
 }
 
 function $332($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $40_1 = 0, $39_1 = 0, $30_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $39_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $39_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $334(HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  }
  HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 8 | 0) >> 2] = HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0;
  label$4 : {
   label$5 : {
    if (!(($328(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[(HEAP32[((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
    break label$4;
   }
   $30_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
   HEAP32[(($329(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] = $30_1;
  }
  HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $334(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0);
  label$6 : {
   $40_1 = $3_1 + 16 | 0;
   if ($40_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $40_1;
  }
  return;
 }
 
 function $333($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $212(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $334($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return;
 }
 
 function $335($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $336($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $27_1 = 0, $26_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $26_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAPU8[($5_1 + 4 | 0) >> 0] | 0) & 1 | 0)) {
    break label$3
   }
   $178(HEAP32[$5_1 >> 2] | 0 | 0, $177((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 13 | 0 | 0) | 0 | 0);
  }
  label$4 : {
   if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$4
   }
   $179(HEAP32[$5_1 >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 1 | 0);
  }
  label$5 : {
   $27_1 = $4_1 + 16 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return;
 }
 
 function $337($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
    continue label$2;
   };
  }
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $338($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $339($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $340($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!(($341($4_1 + 8 | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $14_1 = HEAP32[$4_1 >> 2] | 0;
    break label$3;
   }
   $14_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  }
  $16_1 = $14_1;
  label$5 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $341($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  return +HEAPF64[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 3] < +HEAPF64[(HEAP32[($5_1 + 4 | 0) >> 2] | 0) >> 3] & 1 | 0 | 0;
 }
 
 function $342($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : {
    if (((HEAP32[$1_1 >> 2] | 0) + -8 | 0) >>> 0 > 2 >>> 0) {
     break label$2
    }
    HEAPF64[($4_1 + 8 | 0) >> 3] = +(0 | 0);
    break label$1;
   }
   HEAPF64[($4_1 + 8 | 0) >> 3] = 1.0;
  }
  return +(+HEAPF64[($4_1 + 8 | 0) >> 3]);
 }
 
 function $343($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $18_1 = 0, $17_1 = 0, $19_1 = 0.0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $17_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  $8_1 = $5_1 + 8 | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $38($8_1 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $19_1 = +($12($8_1 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  $43($5_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $18_1 = $5_1 + 32 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return +$19_1;
 }
 
 function $344($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $222($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $345($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $344($4_1 | 0) | 0;
  $769($4_1 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $346($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $3_1 = 0, i64toi32_i32$0 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  i64toi32_i32$0 = 0;
  HEAP32[$4_1 >> 2] = 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = i64toi32_i32$0;
  HEAP32[($4_1 + 8 | 0) >> 2] = 0;
  return $4_1 | 0;
 }
 
 function $347($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $348($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $348($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $349($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  return (HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) < (HEAP32[(HEAP32[($5_1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $350($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $351($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $352($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = $191($353((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $353($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $275(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $354($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $355($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $280(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $356($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $357($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $358(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $358($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $359($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $208(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $360($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $368((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $361($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 28 | 0) >> 2] = $0_1;
  $367(HEAP32[($3_1 + 28 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 32 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $362($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  $266($5_1 | 0) | 0;
  $370($5_1 | 0, $369(HEAP32[$4_1 >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $363($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $371((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $364($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $270($6_1 | 0, $269(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $373($6_1 | 0, $372(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $6_1 | 0;
 }
 
 function $365($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $61(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $366($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $25_1 = 0, $24_1 = 0, $15_1 = 0, $21_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $24_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($5_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $2_1;
  $15_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 32 | 0) >> 2] | 0;
  HEAP32[($5_1 + 16 | 0) >> 2] = $376($15_1 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $22($5_1 + 40 | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  $21_1 = HEAP32[($5_1 + 40 | 0) >> 2] | 0;
  label$3 : {
   $25_1 = $5_1 + 48 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $367($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 4 | 0) >> 2] = $0_1;
  return;
 }
 
 function $368($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $374(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $369($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $370($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $369(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $371($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $375(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $372($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $373($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $372(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $374($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $375($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $376($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $21_1 = 0, $20_1 = 0, $10_1 = 0, $13_1 = 0, $17_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $20_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
  $10_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
  $13_1 = $377(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = $378($10_1 | 0, HEAP32[$5_1 >> 2] | 0 | 0, $13_1 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $17_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $21_1 = $5_1 + 32 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return $17_1 | 0;
 }
 
 function $377($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $378($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $20_1 = 0, $49_1 = 0, $48_1 = 0, $45_1 = 0;
  $6_1 = global$0 - 64 | 0;
  label$1 : {
   $48_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $48_1;
  }
  HEAP32[($6_1 + 48 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 40 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 36 | 0) >> 2] = $3_1;
  $20_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
  HEAP32[($6_1 + 16 | 0) >> 2] = HEAP32[($6_1 + 48 | 0) >> 2] | 0;
  HEAP32[($6_1 + 24 | 0) >> 2] = $379($20_1 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0, $6_1 + 32 | 0 | 0, $6_1 + 28 | 0 | 0, HEAP32[($6_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($6_1 + 24 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($6_1 + 24 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
    break label$3
   }
   $381($6_1 | 0, $20_1 | 0, $380(HEAP32[($6_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0);
   $383($20_1 | 0, HEAP32[($6_1 + 32 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0, $382($6_1 | 0) | 0 | 0);
   HEAP32[($6_1 + 12 | 0) >> 2] = $384($6_1 | 0) | 0;
   $385($6_1 | 0) | 0;
  }
  $386($6_1 + 56 | 0 | 0, HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  $45_1 = HEAP32[($6_1 + 56 | 0) >> 2] | 0;
  label$4 : {
   $49_1 = $6_1 + 64 | 0;
   if ($49_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $49_1;
  }
  return $45_1 | 0;
 }
 
 function $379($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $15_1 = 0, $14_1 = 0, $21_1 = 0, $35_1 = 0, $38_1 = 0, $48_1 = 0, $95_1 = 0, $111_1 = 0, $154_1 = 0, $153_1 = 0, $150_1 = 0;
  $7_1 = global$0 - 96 | 0;
  label$1 : {
   $153_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $153_1;
  }
  $14_1 = $7_1 + 64 | 0;
  HEAP32[($7_1 + 88 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 84 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 80 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 76 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 72 | 0) >> 2] = $4_1;
  $15_1 = HEAP32[($7_1 + 84 | 0) >> 2] | 0;
  HEAP32[($7_1 + 56 | 0) >> 2] = $24($15_1 | 0) | 0;
  $387($14_1 | 0, HEAP32[($7_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  $21_1 = 1;
  label$3 : {
   if (($236($7_1 + 88 | 0 | 0, $14_1 | 0) | 0) & 1 | 0) {
    break label$3
   }
   $21_1 = $390($388($15_1 | 0) | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0, $389($7_1 + 88 | 0 | 0) | 0 | 0) | 0;
  }
  label$4 : {
   label$5 : {
    if (!($21_1 & 1 | 0)) {
     break label$5
    }
    $35_1 = $7_1 + 48 | 0;
    $38_1 = $7_1 + 40 | 0;
    HEAP32[$35_1 >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
    HEAP32[($7_1 + 32 | 0) >> 2] = $21($15_1 | 0) | 0;
    $387($38_1 | 0, HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0;
    $48_1 = 1;
    label$6 : {
     if (($236($35_1 | 0, $38_1 | 0) | 0) & 1 | 0) {
      break label$6
     }
     $48_1 = $392($388($15_1 | 0) | 0 | 0, $389($391($7_1 + 48 | 0 | 0) | 0 | 0) | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0) | 0;
    }
    label$7 : {
     if (!($48_1 & 1 | 0)) {
      break label$7
     }
     label$8 : {
      if (!((HEAP32[(HEAP32[($7_1 + 88 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
       break label$8
      }
      HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
      HEAP32[($7_1 + 92 | 0) >> 2] = HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] | 0;
      break label$4;
     }
     HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 48 | 0) >> 2] | 0;
     HEAP32[($7_1 + 92 | 0) >> 2] = (HEAP32[($7_1 + 48 | 0) >> 2] | 0) + 4 | 0;
     break label$4;
    }
    HEAP32[($7_1 + 92 | 0) >> 2] = $393($15_1 | 0, HEAP32[($7_1 + 80 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0) | 0;
    break label$4;
   }
   label$9 : {
    if (!(($392($388($15_1 | 0) | 0 | 0, $389($7_1 + 88 | 0 | 0) | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$9
    }
    $95_1 = $7_1 + 8 | 0;
    HEAP32[($7_1 + 16 | 0) >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
    HEAP32[($7_1 + 24 | 0) >> 2] = $394(HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0, 1 | 0) | 0;
    HEAP32[$7_1 >> 2] = $24($15_1 | 0) | 0;
    $387($95_1 | 0, HEAP32[$7_1 >> 2] | 0 | 0) | 0;
    $111_1 = 1;
    label$10 : {
     if (($236($7_1 + 24 | 0 | 0, $95_1 | 0) | 0) & 1 | 0) {
      break label$10
     }
     $111_1 = $390($388($15_1 | 0) | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0, $389($7_1 + 24 | 0 | 0) | 0 | 0) | 0;
    }
    label$11 : {
     if (!($111_1 & 1 | 0)) {
      break label$11
     }
     label$12 : {
      if (!((HEAP32[(($237($7_1 + 88 | 0 | 0) | 0) + 4 | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
       break label$12
      }
      HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
      HEAP32[($7_1 + 92 | 0) >> 2] = (HEAP32[($7_1 + 88 | 0) >> 2] | 0) + 4 | 0;
      break label$4;
     }
     HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 24 | 0) >> 2] | 0;
     HEAP32[($7_1 + 92 | 0) >> 2] = HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] | 0;
     break label$4;
    }
    HEAP32[($7_1 + 92 | 0) >> 2] = $393($15_1 | 0, HEAP32[($7_1 + 80 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 72 | 0) >> 2] | 0 | 0) | 0;
    break label$4;
   }
   HEAP32[(HEAP32[($7_1 + 80 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
   HEAP32[(HEAP32[($7_1 + 76 | 0) >> 2] | 0) >> 2] = HEAP32[($7_1 + 88 | 0) >> 2] | 0;
   HEAP32[($7_1 + 92 | 0) >> 2] = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
  }
  $150_1 = HEAP32[($7_1 + 92 | 0) >> 2] | 0;
  label$13 : {
   $154_1 = $7_1 + 96 | 0;
   if ($154_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $154_1;
  }
  return $150_1 | 0;
 }
 
 function $380($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $381($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $9_1 = 0, $38_1 = 0, $37_1 = 0, $16_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $37_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  $8_1 = $5_1 + 16 | 0;
  $9_1 = 0;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $161(HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  HEAP8[($5_1 + 31 | 0) >> 0] = $9_1 & 1 | 0;
  $16_1 = $395(HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, 1 | 0) | 0;
  $396($8_1 | 0, HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, $9_1 & 1 | 0 | 0) | 0;
  $397($0_1 | 0, $16_1 | 0, $8_1 | 0) | 0;
  $399(HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0, $162(($398($0_1 | 0) | 0) + 16 | 0 | 0) | 0 | 0, $380(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP8[(($400($0_1 | 0) | 0) + 4 | 0) >> 0] = 1;
  HEAP8[($5_1 + 31 | 0) >> 0] = 1 & 1 | 0;
  label$3 : {
   if ((HEAPU8[($5_1 + 31 | 0) >> 0] | 0) & 1 | 0) {
    break label$3
   }
   $385($0_1 | 0) | 0;
  }
  label$4 : {
   $38_1 = $5_1 + 48 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $382($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($402(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $383($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $8_1 = 0, $7_1 = 0, $31_1 = 0, $38_1 = 0, $37_1 = 0, $25_1 = 0;
  $6_1 = global$0 - 16 | 0;
  label$1 : {
   $37_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  $7_1 = 0;
  HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$6_1 >> 2] = $3_1;
  $8_1 = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
  HEAP32[(HEAP32[$6_1 >> 2] | 0) >> 2] = $7_1;
  HEAP32[((HEAP32[$6_1 >> 2] | 0) + 4 | 0) >> 2] = $7_1;
  HEAP32[((HEAP32[$6_1 >> 2] | 0) + 8 | 0) >> 2] = HEAP32[($6_1 + 8 | 0) >> 2] | 0;
  HEAP32[(HEAP32[($6_1 + 4 | 0) >> 2] | 0) >> 2] = HEAP32[$6_1 >> 2] | 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($350($8_1 | 0) | 0) >> 2] | 0) >> 2] | 0 | 0) != ($7_1 | 0) & 1 | 0)) {
    break label$3
   }
   $25_1 = HEAP32[(HEAP32[($350($8_1 | 0) | 0) >> 2] | 0) >> 2] | 0;
   HEAP32[($350($8_1 | 0) | 0) >> 2] = $25_1;
  }
  $304(HEAP32[($352($8_1 | 0) | 0) >> 2] | 0 | 0, HEAP32[(HEAP32[($6_1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0);
  $31_1 = $401($8_1 | 0) | 0;
  HEAP32[$31_1 >> 2] = (HEAP32[$31_1 >> 2] | 0) + 1 | 0;
  label$4 : {
   $38_1 = $6_1 + 16 | 0;
   if ($38_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $38_1;
  }
  return;
 }
 
 function $384($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[($403($5_1 | 0) | 0) >> 2] | 0;
  HEAP32[($403($5_1 | 0) | 0) >> 2] = 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $385($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $404($5_1 | 0, 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $386($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $387($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $388($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $405((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $389($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = ($237(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 16 | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $390($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $12_1 = ($406(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $230(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0) & 1 | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $391($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $325(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $392($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $12_1 = ($406(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, $230(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $393($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $7_1 = 0, $78_1 = 0, $77_1 = 0, $70_1 = 0, $74_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $77_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $77_1;
  }
  HEAP32[($5_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $2_1;
  $7_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $159($7_1 | 0) | 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = $407($7_1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    label$5 : while (1) {
     label$6 : {
      label$7 : {
       if (!(($390($388($7_1 | 0) | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 16 | 0 | 0) | 0) & 1 | 0)) {
        break label$7
       }
       label$8 : {
        label$9 : {
         if (!((HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
          break label$9
         }
         HEAP32[($5_1 + 8 | 0) >> 2] = $408(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0;
         HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
         break label$8;
        }
        HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
        HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
        break label$3;
       }
       break label$6;
      }
      label$10 : {
       label$11 : {
        if (!(($392($388($7_1 | 0) | 0 | 0, (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 16 | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
         break label$11
        }
        label$12 : {
         label$13 : {
          if (!((HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
           break label$13
          }
          HEAP32[($5_1 + 8 | 0) >> 2] = $408((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
          HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
          break label$12;
         }
         HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
         HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0;
         break label$3;
        }
        break label$10;
       }
       HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
       HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
       break label$3;
      }
     }
     continue label$5;
    };
   }
   $70_1 = $352($7_1 | 0) | 0;
   HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] = $70_1;
   HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[(HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
  }
  $74_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  label$14 : {
   $78_1 = $5_1 + 32 | 0;
   if ($78_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $78_1;
  }
  return $74_1 | 0;
 }
 
 function $394($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $17_1 = 0, $16_1 = 0, $13_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $16_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  $7_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $1_1;
  $409($7_1 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0);
  HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[$7_1 >> 2] | 0;
  $13_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $17_1 = $4_1 + 32 | 0;
   if ($17_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  return $13_1 | 0;
 }
 
 function $395($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = $412(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $396($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP8[($5_1 + 7 | 0) >> 0] = $2_1;
  $7_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$7_1 >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP8[($7_1 + 4 | 0) >> 0] = (HEAPU8[($5_1 + 7 | 0) >> 0] | 0) & 1 | 0;
  return $7_1 | 0;
 }
 
 function $397($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $9_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $414($9_1 | 0, $5_1 + 8 | 0 | 0, $413(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $15_1 = $5_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $9_1 | 0;
 }
 
 function $398($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($402(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $399($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $415(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $380(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $400($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $416(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $401($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $425((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $402($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $423(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $403($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $426(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $404($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $22_1 = 0, $21_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $21_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($403($6_1 | 0) | 0) >> 2] | 0;
  $9_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  HEAP32[($403($6_1 | 0) | 0) >> 2] = $9_1;
  label$3 : {
   if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $427($416($6_1 | 0) | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  label$4 : {
   $22_1 = $4_1 + 16 | 0;
   if ($22_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  return;
 }
 
 function $405($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $410(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $406($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  return (HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) < (HEAP32[(HEAP32[($5_1 + 4 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $407($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $408($165(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $408($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $409($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $411(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $410($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $411($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $37_1 = 0, $36_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $36_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!((HEAP32[$4_1 >> 2] | 0 | 0) >= (0 | 0) & 1 | 0)) {
     break label$4
    }
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[$4_1 >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
       break label$5
      }
      $232(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0;
      HEAP32[$4_1 >> 2] = (HEAP32[$4_1 >> 2] | 0) + -1 | 0;
      continue label$6;
     };
    }
    break label$3;
   }
   label$7 : {
    label$8 : while (1) {
     if (!((HEAP32[$4_1 >> 2] | 0 | 0) < (0 | 0) & 1 | 0)) {
      break label$7
     }
     $391(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0;
     HEAP32[$4_1 >> 2] = (HEAP32[$4_1 >> 2] | 0) + 1 | 0;
     continue label$8;
    };
   }
  }
  label$9 : {
   $37_1 = $4_1 + 16 | 0;
   if ($37_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  return;
 }
 
 function $412($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $23_1 = 0, $22_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $22_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 > ($417(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $314(1426 | 0);
   abort();
  }
  $19_1 = $315((HEAP32[($5_1 + 8 | 0) >> 2] | 0) << 5 | 0 | 0, 4 | 0) | 0;
  label$4 : {
   $23_1 = $5_1 + 16 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $19_1 | 0;
 }
 
 function $413($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $414($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $419($6_1 | 0, $418(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $421($6_1 + 4 | 0 | 0, $420(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $415($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $422(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $380(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $416($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $424((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $417($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 134217727 | 0;
 }
 
 function $418($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $419($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($418(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $420($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $421($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, i64toi32_i32$0 = 0, $5_1 = 0, i64toi32_i32$2 = 0, $11_1 = 0, $10_1 = 0, i64toi32_i32$1 = 0, $35_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  i64toi32_i32$2 = $420(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $35_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $5_1;
  HEAP32[i64toi32_i32$0 >> 2] = $35_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $422($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $218(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $380(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $423($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $424($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $425($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $212(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $426($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $427($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $27_1 = 0, $26_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $26_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAPU8[($5_1 + 4 | 0) >> 0] | 0) & 1 | 0)) {
    break label$3
   }
   $163(HEAP32[$5_1 >> 2] | 0 | 0, $162((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 16 | 0 | 0) | 0 | 0);
  }
  label$4 : {
   if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$4
   }
   $164(HEAP32[$5_1 >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 1 | 0);
  }
  label$5 : {
   $27_1 = $4_1 + 16 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return;
 }
 
 function $428($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $266($4_1 | 0) | 0;
  $429($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $429($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $430($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $430($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $431($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $203($202($4_1 | 0) | 0 | 0) | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $203($202($4_1 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $4_1 | 0;
 }
 
 function $432($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $270($5_1 | 0, $269(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $433($5_1 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $433($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $434($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $434($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $435($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $436($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $437($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $26_1 = 0, $25_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $25_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $438(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($3_1 + 4 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($3_1 + 4 | 0) >> 2] | 0) >>> 0 < 3 >>> 0 & 1 | 0)) {
     break label$3
    }
    HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + ((HEAP32[($3_1 + 4 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] = 0;
    HEAP32[($3_1 + 4 | 0) >> 2] = (HEAP32[($3_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  label$5 : {
   $26_1 = $3_1 + 16 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return;
 }
 
 function $438($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $439(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $439($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $440($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!(($442($4_1 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $9_1 = $445($4_1 | 0) | 0;
    break label$3;
   }
   $9_1 = $446($4_1 | 0) | 0;
  }
  $11_1 = $9_1;
  label$5 : {
   $15_1 = $3_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $441($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $442($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $16_1 = (((HEAPU8[(($447(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 11 | 0) >> 0] | 0) & 255 | 0) & 128 | 0 | 0) != (0 | 0) & 1 | 0;
  label$3 : {
   $20_1 = $3_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $443($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[(($447(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $444($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = (HEAPU8[(($447(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 11 | 0) >> 0] | 0) & 255 | 0;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $445($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($447(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $446($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $448($447(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $447($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $449(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $448($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $450(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $449($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $450($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $451($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0 | 0;
 }
 
 function $452($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($67($4_1 + 24 | 0 | 0, $4_1 + 16 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    $453($4_1 + 24 | 0 | 0) | 0;
    continue label$4;
   };
  }
  $21_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  label$5 : {
   $25_1 = $4_1 + 32 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $453($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = HEAP32[((HEAP32[$4_1 >> 2] | 0) + 4 | 0) >> 2] | 0;
  return $4_1 | 0;
 }
 
 function $454($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = $462(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $455($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP32[($6_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  return $6_1 | 0;
 }
 
 function $456($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $9_1 = 0, $15_1 = 0, $14_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $9_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $464($9_1 | 0, $5_1 + 8 | 0 | 0, $463(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $15_1 = $5_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $9_1 | 0;
 }
 
 function $457($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $458($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $470(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $459($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $471(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $460($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $472(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $461($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $22_1 = 0, $21_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $21_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($460($6_1 | 0) | 0) >> 2] | 0;
  $9_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  HEAP32[($460($6_1 | 0) | 0) >> 2] = $9_1;
  label$3 : {
   if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $474($473($6_1 | 0) | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  label$4 : {
   $22_1 = $4_1 + 16 | 0;
   if ($22_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  return;
 }
 
 function $462($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $23_1 = 0, $22_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $22_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 > ($465(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $314(1426 | 0);
   abort();
  }
  $19_1 = $315(Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, 20) | 0, 4 | 0) | 0;
  label$4 : {
   $23_1 = $5_1 + 16 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $19_1 | 0;
 }
 
 function $463($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $464($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $467($6_1 | 0, $466(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $469($6_1 + 4 | 0 | 0, $468(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $465($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 214748364 | 0;
 }
 
 function $466($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $467($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($466(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $468($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $469($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, i64toi32_i32$0 = 0, $5_1 = 0, i64toi32_i32$2 = 0, $11_1 = 0, $10_1 = 0, i64toi32_i32$1 = 0, $35_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  i64toi32_i32$2 = $468(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $35_1 = i64toi32_i32$0;
  i64toi32_i32$0 = $5_1;
  HEAP32[i64toi32_i32$0 >> 2] = $35_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $470($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $58(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $471($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $472($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $473($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $475((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $474($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $198(HEAP32[$5_1 >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $475($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $476($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($438(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $477($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $478($438(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $478($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $183(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $479($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $480($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($479(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $481($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $484(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $482($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $485(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $483($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $17_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $16_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   if (($6_1 | 0) == (0 | 0) & 1 | 0) {
    break label$3
   }
   FUNCTION_TABLE[HEAP32[((HEAP32[$6_1 >> 2] | 0) + 12 | 0) >> 2] | 0]($6_1);
  }
  label$4 : {
   $17_1 = $4_1 + 16 | 0;
   if ($17_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  return;
 }
 
 function $484($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $485($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $486($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $487($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $488($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $503($5_1 | 0, $502(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $504($5_1 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $489($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($37($4_1 + 24 | 0 | 0, $4_1 + 16 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    $66($4_1 + 24 | 0 | 0) | 0;
    continue label$4;
   };
  }
  $21_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  label$5 : {
   $25_1 = $4_1 + 32 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $490($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $19_1 = 0, $18_1 = 0, $15_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $18_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $507($506(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  HEAP32[($3_1 + 4 | 0) >> 2] = $508() | 0;
  $15_1 = HEAP32[($509($3_1 + 8 | 0 | 0, $3_1 + 4 | 0 | 0) | 0) >> 2] | 0;
  label$3 : {
   $19_1 = $3_1 + 16 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $15_1 | 0;
 }
 
 function $491($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $511((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $492($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $12_1 = 0, $11_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $8_1 = $510(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0;
  label$3 : {
   $12_1 = $4_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $8_1 | 0;
 }
 
 function $493($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $512((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $494($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $25_1 = 0, $24_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $515($5_1 | 0, $513($5_1 | 0) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul($514($5_1 | 0) | 0, 12) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul($514($5_1 | 0) | 0, 12) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 12) | 0 | 0);
  label$3 : {
   $25_1 = $4_1 + 16 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return;
 }
 
 function $495($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  return HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $496($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $27_1 = 0, $34_1 = 0, $33_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $33_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  HEAP32[($6_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $3_1;
  label$3 : {
   label$4 : while (1) {
    if (!(($37($6_1 + 24 | 0 | 0, $6_1 + 16 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    $529(HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0, $525(HEAP32[(HEAP32[($6_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) | 0 | 0, $41($6_1 + 24 | 0 | 0) | 0 | 0);
    $66($6_1 + 24 | 0 | 0) | 0;
    $27_1 = HEAP32[($6_1 + 8 | 0) >> 2] | 0;
    HEAP32[$27_1 >> 2] = (HEAP32[$27_1 >> 2] | 0) + 12 | 0;
    continue label$4;
   };
  }
  label$5 : {
   $34_1 = $6_1 + 32 | 0;
   if ($34_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $34_1;
  }
  return;
 }
 
 function $497($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return;
 }
 
 function $498($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $19_1 = 0, $18_1 = 0, $15_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $18_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $5_1;
  label$3 : {
   if (!((HEAP32[$5_1 >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $499($5_1 | 0);
   $501($491($5_1 | 0) | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0, $500($5_1 | 0) | 0 | 0);
  }
  $15_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$4 : {
   $19_1 = $3_1 + 16 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $15_1 | 0;
 }
 
 function $499($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $533($4_1 | 0, HEAP32[$4_1 >> 2] | 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $500($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $10_1 = ((HEAP32[($526($4_1 | 0) | 0) >> 2] | 0) - (HEAP32[$4_1 >> 2] | 0) | 0 | 0) / (12 | 0) | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $501($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $534(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $502($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $503($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $502(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$6_1 >> 2] = 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $6_1 | 0;
 }
 
 function $504($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $505($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $505($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $506($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $518((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $507($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $517(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $508() {
  return $519() | 0 | 0;
 }
 
 function $509($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $516(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $510($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $23_1 = 0, $22_1 = 0, $19_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $22_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 > ($521(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $314(1426 | 0);
   abort();
  }
  $19_1 = $315(Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, 12) | 0, 4 | 0) | 0;
  label$4 : {
   $23_1 = $5_1 + 16 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $19_1 | 0;
 }
 
 function $511($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $523(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $512($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $524(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $513($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $525(HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $514($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $500(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $515($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0;
  $7_1 = global$0 - 32 | 0;
  HEAP32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $4_1;
  return;
 }
 
 function $516($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!(($520($4_1 + 8 | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $14_1 = HEAP32[$4_1 >> 2] | 0;
    break label$3;
   }
   $14_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  }
  $16_1 = $14_1;
  label$5 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $517($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $5_1 = $521(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $518($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $522(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $519() {
  return 2147483647 | 0;
 }
 
 function $520($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  return (HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] | 0) >>> 0 < (HEAP32[(HEAP32[($5_1 + 4 | 0) >> 2] | 0) >> 2] | 0) >>> 0 & 1 | 0 | 0;
 }
 
 function $521($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 357913941 | 0;
 }
 
 function $522($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $523($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $524($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $525($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $526($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $527((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $527($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $528(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $528($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $529($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $531(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $530(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $530($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $531($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $532(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $530(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $532($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $814(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $530(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $533($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $17_1 = 0, $23_1 = 0, $22_1 = 0, $14_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $22_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) != (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $14_1 = $491($5_1 | 0) | 0;
    $17_1 = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + -12 | 0;
    HEAP32[($4_1 + 4 | 0) >> 2] = $17_1;
    $535($14_1 | 0, $525($17_1 | 0) | 0 | 0);
    continue label$4;
   };
  }
  HEAP32[($5_1 + 4 | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$5 : {
   $23_1 = $4_1 + 16 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return;
 }
 
 function $534($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $186(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, Math_imul(HEAP32[($5_1 + 4 | 0) >> 2] | 0, 12) | 0, 4 | 0);
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $535($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  $536(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 32 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $536($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $537(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $537($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $832(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $4_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $538($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $13_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $546($0_1 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0 | 0, HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $539($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP8[($3_1 + 15 | 0) >> 0] = $0_1;
  $5_1 = 24;
  return ((HEAPU8[($3_1 + 15 | 0) >> 0] | 0) << $5_1 | 0) >> $5_1 | 0 | 0;
 }
 
 function $540($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP8[($3_1 + 15 | 0) >> 0] = $0_1;
  return (HEAPU8[($3_1 + 15 | 0) >> 0] | 0) & 1 | 0 | 0;
 }
 
 function $541($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(24 | 0) | 0;
  $545($5_1 | 0, $544(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $542($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $547($4_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $543() {
  return 1632 | 0;
 }
 
 function $544($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $545($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $15_1 = 0, $14_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAPF64[$5_1 >> 3] = +HEAPF64[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 3];
  $548($5_1 + 8 | 0 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 8 | 0 | 0) | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $5_1 | 0;
 }
 
 function $546($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $5($6_1 | 0) | 0;
  $817($6_1 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $6_1 | 0;
 }
 
 function $547($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $554($4_1 | 0);
  $498($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $548($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $5_1 = 0, $25_1 = 0, $24_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  $5_1 = 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $550($6_1 | 0, $549($491(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0 | 0) | 0;
  HEAP32[$6_1 >> 2] = HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0;
  HEAP32[($6_1 + 4 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  $16_1 = HEAP32[($493(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  HEAP32[($493($6_1 | 0) | 0) >> 2] = $16_1;
  HEAP32[($493(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] = $5_1;
  HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] = $5_1;
  HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] = $5_1;
  label$3 : {
   $25_1 = $4_1 + 16 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $6_1 | 0;
 }
 
 function $549($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $550($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $9_1 = 0, $17_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $16_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $487($5_1 | 0) | 0;
  $9_1 = 0;
  HEAP32[$5_1 >> 2] = $9_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $9_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $9_1;
  $551($5_1 + 8 | 0 | 0, $4_1 + 4 | 0 | 0, $549(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $17_1 = $4_1 + 16 | 0;
   if ($17_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  return $5_1 | 0;
 }
 
 function $551($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $14_1 = 0, $13_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $503($6_1 | 0, $502(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $553($6_1 | 0, $552(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $14_1 = $5_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $6_1 | 0;
 }
 
 function $552($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $553($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $552(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $554($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $3_1 = 0, $24_1 = 0, $23_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $23_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $515($4_1 | 0, $513($4_1 | 0) | 0 | 0, ($513($4_1 | 0) | 0) + Math_imul($514($4_1 | 0) | 0, 12) | 0 | 0, ($513($4_1 | 0) | 0) + Math_imul($120($4_1 | 0) | 0, 12) | 0 | 0, ($513($4_1 | 0) | 0) + Math_imul($514($4_1 | 0) | 0, 12) | 0 | 0);
  label$3 : {
   $24_1 = $3_1 + 16 | 0;
   if ($24_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  return;
 }
 
 function $555($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $564(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $563(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $556($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $33_1 = 0, $32_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $32_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $32_1;
  }
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  HEAP32[($4_1 + 36 | 0) >> 2] = $491($8_1 | 0) | 0;
  $566($4_1 + 16 | 0 | 0, $565($8_1 | 0, ($120($8_1 | 0) | 0) + 1 | 0 | 0) | 0 | 0, $120($8_1 | 0) | 0 | 0, HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  $555(HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0, $525(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0 | 0, $563(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP32[($4_1 + 24 | 0) >> 2] = (HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 12 | 0;
  $567($8_1 | 0, $4_1 + 16 | 0 | 0);
  $568($4_1 + 16 | 0 | 0) | 0;
  label$3 : {
   $33_1 = $4_1 + 48 | 0;
   if ($33_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  return;
 }
 
 function $557($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $23_1 = 0, $42_1 = 0, $41_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $41_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $41_1;
  }
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 44 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!((((HEAP32[($493($6_1 | 0) | 0) >> 2] | 0) - (HEAP32[($6_1 + 4 | 0) >> 2] | 0) | 0 | 0) / (12 | 0) | 0) >>> 0 >= (HEAP32[($5_1 + 40 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
     break label$4
    }
    $594($6_1 | 0, HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0);
    break label$3;
   }
   $23_1 = $5_1 + 8 | 0;
   HEAP32[($5_1 + 32 | 0) >> 2] = $491($6_1 | 0) | 0;
   $566($23_1 | 0, $565($6_1 | 0, ($120($6_1 | 0) | 0) + (HEAP32[($5_1 + 40 | 0) >> 2] | 0) | 0 | 0) | 0 | 0, $120($6_1 | 0) | 0 | 0, HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0) | 0;
   $595($23_1 | 0, HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0);
   $567($6_1 | 0, $5_1 + 8 | 0 | 0);
   $568($5_1 + 8 | 0 | 0) | 0;
  }
  label$5 : {
   $42_1 = $5_1 + 48 | 0;
   if ($42_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $42_1;
  }
  return;
 }
 
 function $558($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $596($5_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  HEAP32[($4_1 + 4 | 0) >> 2] = $120($5_1 | 0) | 0;
  $533($5_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  $597($5_1 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $559($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 12) | 0 | 0;
 }
 
 function $560($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $15_1 = 0, $14_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $637($4_1 | 0, $563(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  HEAP32[$6_1 >> 2] = fimport$13($638() | 0 | 0, $639($4_1 | 0) | 0 | 0) | 0;
  label$3 : {
   $15_1 = $4_1 + 16 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $6_1 | 0;
 }
 
 function $561($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $640($0_1 | 0, 1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $562($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 12) | 0 | 0;
 }
 
 function $563($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $564($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $569(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $563(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $565($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $40_1 = 0, $39_1 = 0, $36_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $39_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $39_1;
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $490($5_1 | 0) | 0;
  label$3 : {
   if (!((HEAP32[($4_1 + 20 | 0) >> 2] | 0) >>> 0 > (HEAP32[($4_1 + 16 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
    break label$3
   }
   $864($5_1 | 0);
   abort();
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $514($5_1 | 0) | 0;
  label$4 : {
   label$5 : {
    if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0) >>> 0 >= ((HEAP32[($4_1 + 16 | 0) >> 2] | 0) >>> 1 | 0) >>> 0 & 1 | 0)) {
     break label$5
    }
    HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
    break label$4;
   }
   HEAP32[($4_1 + 8 | 0) >> 2] = (HEAP32[($4_1 + 12 | 0) >> 2] | 0) << 1 | 0;
   HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($570($4_1 + 8 | 0 | 0, $4_1 + 20 | 0 | 0) | 0) >> 2] | 0;
  }
  $36_1 = HEAP32[($4_1 + 28 | 0) >> 2] | 0;
  label$6 : {
   $40_1 = $4_1 + 32 | 0;
   if ($40_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $40_1;
  }
  return $36_1 | 0;
 }
 
 function $566($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $11_1 = 0, $19_1 = 0, $26_1 = 0, $37_1 = 0, $36_1 = 0, $31_1 = 0, $33_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $36_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  HEAP32[($6_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = $3_1;
  $11_1 = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
  HEAP32[($6_1 + 28 | 0) >> 2] = $11_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = 0;
  $571($11_1 + 12 | 0 | 0, $6_1 + 8 | 0 | 0, HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!(HEAP32[($6_1 + 20 | 0) >> 2] | 0)) {
     break label$4
    }
    $19_1 = $492($572($11_1 | 0) | 0 | 0, HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) | 0;
    break label$3;
   }
   $19_1 = 0;
  }
  HEAP32[$11_1 >> 2] = $19_1;
  $26_1 = (HEAP32[$11_1 >> 2] | 0) + Math_imul(HEAP32[($6_1 + 16 | 0) >> 2] | 0, 12) | 0;
  HEAP32[($11_1 + 8 | 0) >> 2] = $26_1;
  HEAP32[($11_1 + 4 | 0) >> 2] = $26_1;
  $31_1 = (HEAP32[$11_1 >> 2] | 0) + Math_imul(HEAP32[($6_1 + 20 | 0) >> 2] | 0, 12) | 0;
  HEAP32[($573($11_1 | 0) | 0) >> 2] = $31_1;
  $33_1 = HEAP32[($6_1 + 28 | 0) >> 2] | 0;
  label$5 : {
   $37_1 = $6_1 + 32 | 0;
   if ($37_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $37_1;
  }
  return $33_1 | 0;
 }
 
 function $567($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $30_1 = 0, $29_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $29_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $554($5_1 | 0);
  $574($491($5_1 | 0) | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0 | 0);
  $575($5_1 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0 | 0);
  $575($5_1 + 4 | 0 | 0, (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 8 | 0 | 0);
  $575($493($5_1 | 0) | 0 | 0, $573(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  $494($5_1 | 0, $120($5_1 | 0) | 0 | 0);
  $576($5_1 | 0);
  label$3 : {
   $30_1 = $4_1 + 16 | 0;
   if ($30_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  return;
 }
 
 function $568($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $19_1 = 0, $18_1 = 0, $15_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $18_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $5_1;
  $577($5_1 | 0);
  label$3 : {
   if (!((HEAP32[$5_1 >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $501($572($5_1 | 0) | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0, $578($5_1 | 0) | 0 | 0);
  }
  $15_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$4 : {
   $19_1 = $3_1 + 16 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return $15_1 | 0;
 }
 
 function $569($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $814(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $563(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $570($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $579(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $571($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  $503($6_1 | 0, $502(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $581($6_1 + 4 | 0 | 0, $580(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $572($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $582((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 12 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $573($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $583((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 12 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $574($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $22_1 = 0, $24_1 = 0, $31_1 = 0, $30_1 = 0, $14_1 = 0, $19_1 = 0;
  $6_1 = global$0 - 16 | 0;
  label$1 : {
   $30_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$6_1 >> 2] = $3_1;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0) != (HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $14_1 = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
    $19_1 = $525((HEAP32[(HEAP32[$6_1 >> 2] | 0) >> 2] | 0) + -12 | 0 | 0) | 0;
    $22_1 = (HEAP32[($6_1 + 4 | 0) >> 2] | 0) + -12 | 0;
    HEAP32[($6_1 + 4 | 0) >> 2] = $22_1;
    $586($14_1 | 0, $19_1 | 0, $585($22_1 | 0) | 0 | 0);
    $24_1 = HEAP32[$6_1 >> 2] | 0;
    HEAP32[$24_1 >> 2] = (HEAP32[$24_1 >> 2] | 0) + -12 | 0;
    continue label$4;
   };
  }
  label$5 : {
   $31_1 = $6_1 + 16 | 0;
   if ($31_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $31_1;
  }
  return;
 }
 
 function $575($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $21_1 = 0, $20_1 = 0, $13_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $20_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($587(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  $13_1 = HEAP32[($587(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] = $13_1;
  $16_1 = HEAP32[($587($4_1 + 4 | 0 | 0) | 0) >> 2] | 0;
  HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] = $16_1;
  label$3 : {
   $21_1 = $4_1 + 16 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return;
 }
 
 function $576($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return;
 }
 
 function $577($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $590($4_1 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $578($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $10_1 = ((HEAP32[($591($4_1 | 0) | 0) >> 2] | 0) - (HEAP32[$4_1 >> 2] | 0) | 0 | 0) / (12 | 0) | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $579($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $14_1 = 0, $20_1 = 0, $19_1 = 0, $16_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  label$3 : {
   label$4 : {
    if (!(($520($4_1 + 8 | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $14_1 = HEAP32[$4_1 >> 2] | 0;
    break label$3;
   }
   $14_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  }
  $16_1 = $14_1;
  label$5 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $16_1 | 0;
 }
 
 function $580($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $581($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $580(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $582($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $584((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 4 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $583($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $524(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $584($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $585($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $57(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $586($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $588(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $587($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $588($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $13_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $12_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $589(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $13_1 = $5_1 + 32 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return;
 }
 
 function $589($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $12_1 = 0, $11_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $58(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, $457(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $12_1 = $5_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $590($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $592(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $591($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = $593((HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 12 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $592($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $16_1 = 0, $21_1 = 0, $20_1 = 0, $13_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $20_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[$4_1 >> 2] | 0 | 0) != (HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $13_1 = $572($5_1 | 0) | 0;
    $16_1 = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + -12 | 0;
    HEAP32[($5_1 + 8 | 0) >> 2] = $16_1;
    $535($13_1 | 0, $525($16_1 | 0) | 0 | 0);
    continue label$4;
   };
  }
  label$5 : {
   $21_1 = $4_1 + 16 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return;
 }
 
 function $593($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $528(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $594($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $10_1 = 0, $32_1 = 0, $31_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $31_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $31_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[($5_1 + 16 | 0) >> 2] = $491($6_1 | 0) | 0;
  label$3 : while (1) {
   $10_1 = $5_1 + 8 | 0;
   $495($10_1 | 0, $6_1 | 0, 1 | 0) | 0;
   $555(HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, $525(HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0);
   HEAP32[($6_1 + 4 | 0) >> 2] = (HEAP32[($6_1 + 4 | 0) >> 2] | 0) + 12 | 0;
   HEAP32[($5_1 + 24 | 0) >> 2] = (HEAP32[($5_1 + 24 | 0) >> 2] | 0) + -1 | 0;
   $497($10_1 | 0);
   if ((HEAP32[($5_1 + 24 | 0) >> 2] | 0) >>> 0 > 0 >>> 0 & 1 | 0) {
    continue label$3
   }
   break label$3;
  };
  label$4 : {
   $32_1 = $5_1 + 32 | 0;
   if ($32_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $32_1;
  }
  return;
 }
 
 function $595($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $28_1 = 0, $27_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $27_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $572($6_1 | 0) | 0;
  label$3 : while (1) {
   $555(HEAP32[$5_1 >> 2] | 0 | 0, $525(HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
   HEAP32[($6_1 + 8 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) + 12 | 0;
   HEAP32[($5_1 + 8 | 0) >> 2] = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + -1 | 0;
   if ((HEAP32[($5_1 + 8 | 0) >> 2] | 0) >>> 0 > 0 >>> 0 & 1 | 0) {
    continue label$3
   }
   break label$3;
  };
  label$4 : {
   $28_1 = $5_1 + 16 | 0;
   if ($28_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  return;
 }
 
 function $596($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return;
 }
 
 function $597($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $25_1 = 0, $24_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $515($5_1 | 0, $513($5_1 | 0) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul($514($5_1 | 0) | 0, 12) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 12) | 0 | 0, ($513($5_1 | 0) | 0) + Math_imul($120($5_1 | 0) | 0, 12) | 0 | 0);
  label$3 : {
   $25_1 = $4_1 + 16 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return;
 }
 
 function $598($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 2100 | 0;
 }
 
 function $599() {
  return 2100 | 0;
 }
 
 function $600() {
  return 2212 | 0;
 }
 
 function $601() {
  return 2316 | 0;
 }
 
 function $602($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $101($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $603($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $606(FUNCTION_TABLE[HEAP32[($3_1 + 12 | 0) >> 2] | 0]() | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $604($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 1 | 0;
 }
 
 function $605($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $607() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $606($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $607() {
  return 2340 | 0;
 }
 
 function $608($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $13_1 = 0, $19_1 = 0, $23_1 = 0, $31_1 = 0, $30_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $30_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $7_1 = $612(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  $8_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  $9_1 = HEAP32[($8_1 + 4 | 0) >> 2] | 0;
  $10_1 = HEAP32[$8_1 >> 2] | 0;
  $13_1 = $7_1 + ($9_1 >> 1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!($9_1 & 1 | 0)) {
     break label$4
    }
    $19_1 = HEAP32[((HEAP32[$13_1 >> 2] | 0) + $10_1 | 0) >> 2] | 0;
    break label$3;
   }
   $19_1 = $10_1;
  }
  $23_1 = $5_1 + 8 | 0;
  $538($23_1 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0);
  FUNCTION_TABLE[$19_1]($13_1, $23_1);
  $832($5_1 + 8 | 0 | 0) | 0;
  label$5 : {
   $31_1 = $5_1 + 32 | 0;
   if ($31_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $31_1;
  }
  return;
 }
 
 function $609($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 3 | 0;
 }
 
 function $610($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $613() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $611($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $6_1 = 0, $12_1 = 0, $11_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(8 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $7_1 = HEAP32[$6_1 >> 2] | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = HEAP32[($6_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $7_1;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $612($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $613() {
  return 2344 | 0;
 }
 
 function $614($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0, $14_1 = 0, $20_1 = 0, $24_1 = 0, $34_1 = 0, $33_1 = 0, $8_1 = 0, $26_1 = 0;
  $6_1 = global$0 - 48 | 0;
  label$1 : {
   $33_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  HEAP32[($6_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 32 | 0) >> 2] = $3_1;
  $8_1 = $612(HEAP32[($6_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  $9_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
  $10_1 = HEAP32[($9_1 + 4 | 0) >> 2] | 0;
  $11_1 = HEAP32[$9_1 >> 2] | 0;
  $14_1 = $8_1 + ($10_1 >> 1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!($10_1 & 1 | 0)) {
     break label$4
    }
    $20_1 = HEAP32[((HEAP32[$14_1 >> 2] | 0) + $11_1 | 0) >> 2] | 0;
    break label$3;
   }
   $20_1 = $11_1;
  }
  $24_1 = $6_1 + 16 | 0;
  $26_1 = $619(HEAP32[($6_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  $538($24_1 | 0, HEAP32[($6_1 + 32 | 0) >> 2] | 0 | 0);
  FUNCTION_TABLE[$20_1]($14_1, $26_1, $24_1);
  $832($6_1 + 16 | 0 | 0) | 0;
  label$5 : {
   $34_1 = $6_1 + 48 | 0;
   if ($34_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $34_1;
  }
  return;
 }
 
 function $615($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 4 | 0;
 }
 
 function $616($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $620() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $617() {
  return 2384 | 0;
 }
 
 function $618($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $6_1 = 0, $12_1 = 0, $11_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(8 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $7_1 = HEAP32[$6_1 >> 2] | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = HEAP32[($6_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $7_1;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $619($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $620() {
  return 2368 | 0;
 }
 
 function $621($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $8_1 = 0, $9_1 = 0, $12_1 = 0, $18_1 = 0, $28_1 = 0, $27_1 = 0, $6_1 = 0, $24_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $27_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $6_1 = $625(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $7_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $8_1 = HEAP32[($7_1 + 4 | 0) >> 2] | 0;
  $9_1 = HEAP32[$7_1 >> 2] | 0;
  $12_1 = $6_1 + ($8_1 >> 1 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!($8_1 & 1 | 0)) {
     break label$4
    }
    $18_1 = HEAP32[((HEAP32[$12_1 >> 2] | 0) + $9_1 | 0) >> 2] | 0;
    break label$3;
   }
   $18_1 = $9_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = FUNCTION_TABLE[$18_1]($12_1) | 0;
  $24_1 = $626($4_1 + 4 | 0 | 0) | 0;
  label$5 : {
   $28_1 = $4_1 + 16 | 0;
   if ($28_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  return $24_1 | 0;
 }
 
 function $622($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 2 | 0;
 }
 
 function $623($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $627() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $624($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $6_1 = 0, $12_1 = 0, $11_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(8 | 0) | 0;
  $6_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $7_1 = HEAP32[$6_1 >> 2] | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = HEAP32[($6_1 + 4 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $7_1;
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return $5_1 | 0;
 }
 
 function $625($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $626($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $627() {
  return 2392 | 0;
 }
 
 function $628($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $22_1 = 0, $21_1 = 0, $10_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $21_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  $8_1 = $5_1 + 16 | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $10_1 = HEAP32[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 2] | 0;
  FUNCTION_TABLE[$10_1]($8_1, $633(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0, $619(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0);
  $15_1 = $634($8_1 | 0) | 0;
  $635($5_1 + 16 | 0 | 0) | 0;
  label$3 : {
   $22_1 = $5_1 + 32 | 0;
   if ($22_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  return $15_1 | 0;
 }
 
 function $629($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 3 | 0;
 }
 
 function $630($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $636() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $631() {
  return 2444 | 0;
 }
 
 function $632($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(4 | 0) | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $633($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $634($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$11(HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0);
  $7_1 = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $635($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $9_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  fimport$12(HEAP32[$4_1 >> 2] | 0 | 0);
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $4_1 | 0;
 }
 
 function $636() {
  return 2404 | 0;
 }
 
 function $637($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $20_1 = 0, $19_1 = 0, $11_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $641($8_1 | 0) | 0;
  $11_1 = $563(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 28 | 0) >> 2] = $4_1 + 12 | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $11_1;
  $643(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, $642($563(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0 | 0) | 0 | 0);
  $644(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0);
  label$3 : {
   $20_1 = $4_1 + 32 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $8_1 | 0;
 }
 
 function $638() {
  return $645() | 0 | 0;
 }
 
 function $639($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $646(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $640($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  return $5_1 | 0;
 }
 
 function $641($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $642($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $27_1 = 0, $26_1 = 0, $12_1 = 0, $23_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $26_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $1040((($86(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) << 0 | 0) + 4 | 0 | 0) | 0;
  $12_1 = $86(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 2] = $12_1;
  $1043((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0 | 0, $84(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0, ($86(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0) << 0 | 0 | 0) | 0;
  $23_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $27_1 = $3_1 + 16 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return $23_1 | 0;
 }
 
 function $643($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[(HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  $8_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$8_1 >> 2] = (HEAP32[$8_1 >> 2] | 0) + 8 | 0;
  return;
 }
 
 function $644($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return;
 }
 
 function $645() {
  return 1788 | 0;
 }
 
 function $646($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $647($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $9_1 = 0, $29_1 = 0, $28_1 = 0, $11_1 = 0, $13_1 = 0, $15_1 = 0, $20_1 = 0, $25_1 = 0;
  $6_1 = global$0 - 48 | 0;
  label$1 : {
   $28_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  $9_1 = $6_1 + 16 | 0;
  HEAP32[($6_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 32 | 0) >> 2] = $3_1;
  $11_1 = HEAP32[(HEAP32[($6_1 + 44 | 0) >> 2] | 0) >> 2] | 0;
  $13_1 = $633(HEAP32[($6_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  $15_1 = $619(HEAP32[($6_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  $538($9_1 | 0, HEAP32[($6_1 + 32 | 0) >> 2] | 0 | 0);
  $20_1 = $651((FUNCTION_TABLE[$11_1]($13_1, $15_1, $9_1) | 0) & 1 | 0 | 0) | 0;
  $832($6_1 + 16 | 0 | 0) | 0;
  $25_1 = $20_1 & 1 | 0;
  label$3 : {
   $29_1 = $6_1 + 48 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return $25_1 | 0;
 }
 
 function $648($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = $0_1;
  return 4 | 0;
 }
 
 function $649($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = $652() | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $650($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(4 | 0) | 0;
  HEAP32[$5_1 >> 2] = HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $651($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP8[($3_1 + 15 | 0) >> 0] = $0_1;
  return (HEAPU8[($3_1 + 15 | 0) >> 0] | 0) & 1 | 0 | 0;
 }
 
 function $652() {
  return 2464 | 0;
 }
 
 function $653($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $602($4_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $654() {
  return 1668 | 0;
 }
 
 function $655($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return +(+HEAPF64[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 3]);
 }
 
 function $656($0_1) {
  $0_1 = +$0_1;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAPF64[($3_1 + 8 | 0) >> 3] = $0_1;
  return +(+HEAPF64[($3_1 + 8 | 0) >> 3]);
 }
 
 function $657() {
  return 4164 | 0;
 }
 
 function $658($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $5_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $768(12 | 0) | 0;
  $660($5_1 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $659($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $20_1 = 0, $19_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!(($5_1 | 0) != (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$3
   }
   $665($5_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
   $666($5_1 | 0, HEAP32[(HEAP32[($4_1 + 8 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[((HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0);
  }
  label$4 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $5_1 | 0;
 }
 
 function $660($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $9_1 = 0, $30_1 = 0, $29_1 = 0, $26_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $29_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  HEAP32[($4_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 36 | 0) >> 2] = $1_1;
  $9_1 = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 44 | 0) >> 2] = $9_1;
  $661($506(HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0);
  $550($9_1 | 0, $4_1 + 32 | 0 | 0) | 0;
  HEAP32[($4_1 + 20 | 0) >> 2] = $120(HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   if (!((HEAP32[($4_1 + 20 | 0) >> 2] | 0) >>> 0 > 0 >>> 0 & 1 | 0)) {
    break label$3
   }
   $103($9_1 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
   $662($9_1 | 0, HEAP32[(HEAP32[($4_1 + 36 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[((HEAP32[($4_1 + 36 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
  }
  $26_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  label$4 : {
   $30_1 = $4_1 + 48 | 0;
   if ($30_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  return $26_1 | 0;
 }
 
 function $661($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 32 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 28 | 0) >> 2] = $0_1;
  $663(HEAP32[($3_1 + 28 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 32 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $662($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $10_1 = 0, $9_1 = 0, $21_1 = 0, $20_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $20_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  $9_1 = $6_1 + 8 | 0;
  HEAP32[($6_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $3_1;
  $10_1 = HEAP32[($6_1 + 28 | 0) >> 2] | 0;
  HEAP32[($6_1 + 12 | 0) >> 2] = $491($10_1 | 0) | 0;
  $495($9_1 | 0, $10_1 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  $664(HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0, $10_1 + 4 | 0 | 0);
  $497($9_1 | 0);
  label$3 : {
   $21_1 = $6_1 + 32 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return;
 }
 
 function $663($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[((global$0 - 16 | 0) + 4 | 0) >> 2] = $0_1;
  return;
 }
 
 function $664($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $22_1 = 0, $29_1 = 0, $28_1 = 0;
  $6_1 = global$0 - 16 | 0;
  label$1 : {
   $28_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$6_1 >> 2] = $3_1;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) != (HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $529(HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0, $525(HEAP32[(HEAP32[$6_1 >> 2] | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0);
    HEAP32[($6_1 + 8 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) + 12 | 0;
    $22_1 = HEAP32[$6_1 >> 2] | 0;
    HEAP32[$22_1 >> 2] = (HEAP32[$22_1 >> 2] | 0) + 12 | 0;
    continue label$4;
   };
  }
  label$5 : {
   $29_1 = $6_1 + 16 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return;
 }
 
 function $665($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $667(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $666($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $53_1 = 0, $52_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $52_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $52_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  HEAP32[($5_1 + 16 | 0) >> 2] = $668(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0) >>> 0 <= ($514($6_1 | 0) | 0) >>> 0 & 1 | 0)) {
     break label$4
    }
    HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
    HEAP8[($5_1 + 11 | 0) >> 0] = 0;
    label$5 : {
     if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0) >>> 0 > ($120($6_1 | 0) | 0) >>> 0 & 1 | 0)) {
      break label$5
     }
     HEAP8[($5_1 + 11 | 0) >> 0] = 1;
     HEAP32[($5_1 + 12 | 0) >> 2] = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
     $669($5_1 + 12 | 0 | 0, $120($6_1 | 0) | 0 | 0);
    }
    HEAP32[($5_1 + 4 | 0) >> 2] = $670(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[$6_1 >> 2] | 0 | 0) | 0;
    label$6 : {
     label$7 : {
      if (!((HEAPU8[($5_1 + 11 | 0) >> 0] | 0) & 1 | 0)) {
       break label$7
      }
      $662($6_1 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, (HEAP32[($5_1 + 16 | 0) >> 2] | 0) - ($120($6_1 | 0) | 0) | 0 | 0);
      break label$6;
     }
     $558($6_1 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0);
    }
    break label$3;
   }
   $671($6_1 | 0);
   $103($6_1 | 0, $565($6_1 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0 | 0);
   $662($6_1 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0);
  }
  $576($6_1 | 0);
  label$8 : {
   $53_1 = $5_1 + 32 | 0;
   if ($53_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $53_1;
  }
  return;
 }
 
 function $667($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  return;
 }
 
 function $668($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $672(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $669($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $673(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $4_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $670($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $12_1 = $675($674(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0, $674(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, $674(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $671($0_1) {
  $0_1 = $0_1 | 0;
  var $5_1 = 0, $3_1 = 0, $12_1 = 0, $20_1 = 0, $19_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[$5_1 >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$3
   }
   $12_1 = 0;
   $676($5_1 | 0);
   $501($491($5_1 | 0) | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0, $514($5_1 | 0) | 0 | 0);
   HEAP32[($493($5_1 | 0) | 0) >> 2] = $12_1;
   HEAP32[($5_1 + 4 | 0) >> 2] = $12_1;
   HEAP32[$5_1 >> 2] = $12_1;
  }
  label$4 : {
   $20_1 = $3_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return;
 }
 
 function $672($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  return ((HEAP32[$4_1 >> 2] | 0) - (HEAP32[($4_1 + 4 | 0) >> 2] | 0) | 0 | 0) / (12 | 0) | 0 | 0;
 }
 
 function $673($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = (HEAP32[$6_1 >> 2] | 0) + Math_imul(HEAP32[$4_1 >> 2] | 0, 12) | 0;
  return;
 }
 
 function $674($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $675($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $24_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) != (HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $837(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0;
    HEAP32[($5_1 + 12 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 12 | 0;
    HEAP32[($5_1 + 4 | 0) >> 2] = (HEAP32[($5_1 + 4 | 0) >> 2] | 0) + 12 | 0;
    continue label$4;
   };
  }
  $21_1 = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
  label$5 : {
   $25_1 = $5_1 + 16 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $676($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = $120($4_1 | 0) | 0;
  $499($4_1 | 0);
  $597($4_1 | 0, HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0);
  $576($4_1 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $677() {
  $2();
  $106();
  return;
 }
 
 function $678() {
  $4(6196 | 0, 2491 | 0) | 0;
  return;
 }
 
 function $679($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $832(6196 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $680($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
  HEAP32[$0_1 >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  HEAP32[($0_1 + 8 | 0) >> 2] = 0;
  return;
 }
 
 function $681($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
  HEAP32[$0_1 >> 2] = 9;
  HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[($0_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  return;
 }
 
 function $682($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : {
    if (!((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) == (14 | 0) & 1 | 0)) {
     break label$2
    }
    $12_1 = 1;
    break label$1;
   }
   $12_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  }
  return $12_1 | 0;
 }
 
 function $683($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : {
    if (!((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) == (1 | 0) & 1 | 0)) {
     break label$2
    }
    $12_1 = 14;
    break label$1;
   }
   $12_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  }
  return $12_1 | 0;
 }
 
 function $684($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $6_1 = 0, $69_1 = 0, $68_1 = 0, $65_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $68_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $68_1;
  }
  HEAP32[($4_1 + 8 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $1_1;
  $6_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) == (16 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = 14;
    break label$3;
   }
   label$5 : {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) == (15 | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = 13;
    break label$3;
   }
   label$6 : {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) == (HEAP32[$6_1 >> 2] | 0 | 0) & 1 | 0)) {
     break label$6
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = 12;
    break label$3;
   }
   label$7 : {
    label$8 : {
     if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
      break label$8
     }
     if ((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) <= (14 | 0) & 1 | 0) {
      break label$7
     }
    }
    fimport$1(2497 | 0, 2521 | 0, 49 | 0, 2535 | 0);
    abort();
   }
   HEAP32[($4_1 + 4 | 0) >> 2] = $683(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0;
   HEAP32[$4_1 >> 2] = $683(HEAP32[$6_1 >> 2] | 0 | 0) | 0;
   label$9 : {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) > (HEAP32[$4_1 >> 2] | 0 | 0) & 1 | 0)) {
     break label$9
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) - 3 | 0;
    break label$3;
   }
   HEAP32[($4_1 + 12 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) - 2 | 0;
  }
  $65_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  label$10 : {
   $69_1 = $4_1 + 16 | 0;
   if ($69_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $69_1;
  }
  return $65_1 | 0;
 }
 
 function $685($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $27_1 = 0, $87_1 = 0, $99_1 = 0, $98_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $98_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $98_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP8[($5_1 + 23 | 0) >> 0] = $2_1;
  HEAP8[($5_1 + 22 | 0) >> 0] = 0 & 1 | 0;
  $4($0_1 | 0, 2544 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) >= (2 | 0) & 1 | 0)) {
     break label$4
    }
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) <= (9 | 0) & 1 | 0)) {
     break label$4
    }
    $27_1 = 24;
    $686($0_1 | 0, (((HEAP32[($5_1 + 24 | 0) >> 2] | 0) + 48 | 0) << $27_1 | 0) >> $27_1 | 0 | 0) | 0;
    break label$3;
   }
   label$5 : {
    label$6 : {
     if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (1 | 0) & 1 | 0)) {
      break label$6
     }
     $687($0_1 | 0, 2545 | 0) | 0;
     break label$5;
    }
    label$7 : {
     label$8 : {
      if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (11 | 0) & 1 | 0)) {
       break label$8
      }
      $687($0_1 | 0, 2547 | 0) | 0;
      break label$7;
     }
     label$9 : {
      label$10 : {
       if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (13 | 0) & 1 | 0)) {
        break label$10
       }
       $687($0_1 | 0, 2549 | 0) | 0;
       break label$9;
      }
      label$11 : {
       label$12 : {
        if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (12 | 0) & 1 | 0)) {
         break label$12
        }
        $687($0_1 | 0, 2551 | 0) | 0;
        break label$11;
       }
       label$13 : {
        if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (10 | 0) & 1 | 0)) {
         break label$13
        }
        $687($0_1 | 0, 2553 | 0) | 0;
       }
      }
     }
    }
   }
  }
  label$14 : {
   label$15 : {
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (16 | 0) & 1 | 0)) {
     break label$15
    }
    $687($0_1 | 0, 2555 | 0) | 0;
    break label$14;
   }
   label$16 : {
    label$17 : {
     if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (15 | 0) & 1 | 0)) {
      break label$17
     }
     $687($0_1 | 0, 2558 | 0) | 0;
     break label$16;
    }
    $87_1 = 24;
    $686($0_1 | 0, ((HEAPU8[($5_1 + 23 | 0) >> 0] | 0) << $87_1 | 0) >> $87_1 | 0 | 0) | 0;
   }
  }
  HEAP8[($5_1 + 22 | 0) >> 0] = 1 & 1 | 0;
  label$18 : {
   if ((HEAPU8[($5_1 + 22 | 0) >> 0] | 0) & 1 | 0) {
    break label$18
   }
   $832($0_1 | 0) | 0;
  }
  label$19 : {
   $99_1 = $5_1 + 32 | 0;
   if ($99_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $99_1;
  }
  return;
 }
 
 function $686($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $7_1 = 0, $13_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP8[($4_1 + 11 | 0) >> 0] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $7_1 = 24;
  $853($5_1 | 0, ((HEAPU8[($4_1 + 11 | 0) >> 0] | 0) << $7_1 | 0) >> $7_1 | 0 | 0);
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $5_1 | 0;
 }
 
 function $687($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $852(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $688($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $30_1 = 0, $29_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $29_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  HEAP8[($4_1 + 23 | 0) >> 0] = 0 & 1 | 0;
  $4($0_1 | 0, 2544 | 0) | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    $687($0_1 | 0, 2561 | 0) | 0;
    HEAP32[($4_1 + 16 | 0) >> 2] = (HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  HEAP8[($4_1 + 23 | 0) >> 0] = 1 & 1 | 0;
  label$5 : {
   if ((HEAPU8[($4_1 + 23 | 0) >> 0] | 0) & 1 | 0) {
    break label$5
   }
   $832($0_1 | 0) | 0;
  }
  label$6 : {
   $30_1 = $4_1 + 32 | 0;
   if ($30_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  return;
 }
 
 function $689($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $11_1 = 0, $74_1 = 0, $84_1 = 0, $119_1 = 0, $118_1 = 0;
  $5_1 = global$0 - 128 | 0;
  label$1 : {
   $118_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $118_1;
  }
  $11_1 = $5_1 + 112 | 0;
  HEAP32[($5_1 + 124 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 120 | 0) >> 2] = $2_1;
  HEAP8[($5_1 + 119 | 0) >> 0] = 0 & 1 | 0;
  $4($0_1 | 0, 2544 | 0) | 0;
  $13($11_1 | 0) | 0;
  HEAP32[($5_1 + 104 | 0) >> 2] = $14($1_1 | 0) | 0;
  HEAP32[$11_1 >> 2] = HEAP32[($5_1 + 104 | 0) >> 2] | 0;
  label$3 : while (1) {
   HEAP32[($5_1 + 96 | 0) >> 2] = $15($1_1 | 0) | 0;
   label$4 : {
    if (!(($16($5_1 + 112 | 0 | 0, $5_1 + 96 | 0 | 0) | 0) & 1 | 0)) {
     break label$4
    }
    $690($5_1 + 80 | 0 | 0) | 0;
    HEAP32[($5_1 + 72 | 0) >> 2] = $691(($17($5_1 + 112 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
    HEAP32[($5_1 + 80 | 0) >> 2] = HEAP32[($5_1 + 72 | 0) >> 2] | 0;
    label$5 : while (1) {
     HEAP32[($5_1 + 64 | 0) >> 2] = $692(($17($5_1 + 112 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
     label$6 : {
      if (!(($257($5_1 + 80 | 0 | 0, $5_1 + 64 | 0 | 0) | 0) & 1 | 0)) {
       break label$6
      }
      $74_1 = 24;
      $685($5_1 + 32 | 0 | 0, HEAP32[($17($5_1 + 112 | 0 | 0) | 0) >> 2] | 0 | 0, ((HEAPU8[($258($5_1 + 80 | 0 | 0) | 0) >> 0] | 0) << $74_1 | 0) >> $74_1 | 0 | 0);
      $84_1 = 24;
      $693($5_1 + 48 | 0 | 0, $5_1 + 32 | 0 | 0, (32 << $84_1 | 0) >> $84_1 | 0 | 0);
      $42($0_1 | 0, $5_1 + 48 | 0 | 0) | 0;
      $832($5_1 + 48 | 0 | 0) | 0;
      $832($5_1 + 32 | 0 | 0) | 0;
      HEAP32[($5_1 + 24 | 0) >> 2] = $694($5_1 + 80 | 0 | 0, 0 | 0) | 0;
      continue label$5;
     }
     break label$5;
    };
    HEAP32[($5_1 + 16 | 0) >> 2] = $19($5_1 + 112 | 0 | 0, 0 | 0) | 0;
    continue label$3;
   }
   break label$3;
  };
  $688($5_1 | 0, HEAP32[($5_1 + 120 | 0) >> 2] | 0 | 0);
  $42($0_1 | 0, $5_1 | 0) | 0;
  $832($5_1 | 0) | 0;
  HEAP8[($5_1 + 119 | 0) >> 0] = 1 & 1 | 0;
  label$7 : {
   if ((HEAPU8[($5_1 + 119 | 0) >> 0] | 0) & 1 | 0) {
    break label$7
   }
   $832($0_1 | 0) | 0;
  }
  label$8 : {
   $119_1 = $5_1 + 128 | 0;
   if ($119_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $119_1;
  }
  return;
 }
 
 function $690($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $691($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $299(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $296($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $692($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$3_1 >> 2] = $295(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  $296($3_1 + 8 | 0 | 0, HEAP32[$3_1 >> 2] | 0 | 0) | 0;
  $10_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $693($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP8[($5_1 + 7 | 0) >> 0] = $2_1;
  $8_1 = 24;
  $853(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, ((HEAPU8[($5_1 + 7 | 0) >> 0] | 0) << $8_1 | 0) >> $8_1 | 0 | 0);
  $58($0_1 | 0, $57(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return;
 }
 
 function $694($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = HEAP32[$8_1 >> 2] | 0;
  $260($8_1 | 0) | 0;
  $10_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $695($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1, $7_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  $7_1 = $7_1 | 0;
  var $10_1 = 0, $40_1 = 0, $110_1 = 0, $129_1 = 0, $279_1 = 0, $278_1 = 0, $69_1 = 0, $70_1 = 0, $77_1 = 0, $191_1 = 0, $192_1 = 0, $199_1 = 0, $240_1 = 0, $241_1 = 0, $259_1 = 0, $275_1 = 0;
  $10_1 = global$0 - 160 | 0;
  label$1 : {
   $278_1 = $10_1;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $278_1;
  }
  HEAP32[($10_1 + 152 | 0) >> 2] = $0_1;
  HEAP32[($10_1 + 148 | 0) >> 2] = $1_1;
  HEAP32[($10_1 + 144 | 0) >> 2] = $2_1;
  HEAP32[($10_1 + 140 | 0) >> 2] = $3_1;
  HEAP32[($10_1 + 136 | 0) >> 2] = $4_1;
  HEAP8[($10_1 + 135 | 0) >> 0] = $5_1;
  HEAP32[($10_1 + 128 | 0) >> 2] = $6_1;
  HEAP32[($10_1 + 124 | 0) >> 2] = $7_1;
  label$3 : {
   if ((HEAP32[($10_1 + 144 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0) {
    break label$3
   }
   fimport$1(2565 | 0, 2521 | 0, 117 | 0, 2585 | 0);
   abort();
  }
  label$4 : {
   if ((((HEAP32[($10_1 + 144 | 0) >> 2] | 0) + (HEAP32[($10_1 + 140 | 0) >> 2] | 0) | 0) - 1 | 0 | 0) <= (14 | 0) & 1 | 0) {
    break label$4
   }
   fimport$1(2597 | 0, 2521 | 0, 118 | 0, 2585 | 0);
   abort();
  }
  $696(HEAP32[($10_1 + 128 | 0) >> 2] | 0 | 0);
  $40_1 = 24;
  label$5 : {
   label$6 : {
    label$7 : {
     if (!((((HEAPU8[($10_1 + 135 | 0) >> 0] | 0) << $40_1 | 0) >> $40_1 | 0 | 0) == (65 | 0) & 1 | 0)) {
      break label$7
     }
     HEAP32[($10_1 + 120 | 0) >> 2] = 0;
     HEAP32[($10_1 + 116 | 0) >> 2] = HEAP32[($10_1 + 144 | 0) >> 2] | 0;
     label$8 : {
      label$9 : while (1) {
       if (!((HEAP32[($10_1 + 116 | 0) >> 2] | 0 | 0) < ((HEAP32[($10_1 + 144 | 0) >> 2] | 0) + (HEAP32[($10_1 + 140 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
        break label$8
       }
       HEAP32[($10_1 + 112 | 0) >> 2] = 0;
       $69_1 = HEAP32[($10_1 + 136 | 0) >> 2] | 0;
       $70_1 = HEAP32[($10_1 + 152 | 0) >> 2] | 0;
       HEAP32[($10_1 + 104 | 0) >> 2] = $682(HEAP32[($10_1 + 116 | 0) >> 2] | 0 | 0) | 0;
       HEAP32[($10_1 + 108 | 0) >> 2] = $69_1 - ($18($697($70_1 | 0, $10_1 + 104 | 0 | 0) | 0 | 0) | 0) | 0;
       $77_1 = HEAP32[($8($10_1 + 112 | 0 | 0, $10_1 + 108 | 0 | 0) | 0) >> 2] | 0;
       HEAP32[($10_1 + 120 | 0) >> 2] = (HEAP32[($10_1 + 120 | 0) >> 2] | 0) + $77_1 | 0;
       HEAP32[($10_1 + 116 | 0) >> 2] = (HEAP32[($10_1 + 116 | 0) >> 2] | 0) + 1 | 0;
       continue label$9;
      };
     }
     label$10 : {
      if (!((HEAP32[($10_1 + 120 | 0) >> 2] | 0 | 0) > (HEAP32[($10_1 + 148 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$10
      }
      HEAP8[($10_1 + 159 | 0) >> 0] = 0 & 1 | 0;
      break label$5;
     }
     HEAP32[(HEAP32[($10_1 + 124 | 0) >> 2] | 0) >> 2] = HEAP32[($10_1 + 120 | 0) >> 2] | 0;
     HEAP32[($10_1 + 100 | 0) >> 2] = HEAP32[($10_1 + 144 | 0) >> 2] | 0;
     label$11 : {
      label$12 : while (1) {
       if (!((HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0) < ((HEAP32[($10_1 + 144 | 0) >> 2] | 0) + (HEAP32[($10_1 + 140 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
        break label$11
       }
       $110_1 = $10_1 + 88 | 0;
       HEAP32[($10_1 + 96 | 0) >> 2] = $682(HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0) | 0;
       $690($110_1 | 0) | 0;
       HEAP32[($10_1 + 84 | 0) >> 2] = 0;
       HEAP32[($10_1 + 80 | 0) >> 2] = $691($698(HEAP32[($10_1 + 152 | 0) >> 2] | 0 | 0, $10_1 + 96 | 0 | 0) | 0 | 0) | 0;
       HEAP32[$110_1 >> 2] = HEAP32[($10_1 + 80 | 0) >> 2] | 0;
       label$13 : while (1) {
        $129_1 = 0;
        label$14 : {
         if (!((HEAP32[($10_1 + 84 | 0) >> 2] | 0 | 0) < (HEAP32[($10_1 + 136 | 0) >> 2] | 0 | 0) & 1 | 0)) {
          break label$14
         }
         HEAP32[($10_1 + 72 | 0) >> 2] = $692($698(HEAP32[($10_1 + 152 | 0) >> 2] | 0 | 0, $10_1 + 96 | 0 | 0) | 0 | 0) | 0;
         $129_1 = $257($10_1 + 88 | 0 | 0, $10_1 + 72 | 0 | 0) | 0;
        }
        label$15 : {
         if (!($129_1 & 1 | 0)) {
          break label$15
         }
         HEAP32[($10_1 + 64 | 0) >> 2] = $699($698(HEAP32[($10_1 + 128 | 0) >> 2] | 0 | 0, $10_1 + 96 | 0 | 0) | 0 | 0, $258($10_1 + 88 | 0 | 0) | 0 | 0) | 0;
         HEAP32[($10_1 + 84 | 0) >> 2] = (HEAP32[($10_1 + 84 | 0) >> 2] | 0) + 1 | 0;
         HEAP32[($10_1 + 56 | 0) >> 2] = $694($10_1 + 88 | 0 | 0, 0 | 0) | 0;
         continue label$13;
        }
        break label$13;
       };
       HEAP32[($10_1 + 100 | 0) >> 2] = (HEAP32[($10_1 + 100 | 0) >> 2] | 0) + 1 | 0;
       continue label$12;
      };
     }
     break label$6;
    }
    HEAP32[($10_1 + 52 | 0) >> 2] = 0;
    HEAP32[($10_1 + 48 | 0) >> 2] = HEAP32[($10_1 + 144 | 0) >> 2] | 0;
    label$16 : {
     label$17 : while (1) {
      if (!((HEAP32[($10_1 + 48 | 0) >> 2] | 0 | 0) < ((HEAP32[($10_1 + 144 | 0) >> 2] | 0) + (HEAP32[($10_1 + 140 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
       break label$16
      }
      HEAP32[($10_1 + 44 | 0) >> 2] = 0;
      $191_1 = HEAP32[($10_1 + 136 | 0) >> 2] | 0;
      $192_1 = HEAP32[($10_1 + 152 | 0) >> 2] | 0;
      HEAP32[($10_1 + 36 | 0) >> 2] = $682(HEAP32[($10_1 + 48 | 0) >> 2] | 0 | 0) | 0;
      HEAP32[($10_1 + 40 | 0) >> 2] = $191_1 - ($700($697($192_1 | 0, $10_1 + 36 | 0 | 0) | 0 | 0, $10_1 + 135 | 0 | 0) | 0) | 0;
      $199_1 = HEAP32[($8($10_1 + 44 | 0 | 0, $10_1 + 40 | 0 | 0) | 0) >> 2] | 0;
      HEAP32[($10_1 + 52 | 0) >> 2] = (HEAP32[($10_1 + 52 | 0) >> 2] | 0) + $199_1 | 0;
      HEAP32[($10_1 + 48 | 0) >> 2] = (HEAP32[($10_1 + 48 | 0) >> 2] | 0) + 1 | 0;
      continue label$17;
     };
    }
    label$18 : {
     if (!((HEAP32[($10_1 + 52 | 0) >> 2] | 0 | 0) > (HEAP32[($10_1 + 148 | 0) >> 2] | 0 | 0) & 1 | 0)) {
      break label$18
     }
     HEAP8[($10_1 + 159 | 0) >> 0] = 0 & 1 | 0;
     break label$5;
    }
    HEAP32[(HEAP32[($10_1 + 124 | 0) >> 2] | 0) >> 2] = HEAP32[($10_1 + 52 | 0) >> 2] | 0;
    HEAP32[($10_1 + 32 | 0) >> 2] = HEAP32[($10_1 + 144 | 0) >> 2] | 0;
    label$19 : {
     label$20 : while (1) {
      if (!((HEAP32[($10_1 + 32 | 0) >> 2] | 0 | 0) < ((HEAP32[($10_1 + 144 | 0) >> 2] | 0) + (HEAP32[($10_1 + 140 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
       break label$19
      }
      HEAP32[($10_1 + 28 | 0) >> 2] = 0;
      label$21 : {
       label$22 : while (1) {
        $240_1 = HEAP32[($10_1 + 28 | 0) >> 2] | 0;
        $241_1 = HEAP32[($10_1 + 152 | 0) >> 2] | 0;
        HEAP32[($10_1 + 20 | 0) >> 2] = $682(HEAP32[($10_1 + 32 | 0) >> 2] | 0 | 0) | 0;
        HEAP32[($10_1 + 24 | 0) >> 2] = $700($697($241_1 | 0, $10_1 + 20 | 0 | 0) | 0 | 0, $10_1 + 135 | 0 | 0) | 0;
        if (!(($240_1 | 0) < (HEAP32[($9($10_1 + 136 | 0 | 0, $10_1 + 24 | 0 | 0) | 0) >> 2] | 0 | 0) & 1 | 0)) {
         break label$21
        }
        $259_1 = HEAP32[($10_1 + 128 | 0) >> 2] | 0;
        HEAP32[($10_1 + 16 | 0) >> 2] = $682(HEAP32[($10_1 + 32 | 0) >> 2] | 0 | 0) | 0;
        HEAP32[($10_1 + 8 | 0) >> 2] = $699($697($259_1 | 0, $10_1 + 16 | 0 | 0) | 0 | 0, $10_1 + 135 | 0 | 0) | 0;
        HEAP32[($10_1 + 28 | 0) >> 2] = (HEAP32[($10_1 + 28 | 0) >> 2] | 0) + 1 | 0;
        continue label$22;
       };
      }
      HEAP32[($10_1 + 32 | 0) >> 2] = (HEAP32[($10_1 + 32 | 0) >> 2] | 0) + 1 | 0;
      continue label$20;
     };
    }
   }
   HEAP8[($10_1 + 159 | 0) >> 0] = 1 & 1 | 0;
  }
  $275_1 = (HEAPU8[($10_1 + 159 | 0) >> 0] | 0) & 1 | 0;
  label$23 : {
   $279_1 = $10_1 + 160 | 0;
   if ($279_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $279_1;
  }
  return $275_1 | 0;
 }
 
 function $696($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $701(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return;
 }
 
 function $697($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $27_1 = 0, $26_1 = 0, $15_1 = 0, $16_1 = 0, $23_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $26_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  $7_1 = $4_1 + 32 | 0;
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $15_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  $16_1 = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $703($702(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $704();
  $705($7_1 | 0, $15_1 | 0, $16_1 | 0, 2708 | 0, $4_1 + 24 | 0 | 0, $4_1 + 16 | 0 | 0);
  $23_1 = ($26($25($7_1 | 0) | 0 | 0) | 0) + 4 | 0;
  label$3 : {
   $27_1 = $4_1 + 48 | 0;
   if ($27_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $27_1;
  }
  return $23_1 | 0;
 }
 
 function $698($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $7_1 = 0, $26_1 = 0, $25_1 = 0, $15_1 = 0, $16_1 = 0, $22_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $25_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  $7_1 = $4_1 + 32 | 0;
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $15_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  $16_1 = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $706(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  $704();
  $707($7_1 | 0, $15_1 | 0, $16_1 | 0, 2708 | 0, $4_1 + 24 | 0 | 0, $4_1 + 16 | 0 | 0);
  $22_1 = ($26($25($7_1 | 0) | 0 | 0) | 0) + 4 | 0;
  label$3 : {
   $26_1 = $4_1 + 48 | 0;
   if ($26_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $26_1;
  }
  return $22_1 | 0;
 }
 
 function $699($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $15_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $708(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  $296($4_1 + 24 | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $12_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $16_1 = $4_1 + 32 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $700($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $10_1 = 0, $7_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $7_1 = $709(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $701($0_1) {
  $0_1 = $0_1 | 0;
  var $5_1 = 0, $3_1 = 0, $4_1 = 0, $14_1 = 0, $13_1 = 0, $8_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  $4_1 = 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $160($5_1 | 0, $159($5_1 | 0) | 0 | 0);
  HEAP32[($401($5_1 | 0) | 0) >> 2] = $4_1;
  $8_1 = $352($5_1 | 0) | 0;
  HEAP32[($350($5_1 | 0) | 0) >> 2] = $8_1;
  HEAP32[($352($5_1 | 0) | 0) >> 2] = $4_1;
  label$3 : {
   $14_1 = $3_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return;
 }
 
 function $702($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $703($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $724($3_1 + 8 | 0 | 0, $269(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $704() {
  var $2_1 = 0, $9_1 = 0, $8_1 = 0;
  $2_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  $725($2_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $9_1 = $2_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return;
 }
 
 function $705($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $8_1 = 0, $28_1 = 0, $14_1 = 0, $42_1 = 0, $50_1 = 0, $49_1 = 0;
  $8_1 = global$0 - 64 | 0;
  label$1 : {
   $49_1 = $8_1;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $49_1;
  }
  HEAP32[($8_1 + 60 | 0) >> 2] = $1_1;
  HEAP32[($8_1 + 56 | 0) >> 2] = $2_1;
  HEAP32[($8_1 + 52 | 0) >> 2] = $3_1;
  HEAP32[($8_1 + 48 | 0) >> 2] = $4_1;
  HEAP32[($8_1 + 44 | 0) >> 2] = $5_1;
  $14_1 = HEAP32[($8_1 + 60 | 0) >> 2] | 0;
  HEAP32[($8_1 + 36 | 0) >> 2] = $393($14_1 | 0, $8_1 + 40 | 0 | 0, HEAP32[($8_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($8_1 + 32 | 0) >> 2] = HEAP32[(HEAP32[($8_1 + 36 | 0) >> 2] | 0) >> 2] | 0;
  HEAP8[($8_1 + 31 | 0) >> 0] = 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($8_1 + 36 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
    break label$3
   }
   $28_1 = $8_1 + 16 | 0;
   $722($28_1 | 0, $14_1 | 0, $719(HEAP32[($8_1 + 52 | 0) >> 2] | 0 | 0) | 0 | 0, $720(HEAP32[($8_1 + 48 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($8_1 + 44 | 0) >> 2] | 0 | 0) | 0 | 0);
   $383($14_1 | 0, HEAP32[($8_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 36 | 0) >> 2] | 0 | 0, $382($28_1 | 0) | 0 | 0);
   HEAP32[($8_1 + 32 | 0) >> 2] = $384($28_1 | 0) | 0;
   HEAP8[($8_1 + 31 | 0) >> 0] = 1;
   $385($28_1 | 0) | 0;
  }
  $42_1 = $8_1 + 8 | 0;
  $386($42_1 | 0, HEAP32[($8_1 + 32 | 0) >> 2] | 0 | 0) | 0;
  $723($0_1 | 0, $42_1 | 0, $8_1 + 31 | 0 | 0) | 0;
  label$4 : {
   $50_1 = $8_1 + 64 | 0;
   if ($50_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $50_1;
  }
  return;
 }
 
 function $706($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($3_1 + 4 | 0) >> 2] = $0_1;
  $746($3_1 + 8 | 0 | 0, $745(HEAP32[($3_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $3_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $707($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $8_1 = 0, $28_1 = 0, $14_1 = 0, $42_1 = 0, $50_1 = 0, $49_1 = 0;
  $8_1 = global$0 - 64 | 0;
  label$1 : {
   $49_1 = $8_1;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $49_1;
  }
  HEAP32[($8_1 + 60 | 0) >> 2] = $1_1;
  HEAP32[($8_1 + 56 | 0) >> 2] = $2_1;
  HEAP32[($8_1 + 52 | 0) >> 2] = $3_1;
  HEAP32[($8_1 + 48 | 0) >> 2] = $4_1;
  HEAP32[($8_1 + 44 | 0) >> 2] = $5_1;
  $14_1 = HEAP32[($8_1 + 60 | 0) >> 2] | 0;
  HEAP32[($8_1 + 36 | 0) >> 2] = $393($14_1 | 0, $8_1 + 40 | 0 | 0, HEAP32[($8_1 + 56 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($8_1 + 32 | 0) >> 2] = HEAP32[(HEAP32[($8_1 + 36 | 0) >> 2] | 0) >> 2] | 0;
  HEAP8[($8_1 + 31 | 0) >> 0] = 0;
  label$3 : {
   if (!((HEAP32[(HEAP32[($8_1 + 36 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
    break label$3
   }
   $28_1 = $8_1 + 16 | 0;
   $744($28_1 | 0, $14_1 | 0, $719(HEAP32[($8_1 + 52 | 0) >> 2] | 0 | 0) | 0 | 0, $743(HEAP32[($8_1 + 48 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($8_1 + 44 | 0) >> 2] | 0 | 0) | 0 | 0);
   $383($14_1 | 0, HEAP32[($8_1 + 40 | 0) >> 2] | 0 | 0, HEAP32[($8_1 + 36 | 0) >> 2] | 0 | 0, $382($28_1 | 0) | 0 | 0);
   HEAP32[($8_1 + 32 | 0) >> 2] = $384($28_1 | 0) | 0;
   HEAP8[($8_1 + 31 | 0) >> 0] = 1;
   $385($28_1 | 0) | 0;
  }
  $42_1 = $8_1 + 8 | 0;
  $386($42_1 | 0, HEAP32[($8_1 + 32 | 0) >> 2] | 0 | 0) | 0;
  $723($0_1 | 0, $42_1 | 0, $8_1 + 31 | 0 | 0) | 0;
  label$4 : {
   $50_1 = $8_1 + 64 | 0;
   if ($50_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $50_1;
  }
  return;
 }
 
 function $708($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $13_1 = 0, $12_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $12_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $756(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, $277(HEAP32[$4_1 >> 2] | 0 | 0) | 0 | 0) | 0;
  $9_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $13_1 = $4_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $9_1 | 0;
 }
 
 function $709($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $54_1 = 0, $53_1 = 0, $50_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $53_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $53_1;
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $180($5_1 | 0) | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $174($5_1 | 0) | 0;
  label$3 : {
   label$4 : {
    label$5 : while (1) {
     if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
      break label$4
     }
     label$6 : {
      label$7 : {
       if (!(($298($240($5_1 | 0) | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, (HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0) | 0) & 1 | 0)) {
        break label$7
       }
       HEAP32[($4_1 + 16 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
       HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
       break label$6;
      }
      label$8 : {
       label$9 : {
        if (!(($298($240($5_1 | 0) | 0 | 0, (HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
         break label$9
        }
        HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
        break label$8;
       }
       HEAP32[($4_1 + 8 | 0) >> 2] = $757($5_1 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
       HEAP32[$4_1 >> 2] = $758($5_1 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
       HEAP32[($4_1 + 28 | 0) >> 2] = $759(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0) | 0;
       break label$3;
      }
     }
     continue label$5;
    };
   }
   HEAP32[($4_1 + 28 | 0) >> 2] = 0;
  }
  $50_1 = HEAP32[($4_1 + 28 | 0) >> 2] | 0;
  label$10 : {
   $54_1 = $4_1 + 32 | 0;
   if ($54_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $54_1;
  }
  return $50_1 | 0;
 }
 
 function $710($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $6_1 = 0, $16_1 = 0, $25_1 = 0, $32_1 = 0, $43_1 = 0, $54_1 = 0, $65_1 = 0, $76_1 = 0, $87_1 = 0, $104_1 = 0, $103_1 = 0, $100_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $103_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $103_1;
  }
  HEAP8[($3_1 + 11 | 0) >> 0] = $0_1;
  $6_1 = 24;
  label$3 : {
   label$4 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $6_1 | 0) >> $6_1 | 0 | 0) >= (50 | 0) & 1 | 0)) {
     break label$4
    }
    $16_1 = 24;
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $16_1 | 0) >> $16_1 | 0 | 0) <= (57 | 0) & 1 | 0)) {
     break label$4
    }
    $25_1 = 24;
    HEAP32[($3_1 + 12 | 0) >> 2] = (((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $25_1 | 0) >> $25_1 | 0) - 48 | 0;
    break label$3;
   }
   $32_1 = 24;
   label$5 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $32_1 | 0) >> $32_1 | 0 | 0) == (65 | 0) & 1 | 0)) {
     break label$5
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 1;
    break label$3;
   }
   $43_1 = 24;
   label$6 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $43_1 | 0) >> $43_1 | 0 | 0) == (74 | 0) & 1 | 0)) {
     break label$6
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 11;
    break label$3;
   }
   $54_1 = 24;
   label$7 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $54_1 | 0) >> $54_1 | 0 | 0) == (81 | 0) & 1 | 0)) {
     break label$7
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 12;
    break label$3;
   }
   $65_1 = 24;
   label$8 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $65_1 | 0) >> $65_1 | 0 | 0) == (75 | 0) & 1 | 0)) {
     break label$8
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 13;
    break label$3;
   }
   $76_1 = 24;
   label$9 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $76_1 | 0) >> $76_1 | 0 | 0) == (48 | 0) & 1 | 0)) {
     break label$9
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 10;
    break label$3;
   }
   $87_1 = 24;
   label$10 : {
    if (!((((HEAPU8[($3_1 + 11 | 0) >> 0] | 0) << $87_1 | 0) >> $87_1 | 0 | 0) == (88 | 0) & 1 | 0)) {
     break label$10
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = 15;
    break label$3;
   }
   fimport$1(2631 | 0, 2521 | 0, 185 | 0, 2655 | 0);
   abort();
  }
  $100_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$11 : {
   $104_1 = $3_1 + 16 | 0;
   if ($104_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $104_1;
  }
  return $100_1 | 0;
 }
 
 function $711($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $8_1 = 0, $43_1 = 0, $54_1 = 0, $65_1 = 0, $74_1 = 0, $73_1 = 0;
  $5_1 = global$0 - 32 | 0;
  label$1 : {
   $73_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $73_1;
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP8[($5_1 + 27 | 0) >> 0] = $1_1;
  HEAP8[($5_1 + 26 | 0) >> 0] = $2_1;
  $8_1 = 24;
  HEAP32[($5_1 + 20 | 0) >> 2] = $710(((HEAPU8[($5_1 + 27 | 0) >> 0] | 0) << $8_1 | 0) >> $8_1 | 0 | 0) | 0;
  label$3 : {
   label$4 : {
    if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
     break label$4
    }
    if ((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) <= (15 | 0) & 1 | 0) {
     break label$3
    }
   }
   fimport$1(2673 | 0, 2521 | 0, 190 | 0, 2700 | 0);
   abort();
  }
  $712($5_1 + 8 | 0 | 0) | 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  HEAP8[($5_1 + 12 | 0) >> 0] = HEAPU8[($5_1 + 26 | 0) >> 0] | 0;
  label$5 : {
   if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) == (15 | 0) & 1 | 0)) {
    break label$5
   }
   $43_1 = 24;
   label$6 : {
    label$7 : {
     if (!((((HEAPU8[($5_1 + 26 | 0) >> 0] | 0) << $43_1 | 0) >> $43_1 | 0 | 0) == (82 | 0) & 1 | 0)) {
      break label$7
     }
     HEAP32[($5_1 + 8 | 0) >> 2] = 16;
     break label$6;
    }
    $54_1 = 24;
    label$8 : {
     if (!((((HEAPU8[($5_1 + 26 | 0) >> 0] | 0) << $54_1 | 0) >> $54_1 | 0 | 0) == (66 | 0) & 1 | 0)) {
      break label$8
     }
     HEAP32[($5_1 + 8 | 0) >> 2] = 15;
    }
   }
  }
  $65_1 = $5_1 + 8 | 0;
  HEAP32[$5_1 >> 2] = $699($698(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, $65_1 | 0) | 0 | 0, $65_1 + 4 | 0 | 0) | 0;
  label$9 : {
   $74_1 = $5_1 + 32 | 0;
   if ($74_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $74_1;
  }
  return;
 }
 
 function $712($0_1) {
  $0_1 = $0_1 | 0;
  var $6_1 = 0, $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = 0;
  HEAP8[($6_1 + 4 | 0) >> 0] = 0;
  return $6_1 | 0;
 }
 
 function $713($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $58_1 = 0, $10_1 = 0, $30_1 = 0, $64_1 = 0, $84_1 = 0, $93_1 = 0, $98_1 = 0, $138_1 = 0, $137_1 = 0, $119_1 = 0, $134_1 = 0;
  $4_1 = global$0 - 112 | 0;
  label$1 : {
   $137_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $137_1;
  }
  $10_1 = $4_1 + 96 | 0;
  HEAP32[($4_1 + 104 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 100 | 0) >> 2] = $1_1;
  $13($10_1 | 0) | 0;
  HEAP32[($4_1 + 88 | 0) >> 2] = $14(HEAP32[($4_1 + 100 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$10_1 >> 2] = HEAP32[($4_1 + 88 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    label$5 : while (1) {
     HEAP32[($4_1 + 80 | 0) >> 2] = $15(HEAP32[($4_1 + 100 | 0) >> 2] | 0 | 0) | 0;
     if (!(($16($4_1 + 96 | 0 | 0, $4_1 + 80 | 0 | 0) | 0) & 1 | 0)) {
      break label$4
     }
     $30_1 = $4_1 + 72 | 0;
     $690($30_1 | 0) | 0;
     HEAP32[($4_1 + 64 | 0) >> 2] = $691(($17($4_1 + 96 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
     HEAP32[$30_1 >> 2] = HEAP32[($4_1 + 64 | 0) >> 2] | 0;
     label$6 : {
      label$7 : while (1) {
       HEAP32[($4_1 + 56 | 0) >> 2] = $692(($17($4_1 + 96 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
       if (!(($257($4_1 + 72 | 0 | 0, $4_1 + 56 | 0 | 0) | 0) & 1 | 0)) {
        break label$6
       }
       $58_1 = $4_1 + 48 | 0;
       $64_1 = $4_1 + 96 | 0;
       $690($58_1 | 0) | 0;
       HEAP32[($4_1 + 40 | 0) >> 2] = $714($698(HEAP32[($4_1 + 104 | 0) >> 2] | 0 | 0, $17($64_1 | 0) | 0 | 0) | 0 | 0, $258($4_1 + 72 | 0 | 0) | 0 | 0) | 0;
       HEAP32[$58_1 >> 2] = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
       HEAP32[($4_1 + 32 | 0) >> 2] = $692($698(HEAP32[($4_1 + 104 | 0) >> 2] | 0 | 0, $17($64_1 | 0) | 0 | 0) | 0 | 0) | 0;
       $84_1 = 1;
       label$8 : {
        if (($276($58_1 | 0, $4_1 + 32 | 0 | 0) | 0) & 1 | 0) {
         break label$8
        }
        $93_1 = 24;
        $98_1 = 24;
        $84_1 = (((HEAPU8[($258($4_1 + 48 | 0 | 0) | 0) >> 0] | 0) << $93_1 | 0) >> $93_1 | 0 | 0) != (((HEAPU8[($258($4_1 + 72 | 0 | 0) | 0) >> 0] | 0) << $98_1 | 0) >> $98_1 | 0 | 0);
       }
       label$9 : {
        if (!($84_1 & 1 | 0)) {
         break label$9
        }
        HEAP32[($4_1 + 108 | 0) >> 2] = -1;
        break label$3;
       }
       $119_1 = $698(HEAP32[($4_1 + 104 | 0) >> 2] | 0 | 0, $17($4_1 + 96 | 0 | 0) | 0 | 0) | 0;
       HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[($4_1 + 48 | 0) >> 2] | 0;
       HEAP32[($4_1 + 16 | 0) >> 2] = $715($119_1 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0;
       HEAP32[($4_1 + 8 | 0) >> 2] = $694($4_1 + 72 | 0 | 0, 0 | 0) | 0;
       continue label$7;
      };
     }
     HEAP32[$4_1 >> 2] = $19($4_1 + 96 | 0 | 0, 0 | 0) | 0;
     continue label$5;
    };
   }
   HEAP32[($4_1 + 108 | 0) >> 2] = 0;
  }
  $134_1 = HEAP32[($4_1 + 108 | 0) >> 2] | 0;
  label$10 : {
   $138_1 = $4_1 + 112 | 0;
   if ($138_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $138_1;
  }
  return $134_1 | 0;
 }
 
 function $714($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $16_1 = 0, $15_1 = 0, $12_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $15_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $716(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  $296($4_1 + 24 | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $12_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $16_1 = $4_1 + 32 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $12_1 | 0;
 }
 
 function $715($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $21_1 = 0, $20_1 = 0, $12_1 = 0, $17_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $20_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  $12_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $717($12_1 | 0, HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  $296($4_1 + 24 | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $17_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $21_1 = $4_1 + 32 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return $17_1 | 0;
 }
 
 function $716($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $14_1 = 0, $13_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $13_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $761($5_1 | 0, HEAP32[$4_1 >> 2] | 0 | 0, $174($5_1 | 0) | 0 | 0, $254($5_1 | 0) | 0 | 0) | 0;
  $10_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$3 : {
   $14_1 = $4_1 + 16 | 0;
   if ($14_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  return $10_1 | 0;
 }
 
 function $717($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $9_1 = 0, $23_1 = 0, $22_1 = 0, $19_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $22_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  $8_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  $9_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $279($8_1 | 0) | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $762($9_1 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $176($9_1 | 0) | 0;
  $178(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, $177($258($8_1 | 0) | 0 | 0) | 0 | 0);
  $179(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, 1 | 0);
  $19_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  label$3 : {
   $23_1 = $4_1 + 32 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $19_1 | 0;
 }
 
 function $718($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $10_1 = 0, $30_1 = 0, $80_1 = 0, $79_1 = 0, $76_1 = 0;
  $4_1 = global$0 - 80 | 0;
  label$1 : {
   $79_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $79_1;
  }
  $10_1 = $4_1 + 64 | 0;
  HEAP32[($4_1 + 76 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 72 | 0) >> 2] = $1_1;
  $13($10_1 | 0) | 0;
  HEAP32[($4_1 + 56 | 0) >> 2] = $14(HEAP32[($4_1 + 72 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$10_1 >> 2] = HEAP32[($4_1 + 56 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    HEAP32[($4_1 + 48 | 0) >> 2] = $15(HEAP32[($4_1 + 72 | 0) >> 2] | 0 | 0) | 0;
    if (!(($16($4_1 + 64 | 0 | 0, $4_1 + 48 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    $30_1 = $4_1 + 40 | 0;
    $690($30_1 | 0) | 0;
    HEAP32[($4_1 + 32 | 0) >> 2] = $691(($17($4_1 + 64 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
    HEAP32[$30_1 >> 2] = HEAP32[($4_1 + 32 | 0) >> 2] | 0;
    label$5 : {
     label$6 : while (1) {
      HEAP32[($4_1 + 24 | 0) >> 2] = $692(($17($4_1 + 64 | 0 | 0) | 0) + 4 | 0 | 0) | 0;
      if (!(($257($4_1 + 40 | 0 | 0, $4_1 + 24 | 0 | 0) | 0) & 1 | 0)) {
       break label$5
      }
      HEAP32[($4_1 + 16 | 0) >> 2] = $699($698(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, $17($4_1 + 64 | 0 | 0) | 0 | 0) | 0 | 0, $258($4_1 + 40 | 0 | 0) | 0 | 0) | 0;
      HEAP32[($4_1 + 8 | 0) >> 2] = $694($4_1 + 40 | 0 | 0, 0 | 0) | 0;
      continue label$6;
     };
    }
    HEAP32[$4_1 >> 2] = $19($4_1 + 64 | 0 | 0, 0 | 0) | 0;
    continue label$4;
   };
  }
  $76_1 = 0;
  label$7 : {
   $80_1 = $4_1 + 80 | 0;
   if ($80_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $80_1;
  }
  return $76_1 | 0;
 }
 
 function $719($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $720($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $721($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $722($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $10_1 = 0, $11_1 = 0, $44_1 = 0, $43_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $43_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $43_1;
  }
  $10_1 = $7_1 + 8 | 0;
  $11_1 = 0;
  HEAP32[($7_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $4_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $161(HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  HEAP8[($7_1 + 23 | 0) >> 0] = $11_1 & 1 | 0;
  $18_1 = $395(HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, 1 | 0) | 0;
  $396($10_1 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $11_1 & 1 | 0 | 0) | 0;
  $397($0_1 | 0, $18_1 | 0, $10_1 | 0) | 0;
  $726(HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $162(($398($0_1 | 0) | 0) + 16 | 0 | 0) | 0 | 0, $719(HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0, $720(HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP8[(($400($0_1 | 0) | 0) + 4 | 0) >> 0] = 1;
  HEAP8[($7_1 + 23 | 0) >> 0] = 1 & 1 | 0;
  label$3 : {
   if ((HEAPU8[($7_1 + 23 | 0) >> 0] | 0) & 1 | 0) {
    break label$3
   }
   $385($0_1 | 0) | 0;
  }
  label$4 : {
   $44_1 = $7_1 + 48 | 0;
   if ($44_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $44_1;
  }
  return;
 }
 
 function $723($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $18_1 = 0, $17_1 = 0;
  $5_1 = global$0 - 16 | 0;
  label$1 : {
   $17_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($727(HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  HEAP8[($6_1 + 4 | 0) >> 0] = (HEAPU8[($728(HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0) >> 0] | 0) & 1 | 0;
  label$3 : {
   $18_1 = $5_1 + 16 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return $6_1 | 0;
 }
 
 function $724($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  $741($5_1 | 0, $269(HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 48 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $725($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $726($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $19_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $4_1;
  $729(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $719(HEAP32[($7_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0, $720(HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $19_1 = $7_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $727($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $728($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $729($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $19_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($7_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 8 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 4 | 0) >> 2] = $4_1;
  $730(HEAP32[($7_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0, $719(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0, $720(HEAP32[($7_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $19_1 = $7_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $730($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $21_1 = 0, $20_1 = 0, $11_1 = 0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $20_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($7_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $4_1;
  $11_1 = HEAP32[($7_1 + 40 | 0) >> 2] | 0;
  $719(HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($7_1 + 16 | 0) >> 2] = HEAP32[($720(HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  $721(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0) | 0;
  $731($11_1 | 0, HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $21_1 = $7_1 + 48 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return;
 }
 
 function $731($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $15_1 = 0, $14_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  $11_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  $732($11_1 | 0, $4_1 + 32 | 0 | 0, $4_1 + 24 | 0 | 0) | 0;
  label$3 : {
   $15_1 = $4_1 + 48 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $732($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($734($733(HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0 | 0) | 0) >> 2] | 0;
  $735($6_1 + 4 | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 48 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $733($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $736(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $734($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $735($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $7_1 = 0, $11_1 = 0, $10_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $7_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $737($7_1 | 0, $3_1 + 8 | 0 | 0) | 0;
  label$3 : {
   $11_1 = $3_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $7_1 | 0;
 }
 
 function $736($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $737($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $20_1 = 0, $19_1 = 0, $15_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $19_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $738($5_1 + 4 | 0 | 0) | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  $253($5_1 + 8 | 0 | 0, $4_1 + 4 | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $15_1 = $254($5_1 | 0) | 0;
  HEAP32[($255($5_1 | 0) | 0) >> 2] = $15_1;
  label$3 : {
   $20_1 = $4_1 + 16 | 0;
   if ($20_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  return $5_1 | 0;
 }
 
 function $738($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $266($4_1 | 0) | 0;
  $739($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $739($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $740($4_1 | 0) | 0;
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $740($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $741($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $742($5_1 | 0, $269(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 48 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $742($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $269(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $743($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $744($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $10_1 = 0, $11_1 = 0, $44_1 = 0, $43_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $43_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $43_1;
  }
  $10_1 = $7_1 + 8 | 0;
  $11_1 = 0;
  HEAP32[($7_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $4_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $161(HEAP32[($7_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  HEAP8[($7_1 + 23 | 0) >> 0] = $11_1 & 1 | 0;
  $18_1 = $395(HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, 1 | 0) | 0;
  $396($10_1 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $11_1 & 1 | 0 | 0) | 0;
  $397($0_1 | 0, $18_1 | 0, $10_1 | 0) | 0;
  $747(HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $162(($398($0_1 | 0) | 0) + 16 | 0 | 0) | 0 | 0, $719(HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0) | 0 | 0, $743(HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0) | 0 | 0);
  HEAP8[(($400($0_1 | 0) | 0) + 4 | 0) >> 0] = 1;
  HEAP8[($7_1 + 23 | 0) >> 0] = 1 & 1 | 0;
  label$3 : {
   if ((HEAPU8[($7_1 + 23 | 0) >> 0] | 0) & 1 | 0) {
    break label$3
   }
   $385($0_1 | 0) | 0;
  }
  label$4 : {
   $44_1 = $7_1 + 48 | 0;
   if ($44_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $44_1;
  }
  return;
 }
 
 function $745($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0;
 }
 
 function $746($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $10_1 = 0, $9_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($4_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 40 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
  $754($5_1 | 0, HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $4_1 + 48 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $5_1 | 0;
 }
 
 function $747($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $19_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $4_1;
  $748(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0, $719(HEAP32[($7_1 + 20 | 0) >> 2] | 0 | 0) | 0 | 0, $743(HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $19_1 = $7_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $748($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $19_1 = 0, $18_1 = 0;
  $7_1 = global$0 - 32 | 0;
  label$1 : {
   $18_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  HEAP32[($7_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 8 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 4 | 0) >> 2] = $4_1;
  $749(HEAP32[($7_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0, $719(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0, $743(HEAP32[($7_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0, $721(HEAP32[($7_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0);
  label$3 : {
   $19_1 = $7_1 + 32 | 0;
   if ($19_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $19_1;
  }
  return;
 }
 
 function $749($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $21_1 = 0, $20_1 = 0, $11_1 = 0;
  $7_1 = global$0 - 48 | 0;
  label$1 : {
   $20_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $20_1;
  }
  HEAP32[($7_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 32 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $4_1;
  $11_1 = HEAP32[($7_1 + 40 | 0) >> 2] | 0;
  $719(HEAP32[($7_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($7_1 + 16 | 0) >> 2] = HEAP32[($743(HEAP32[($7_1 + 32 | 0) >> 2] | 0 | 0) | 0) >> 2] | 0;
  $721(HEAP32[($7_1 + 28 | 0) >> 2] | 0 | 0) | 0;
  $750($11_1 | 0, HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $21_1 = $7_1 + 48 | 0;
   if ($21_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $21_1;
  }
  return;
 }
 
 function $750($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $11_1 = 0, $15_1 = 0, $14_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $14_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $14_1;
  }
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $0_1;
  $11_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  $751($11_1 | 0, $4_1 + 32 | 0 | 0, $4_1 + 24 | 0 | 0) | 0;
  label$3 : {
   $15_1 = $4_1 + 48 | 0;
   if ($15_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  return $11_1 | 0;
 }
 
 function $751($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $6_1 = 0, $16_1 = 0, $15_1 = 0;
  $5_1 = global$0 - 48 | 0;
  label$1 : {
   $15_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $2_1;
  $6_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  HEAP32[$6_1 >> 2] = HEAP32[($745($752(HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0 | 0) | 0) >> 2] | 0;
  $735($6_1 + 4 | 0 | 0) | 0;
  label$3 : {
   $16_1 = $5_1 + 48 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return $6_1 | 0;
 }
 
 function $752($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $9_1 = 0, $8_1 = 0, $5_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $8_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $5_1 = $753(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $9_1 = $3_1 + 16 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $5_1 | 0;
 }
 
 function $753($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  return HEAP32[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0;
 }
 
 function $754($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  $755($5_1 | 0, $745(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 48 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $755($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $5_1 = 0, $11_1 = 0, $10_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $10_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $5_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$5_1 >> 2] = $745(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $11_1 = $4_1 + 16 | 0;
   if ($11_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  return $5_1 | 0;
 }
 
 function $756($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $21_1 = 0, $7_1 = 0, $33_1 = 0, $32_1 = 0, $29_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $32_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $32_1;
  }
  $7_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 36 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 36 | 0) >> 2] | 0;
  $281($7_1 | 0, $8_1 | 0, $277(HEAP32[($4_1 + 32 | 0) >> 2] | 0 | 0) | 0 | 0);
  $21_1 = $4_1 + 16 | 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = $301($8_1 | 0, $4_1 + 12 | 0 | 0, $283(($282($7_1 | 0) | 0) + 13 | 0 | 0) | 0 | 0) | 0;
  $286($8_1 | 0, HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, $285($21_1 | 0) | 0 | 0);
  $288($4_1 + 40 | 0 | 0, $287($21_1 | 0) | 0 | 0) | 0;
  $289($21_1 | 0) | 0;
  $29_1 = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  label$3 : {
   $33_1 = $4_1 + 48 | 0;
   if ($33_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $33_1;
  }
  return $29_1 | 0;
 }
 
 function $757($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $36_1 = 0, $35_1 = 0, $7_1 = 0, $32_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $35_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $35_1;
  }
  HEAP32[($6_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $3_1;
  $7_1 = HEAP32[($6_1 + 20 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$3
    }
    label$5 : {
     label$6 : {
      if (($298($240($7_1 | 0) | 0 | 0, (HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0) {
       break label$6
      }
      HEAP32[($6_1 + 8 | 0) >> 2] = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
      HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($6_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
      break label$5;
     }
     HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
    }
    continue label$4;
   };
  }
  $339($6_1 + 24 | 0 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $32_1 = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
  label$7 : {
   $36_1 = $6_1 + 32 | 0;
   if ($36_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  return $32_1 | 0;
 }
 
 function $758($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $36_1 = 0, $35_1 = 0, $7_1 = 0, $32_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $35_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $35_1;
  }
  HEAP32[($6_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $3_1;
  $7_1 = HEAP32[($6_1 + 20 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$3
    }
    label$5 : {
     label$6 : {
      if (!(($298($240($7_1 | 0) | 0 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0, (HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0) | 0) & 1 | 0)) {
       break label$6
      }
      HEAP32[($6_1 + 8 | 0) >> 2] = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
      HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($6_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
      break label$5;
     }
     HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
    }
    continue label$4;
   };
  }
  $339($6_1 + 24 | 0 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $32_1 = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
  label$7 : {
   $36_1 = $6_1 + 32 | 0;
   if ($36_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  return $32_1 | 0;
 }
 
 function $759($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 48 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 32 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = HEAP32[($4_1 + 40 | 0) >> 2] | 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = HEAP32[($4_1 + 32 | 0) >> 2] | 0;
  $21_1 = $760(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0;
  label$3 : {
   $25_1 = $4_1 + 48 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $760($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $25_1 = 0, $24_1 = 0, $21_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $24_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $24_1;
  }
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!(($257($4_1 + 24 | 0 | 0, $4_1 + 16 | 0 | 0) | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    $260($4_1 + 24 | 0 | 0) | 0;
    continue label$4;
   };
  }
  $21_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  label$5 : {
   $25_1 = $4_1 + 32 | 0;
   if ($25_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $25_1;
  }
  return $21_1 | 0;
 }
 
 function $761($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $36_1 = 0, $35_1 = 0, $7_1 = 0, $32_1 = 0;
  $6_1 = global$0 - 32 | 0;
  label$1 : {
   $35_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $35_1;
  }
  HEAP32[($6_1 + 20 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $3_1;
  $7_1 = HEAP32[($6_1 + 20 | 0) >> 2] | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$3
    }
    label$5 : {
     label$6 : {
      if (($298($297($7_1 | 0) | 0 | 0, (HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 13 | 0 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0) {
       break label$6
      }
      HEAP32[($6_1 + 8 | 0) >> 2] = HEAP32[($6_1 + 12 | 0) >> 2] | 0;
      HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[($6_1 + 12 | 0) >> 2] | 0) >> 2] | 0;
      break label$5;
     }
     HEAP32[($6_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
    }
    continue label$4;
   };
  }
  $323($6_1 + 24 | 0 | 0, HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  $32_1 = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
  label$7 : {
   $36_1 = $6_1 + 32 | 0;
   if ($36_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $36_1;
  }
  return $32_1 | 0;
 }
 
 function $762($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $8_1 = 0, $7_1 = 0, $20_1 = 0, $31_1 = 0, $30_1 = 0, $18_1 = 0, $27_1 = 0;
  $4_1 = global$0 - 16 | 0;
  label$1 : {
   $30_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $30_1;
  }
  $7_1 = $4_1 + 8 | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = $0_1;
  HEAP32[$4_1 >> 2] = $1_1;
  $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
  $288($7_1 | 0, HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  $763($7_1 | 0) | 0;
  label$3 : {
   if (!((HEAP32[($255($8_1 | 0) | 0) >> 2] | 0 | 0) == (HEAP32[$4_1 >> 2] | 0 | 0) & 1 | 0)) {
    break label$3
   }
   $18_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
   HEAP32[($255($8_1 | 0) | 0) >> 2] = $18_1;
  }
  $20_1 = $305($8_1 | 0) | 0;
  HEAP32[$20_1 >> 2] = (HEAP32[$20_1 >> 2] | 0) + -1 | 0;
  $764(HEAP32[($254($8_1 | 0) | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0);
  $27_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$4 : {
   $31_1 = $4_1 + 16 | 0;
   if ($31_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $31_1;
  }
  return $27_1 | 0;
 }
 
 function $763($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $4_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = $280(HEAP32[$4_1 >> 2] | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $4_1 | 0;
 }
 
 function $764($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $22_1 = 0, $36_1 = 0, $40_1 = 0, $227_1 = 0, $261_1 = 0, $339_1 = 0, $373_1 = 0, $381_1 = 0, $380_1 = 0, $68_1 = 0, $95_1 = 0, $255_1 = 0, $367_1 = 0;
  $4_1 = global$0 - 32 | 0;
  label$1 : {
   $380_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $380_1;
  }
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  label$3 : {
   label$4 : {
    label$5 : {
     if ((HEAP32[(HEAP32[($4_1 + 24 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
      break label$5
     }
     if (!((HEAP32[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0)) {
      break label$4
     }
    }
    $22_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
    break label$3;
   }
   $22_1 = $765(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  }
  HEAP32[($4_1 + 20 | 0) >> 2] = $22_1;
  label$6 : {
   label$7 : {
    if (!((HEAP32[(HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$7
    }
    $36_1 = HEAP32[(HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 2] | 0;
    break label$6;
   }
   $36_1 = HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  }
  $40_1 = 0;
  HEAP32[($4_1 + 16 | 0) >> 2] = $36_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $40_1;
  label$8 : {
   if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) != ($40_1 | 0) & 1 | 0)) {
    break label$8
   }
   HEAP32[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 8 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0;
  }
  label$9 : {
   label$10 : {
    if (!(($328(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
     break label$10
    }
    HEAP32[(HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
    label$11 : {
     label$12 : {
      if (!((HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) != (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$12
      }
      HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(($329(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] | 0;
      break label$11;
     }
     HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
    }
    break label$9;
   }
   $68_1 = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
   HEAP32[(($329(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] = $68_1;
   HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] | 0;
  }
  HEAP8[($4_1 + 11 | 0) >> 0] = (HEAPU8[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0;
  label$13 : {
   if (!((HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) != (HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$13
   }
   HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 8 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0;
   label$14 : {
    label$15 : {
     if (!(($328(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
      break label$15
     }
     HEAP32[(HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
     break label$14;
    }
    $95_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
    HEAP32[(($329(HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] = $95_1;
   }
   HEAP32[(HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 2] = HEAP32[(HEAP32[($4_1 + 24 | 0) >> 2] | 0) >> 2] | 0;
   $334(HEAP32[(HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
   HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 4 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
   label$16 : {
    if (!((HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$16
    }
    $334(HEAP32[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0);
   }
   HEAP8[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 12 | 0) >> 0] = (HEAPU8[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0;
   label$17 : {
    if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$17
    }
    HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
   }
  }
  label$18 : {
   if (!((HEAPU8[($4_1 + 11 | 0) >> 0] | 0) & 1 | 0)) {
    break label$18
   }
   if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
    break label$18
   }
   label$19 : {
    label$20 : {
     if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
      break label$20
     }
     HEAP8[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
     break label$19;
    }
    label$21 : while (1) {
     label$22 : {
      label$23 : {
       label$24 : {
        if (($328(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0) {
         break label$24
        }
        label$25 : {
         if ((HEAPU8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0) {
          break label$25
         }
         HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
         HEAP8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] = 0;
         $331($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
         label$26 : {
          if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) == (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) & 1 | 0)) {
           break label$26
          }
          HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
         }
         HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
        }
        label$27 : {
         label$28 : {
          label$29 : {
           if ((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
            break label$29
           }
           if (!((HEAPU8[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
            break label$28
           }
          }
          label$30 : {
           if ((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
            break label$30
           }
           if (!((HEAPU8[((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
            break label$28
           }
          }
          HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
          HEAP32[($4_1 + 16 | 0) >> 2] = $329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
          label$31 : {
           label$32 : {
            if ((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0) {
             break label$32
            }
            if ((HEAPU8[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0) {
             break label$31
            }
           }
           HEAP8[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
           break label$22;
          }
          label$33 : {
           label$34 : {
            if (!(($328(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
             break label$34
            }
            $227_1 = HEAP32[(($329(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] | 0;
            break label$33;
           }
           $227_1 = HEAP32[(HEAP32[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] | 0;
          }
          HEAP32[($4_1 + 12 | 0) >> 2] = $227_1;
          break label$27;
         }
         label$35 : {
          label$36 : {
           if ((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
            break label$36
           }
           if (!((HEAPU8[((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
            break label$35
           }
          }
          HEAP8[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
          HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
          $332(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0);
          HEAP32[($4_1 + 12 | 0) >> 2] = $329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
         }
         $255_1 = HEAPU8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] | 0;
         HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = $255_1 & 1 | 0;
         $261_1 = 1;
         HEAP8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] = $261_1;
         HEAP8[((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] = $261_1;
         $331($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
         break label$22;
        }
        break label$23;
       }
       label$37 : {
        if ((HEAPU8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0) {
         break label$37
        }
        HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
        HEAP8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] = 0;
        $332($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
        label$38 : {
         if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) == (HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
          break label$38
         }
         HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
        }
        HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) >> 2] | 0;
       }
       label$39 : {
        label$40 : {
         label$41 : {
          if ((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
           break label$41
          }
          if (!((HEAPU8[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
           break label$40
          }
         }
         label$42 : {
          if ((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
           break label$42
          }
          if (!((HEAPU8[((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
           break label$40
          }
         }
         HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
         HEAP32[($4_1 + 16 | 0) >> 2] = $329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
         label$43 : {
          label$44 : {
           if (!((HEAPU8[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
            break label$44
           }
           if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
            break label$43
           }
          }
          HEAP8[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
          break label$22;
         }
         label$45 : {
          label$46 : {
           if (!(($328(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
            break label$46
           }
           $339_1 = HEAP32[(($329(HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) | 0) + 4 | 0) >> 2] | 0;
           break label$45;
          }
          $339_1 = HEAP32[(HEAP32[((HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) >> 2] | 0;
         }
         HEAP32[($4_1 + 12 | 0) >> 2] = $339_1;
         break label$39;
        }
        label$47 : {
         label$48 : {
          if ((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) == (0 | 0) & 1 | 0) {
           break label$48
          }
          if (!((HEAPU8[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 12 | 0) >> 0] | 0) & 1 | 0)) {
           break label$47
          }
         }
         HEAP8[((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0) + 12 | 0) >> 0] = 1;
         HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = 0;
         $331(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0);
         HEAP32[($4_1 + 12 | 0) >> 2] = $329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0;
        }
        $367_1 = HEAPU8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] | 0;
        HEAP8[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 0] = $367_1 & 1 | 0;
        $373_1 = 1;
        HEAP8[(($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0) + 12 | 0) >> 0] = $373_1;
        HEAP8[((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0) + 12 | 0) >> 0] = $373_1;
        $332($329(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0);
        break label$22;
       }
      }
      continue label$21;
     }
     break label$21;
    };
   }
  }
  label$49 : {
   $381_1 = $4_1 + 32 | 0;
   if ($381_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $381_1;
  }
  return;
 }
 
 function $765($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $29_1 = 0, $28_1 = 0, $25_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $28_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $28_1;
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  label$3 : {
   label$4 : {
    if (!((HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($3_1 + 12 | 0) >> 2] = $337(HEAP32[((HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0) | 0;
    break label$3;
   }
   label$5 : {
    label$6 : while (1) {
     if (!((($328(HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) | 0) ^ -1 | 0) & 1 | 0)) {
      break label$5
     }
     HEAP32[($3_1 + 8 | 0) >> 2] = $329(HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) | 0;
     continue label$6;
    };
   }
   HEAP32[($3_1 + 12 | 0) >> 2] = $329(HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  }
  $25_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  label$7 : {
   $29_1 = $3_1 + 16 | 0;
   if ($29_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $29_1;
  }
  return $25_1 | 0;
 }
 
 function $766() {
  $678();
  return;
 }
 
 function $767($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0, $3_1 = 0;
  $1_1 = $0_1;
  label$1 : {
   label$2 : {
    if (!($1_1 & 3 | 0)) {
     break label$2
    }
    label$3 : {
     if (HEAPU8[$0_1 >> 0] | 0) {
      break label$3
     }
     $1_1 = $0_1;
     break label$1;
    }
    $1_1 = $0_1;
    label$4 : while (1) {
     $1_1 = $1_1 + 1 | 0;
     if (!($1_1 & 3 | 0)) {
      break label$2
     }
     if (!(HEAPU8[$1_1 >> 0] | 0)) {
      break label$1
     }
     continue label$4;
    };
   }
   label$5 : while (1) {
    $2_1 = $1_1;
    $1_1 = $1_1 + 4 | 0;
    $3_1 = HEAP32[$2_1 >> 2] | 0;
    if (!((($3_1 ^ -1 | 0) & ($3_1 + -16843009 | 0) | 0) & -2139062144 | 0)) {
     continue label$5
    }
    break label$5;
   };
   label$6 : {
    if ($3_1 & 255 | 0) {
     break label$6
    }
    $1_1 = $2_1;
    break label$1;
   }
   label$7 : while (1) {
    $3_1 = HEAPU8[($2_1 + 1 | 0) >> 0] | 0;
    $1_1 = $2_1 + 1 | 0;
    $2_1 = $1_1;
    if ($3_1) {
     continue label$7
    }
    break label$7;
   };
  }
  return $1_1 - $0_1 | 0 | 0;
 }
 
 function $768($0_1) {
  $0_1 = $0_1 | 0;
  var $2_1 = 0, $1_1 = 0;
  $1_1 = $0_1 ? $0_1 : 1;
  label$1 : {
   label$2 : while (1) {
    $2_1 = $1040($1_1 | 0) | 0;
    if ($2_1) {
     break label$1
    }
    $0_1 = $869() | 0;
    if (!$0_1) {
     break label$1
    }
    FUNCTION_TABLE[$0_1]();
    continue label$2;
   };
  }
  return $2_1 | 0;
 }
 
 function $769($0_1) {
  $0_1 = $0_1 | 0;
  $1041($0_1 | 0);
 }
 
 function $770($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[$0_1 >> 2] = 3404;
  return $0_1 | 0;
 }
 
 function $771($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0, $3_1 = 0;
  $2_1 = $767($1_1 | 0) | 0;
  $3_1 = $768($2_1 + 13 | 0 | 0) | 0;
  HEAP32[($3_1 + 8 | 0) >> 2] = 0;
  HEAP32[($3_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$3_1 >> 2] = $2_1;
  HEAP32[$0_1 >> 2] = $1043($772($3_1 | 0) | 0 | 0, $1_1 | 0, $2_1 + 1 | 0 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $772($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 + 12 | 0 | 0;
 }
 
 function $773($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $770($0_1 | 0) | 0;
  HEAP32[$0_1 >> 2] = 3448;
  $771($0_1 + 4 | 0 | 0, $1_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $774($0_1) {
  $0_1 = $0_1 | 0;
  return 1 | 0;
 }
 
 function $775($0_1) {
  $0_1 = $0_1 | 0;
  return 1 | 0;
 }
 
 function $776($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $777() {
  return 6208 | 0;
 }
 
 function $778($0_1) {
  $0_1 = $0_1 | 0;
  return ($0_1 + -48 | 0) >>> 0 < 10 >>> 0 | 0;
 }
 
 function $779() {
  return 5800 | 0;
 }
 
 function $780($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0;
  $3_1 = 1;
  label$1 : {
   label$2 : {
    if (!$0_1) {
     break label$2
    }
    if ($1_1 >>> 0 <= 127 >>> 0) {
     break label$1
    }
    label$3 : {
     label$4 : {
      if (HEAP32[(HEAP32[(($781() | 0) + 176 | 0) >> 2] | 0) >> 2] | 0) {
       break label$4
      }
      if (($1_1 & -128 | 0 | 0) == (57216 | 0)) {
       break label$1
      }
      HEAP32[($777() | 0) >> 2] = 25;
      break label$3;
     }
     label$5 : {
      if ($1_1 >>> 0 > 2047 >>> 0) {
       break label$5
      }
      HEAP8[($0_1 + 1 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 6 | 0 | 192 | 0;
      return 2 | 0;
     }
     label$6 : {
      label$7 : {
       if ($1_1 >>> 0 < 55296 >>> 0) {
        break label$7
       }
       if (($1_1 & -8192 | 0 | 0) != (57344 | 0)) {
        break label$6
       }
      }
      HEAP8[($0_1 + 2 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 12 | 0 | 224 | 0;
      HEAP8[($0_1 + 1 | 0) >> 0] = ($1_1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      return 3 | 0;
     }
     label$8 : {
      if (($1_1 + -65536 | 0) >>> 0 > 1048575 >>> 0) {
       break label$8
      }
      HEAP8[($0_1 + 3 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 18 | 0 | 240 | 0;
      HEAP8[($0_1 + 2 | 0) >> 0] = ($1_1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      HEAP8[($0_1 + 1 | 0) >> 0] = ($1_1 >>> 12 | 0) & 63 | 0 | 128 | 0;
      return 4 | 0;
     }
     HEAP32[($777() | 0) >> 2] = 25;
    }
    $3_1 = -1;
   }
   return $3_1 | 0;
  }
  HEAP8[$0_1 >> 0] = $1_1;
  return 1 | 0;
 }
 
 function $781() {
  return $779() | 0 | 0;
 }
 
 function $782($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   return 0 | 0;
  }
  return $780($0_1 | 0, $1_1 | 0, 0 | 0) | 0 | 0;
 }
 
 function $783($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0;
  $3_1 = ($2_1 | 0) != (0 | 0);
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      if (!$2_1) {
       break label$4
      }
      if (!($0_1 & 3 | 0)) {
       break label$4
      }
      $4_1 = $1_1 & 255 | 0;
      label$5 : while (1) {
       if ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($4_1 | 0)) {
        break label$3
       }
       $0_1 = $0_1 + 1 | 0;
       $2_1 = $2_1 + -1 | 0;
       $3_1 = ($2_1 | 0) != (0 | 0);
       if (!$2_1) {
        break label$4
       }
       if ($0_1 & 3 | 0) {
        continue label$5
       }
       break label$5;
      };
     }
     if (!$3_1) {
      break label$2
     }
    }
    if ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($1_1 & 255 | 0 | 0)) {
     break label$1
    }
    label$6 : {
     label$7 : {
      if ($2_1 >>> 0 < 4 >>> 0) {
       break label$7
      }
      $4_1 = Math_imul($1_1 & 255 | 0, 16843009);
      $3_1 = $2_1 + -4 | 0;
      $5_1 = $3_1 & 3 | 0;
      $6_1 = (($3_1 & -4 | 0) + $0_1 | 0) + 4 | 0;
      label$8 : while (1) {
       $3_1 = (HEAP32[$0_1 >> 2] | 0) ^ $4_1 | 0;
       if ((($3_1 ^ -1 | 0) & ($3_1 + -16843009 | 0) | 0) & -2139062144 | 0) {
        break label$6
       }
       $0_1 = $0_1 + 4 | 0;
       $2_1 = $2_1 + -4 | 0;
       if ($2_1 >>> 0 > 3 >>> 0) {
        continue label$8
       }
       break label$8;
      };
      $2_1 = $5_1;
      $0_1 = $6_1;
     }
     if (!$2_1) {
      break label$2
     }
    }
    $3_1 = $1_1 & 255 | 0;
    label$9 : while (1) {
     if ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($3_1 | 0)) {
      break label$1
     }
     $0_1 = $0_1 + 1 | 0;
     $2_1 = $2_1 + -1 | 0;
     if ($2_1) {
      continue label$9
     }
     break label$9;
    };
   }
   return 0 | 0;
  }
  return $0_1 | 0;
 }
 
 function $784($0_1, $1_1) {
  $0_1 = +$0_1;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $2_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, $3_1 = 0, $10_1 = 0, $3$hi = 0;
  label$1 : {
   wasm2js_scratch_store_f64(+$0_1);
   i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
   $3_1 = wasm2js_scratch_load_i32(0 | 0) | 0;
   $3$hi = i64toi32_i32$0;
   i64toi32_i32$2 = $3_1;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 52;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = 0;
    $10_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    $10_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
   }
   $2_1 = $10_1 & 2047 | 0;
   if (($2_1 | 0) == (2047 | 0)) {
    break label$1
   }
   label$2 : {
    if ($2_1) {
     break label$2
    }
    label$3 : {
     label$4 : {
      if ($0_1 != 0.0) {
       break label$4
      }
      $2_1 = 0;
      break label$3;
     }
     $0_1 = +$784(+($0_1 * 18446744073709551615.0), $1_1 | 0);
     $2_1 = (HEAP32[$1_1 >> 2] | 0) + -64 | 0;
    }
    HEAP32[$1_1 >> 2] = $2_1;
    return +$0_1;
   }
   HEAP32[$1_1 >> 2] = $2_1 + -1022 | 0;
   i64toi32_i32$1 = $3$hi;
   i64toi32_i32$0 = $3_1;
   i64toi32_i32$2 = -2146435073;
   i64toi32_i32$3 = -1;
   i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
   i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$3 | 0;
   i64toi32_i32$0 = 1071644672;
   i64toi32_i32$3 = 0;
   i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
   wasm2js_scratch_store_i32(0 | 0, i64toi32_i32$1 | i64toi32_i32$3 | 0 | 0);
   wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$0 | 0);
   $0_1 = +wasm2js_scratch_load_f64();
  }
  return +$0_1;
 }
 
 function $785($0_1, $1_1, $1$hi, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $4$hi = 0, $4_1 = 0, $18_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $11$hi = 0, $18$hi = 0, $19_1 = 0, $19$hi = 0, $24$hi = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (!($3_1 & 64 | 0)) {
      break label$3
     }
     i64toi32_i32$0 = $2$hi;
     i64toi32_i32$0 = 0;
     $11$hi = i64toi32_i32$0;
     i64toi32_i32$0 = $2$hi;
     i64toi32_i32$2 = $2_1;
     i64toi32_i32$1 = $11$hi;
     i64toi32_i32$3 = $3_1 + -64 | 0;
     i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
     if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
      i64toi32_i32$1 = 0;
      $18_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     } else {
      i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
      $18_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
     }
     $1_1 = $18_1;
     $1$hi = i64toi32_i32$1;
     i64toi32_i32$1 = 0;
     $4_1 = 0;
     $4$hi = i64toi32_i32$1;
     i64toi32_i32$1 = 0;
     $2_1 = 0;
     $2$hi = i64toi32_i32$1;
     break label$2;
    }
    if (!$3_1) {
     break label$1
    }
    i64toi32_i32$1 = $2$hi;
    i64toi32_i32$1 = 0;
    $18$hi = i64toi32_i32$1;
    i64toi32_i32$1 = $2$hi;
    i64toi32_i32$0 = $2_1;
    i64toi32_i32$2 = $18$hi;
    i64toi32_i32$3 = 64 - $3_1 | 0;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
     $20_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
     $20_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    }
    $19_1 = $20_1;
    $19$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $1$hi;
    i64toi32_i32$2 = 0;
    $4_1 = $3_1;
    $4$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $1$hi;
    i64toi32_i32$1 = $1_1;
    i64toi32_i32$0 = $4$hi;
    i64toi32_i32$3 = $3_1;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = 0;
     $21_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
     $21_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
    }
    $24$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $19$hi;
    i64toi32_i32$2 = $19_1;
    i64toi32_i32$1 = $24$hi;
    i64toi32_i32$3 = $21_1;
    i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
    $1_1 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
    $1$hi = i64toi32_i32$1;
    i64toi32_i32$1 = $2$hi;
    i64toi32_i32$1 = $4$hi;
    i64toi32_i32$1 = $2$hi;
    i64toi32_i32$0 = $2_1;
    i64toi32_i32$2 = $4$hi;
    i64toi32_i32$3 = $4_1;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = 0;
     $22_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
     $22_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
    }
    $2_1 = $22_1;
    $2$hi = i64toi32_i32$2;
    i64toi32_i32$2 = 0;
    $4_1 = 0;
    $4$hi = i64toi32_i32$2;
   }
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$2 = $1$hi;
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$1 = $4_1;
   i64toi32_i32$0 = $1$hi;
   i64toi32_i32$3 = $1_1;
   i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
   $1_1 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
   $1$hi = i64toi32_i32$0;
  }
  i64toi32_i32$0 = $1$hi;
  i64toi32_i32$1 = $0_1;
  HEAP32[i64toi32_i32$1 >> 2] = $1_1;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$0 = $2$hi;
  HEAP32[(i64toi32_i32$1 + 8 | 0) >> 2] = $2_1;
  HEAP32[(i64toi32_i32$1 + 12 | 0) >> 2] = i64toi32_i32$0;
 }
 
 function $786($0_1, $1_1, $1$hi, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, $4$hi = 0, $18_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $11$hi = 0, $18$hi = 0, $19_1 = 0, $19$hi = 0, $4_1 = 0, $24$hi = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (!($3_1 & 64 | 0)) {
      break label$3
     }
     i64toi32_i32$0 = $1$hi;
     i64toi32_i32$0 = 0;
     $11$hi = i64toi32_i32$0;
     i64toi32_i32$0 = $1$hi;
     i64toi32_i32$2 = $1_1;
     i64toi32_i32$1 = $11$hi;
     i64toi32_i32$3 = $3_1 + -64 | 0;
     i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
     if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
      i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
      $18_1 = 0;
     } else {
      i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
      $18_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
     }
     $2_1 = $18_1;
     $2$hi = i64toi32_i32$1;
     i64toi32_i32$1 = 0;
     $1_1 = 0;
     $1$hi = i64toi32_i32$1;
     break label$2;
    }
    if (!$3_1) {
     break label$1
    }
    i64toi32_i32$1 = $1$hi;
    i64toi32_i32$1 = 0;
    $18$hi = i64toi32_i32$1;
    i64toi32_i32$1 = $1$hi;
    i64toi32_i32$0 = $1_1;
    i64toi32_i32$2 = $18$hi;
    i64toi32_i32$3 = 64 - $3_1 | 0;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = 0;
     $20_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
     $20_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
    }
    $19_1 = $20_1;
    $19$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $2$hi;
    i64toi32_i32$2 = 0;
    $4_1 = $3_1;
    $4$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $2$hi;
    i64toi32_i32$1 = $2_1;
    i64toi32_i32$0 = $4$hi;
    i64toi32_i32$3 = $3_1;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
     $21_1 = 0;
    } else {
     i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
     $21_1 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
    }
    $24$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $19$hi;
    i64toi32_i32$2 = $19_1;
    i64toi32_i32$1 = $24$hi;
    i64toi32_i32$3 = $21_1;
    i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
    $2_1 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
    $2$hi = i64toi32_i32$1;
    i64toi32_i32$1 = $1$hi;
    i64toi32_i32$1 = $4$hi;
    i64toi32_i32$1 = $1$hi;
    i64toi32_i32$0 = $1_1;
    i64toi32_i32$2 = $4$hi;
    i64toi32_i32$3 = $4_1;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
     $22_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
     $22_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    }
    $1_1 = $22_1;
    $1$hi = i64toi32_i32$2;
   }
   i64toi32_i32$2 = $2$hi;
   i64toi32_i32$1 = $2_1;
   i64toi32_i32$0 = 0;
   i64toi32_i32$3 = 0;
   i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
   $2_1 = i64toi32_i32$1 | i64toi32_i32$3 | 0;
   $2$hi = i64toi32_i32$0;
  }
  i64toi32_i32$0 = $1$hi;
  i64toi32_i32$1 = $0_1;
  HEAP32[i64toi32_i32$1 >> 2] = $1_1;
  HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
  i64toi32_i32$0 = $2$hi;
  HEAP32[(i64toi32_i32$1 + 8 | 0) >> 2] = $2_1;
  HEAP32[(i64toi32_i32$1 + 12 | 0) >> 2] = i64toi32_i32$0;
 }
 
 function $787($0_1, $0$hi, $1_1, $1$hi) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$5 = 0, i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $6_1 = 0, $6$hi = 0, $7$hi = 0, $7_1 = 0, $2_1 = 0, $3_1 = 0, $44_1 = 0, $46_1 = 0, $47_1 = 0, $48_1 = 0, $49_1 = 0, $51_1 = 0, $52_1 = 0, $5_1 = 0, $4_1 = 0, $18_1 = 0, $18$hi = 0, $20$hi = 0, $23_1 = 0, $23$hi = 0, $25$hi = 0, $39$hi = 0, $43_1 = 0, $45_1 = 0, $50_1 = 0, $50$hi = 0, $52$hi = 0, $80_1 = 0, $80$hi = 0, $84$hi = 0, $87_1 = 0, $87$hi = 0, $89_1 = 0, $89$hi = 0, $93_1 = 0, $93$hi = 0, $95_1 = 0, $96$hi = 0, $106$hi = 0, $117_1 = 0, $117$hi = 0;
  label$1 : {
   $2_1 = global$0 - 32 | 0;
   $4_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $4_1;
  }
  label$3 : {
   label$4 : {
    i64toi32_i32$0 = $1$hi;
    i64toi32_i32$2 = $1_1;
    i64toi32_i32$1 = 2147483647;
    i64toi32_i32$3 = -1;
    i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
    $6_1 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
    $6$hi = i64toi32_i32$1;
    i64toi32_i32$0 = $6_1;
    i64toi32_i32$2 = -1006698496;
    i64toi32_i32$3 = 0;
    i64toi32_i32$4 = i64toi32_i32$0 + i64toi32_i32$3 | 0;
    i64toi32_i32$5 = i64toi32_i32$1 + i64toi32_i32$2 | 0;
    if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
    }
    $18_1 = i64toi32_i32$4;
    $18$hi = i64toi32_i32$5;
    i64toi32_i32$5 = $6$hi;
    i64toi32_i32$1 = $6_1;
    i64toi32_i32$0 = -1140785152;
    i64toi32_i32$3 = 0;
    i64toi32_i32$2 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
    i64toi32_i32$4 = i64toi32_i32$5 + i64toi32_i32$0 | 0;
    if (i64toi32_i32$2 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$4 = i64toi32_i32$4 + 1 | 0
    }
    $20$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $18$hi;
    i64toi32_i32$5 = $18_1;
    i64toi32_i32$1 = $20$hi;
    i64toi32_i32$3 = i64toi32_i32$2;
    if (i64toi32_i32$4 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$5 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
     break label$4
    }
    i64toi32_i32$5 = $0$hi;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$4 = 0;
    i64toi32_i32$1 = 60;
    i64toi32_i32$0 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$4 = 0;
     $44_1 = i64toi32_i32$5 >>> i64toi32_i32$0 | 0;
    } else {
     i64toi32_i32$4 = i64toi32_i32$5 >>> i64toi32_i32$0 | 0;
     $44_1 = (((1 << i64toi32_i32$0 | 0) - 1 | 0) & i64toi32_i32$5 | 0) << (32 - i64toi32_i32$0 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$0 | 0) | 0;
    }
    $23_1 = $44_1;
    $23$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $1$hi;
    i64toi32_i32$5 = $1_1;
    i64toi32_i32$3 = 0;
    i64toi32_i32$1 = 4;
    i64toi32_i32$0 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$3 = i64toi32_i32$5 << i64toi32_i32$0 | 0;
     $46_1 = 0;
    } else {
     i64toi32_i32$3 = ((1 << i64toi32_i32$0 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$0 | 0) | 0) | 0 | (i64toi32_i32$4 << i64toi32_i32$0 | 0) | 0;
     $46_1 = i64toi32_i32$5 << i64toi32_i32$0 | 0;
    }
    $25$hi = i64toi32_i32$3;
    i64toi32_i32$3 = $23$hi;
    i64toi32_i32$4 = $23_1;
    i64toi32_i32$5 = $25$hi;
    i64toi32_i32$1 = $46_1;
    i64toi32_i32$5 = i64toi32_i32$3 | i64toi32_i32$5 | 0;
    $6_1 = i64toi32_i32$4 | i64toi32_i32$1 | 0;
    $6$hi = i64toi32_i32$5;
    label$5 : {
     i64toi32_i32$5 = $0$hi;
     i64toi32_i32$3 = $0_1;
     i64toi32_i32$4 = 268435455;
     i64toi32_i32$1 = -1;
     i64toi32_i32$4 = i64toi32_i32$5 & i64toi32_i32$4 | 0;
     $0_1 = i64toi32_i32$3 & i64toi32_i32$1 | 0;
     $0$hi = i64toi32_i32$4;
     i64toi32_i32$5 = $0_1;
     i64toi32_i32$3 = 134217728;
     i64toi32_i32$1 = 1;
     if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$3 | 0) & i64toi32_i32$5 >>> 0 < i64toi32_i32$1 >>> 0 | 0) | 0) {
      break label$5
     }
     i64toi32_i32$5 = $6$hi;
     i64toi32_i32$1 = $6_1;
     i64toi32_i32$4 = 1073741824;
     i64toi32_i32$3 = 1;
     i64toi32_i32$0 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
     i64toi32_i32$2 = i64toi32_i32$5 + i64toi32_i32$4 | 0;
     if (i64toi32_i32$0 >>> 0 < i64toi32_i32$3 >>> 0) {
      i64toi32_i32$2 = i64toi32_i32$2 + 1 | 0
     }
     $7_1 = i64toi32_i32$0;
     $7$hi = i64toi32_i32$2;
     break label$3;
    }
    i64toi32_i32$2 = $6$hi;
    i64toi32_i32$5 = $6_1;
    i64toi32_i32$1 = 1073741824;
    i64toi32_i32$3 = 0;
    i64toi32_i32$4 = i64toi32_i32$5 + i64toi32_i32$3 | 0;
    i64toi32_i32$0 = i64toi32_i32$2 + i64toi32_i32$1 | 0;
    if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$0 = i64toi32_i32$0 + 1 | 0
    }
    $7_1 = i64toi32_i32$4;
    $7$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $0$hi;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$5 = 134217728;
    i64toi32_i32$3 = 0;
    i64toi32_i32$5 = i64toi32_i32$0 ^ i64toi32_i32$5 | 0;
    i64toi32_i32$0 = i64toi32_i32$2 ^ i64toi32_i32$3 | 0;
    i64toi32_i32$2 = 0;
    i64toi32_i32$3 = 0;
    if ((i64toi32_i32$0 | 0) != (i64toi32_i32$3 | 0) | (i64toi32_i32$5 | 0) != (i64toi32_i32$2 | 0) | 0) {
     break label$3
    }
    i64toi32_i32$0 = $7$hi;
    i64toi32_i32$3 = $7_1;
    i64toi32_i32$5 = 0;
    i64toi32_i32$2 = 1;
    i64toi32_i32$5 = i64toi32_i32$0 & i64toi32_i32$5 | 0;
    $39$hi = i64toi32_i32$5;
    i64toi32_i32$5 = i64toi32_i32$0;
    i64toi32_i32$5 = $39$hi;
    i64toi32_i32$0 = i64toi32_i32$3 & i64toi32_i32$2 | 0;
    i64toi32_i32$3 = $7$hi;
    i64toi32_i32$2 = $7_1;
    i64toi32_i32$1 = i64toi32_i32$0 + i64toi32_i32$2 | 0;
    i64toi32_i32$4 = i64toi32_i32$5 + i64toi32_i32$3 | 0;
    if (i64toi32_i32$1 >>> 0 < i64toi32_i32$2 >>> 0) {
     i64toi32_i32$4 = i64toi32_i32$4 + 1 | 0
    }
    $7_1 = i64toi32_i32$1;
    $7$hi = i64toi32_i32$4;
    break label$3;
   }
   label$6 : {
    i64toi32_i32$4 = $0$hi;
    $43_1 = !($0_1 | i64toi32_i32$4 | 0);
    i64toi32_i32$4 = $6$hi;
    i64toi32_i32$5 = $6_1;
    i64toi32_i32$0 = 2147418112;
    i64toi32_i32$2 = 0;
    $45_1 = i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$0 | 0) & i64toi32_i32$5 >>> 0 < i64toi32_i32$2 >>> 0 | 0) | 0;
    i64toi32_i32$5 = i64toi32_i32$4;
    i64toi32_i32$2 = $6_1;
    i64toi32_i32$4 = 2147418112;
    i64toi32_i32$0 = 0;
    if ((i64toi32_i32$2 | 0) == (i64toi32_i32$0 | 0) & (i64toi32_i32$5 | 0) == (i64toi32_i32$4 | 0) | 0 ? $43_1 : $45_1) {
     break label$6
    }
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$5 = 0;
    i64toi32_i32$4 = 60;
    i64toi32_i32$3 = i64toi32_i32$4 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$4 & 63 | 0) >>> 0) {
     i64toi32_i32$5 = 0;
     $47_1 = i64toi32_i32$2 >>> i64toi32_i32$3 | 0;
    } else {
     i64toi32_i32$5 = i64toi32_i32$2 >>> i64toi32_i32$3 | 0;
     $47_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$3 | 0) | 0;
    }
    $50_1 = $47_1;
    $50$hi = i64toi32_i32$5;
    i64toi32_i32$5 = $1$hi;
    i64toi32_i32$2 = $1_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$4 = 4;
    i64toi32_i32$3 = i64toi32_i32$4 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$4 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
     $48_1 = 0;
    } else {
     i64toi32_i32$0 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$5 << i64toi32_i32$3 | 0) | 0;
     $48_1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
    }
    $52$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $50$hi;
    i64toi32_i32$5 = $50_1;
    i64toi32_i32$2 = $52$hi;
    i64toi32_i32$4 = $48_1;
    i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
    i64toi32_i32$0 = i64toi32_i32$5 | i64toi32_i32$4 | 0;
    i64toi32_i32$5 = 524287;
    i64toi32_i32$4 = -1;
    i64toi32_i32$5 = i64toi32_i32$2 & i64toi32_i32$5 | 0;
    i64toi32_i32$2 = i64toi32_i32$0 & i64toi32_i32$4 | 0;
    i64toi32_i32$0 = 2146959360;
    i64toi32_i32$4 = 0;
    i64toi32_i32$0 = i64toi32_i32$5 | i64toi32_i32$0 | 0;
    $7_1 = i64toi32_i32$2 | i64toi32_i32$4 | 0;
    $7$hi = i64toi32_i32$0;
    break label$3;
   }
   i64toi32_i32$0 = 2146435072;
   $7_1 = 0;
   $7$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $6$hi;
   i64toi32_i32$5 = $6_1;
   i64toi32_i32$2 = 1140785151;
   i64toi32_i32$4 = -1;
   if (i64toi32_i32$0 >>> 0 > i64toi32_i32$2 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$2 | 0) & i64toi32_i32$5 >>> 0 > i64toi32_i32$4 >>> 0 | 0) | 0) {
    break label$3
   }
   i64toi32_i32$5 = 0;
   $7_1 = 0;
   $7$hi = i64toi32_i32$5;
   i64toi32_i32$5 = $6$hi;
   i64toi32_i32$4 = $6_1;
   i64toi32_i32$0 = 0;
   i64toi32_i32$2 = 48;
   i64toi32_i32$3 = i64toi32_i32$2 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$2 & 63 | 0) >>> 0) {
    i64toi32_i32$0 = 0;
    $49_1 = i64toi32_i32$5 >>> i64toi32_i32$3 | 0;
   } else {
    i64toi32_i32$0 = i64toi32_i32$5 >>> i64toi32_i32$3 | 0;
    $49_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$5 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$4 >>> i64toi32_i32$3 | 0) | 0;
   }
   $3_1 = $49_1;
   if ($3_1 >>> 0 < 15249 >>> 0) {
    break label$3
   }
   i64toi32_i32$0 = $0$hi;
   i64toi32_i32$0 = $1$hi;
   i64toi32_i32$5 = $1_1;
   i64toi32_i32$4 = 65535;
   i64toi32_i32$2 = -1;
   i64toi32_i32$4 = i64toi32_i32$0 & i64toi32_i32$4 | 0;
   i64toi32_i32$0 = i64toi32_i32$5 & i64toi32_i32$2 | 0;
   i64toi32_i32$5 = 65536;
   i64toi32_i32$2 = 0;
   i64toi32_i32$5 = i64toi32_i32$4 | i64toi32_i32$5 | 0;
   $6_1 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
   $6$hi = i64toi32_i32$5;
   i64toi32_i32$5 = $0$hi;
   i64toi32_i32$0 = $6$hi;
   $785($2_1 | 0, $0_1 | 0, i64toi32_i32$5 | 0, $6_1 | 0, i64toi32_i32$0 | 0, 15361 - $3_1 | 0 | 0);
   i64toi32_i32$0 = i64toi32_i32$5;
   i64toi32_i32$0 = $6$hi;
   i64toi32_i32$0 = i64toi32_i32$5;
   i64toi32_i32$5 = $6$hi;
   $786($2_1 + 16 | 0 | 0, $0_1 | 0, i64toi32_i32$0 | 0, $6_1 | 0, i64toi32_i32$5 | 0, $3_1 + -15233 | 0 | 0);
   i64toi32_i32$4 = $2_1;
   i64toi32_i32$5 = HEAP32[i64toi32_i32$4 >> 2] | 0;
   i64toi32_i32$0 = HEAP32[(i64toi32_i32$4 + 4 | 0) >> 2] | 0;
   $6_1 = i64toi32_i32$5;
   $6$hi = i64toi32_i32$0;
   i64toi32_i32$4 = i64toi32_i32$5;
   i64toi32_i32$5 = 0;
   i64toi32_i32$2 = 60;
   i64toi32_i32$3 = i64toi32_i32$2 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$2 & 63 | 0) >>> 0) {
    i64toi32_i32$5 = 0;
    $51_1 = i64toi32_i32$0 >>> i64toi32_i32$3 | 0;
   } else {
    i64toi32_i32$5 = i64toi32_i32$0 >>> i64toi32_i32$3 | 0;
    $51_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$4 >>> i64toi32_i32$3 | 0) | 0;
   }
   $80_1 = $51_1;
   $80$hi = i64toi32_i32$5;
   i64toi32_i32$0 = $2_1 + 8 | 0;
   i64toi32_i32$5 = HEAP32[i64toi32_i32$0 >> 2] | 0;
   i64toi32_i32$4 = HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] | 0;
   i64toi32_i32$0 = i64toi32_i32$5;
   i64toi32_i32$5 = 0;
   i64toi32_i32$2 = 4;
   i64toi32_i32$3 = i64toi32_i32$2 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$2 & 63 | 0) >>> 0) {
    i64toi32_i32$5 = i64toi32_i32$0 << i64toi32_i32$3 | 0;
    $52_1 = 0;
   } else {
    i64toi32_i32$5 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$4 << i64toi32_i32$3 | 0) | 0;
    $52_1 = i64toi32_i32$0 << i64toi32_i32$3 | 0;
   }
   $84$hi = i64toi32_i32$5;
   i64toi32_i32$5 = $80$hi;
   i64toi32_i32$4 = $80_1;
   i64toi32_i32$0 = $84$hi;
   i64toi32_i32$2 = $52_1;
   i64toi32_i32$0 = i64toi32_i32$5 | i64toi32_i32$0 | 0;
   $7_1 = i64toi32_i32$4 | i64toi32_i32$2 | 0;
   $7$hi = i64toi32_i32$0;
   label$7 : {
    i64toi32_i32$0 = $6$hi;
    i64toi32_i32$5 = $6_1;
    i64toi32_i32$4 = 268435455;
    i64toi32_i32$2 = -1;
    i64toi32_i32$4 = i64toi32_i32$0 & i64toi32_i32$4 | 0;
    $87_1 = i64toi32_i32$5 & i64toi32_i32$2 | 0;
    $87$hi = i64toi32_i32$4;
    i64toi32_i32$0 = $2_1;
    i64toi32_i32$4 = HEAP32[(i64toi32_i32$0 + 16 | 0) >> 2] | 0;
    i64toi32_i32$5 = HEAP32[(i64toi32_i32$0 + 20 | 0) >> 2] | 0;
    $89_1 = i64toi32_i32$4;
    $89$hi = i64toi32_i32$5;
    i64toi32_i32$0 = (i64toi32_i32$0 + 16 | 0) + 8 | 0;
    i64toi32_i32$5 = HEAP32[i64toi32_i32$0 >> 2] | 0;
    i64toi32_i32$4 = HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] | 0;
    $93_1 = i64toi32_i32$5;
    $93$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $89$hi;
    i64toi32_i32$0 = $89_1;
    i64toi32_i32$5 = $93$hi;
    i64toi32_i32$2 = $93_1;
    i64toi32_i32$5 = i64toi32_i32$4 | i64toi32_i32$5 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
    i64toi32_i32$0 = 0;
    i64toi32_i32$2 = 0;
    $95_1 = (i64toi32_i32$4 | 0) != (i64toi32_i32$2 | 0) | (i64toi32_i32$5 | 0) != (i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$4 = 0;
    $96$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $87$hi;
    i64toi32_i32$2 = $87_1;
    i64toi32_i32$5 = $96$hi;
    i64toi32_i32$0 = $95_1;
    i64toi32_i32$5 = i64toi32_i32$4 | i64toi32_i32$5 | 0;
    $6_1 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
    $6$hi = i64toi32_i32$5;
    i64toi32_i32$4 = $6_1;
    i64toi32_i32$2 = 134217728;
    i64toi32_i32$0 = 1;
    if (i64toi32_i32$5 >>> 0 < i64toi32_i32$2 >>> 0 | ((i64toi32_i32$5 | 0) == (i64toi32_i32$2 | 0) & i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0 | 0) | 0) {
     break label$7
    }
    i64toi32_i32$4 = $7$hi;
    i64toi32_i32$0 = $7_1;
    i64toi32_i32$5 = 0;
    i64toi32_i32$2 = 1;
    i64toi32_i32$3 = i64toi32_i32$0 + i64toi32_i32$2 | 0;
    i64toi32_i32$1 = i64toi32_i32$4 + i64toi32_i32$5 | 0;
    if (i64toi32_i32$3 >>> 0 < i64toi32_i32$2 >>> 0) {
     i64toi32_i32$1 = i64toi32_i32$1 + 1 | 0
    }
    $7_1 = i64toi32_i32$3;
    $7$hi = i64toi32_i32$1;
    break label$3;
   }
   i64toi32_i32$1 = $6$hi;
   i64toi32_i32$4 = $6_1;
   i64toi32_i32$0 = 134217728;
   i64toi32_i32$2 = 0;
   i64toi32_i32$0 = i64toi32_i32$1 ^ i64toi32_i32$0 | 0;
   i64toi32_i32$1 = i64toi32_i32$4 ^ i64toi32_i32$2 | 0;
   i64toi32_i32$4 = 0;
   i64toi32_i32$2 = 0;
   if ((i64toi32_i32$1 | 0) != (i64toi32_i32$2 | 0) | (i64toi32_i32$0 | 0) != (i64toi32_i32$4 | 0) | 0) {
    break label$3
   }
   i64toi32_i32$1 = $7$hi;
   i64toi32_i32$2 = $7_1;
   i64toi32_i32$0 = 0;
   i64toi32_i32$4 = 1;
   i64toi32_i32$0 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
   $106$hi = i64toi32_i32$0;
   i64toi32_i32$0 = i64toi32_i32$1;
   i64toi32_i32$0 = $106$hi;
   i64toi32_i32$1 = i64toi32_i32$2 & i64toi32_i32$4 | 0;
   i64toi32_i32$2 = $7$hi;
   i64toi32_i32$4 = $7_1;
   i64toi32_i32$5 = i64toi32_i32$1 + i64toi32_i32$4 | 0;
   i64toi32_i32$3 = i64toi32_i32$0 + i64toi32_i32$2 | 0;
   if (i64toi32_i32$5 >>> 0 < i64toi32_i32$4 >>> 0) {
    i64toi32_i32$3 = i64toi32_i32$3 + 1 | 0
   }
   $7_1 = i64toi32_i32$5;
   $7$hi = i64toi32_i32$3;
  }
  label$8 : {
   $5_1 = $2_1 + 32 | 0;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  i64toi32_i32$3 = $7$hi;
  i64toi32_i32$3 = $1$hi;
  i64toi32_i32$0 = $1_1;
  i64toi32_i32$1 = -2147483648;
  i64toi32_i32$4 = 0;
  i64toi32_i32$1 = i64toi32_i32$3 & i64toi32_i32$1 | 0;
  $117_1 = i64toi32_i32$0 & i64toi32_i32$4 | 0;
  $117$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $7$hi;
  i64toi32_i32$3 = $7_1;
  i64toi32_i32$0 = $117$hi;
  i64toi32_i32$4 = $117_1;
  i64toi32_i32$0 = i64toi32_i32$1 | i64toi32_i32$0 | 0;
  wasm2js_scratch_store_i32(0 | 0, i64toi32_i32$3 | i64toi32_i32$4 | 0 | 0);
  wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$0 | 0);
  return +(+wasm2js_scratch_load_f64());
 }
 
 function $788() {
  fimport$15(6276 | 0);
  return 6284 | 0;
 }
 
 function $789() {
  fimport$16(6276 | 0);
 }
 
 function $790($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = HEAPU8[($0_1 + 74 | 0) >> 0] | 0;
  HEAP8[($0_1 + 74 | 0) >> 0] = $1_1 + -1 | 0 | $1_1 | 0;
  label$1 : {
   $1_1 = HEAP32[$0_1 >> 2] | 0;
   if (!($1_1 & 8 | 0)) {
    break label$1
   }
   HEAP32[$0_1 >> 2] = $1_1 | 32 | 0;
   return -1 | 0;
  }
  HEAP32[($0_1 + 4 | 0) >> 2] = 0;
  HEAP32[($0_1 + 8 | 0) >> 2] = 0;
  $1_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
  HEAP32[($0_1 + 28 | 0) >> 2] = $1_1;
  HEAP32[($0_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($0_1 + 16 | 0) >> 2] = $1_1 + (HEAP32[($0_1 + 48 | 0) >> 2] | 0) | 0;
  return 0 | 0;
 }
 
 function $791($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0, $5_1 = 0, $6_1 = 0;
  label$1 : {
   label$2 : {
    $3_1 = HEAP32[($2_1 + 16 | 0) >> 2] | 0;
    if ($3_1) {
     break label$2
    }
    $4_1 = 0;
    if ($790($2_1 | 0) | 0) {
     break label$1
    }
    $3_1 = HEAP32[($2_1 + 16 | 0) >> 2] | 0;
   }
   label$3 : {
    $5_1 = HEAP32[($2_1 + 20 | 0) >> 2] | 0;
    if (($3_1 - $5_1 | 0) >>> 0 >= $1_1 >>> 0) {
     break label$3
    }
    return FUNCTION_TABLE[HEAP32[($2_1 + 36 | 0) >> 2] | 0]($2_1, $0_1, $1_1) | 0 | 0;
   }
   $6_1 = 0;
   label$4 : {
    if ((HEAP8[($2_1 + 75 | 0) >> 0] | 0 | 0) < (0 | 0)) {
     break label$4
    }
    $4_1 = $1_1;
    label$5 : while (1) {
     $3_1 = $4_1;
     if (!$3_1) {
      break label$4
     }
     $4_1 = $3_1 + -1 | 0;
     if ((HEAPU8[($0_1 + $4_1 | 0) >> 0] | 0 | 0) != (10 | 0)) {
      continue label$5
     }
     break label$5;
    };
    $4_1 = FUNCTION_TABLE[HEAP32[($2_1 + 36 | 0) >> 2] | 0]($2_1, $0_1, $3_1) | 0;
    if ($4_1 >>> 0 < $3_1 >>> 0) {
     break label$1
    }
    $1_1 = $1_1 - $3_1 | 0;
    $0_1 = $0_1 + $3_1 | 0;
    $5_1 = HEAP32[($2_1 + 20 | 0) >> 2] | 0;
    $6_1 = $3_1;
   }
   $1043($5_1 | 0, $0_1 | 0, $1_1 | 0) | 0;
   HEAP32[($2_1 + 20 | 0) >> 2] = (HEAP32[($2_1 + 20 | 0) >> 2] | 0) + $1_1 | 0;
   $4_1 = $6_1 + $1_1 | 0;
  }
  return $4_1 | 0;
 }
 
 function $792($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0, $6_1 = 0, $7_1 = 0, $9_1 = 0, $8_1 = 0;
  label$1 : {
   $5_1 = global$0 - 208 | 0;
   $8_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  HEAP32[($5_1 + 204 | 0) >> 2] = $2_1;
  $2_1 = 0;
  $1044($5_1 + 160 | 0 | 0, 0 | 0, 40 | 0) | 0;
  HEAP32[($5_1 + 200 | 0) >> 2] = HEAP32[($5_1 + 204 | 0) >> 2] | 0;
  label$3 : {
   label$4 : {
    if (($793(0 | 0, $1_1 | 0, $5_1 + 200 | 0 | 0, $5_1 + 80 | 0 | 0, $5_1 + 160 | 0 | 0, $3_1 | 0, $4_1 | 0) | 0 | 0) >= (0 | 0)) {
     break label$4
    }
    $1_1 = -1;
    break label$3;
   }
   label$5 : {
    if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) < (0 | 0)) {
     break label$5
    }
    $2_1 = $775($0_1 | 0) | 0;
   }
   $6_1 = HEAP32[$0_1 >> 2] | 0;
   label$6 : {
    if ((HEAP8[($0_1 + 74 | 0) >> 0] | 0 | 0) > (0 | 0)) {
     break label$6
    }
    HEAP32[$0_1 >> 2] = $6_1 & -33 | 0;
   }
   $6_1 = $6_1 & 32 | 0;
   label$7 : {
    label$8 : {
     if (!(HEAP32[($0_1 + 48 | 0) >> 2] | 0)) {
      break label$8
     }
     $1_1 = $793($0_1 | 0, $1_1 | 0, $5_1 + 200 | 0 | 0, $5_1 + 80 | 0 | 0, $5_1 + 160 | 0 | 0, $3_1 | 0, $4_1 | 0) | 0;
     break label$7;
    }
    HEAP32[($0_1 + 48 | 0) >> 2] = 80;
    HEAP32[($0_1 + 16 | 0) >> 2] = $5_1 + 80 | 0;
    HEAP32[($0_1 + 28 | 0) >> 2] = $5_1;
    HEAP32[($0_1 + 20 | 0) >> 2] = $5_1;
    $7_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
    HEAP32[($0_1 + 44 | 0) >> 2] = $5_1;
    $1_1 = $793($0_1 | 0, $1_1 | 0, $5_1 + 200 | 0 | 0, $5_1 + 80 | 0 | 0, $5_1 + 160 | 0 | 0, $3_1 | 0, $4_1 | 0) | 0;
    if (!$7_1) {
     break label$7
    }
    FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0]($0_1, 0, 0) | 0;
    HEAP32[($0_1 + 48 | 0) >> 2] = 0;
    HEAP32[($0_1 + 44 | 0) >> 2] = $7_1;
    HEAP32[($0_1 + 28 | 0) >> 2] = 0;
    HEAP32[($0_1 + 16 | 0) >> 2] = 0;
    $3_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
    HEAP32[($0_1 + 20 | 0) >> 2] = 0;
    $1_1 = $3_1 ? $1_1 : -1;
   }
   $3_1 = HEAP32[$0_1 >> 2] | 0;
   HEAP32[$0_1 >> 2] = $3_1 | $6_1 | 0;
   $1_1 = $3_1 & 32 | 0 ? -1 : $1_1;
   if (!$2_1) {
    break label$3
   }
   $776($0_1 | 0);
  }
  label$9 : {
   $9_1 = $5_1 + 208 | 0;
   if ($9_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  return $1_1 | 0;
 }
 
 function $793($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  var $7_1 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $19_1 = 0, i64toi32_i32$5 = 0, $12_1 = 0, i64toi32_i32$3 = 0, $20_1 = 0, $11_1 = 0, $17_1 = 0, $18_1 = 0, i64toi32_i32$2 = 0, $16_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $9_1 = 0, $24_1 = 0, $24$hi = 0, $10_1 = 0, $21_1 = 0, $32_1 = 0, $33_1 = 0, $34_1 = 0, $23_1 = 0, $22_1 = 0, $8_1 = 0, $282_1 = 0;
  label$1 : {
   $7_1 = global$0 - 80 | 0;
   $22_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
  $8_1 = $7_1 + 55 | 0;
  $9_1 = $7_1 + 56 | 0;
  $10_1 = 0;
  $11_1 = 0;
  $1_1 = 0;
  label$3 : {
   label$4 : while (1) {
    label$5 : {
     if (($11_1 | 0) < (0 | 0)) {
      break label$5
     }
     label$6 : {
      if (($1_1 | 0) <= (2147483647 - $11_1 | 0 | 0)) {
       break label$6
      }
      HEAP32[($777() | 0) >> 2] = 61;
      $11_1 = -1;
      break label$5;
     }
     $11_1 = $1_1 + $11_1 | 0;
    }
    $12_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
    $1_1 = $12_1;
    label$7 : {
     label$8 : {
      label$9 : {
       label$10 : {
        label$11 : {
         label$12 : {
          label$13 : {
           label$14 : {
            label$15 : {
             label$16 : {
              label$17 : {
               label$18 : {
                label$19 : {
                 label$20 : {
                  label$21 : {
                   $13_1 = HEAPU8[$1_1 >> 0] | 0;
                   if (!$13_1) {
                    break label$21
                   }
                   label$22 : {
                    label$23 : while (1) {
                     label$24 : {
                      label$25 : {
                       label$26 : {
                        $13_1 = $13_1 & 255 | 0;
                        if ($13_1) {
                         break label$26
                        }
                        $13_1 = $1_1;
                        break label$25;
                       }
                       if (($13_1 | 0) != (37 | 0)) {
                        break label$24
                       }
                       $13_1 = $1_1;
                       label$27 : while (1) {
                        if ((HEAPU8[($1_1 + 1 | 0) >> 0] | 0 | 0) != (37 | 0)) {
                         break label$25
                        }
                        $14_1 = $1_1 + 2 | 0;
                        HEAP32[($7_1 + 76 | 0) >> 2] = $14_1;
                        $13_1 = $13_1 + 1 | 0;
                        $15_1 = HEAPU8[($1_1 + 2 | 0) >> 0] | 0;
                        $1_1 = $14_1;
                        if (($15_1 | 0) == (37 | 0)) {
                         continue label$27
                        }
                        break label$27;
                       };
                      }
                      $1_1 = $13_1 - $12_1 | 0;
                      label$28 : {
                       if (!$0_1) {
                        break label$28
                       }
                       $794($0_1 | 0, $12_1 | 0, $1_1 | 0);
                      }
                      if ($1_1) {
                       continue label$4
                      }
                      $14_1 = $778(HEAP8[((HEAP32[($7_1 + 76 | 0) >> 2] | 0) + 1 | 0) >> 0] | 0 | 0) | 0;
                      $16_1 = -1;
                      $13_1 = 1;
                      $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                      label$29 : {
                       if (!$14_1) {
                        break label$29
                       }
                       if ((HEAPU8[($1_1 + 2 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                        break label$29
                       }
                       $16_1 = (HEAP8[($1_1 + 1 | 0) >> 0] | 0) + -48 | 0;
                       $10_1 = 1;
                       $13_1 = 3;
                      }
                      $1_1 = $1_1 + $13_1 | 0;
                      HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
                      $13_1 = 0;
                      label$30 : {
                       label$31 : {
                        $17_1 = HEAP8[$1_1 >> 0] | 0;
                        $15_1 = $17_1 + -32 | 0;
                        if ($15_1 >>> 0 <= 31 >>> 0) {
                         break label$31
                        }
                        $14_1 = $1_1;
                        break label$30;
                       }
                       $14_1 = $1_1;
                       $15_1 = 1 << $15_1 | 0;
                       if (!($15_1 & 75913 | 0)) {
                        break label$30
                       }
                       label$32 : while (1) {
                        $14_1 = $1_1 + 1 | 0;
                        HEAP32[($7_1 + 76 | 0) >> 2] = $14_1;
                        $13_1 = $15_1 | $13_1 | 0;
                        $17_1 = HEAP8[($1_1 + 1 | 0) >> 0] | 0;
                        $15_1 = $17_1 + -32 | 0;
                        if ($15_1 >>> 0 > 31 >>> 0) {
                         break label$30
                        }
                        $1_1 = $14_1;
                        $15_1 = 1 << $15_1 | 0;
                        if ($15_1 & 75913 | 0) {
                         continue label$32
                        }
                        break label$32;
                       };
                      }
                      label$33 : {
                       label$34 : {
                        if (($17_1 | 0) != (42 | 0)) {
                         break label$34
                        }
                        label$35 : {
                         label$36 : {
                          if (!($778(HEAP8[($14_1 + 1 | 0) >> 0] | 0 | 0) | 0)) {
                           break label$36
                          }
                          $14_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                          if ((HEAPU8[($14_1 + 2 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                           break label$36
                          }
                          HEAP32[((((HEAP8[($14_1 + 1 | 0) >> 0] | 0) << 2 | 0) + $4_1 | 0) + -192 | 0) >> 2] = 10;
                          $1_1 = $14_1 + 3 | 0;
                          $18_1 = HEAP32[((((HEAP8[($14_1 + 1 | 0) >> 0] | 0) << 3 | 0) + $3_1 | 0) + -384 | 0) >> 2] | 0;
                          $10_1 = 1;
                          break label$35;
                         }
                         if ($10_1) {
                          break label$20
                         }
                         $10_1 = 0;
                         $18_1 = 0;
                         label$37 : {
                          if (!$0_1) {
                           break label$37
                          }
                          $1_1 = HEAP32[$2_1 >> 2] | 0;
                          HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
                          $18_1 = HEAP32[$1_1 >> 2] | 0;
                         }
                         $1_1 = (HEAP32[($7_1 + 76 | 0) >> 2] | 0) + 1 | 0;
                        }
                        HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
                        if (($18_1 | 0) > (-1 | 0)) {
                         break label$33
                        }
                        $18_1 = 0 - $18_1 | 0;
                        $13_1 = $13_1 | 8192 | 0;
                        break label$33;
                       }
                       $18_1 = $795($7_1 + 76 | 0 | 0) | 0;
                       if (($18_1 | 0) < (0 | 0)) {
                        break label$20
                       }
                       $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                      }
                      $19_1 = -1;
                      label$38 : {
                       if ((HEAPU8[$1_1 >> 0] | 0 | 0) != (46 | 0)) {
                        break label$38
                       }
                       label$39 : {
                        if ((HEAPU8[($1_1 + 1 | 0) >> 0] | 0 | 0) != (42 | 0)) {
                         break label$39
                        }
                        label$40 : {
                         if (!($778(HEAP8[($1_1 + 2 | 0) >> 0] | 0 | 0) | 0)) {
                          break label$40
                         }
                         $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                         if ((HEAPU8[($1_1 + 3 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                          break label$40
                         }
                         HEAP32[((((HEAP8[($1_1 + 2 | 0) >> 0] | 0) << 2 | 0) + $4_1 | 0) + -192 | 0) >> 2] = 10;
                         $19_1 = HEAP32[((((HEAP8[($1_1 + 2 | 0) >> 0] | 0) << 3 | 0) + $3_1 | 0) + -384 | 0) >> 2] | 0;
                         $1_1 = $1_1 + 4 | 0;
                         HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
                         break label$38;
                        }
                        if ($10_1) {
                         break label$20
                        }
                        label$41 : {
                         label$42 : {
                          if ($0_1) {
                           break label$42
                          }
                          $19_1 = 0;
                          break label$41;
                         }
                         $1_1 = HEAP32[$2_1 >> 2] | 0;
                         HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
                         $19_1 = HEAP32[$1_1 >> 2] | 0;
                        }
                        $1_1 = (HEAP32[($7_1 + 76 | 0) >> 2] | 0) + 2 | 0;
                        HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
                        break label$38;
                       }
                       HEAP32[($7_1 + 76 | 0) >> 2] = $1_1 + 1 | 0;
                       $19_1 = $795($7_1 + 76 | 0 | 0) | 0;
                       $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                      }
                      $14_1 = 0;
                      label$43 : while (1) {
                       $15_1 = $14_1;
                       $20_1 = -1;
                       if (((HEAP8[$1_1 >> 0] | 0) + -65 | 0) >>> 0 > 57 >>> 0) {
                        break label$3
                       }
                       $17_1 = $1_1 + 1 | 0;
                       HEAP32[($7_1 + 76 | 0) >> 2] = $17_1;
                       $14_1 = HEAP8[$1_1 >> 0] | 0;
                       $1_1 = $17_1;
                       $14_1 = HEAPU8[(($14_1 + Math_imul($15_1, 58) | 0) + 2671 | 0) >> 0] | 0;
                       if (($14_1 + -1 | 0) >>> 0 < 8 >>> 0) {
                        continue label$43
                       }
                       break label$43;
                      };
                      if (!$14_1) {
                       break label$3
                      }
                      label$44 : {
                       label$45 : {
                        label$46 : {
                         label$47 : {
                          if (($14_1 | 0) != (19 | 0)) {
                           break label$47
                          }
                          $20_1 = -1;
                          if (($16_1 | 0) <= (-1 | 0)) {
                           break label$46
                          }
                          break label$3;
                         }
                         if (($16_1 | 0) < (0 | 0)) {
                          break label$45
                         }
                         HEAP32[($4_1 + ($16_1 << 2 | 0) | 0) >> 2] = $14_1;
                         i64toi32_i32$2 = $3_1 + ($16_1 << 3 | 0) | 0;
                         i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
                         i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
                         $282_1 = i64toi32_i32$0;
                         i64toi32_i32$0 = $7_1;
                         HEAP32[($7_1 + 64 | 0) >> 2] = $282_1;
                         HEAP32[($7_1 + 68 | 0) >> 2] = i64toi32_i32$1;
                        }
                        $1_1 = 0;
                        if (!$0_1) {
                         continue label$4
                        }
                        break label$44;
                       }
                       if (!$0_1) {
                        break label$7
                       }
                       $796($7_1 + 64 | 0 | 0, $14_1 | 0, $2_1 | 0, $6_1 | 0);
                       $17_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
                      }
                      $21_1 = $13_1 & -65537 | 0;
                      $13_1 = $13_1 & 8192 | 0 ? $21_1 : $13_1;
                      $20_1 = 0;
                      $16_1 = 2709;
                      $14_1 = $9_1;
                      $1_1 = HEAP8[($17_1 + -1 | 0) >> 0] | 0;
                      $1_1 = $15_1 ? (($1_1 & 15 | 0 | 0) == (3 | 0) ? $1_1 & -33 | 0 : $1_1) : $1_1;
                      $17_1 = $1_1 + -88 | 0;
                      if ($17_1 >>> 0 <= 32 >>> 0) {
                       break label$22
                      }
                      label$48 : {
                       label$49 : {
                        label$50 : {
                         label$51 : {
                          label$52 : {
                           $15_1 = $1_1 + -65 | 0;
                           if ($15_1 >>> 0 <= 6 >>> 0) {
                            break label$52
                           }
                           if (($1_1 | 0) != (83 | 0)) {
                            break label$8
                           }
                           if (!$19_1) {
                            break label$51
                           }
                           $14_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                           break label$49;
                          }
                          switch ($15_1 | 0) {
                          case 2:
                           break label$50;
                          case 1:
                          case 3:
                           break label$8;
                          default:
                           break label$19;
                          };
                         }
                         $1_1 = 0;
                         $797($0_1 | 0, 32 | 0, $18_1 | 0, 0 | 0, $13_1 | 0);
                         break label$48;
                        }
                        HEAP32[($7_1 + 12 | 0) >> 2] = 0;
                        i64toi32_i32$2 = $7_1;
                        i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                        i64toi32_i32$0 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                        HEAP32[($7_1 + 8 | 0) >> 2] = i64toi32_i32$1;
                        HEAP32[($7_1 + 64 | 0) >> 2] = $7_1 + 8 | 0;
                        $19_1 = -1;
                        $14_1 = $7_1 + 8 | 0;
                       }
                       $1_1 = 0;
                       label$53 : {
                        label$54 : while (1) {
                         $15_1 = HEAP32[$14_1 >> 2] | 0;
                         if (!$15_1) {
                          break label$53
                         }
                         label$55 : {
                          $15_1 = $782($7_1 + 4 | 0 | 0, $15_1 | 0) | 0;
                          $12_1 = ($15_1 | 0) < (0 | 0);
                          if ($12_1) {
                           break label$55
                          }
                          if ($15_1 >>> 0 > ($19_1 - $1_1 | 0) >>> 0) {
                           break label$55
                          }
                          $14_1 = $14_1 + 4 | 0;
                          $1_1 = $15_1 + $1_1 | 0;
                          if ($19_1 >>> 0 > $1_1 >>> 0) {
                           continue label$54
                          }
                          break label$53;
                         }
                         break label$54;
                        };
                        $20_1 = -1;
                        if ($12_1) {
                         break label$3
                        }
                       }
                       $797($0_1 | 0, 32 | 0, $18_1 | 0, $1_1 | 0, $13_1 | 0);
                       label$56 : {
                        if ($1_1) {
                         break label$56
                        }
                        $1_1 = 0;
                        break label$48;
                       }
                       $15_1 = 0;
                       $14_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                       label$57 : while (1) {
                        $12_1 = HEAP32[$14_1 >> 2] | 0;
                        if (!$12_1) {
                         break label$48
                        }
                        $12_1 = $782($7_1 + 4 | 0 | 0, $12_1 | 0) | 0;
                        $15_1 = $12_1 + $15_1 | 0;
                        if (($15_1 | 0) > ($1_1 | 0)) {
                         break label$48
                        }
                        $794($0_1 | 0, $7_1 + 4 | 0 | 0, $12_1 | 0);
                        $14_1 = $14_1 + 4 | 0;
                        if ($15_1 >>> 0 < $1_1 >>> 0) {
                         continue label$57
                        }
                        break label$57;
                       };
                      }
                      $797($0_1 | 0, 32 | 0, $18_1 | 0, $1_1 | 0, $13_1 ^ 8192 | 0 | 0);
                      $1_1 = ($18_1 | 0) > ($1_1 | 0) ? $18_1 : $1_1;
                      continue label$4;
                     }
                     $14_1 = $1_1 + 1 | 0;
                     HEAP32[($7_1 + 76 | 0) >> 2] = $14_1;
                     $13_1 = HEAPU8[($1_1 + 1 | 0) >> 0] | 0;
                     $1_1 = $14_1;
                     continue label$23;
                    };
                   }
                   switch ($17_1 | 0) {
                   case 29:
                    break label$11;
                   case 22:
                    break label$12;
                   case 24:
                    break label$14;
                   case 23:
                    break label$15;
                   case 12:
                   case 17:
                    break label$16;
                   case 11:
                    break label$17;
                   case 27:
                    break label$18;
                   case 9:
                   case 13:
                   case 14:
                   case 15:
                    break label$19;
                   case 1:
                   case 2:
                   case 3:
                   case 4:
                   case 5:
                   case 6:
                   case 7:
                   case 8:
                   case 10:
                   case 16:
                   case 18:
                   case 19:
                   case 20:
                   case 21:
                   case 25:
                   case 26:
                   case 28:
                   case 30:
                   case 31:
                    break label$8;
                   default:
                    break label$13;
                   };
                  }
                  $20_1 = $11_1;
                  if ($0_1) {
                   break label$3
                  }
                  if (!$10_1) {
                   break label$7
                  }
                  $1_1 = 1;
                  label$58 : {
                   label$59 : while (1) {
                    $13_1 = HEAP32[($4_1 + ($1_1 << 2 | 0) | 0) >> 2] | 0;
                    if (!$13_1) {
                     break label$58
                    }
                    $796($3_1 + ($1_1 << 3 | 0) | 0 | 0, $13_1 | 0, $2_1 | 0, $6_1 | 0);
                    $20_1 = 1;
                    $1_1 = $1_1 + 1 | 0;
                    if (($1_1 | 0) != (10 | 0)) {
                     continue label$59
                    }
                    break label$3;
                   };
                  }
                  $20_1 = 1;
                  if ($1_1 >>> 0 >= 10 >>> 0) {
                   break label$3
                  }
                  label$60 : while (1) {
                   if (HEAP32[($4_1 + ($1_1 << 2 | 0) | 0) >> 2] | 0) {
                    break label$20
                   }
                   $20_1 = 1;
                   $13_1 = $1_1 >>> 0 > 8 >>> 0;
                   $1_1 = $1_1 + 1 | 0;
                   if ($13_1) {
                    break label$3
                   }
                   continue label$60;
                  };
                 }
                 $20_1 = -1;
                 break label$3;
                }
                $1_1 = FUNCTION_TABLE[$5_1]($0_1, +HEAPF64[($7_1 + 64 | 0) >> 3], $18_1, $19_1, $13_1, $1_1) | 0;
                continue label$4;
               }
               $20_1 = 0;
               $1_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
               $12_1 = $1_1 ? $1_1 : 2719;
               $1_1 = $783($12_1 | 0, 0 | 0, $19_1 | 0) | 0;
               $14_1 = $1_1 ? $1_1 : $12_1 + $19_1 | 0;
               $13_1 = $21_1;
               $19_1 = $1_1 ? $1_1 - $12_1 | 0 : $19_1;
               break label$8;
              }
              i64toi32_i32$2 = $7_1;
              i64toi32_i32$0 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
              i64toi32_i32$1 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
              HEAP8[($7_1 + 55 | 0) >> 0] = i64toi32_i32$0;
              $19_1 = 1;
              $12_1 = $8_1;
              $14_1 = $9_1;
              $13_1 = $21_1;
              break label$8;
             }
             label$61 : {
              i64toi32_i32$2 = $7_1;
              i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
              i64toi32_i32$0 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
              $24_1 = i64toi32_i32$1;
              $24$hi = i64toi32_i32$0;
              i64toi32_i32$2 = i64toi32_i32$1;
              i64toi32_i32$1 = -1;
              i64toi32_i32$3 = -1;
              if ((i64toi32_i32$0 | 0) > (i64toi32_i32$1 | 0)) {
               $32_1 = 1
              } else {
               if ((i64toi32_i32$0 | 0) >= (i64toi32_i32$1 | 0)) {
                if (i64toi32_i32$2 >>> 0 <= i64toi32_i32$3 >>> 0) {
                 $33_1 = 0
                } else {
                 $33_1 = 1
                }
                $34_1 = $33_1;
               } else {
                $34_1 = 0
               }
               $32_1 = $34_1;
              }
              if ($32_1) {
               break label$61
              }
              i64toi32_i32$2 = $24$hi;
              i64toi32_i32$2 = 0;
              i64toi32_i32$3 = 0;
              i64toi32_i32$0 = $24$hi;
              i64toi32_i32$1 = $24_1;
              i64toi32_i32$5 = (i64toi32_i32$3 >>> 0 < i64toi32_i32$1 >>> 0) + i64toi32_i32$0 | 0;
              i64toi32_i32$5 = i64toi32_i32$2 - i64toi32_i32$5 | 0;
              $24_1 = i64toi32_i32$3 - i64toi32_i32$1 | 0;
              $24$hi = i64toi32_i32$5;
              i64toi32_i32$3 = $7_1;
              HEAP32[($7_1 + 64 | 0) >> 2] = $24_1;
              HEAP32[($7_1 + 68 | 0) >> 2] = i64toi32_i32$5;
              $20_1 = 1;
              $16_1 = 2709;
              break label$10;
             }
             label$62 : {
              if (!($13_1 & 2048 | 0)) {
               break label$62
              }
              $20_1 = 1;
              $16_1 = 2710;
              break label$10;
             }
             $20_1 = $13_1 & 1 | 0;
             $16_1 = $20_1 ? 2711 : 2709;
             break label$10;
            }
            i64toi32_i32$2 = $7_1;
            i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
            i64toi32_i32$3 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
            $12_1 = $798(i64toi32_i32$5 | 0, i64toi32_i32$3 | 0, $9_1 | 0) | 0;
            $20_1 = 0;
            $16_1 = 2709;
            if (!($13_1 & 8 | 0)) {
             break label$9
            }
            $1_1 = $9_1 - $12_1 | 0;
            $19_1 = ($19_1 | 0) > ($1_1 | 0) ? $19_1 : $1_1 + 1 | 0;
            break label$9;
           }
           $19_1 = $19_1 >>> 0 > 8 >>> 0 ? $19_1 : 8;
           $13_1 = $13_1 | 8 | 0;
           $1_1 = 120;
          }
          i64toi32_i32$2 = $7_1;
          i64toi32_i32$3 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
          i64toi32_i32$5 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
          $12_1 = $799(i64toi32_i32$3 | 0, i64toi32_i32$5 | 0, $9_1 | 0, $1_1 & 32 | 0 | 0) | 0;
          $20_1 = 0;
          $16_1 = 2709;
          if (!($13_1 & 8 | 0)) {
           break label$9
          }
          i64toi32_i32$2 = $7_1;
          i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
          i64toi32_i32$3 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
          if (!(i64toi32_i32$5 | i64toi32_i32$3 | 0)) {
           break label$9
          }
          $16_1 = ($1_1 >>> 4 | 0) + 2709 | 0;
          $20_1 = 2;
          break label$9;
         }
         $1_1 = 0;
         $13_1 = $15_1 & 255 | 0;
         if ($13_1 >>> 0 > 7 >>> 0) {
          continue label$4
         }
         label$63 : {
          switch ($13_1 | 0) {
          default:
           HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $11_1;
           continue label$4;
          case 1:
           HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $11_1;
           continue label$4;
          case 2:
           i64toi32_i32$5 = $11_1;
           i64toi32_i32$3 = i64toi32_i32$5 >> 31 | 0;
           i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
           HEAP32[i64toi32_i32$5 >> 2] = $11_1;
           HEAP32[(i64toi32_i32$5 + 4 | 0) >> 2] = i64toi32_i32$3;
           continue label$4;
          case 3:
           HEAP16[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 1] = $11_1;
           continue label$4;
          case 4:
           HEAP8[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 0] = $11_1;
           continue label$4;
          case 6:
           HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $11_1;
           continue label$4;
          case 5:
           continue label$4;
          case 7:
           break label$63;
          };
         }
         i64toi32_i32$5 = $11_1;
         i64toi32_i32$3 = i64toi32_i32$5 >> 31 | 0;
         i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
         HEAP32[i64toi32_i32$5 >> 2] = $11_1;
         HEAP32[(i64toi32_i32$5 + 4 | 0) >> 2] = i64toi32_i32$3;
         continue label$4;
        }
        $20_1 = 0;
        $16_1 = 2709;
        i64toi32_i32$2 = $7_1;
        i64toi32_i32$3 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
        i64toi32_i32$5 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
        $24_1 = i64toi32_i32$3;
        $24$hi = i64toi32_i32$5;
       }
       i64toi32_i32$5 = $24$hi;
       $12_1 = $800($24_1 | 0, i64toi32_i32$5 | 0, $9_1 | 0) | 0;
      }
      $13_1 = ($19_1 | 0) > (-1 | 0) ? $13_1 & -65537 | 0 : $13_1;
      i64toi32_i32$2 = $7_1;
      i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
      i64toi32_i32$3 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
      $24_1 = i64toi32_i32$5;
      $24$hi = i64toi32_i32$3;
      label$70 : {
       label$71 : {
        if ($19_1) {
         break label$71
        }
        i64toi32_i32$3 = $24$hi;
        if (!!($24_1 | i64toi32_i32$3 | 0)) {
         break label$71
        }
        $19_1 = 0;
        $12_1 = $9_1;
        break label$70;
       }
       i64toi32_i32$3 = $24$hi;
       $1_1 = ($9_1 - $12_1 | 0) + !($24_1 | i64toi32_i32$3 | 0) | 0;
       $19_1 = ($19_1 | 0) > ($1_1 | 0) ? $19_1 : $1_1;
      }
      $14_1 = $9_1;
     }
     $15_1 = $14_1 - $12_1 | 0;
     $17_1 = ($19_1 | 0) < ($15_1 | 0) ? $15_1 : $19_1;
     $14_1 = $20_1 + $17_1 | 0;
     $1_1 = ($18_1 | 0) < ($14_1 | 0) ? $14_1 : $18_1;
     $797($0_1 | 0, 32 | 0, $1_1 | 0, $14_1 | 0, $13_1 | 0);
     $794($0_1 | 0, $16_1 | 0, $20_1 | 0);
     $797($0_1 | 0, 48 | 0, $1_1 | 0, $14_1 | 0, $13_1 ^ 65536 | 0 | 0);
     $797($0_1 | 0, 48 | 0, $17_1 | 0, $15_1 | 0, 0 | 0);
     $794($0_1 | 0, $12_1 | 0, $15_1 | 0);
     $797($0_1 | 0, 32 | 0, $1_1 | 0, $14_1 | 0, $13_1 ^ 8192 | 0 | 0);
     continue label$4;
    }
    break label$4;
   };
   $20_1 = 0;
  }
  label$72 : {
   $23_1 = $7_1 + 80 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return $20_1 | 0;
 }
 
 function $794($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if ((HEAPU8[$0_1 >> 0] | 0) & 32 | 0) {
    break label$1
   }
   $791($1_1 | 0, $2_1 | 0, $0_1 | 0) | 0;
  }
 }
 
 function $795($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0, $3_1 = 0;
  $1_1 = 0;
  label$1 : {
   if (!($778(HEAP8[(HEAP32[$0_1 >> 2] | 0) >> 0] | 0 | 0) | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $2_1 = HEAP32[$0_1 >> 2] | 0;
    $3_1 = HEAP8[$2_1 >> 0] | 0;
    HEAP32[$0_1 >> 2] = $2_1 + 1 | 0;
    $1_1 = ($3_1 + Math_imul($1_1, 10) | 0) + -48 | 0;
    if ($778(HEAP8[($2_1 + 1 | 0) >> 0] | 0 | 0) | 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $1_1 | 0;
 }
 
 function $796($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $26_1 = 0, $34_1 = 0, $44_1 = 0, $52_1 = 0, $60_1 = 0, $68_1 = 0, $76_1 = 0, $86_1 = 0;
  label$1 : {
   if ($1_1 >>> 0 > 20 >>> 0) {
    break label$1
   }
   $1_1 = $1_1 + -9 | 0;
   if ($1_1 >>> 0 > 9 >>> 0) {
    break label$1
   }
   label$2 : {
    switch ($1_1 | 0) {
    default:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     HEAP32[$0_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
     return;
    case 1:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
     i64toi32_i32$1 = i64toi32_i32$0 >> 31 | 0;
     $26_1 = i64toi32_i32$0;
     i64toi32_i32$0 = $0_1;
     HEAP32[i64toi32_i32$0 >> 2] = $26_1;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     return;
    case 2:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
     i64toi32_i32$0 = 0;
     $34_1 = i64toi32_i32$1;
     i64toi32_i32$1 = $0_1;
     HEAP32[i64toi32_i32$1 >> 2] = $34_1;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
     return;
    case 3:
     $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
     i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
     i64toi32_i32$1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
     $44_1 = i64toi32_i32$0;
     i64toi32_i32$0 = $0_1;
     HEAP32[i64toi32_i32$0 >> 2] = $44_1;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     return;
    case 4:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$1 = HEAP16[$1_1 >> 1] | 0;
     i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
     $52_1 = i64toi32_i32$1;
     i64toi32_i32$1 = $0_1;
     HEAP32[i64toi32_i32$1 >> 2] = $52_1;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
     return;
    case 5:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$0 = HEAPU16[$1_1 >> 1] | 0;
     i64toi32_i32$1 = 0;
     $60_1 = i64toi32_i32$0;
     i64toi32_i32$0 = $0_1;
     HEAP32[i64toi32_i32$0 >> 2] = $60_1;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     return;
    case 6:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$1 = HEAP8[$1_1 >> 0] | 0;
     i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
     $68_1 = i64toi32_i32$1;
     i64toi32_i32$1 = $0_1;
     HEAP32[i64toi32_i32$1 >> 2] = $68_1;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
     return;
    case 7:
     $1_1 = HEAP32[$2_1 >> 2] | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
     i64toi32_i32$0 = HEAPU8[$1_1 >> 0] | 0;
     i64toi32_i32$1 = 0;
     $76_1 = i64toi32_i32$0;
     i64toi32_i32$0 = $0_1;
     HEAP32[i64toi32_i32$0 >> 2] = $76_1;
     HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
     return;
    case 8:
     $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
     HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
     i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
     i64toi32_i32$0 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
     $86_1 = i64toi32_i32$1;
     i64toi32_i32$1 = $0_1;
     HEAP32[i64toi32_i32$1 >> 2] = $86_1;
     HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
     return;
    case 9:
     break label$2;
    };
   }
   FUNCTION_TABLE[$3_1]($0_1, $2_1);
  }
 }
 
 function $797($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0, $6_1 = 0, $8_1 = 0, $7_1 = 0;
  label$1 : {
   $5_1 = global$0 - 256 | 0;
   $7_1 = $5_1;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  label$3 : {
   if (($2_1 | 0) <= ($3_1 | 0)) {
    break label$3
   }
   if ($4_1 & 73728 | 0) {
    break label$3
   }
   $4_1 = $2_1 - $3_1 | 0;
   $6_1 = $4_1 >>> 0 < 256 >>> 0;
   $1044($5_1 | 0, $1_1 | 0, ($6_1 ? $4_1 : 256) | 0) | 0;
   label$4 : {
    if ($6_1) {
     break label$4
    }
    $2_1 = $2_1 - $3_1 | 0;
    label$5 : while (1) {
     $794($0_1 | 0, $5_1 | 0, 256 | 0);
     $4_1 = $4_1 + -256 | 0;
     if ($4_1 >>> 0 > 255 >>> 0) {
      continue label$5
     }
     break label$5;
    };
    $4_1 = $2_1 & 255 | 0;
   }
   $794($0_1 | 0, $5_1 | 0, $4_1 | 0);
  }
  label$6 : {
   $8_1 = $5_1 + 256 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
 }
 
 function $798($0_1, $0$hi, $1_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, i64toi32_i32$2 = 0, $8_1 = 0;
  label$1 : {
   i64toi32_i32$0 = $0$hi;
   if (!($0_1 | i64toi32_i32$0 | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$0 = $0$hi;
    HEAP8[$1_1 >> 0] = $0_1 & 7 | 0 | 48 | 0;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 3;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $8_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     $8_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    $0_1 = $8_1;
    $0$hi = i64toi32_i32$1;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$2 = 0;
    i64toi32_i32$3 = 0;
    if ((i64toi32_i32$0 | 0) != (i64toi32_i32$3 | 0) | (i64toi32_i32$1 | 0) != (i64toi32_i32$2 | 0) | 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $1_1 | 0;
 }
 
 function $799($0_1, $0$hi, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, i64toi32_i32$2 = 0, $9_1 = 0;
  label$1 : {
   i64toi32_i32$0 = $0$hi;
   if (!($0_1 | i64toi32_i32$0 | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$0 = $0$hi;
    HEAP8[$1_1 >> 0] = HEAPU8[(($0_1 & 15 | 0) + 3200 | 0) >> 0] | 0 | $2_1 | 0;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 4;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $9_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     $9_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    $0_1 = $9_1;
    $0$hi = i64toi32_i32$1;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$2 = 0;
    i64toi32_i32$3 = 0;
    if ((i64toi32_i32$0 | 0) != (i64toi32_i32$3 | 0) | (i64toi32_i32$1 | 0) != (i64toi32_i32$2 | 0) | 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $1_1 | 0;
 }
 
 function $800($0_1, $0$hi, $1_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $2_1 = 0, i64toi32_i32$3 = 0, $5_1 = 0, i64toi32_i32$5 = 0, $5$hi = 0, $3_1 = 0, $16_1 = 0, $16$hi = 0, $4_1 = 0;
  label$1 : {
   label$2 : {
    i64toi32_i32$0 = $0$hi;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 1;
    i64toi32_i32$3 = 0;
    if (i64toi32_i32$0 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$2 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
     break label$2
    }
    i64toi32_i32$2 = $0$hi;
    $5_1 = $0_1;
    $5$hi = i64toi32_i32$2;
    break label$1;
   }
   label$3 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_udiv($0_1 | 0, i64toi32_i32$2 | 0, 10 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $5_1 = i64toi32_i32$0;
    $5$hi = i64toi32_i32$2;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_mul($5_1 | 0, i64toi32_i32$2 | 0, 10 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $16_1 = i64toi32_i32$0;
    $16$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$0 = $16$hi;
    i64toi32_i32$1 = $16_1;
    i64toi32_i32$5 = ($0_1 >>> 0 < i64toi32_i32$1 >>> 0) + i64toi32_i32$0 | 0;
    i64toi32_i32$5 = i64toi32_i32$2 - i64toi32_i32$5 | 0;
    HEAP8[$1_1 >> 0] = $0_1 - i64toi32_i32$1 | 0 | 48 | 0;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$3 = 9;
    i64toi32_i32$1 = -1;
    $2_1 = $0$hi >>> 0 > i64toi32_i32$3 >>> 0 | (($0$hi | 0) == (i64toi32_i32$3 | 0) & i64toi32_i32$2 >>> 0 > i64toi32_i32$1 >>> 0 | 0) | 0;
    i64toi32_i32$2 = $5$hi;
    $0_1 = $5_1;
    $0$hi = i64toi32_i32$2;
    if ($2_1) {
     continue label$3
    }
    break label$3;
   };
  }
  label$4 : {
   i64toi32_i32$2 = $5$hi;
   $2_1 = $5_1;
   if (!$2_1) {
    break label$4
   }
   label$5 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    $3_1 = ($2_1 >>> 0) / (10 >>> 0) | 0;
    HEAP8[$1_1 >> 0] = $2_1 - Math_imul($3_1, 10) | 0 | 48 | 0;
    $4_1 = $2_1 >>> 0 > 9 >>> 0;
    $2_1 = $3_1;
    if ($4_1) {
     continue label$5
    }
    break label$5;
   };
  }
  return $1_1 | 0;
 }
 
 function $801($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return $792($0_1 | 0, $1_1 | 0, $2_1 | 0, 38 | 0, 39 | 0) | 0 | 0;
 }
 
 function $802($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = +$1_1;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $10_1 = 0, $18_1 = 0, $16_1 = 0, $13_1 = 0, $6_1 = 0, i64toi32_i32$1 = 0, $14_1 = 0, $9_1 = 0, i64toi32_i32$0 = 0, $17_1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$5 = 0, $15_1 = 0, $19_1 = 0, $11_1 = 0, $26_1 = 0.0, $20_1 = 0, $7_1 = 0, $24_1 = 0, $12_1 = 0, $21_1 = 0, $24$hi = 0, $8_1 = 0, $44_1 = 0, $45_1 = 0, $46_1 = 0, $25$hi = 0, $47_1 = 0, $23_1 = 0, $22_1 = 0, $134_1 = 0, $25_1 = 0, $325_1 = 0, $327$hi = 0, $329$hi = 0, $331_1 = 0, $331$hi = 0, $333$hi = 0, $337_1 = 0, $337$hi = 0;
  label$1 : {
   $6_1 = global$0 - 560 | 0;
   $22_1 = $6_1;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $22_1;
  }
  HEAP32[($6_1 + 44 | 0) >> 2] = 0;
  label$3 : {
   label$4 : {
    i64toi32_i32$0 = $804(+$1_1) | 0;
    i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    $24_1 = i64toi32_i32$0;
    $24$hi = i64toi32_i32$1;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$0 = -1;
    i64toi32_i32$3 = -1;
    if ((i64toi32_i32$1 | 0) > (i64toi32_i32$0 | 0)) {
     $44_1 = 1
    } else {
     if ((i64toi32_i32$1 | 0) >= (i64toi32_i32$0 | 0)) {
      if (i64toi32_i32$2 >>> 0 <= i64toi32_i32$3 >>> 0) {
       $45_1 = 0
      } else {
       $45_1 = 1
      }
      $46_1 = $45_1;
     } else {
      $46_1 = 0
     }
     $44_1 = $46_1;
    }
    if ($44_1) {
     break label$4
    }
    $1_1 = -$1_1;
    i64toi32_i32$2 = $804(+$1_1) | 0;
    i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    $24_1 = i64toi32_i32$2;
    $24$hi = i64toi32_i32$1;
    $7_1 = 1;
    $8_1 = 3216;
    break label$3;
   }
   label$5 : {
    if (!($4_1 & 2048 | 0)) {
     break label$5
    }
    $7_1 = 1;
    $8_1 = 3219;
    break label$3;
   }
   $7_1 = $4_1 & 1 | 0;
   $8_1 = $7_1 ? 3222 : 3217;
  }
  label$6 : {
   label$7 : {
    i64toi32_i32$1 = $24$hi;
    i64toi32_i32$3 = $24_1;
    i64toi32_i32$2 = 2146435072;
    i64toi32_i32$0 = 0;
    i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
    i64toi32_i32$1 = i64toi32_i32$3 & i64toi32_i32$0 | 0;
    i64toi32_i32$3 = 2146435072;
    i64toi32_i32$0 = 0;
    if ((i64toi32_i32$1 | 0) != (i64toi32_i32$0 | 0) | (i64toi32_i32$2 | 0) != (i64toi32_i32$3 | 0) | 0) {
     break label$7
    }
    $9_1 = $7_1 + 3 | 0;
    $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 & -65537 | 0 | 0);
    $794($0_1 | 0, $8_1 | 0, $7_1 | 0);
    $10_1 = ($5_1 >>> 5 | 0) & 1 | 0;
    $794($0_1 | 0, ($1_1 != $1_1 ? ($10_1 ? 3243 : 3247) : $10_1 ? 3235 : 3239) | 0, 3 | 0);
    $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 ^ 8192 | 0 | 0);
    break label$6;
   }
   label$8 : {
    $1_1 = +$784(+$1_1, $6_1 + 44 | 0 | 0);
    $1_1 = $1_1 + $1_1;
    if ($1_1 == 0.0) {
     break label$8
    }
    HEAP32[($6_1 + 44 | 0) >> 2] = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) + -1 | 0;
   }
   $11_1 = $6_1 + 16 | 0;
   label$9 : {
    $12_1 = $5_1 | 32 | 0;
    if (($12_1 | 0) != (97 | 0)) {
     break label$9
    }
    $13_1 = $5_1 & 32 | 0;
    $14_1 = $13_1 ? $8_1 + 9 | 0 : $8_1;
    label$10 : {
     if ($3_1 >>> 0 > 11 >>> 0) {
      break label$10
     }
     $10_1 = 12 - $3_1 | 0;
     if (!$10_1) {
      break label$10
     }
     $26_1 = 8.0;
     label$11 : while (1) {
      $26_1 = $26_1 * 16.0;
      $10_1 = $10_1 + -1 | 0;
      if ($10_1) {
       continue label$11
      }
      break label$11;
     };
     label$12 : {
      if ((HEAPU8[$14_1 >> 0] | 0 | 0) != (45 | 0)) {
       break label$12
      }
      $1_1 = -($26_1 + (-$1_1 - $26_1));
      break label$10;
     }
     $1_1 = $1_1 + $26_1 - $26_1;
    }
    label$13 : {
     $10_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
     $134_1 = $10_1;
     $10_1 = $10_1 >> 31 | 0;
     i64toi32_i32$1 = 0;
     $10_1 = $800(($134_1 + $10_1 | 0) ^ $10_1 | 0 | 0, i64toi32_i32$1 | 0, $11_1 | 0) | 0;
     if (($10_1 | 0) != ($11_1 | 0)) {
      break label$13
     }
     HEAP8[($6_1 + 15 | 0) >> 0] = 48;
     $10_1 = $6_1 + 15 | 0;
    }
    $15_1 = $7_1 | 2 | 0;
    $16_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
    $17_1 = $10_1 + -2 | 0;
    HEAP8[$17_1 >> 0] = $5_1 + 15 | 0;
    HEAP8[($10_1 + -1 | 0) >> 0] = ($16_1 | 0) < (0 | 0) ? 45 : 43;
    $18_1 = $4_1 & 8 | 0;
    $16_1 = $6_1 + 16 | 0;
    label$14 : while (1) {
     $10_1 = $16_1;
     label$15 : {
      label$16 : {
       if (!(Math_abs($1_1) < 2147483648.0)) {
        break label$16
       }
       $16_1 = ~~$1_1;
       break label$15;
      }
      $16_1 = -2147483648;
     }
     HEAP8[$10_1 >> 0] = HEAPU8[($16_1 + 3200 | 0) >> 0] | 0 | $13_1 | 0;
     $1_1 = ($1_1 - +($16_1 | 0)) * 16.0;
     label$17 : {
      $16_1 = $10_1 + 1 | 0;
      if (($16_1 - ($6_1 + 16 | 0) | 0 | 0) != (1 | 0)) {
       break label$17
      }
      label$18 : {
       if ($18_1) {
        break label$18
       }
       if (($3_1 | 0) > (0 | 0)) {
        break label$18
       }
       if ($1_1 == 0.0) {
        break label$17
       }
      }
      HEAP8[($10_1 + 1 | 0) >> 0] = 46;
      $16_1 = $10_1 + 2 | 0;
     }
     if ($1_1 != 0.0) {
      continue label$14
     }
     break label$14;
    };
    label$19 : {
     label$20 : {
      if (!$3_1) {
       break label$20
      }
      if ((($16_1 - ($6_1 + 16 | 0) | 0) + -2 | 0 | 0) >= ($3_1 | 0)) {
       break label$20
      }
      $10_1 = (($3_1 + $11_1 | 0) - $17_1 | 0) + 2 | 0;
      break label$19;
     }
     $10_1 = (($11_1 - ($6_1 + 16 | 0) | 0) - $17_1 | 0) + $16_1 | 0;
    }
    $9_1 = $10_1 + $15_1 | 0;
    $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 | 0);
    $794($0_1 | 0, $14_1 | 0, $15_1 | 0);
    $797($0_1 | 0, 48 | 0, $2_1 | 0, $9_1 | 0, $4_1 ^ 65536 | 0 | 0);
    $16_1 = $16_1 - ($6_1 + 16 | 0) | 0;
    $794($0_1 | 0, $6_1 + 16 | 0 | 0, $16_1 | 0);
    $13_1 = $11_1 - $17_1 | 0;
    $797($0_1 | 0, 48 | 0, $10_1 - ($16_1 + $13_1 | 0) | 0 | 0, 0 | 0, 0 | 0);
    $794($0_1 | 0, $17_1 | 0, $13_1 | 0);
    $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 ^ 8192 | 0 | 0);
    break label$6;
   }
   $10_1 = ($3_1 | 0) < (0 | 0);
   label$21 : {
    label$22 : {
     if ($1_1 != 0.0) {
      break label$22
     }
     $18_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
     break label$21;
    }
    $18_1 = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) + -28 | 0;
    HEAP32[($6_1 + 44 | 0) >> 2] = $18_1;
    $1_1 = $1_1 * 268435456.0;
   }
   $14_1 = $10_1 ? 6 : $3_1;
   $19_1 = ($18_1 | 0) < (0 | 0) ? $6_1 + 48 | 0 : $6_1 + 336 | 0;
   $13_1 = $19_1;
   label$23 : while (1) {
    label$24 : {
     label$25 : {
      if (!($1_1 < 4294967296.0 & $1_1 >= 0.0 | 0)) {
       break label$25
      }
      $10_1 = ~~$1_1 >>> 0;
      break label$24;
     }
     $10_1 = 0;
    }
    HEAP32[$13_1 >> 2] = $10_1;
    $13_1 = $13_1 + 4 | 0;
    $1_1 = ($1_1 - +($10_1 >>> 0)) * 1.0e9;
    if ($1_1 != 0.0) {
     continue label$23
    }
    break label$23;
   };
   label$26 : {
    label$27 : {
     if (($18_1 | 0) >= (1 | 0)) {
      break label$27
     }
     $10_1 = $13_1;
     $16_1 = $19_1;
     break label$26;
    }
    $16_1 = $19_1;
    label$28 : while (1) {
     $18_1 = ($18_1 | 0) < (29 | 0) ? $18_1 : 29;
     label$29 : {
      $10_1 = $13_1 + -4 | 0;
      if ($10_1 >>> 0 < $16_1 >>> 0) {
       break label$29
      }
      i64toi32_i32$1 = 0;
      $25_1 = $18_1;
      $25$hi = i64toi32_i32$1;
      i64toi32_i32$1 = 0;
      $24_1 = 0;
      $24$hi = i64toi32_i32$1;
      label$30 : while (1) {
       $325_1 = $10_1;
       i64toi32_i32$0 = $10_1;
       i64toi32_i32$1 = HEAP32[$10_1 >> 2] | 0;
       i64toi32_i32$2 = 0;
       $327$hi = i64toi32_i32$2;
       i64toi32_i32$2 = $25$hi;
       i64toi32_i32$2 = $327$hi;
       i64toi32_i32$0 = i64toi32_i32$1;
       i64toi32_i32$1 = $25$hi;
       i64toi32_i32$3 = $25_1;
       i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
        i64toi32_i32$1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
        $47_1 = 0;
       } else {
        i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
        $47_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
       }
       $329$hi = i64toi32_i32$1;
       i64toi32_i32$1 = $24$hi;
       i64toi32_i32$2 = $24_1;
       i64toi32_i32$0 = 0;
       i64toi32_i32$3 = -1;
       i64toi32_i32$0 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
       $331_1 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
       $331$hi = i64toi32_i32$0;
       i64toi32_i32$0 = $329$hi;
       i64toi32_i32$1 = $47_1;
       i64toi32_i32$2 = $331$hi;
       i64toi32_i32$3 = $331_1;
       i64toi32_i32$4 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
       i64toi32_i32$5 = i64toi32_i32$0 + i64toi32_i32$2 | 0;
       if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
        i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
       }
       $24_1 = i64toi32_i32$4;
       $24$hi = i64toi32_i32$5;
       $333$hi = i64toi32_i32$5;
       i64toi32_i32$1 = 0;
       i64toi32_i32$1 = __wasm_i64_udiv(i64toi32_i32$4 | 0, i64toi32_i32$5 | 0, 1e9 | 0, i64toi32_i32$1 | 0) | 0;
       i64toi32_i32$5 = i64toi32_i32$HIGH_BITS;
       $24_1 = i64toi32_i32$1;
       $24$hi = i64toi32_i32$5;
       i64toi32_i32$1 = 0;
       i64toi32_i32$1 = __wasm_i64_mul($24_1 | 0, i64toi32_i32$5 | 0, 1e9 | 0, i64toi32_i32$1 | 0) | 0;
       i64toi32_i32$5 = i64toi32_i32$HIGH_BITS;
       $337_1 = i64toi32_i32$1;
       $337$hi = i64toi32_i32$5;
       i64toi32_i32$5 = $333$hi;
       i64toi32_i32$0 = i64toi32_i32$4;
       i64toi32_i32$1 = $337$hi;
       i64toi32_i32$3 = $337_1;
       i64toi32_i32$2 = i64toi32_i32$4 - i64toi32_i32$3 | 0;
       i64toi32_i32$4 = (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) + i64toi32_i32$1 | 0;
       i64toi32_i32$4 = i64toi32_i32$5 - i64toi32_i32$4 | 0;
       HEAP32[$325_1 >> 2] = i64toi32_i32$2;
       $10_1 = $10_1 + -4 | 0;
       if ($10_1 >>> 0 >= $16_1 >>> 0) {
        continue label$30
       }
       break label$30;
      };
      i64toi32_i32$4 = $24$hi;
      $10_1 = $24_1;
      if (!$10_1) {
       break label$29
      }
      $16_1 = $16_1 + -4 | 0;
      HEAP32[$16_1 >> 2] = $10_1;
     }
     label$31 : {
      label$32 : while (1) {
       $10_1 = $13_1;
       if ($10_1 >>> 0 <= $16_1 >>> 0) {
        break label$31
       }
       $13_1 = $10_1 + -4 | 0;
       if (!(HEAP32[$13_1 >> 2] | 0)) {
        continue label$32
       }
       break label$32;
      };
     }
     $18_1 = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) - $18_1 | 0;
     HEAP32[($6_1 + 44 | 0) >> 2] = $18_1;
     $13_1 = $10_1;
     if (($18_1 | 0) > (0 | 0)) {
      continue label$28
     }
     break label$28;
    };
   }
   label$33 : {
    if (($18_1 | 0) > (-1 | 0)) {
     break label$33
    }
    $20_1 = (($14_1 + 25 | 0 | 0) / (9 | 0) | 0) + 1 | 0;
    $21_1 = ($12_1 | 0) == (102 | 0);
    label$34 : while (1) {
     $9_1 = ($18_1 | 0) < (-9 | 0) ? 9 : 0 - $18_1 | 0;
     label$35 : {
      label$36 : {
       if ($16_1 >>> 0 < $10_1 >>> 0) {
        break label$36
       }
       $16_1 = HEAP32[$16_1 >> 2] | 0 ? $16_1 : $16_1 + 4 | 0;
       break label$35;
      }
      $17_1 = 1e9 >>> $9_1 | 0;
      $15_1 = (-1 << $9_1 | 0) ^ -1 | 0;
      $18_1 = 0;
      $13_1 = $16_1;
      label$37 : while (1) {
       $3_1 = HEAP32[$13_1 >> 2] | 0;
       HEAP32[$13_1 >> 2] = ($3_1 >>> $9_1 | 0) + $18_1 | 0;
       $18_1 = Math_imul($3_1 & $15_1 | 0, $17_1);
       $13_1 = $13_1 + 4 | 0;
       if ($13_1 >>> 0 < $10_1 >>> 0) {
        continue label$37
       }
       break label$37;
      };
      $16_1 = HEAP32[$16_1 >> 2] | 0 ? $16_1 : $16_1 + 4 | 0;
      if (!$18_1) {
       break label$35
      }
      HEAP32[$10_1 >> 2] = $18_1;
      $10_1 = $10_1 + 4 | 0;
     }
     $18_1 = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) + $9_1 | 0;
     HEAP32[($6_1 + 44 | 0) >> 2] = $18_1;
     $13_1 = $21_1 ? $19_1 : $16_1;
     $10_1 = (($10_1 - $13_1 | 0) >> 2 | 0 | 0) > ($20_1 | 0) ? $13_1 + ($20_1 << 2 | 0) | 0 : $10_1;
     if (($18_1 | 0) < (0 | 0)) {
      continue label$34
     }
     break label$34;
    };
   }
   $13_1 = 0;
   label$38 : {
    if ($16_1 >>> 0 >= $10_1 >>> 0) {
     break label$38
    }
    $13_1 = Math_imul(($19_1 - $16_1 | 0) >> 2 | 0, 9);
    $18_1 = 10;
    $3_1 = HEAP32[$16_1 >> 2] | 0;
    if ($3_1 >>> 0 < 10 >>> 0) {
     break label$38
    }
    label$39 : while (1) {
     $13_1 = $13_1 + 1 | 0;
     $18_1 = Math_imul($18_1, 10);
     if ($3_1 >>> 0 >= $18_1 >>> 0) {
      continue label$39
     }
     break label$39;
    };
   }
   label$40 : {
    $18_1 = ($14_1 - (($12_1 | 0) == (102 | 0) ? 0 : $13_1) | 0) - (($14_1 | 0) != (0 | 0) & ($12_1 | 0) == (103 | 0) | 0) | 0;
    if (($18_1 | 0) >= (Math_imul(($10_1 - $19_1 | 0) >> 2 | 0, 9) + -9 | 0 | 0)) {
     break label$40
    }
    $18_1 = $18_1 + 9216 | 0;
    $9_1 = ($18_1 | 0) / (9 | 0) | 0;
    $17_1 = (($9_1 << 2 | 0) + $19_1 | 0) + -4092 | 0;
    $3_1 = 10;
    label$41 : {
     $18_1 = $18_1 - Math_imul($9_1, 9) | 0;
     if (($18_1 | 0) > (7 | 0)) {
      break label$41
     }
     label$42 : while (1) {
      $3_1 = Math_imul($3_1, 10);
      $9_1 = ($18_1 | 0) < (7 | 0);
      $18_1 = $18_1 + 1 | 0;
      if ($9_1) {
       continue label$42
      }
      break label$42;
     };
    }
    $9_1 = HEAP32[$17_1 >> 2] | 0;
    $15_1 = ($9_1 >>> 0) / ($3_1 >>> 0) | 0;
    $18_1 = $9_1 - Math_imul($15_1, $3_1) | 0;
    label$43 : {
     label$44 : {
      $20_1 = $17_1 + 4 | 0;
      if (($20_1 | 0) != ($10_1 | 0)) {
       break label$44
      }
      if (!$18_1) {
       break label$43
      }
     }
     $21_1 = $3_1 >>> 1 | 0;
     $26_1 = $18_1 >>> 0 < $21_1 >>> 0 ? .5 : ($20_1 | 0) == ($10_1 | 0) ? (($18_1 | 0) == ($21_1 | 0) ? 1.0 : 1.5) : 1.5;
     $1_1 = $15_1 & 1 | 0 ? 9007199254740994.0 : 9007199254740992.0;
     label$45 : {
      if (!$7_1) {
       break label$45
      }
      if ((HEAPU8[$8_1 >> 0] | 0 | 0) != (45 | 0)) {
       break label$45
      }
      $26_1 = -$26_1;
      $1_1 = -$1_1;
     }
     $18_1 = $9_1 - $18_1 | 0;
     HEAP32[$17_1 >> 2] = $18_1;
     if ($1_1 + $26_1 == $1_1) {
      break label$43
     }
     $13_1 = $18_1 + $3_1 | 0;
     HEAP32[$17_1 >> 2] = $13_1;
     label$46 : {
      if ($13_1 >>> 0 < 1e9 >>> 0) {
       break label$46
      }
      label$47 : while (1) {
       HEAP32[$17_1 >> 2] = 0;
       label$48 : {
        $17_1 = $17_1 + -4 | 0;
        if ($17_1 >>> 0 >= $16_1 >>> 0) {
         break label$48
        }
        $16_1 = $16_1 + -4 | 0;
        HEAP32[$16_1 >> 2] = 0;
       }
       $13_1 = (HEAP32[$17_1 >> 2] | 0) + 1 | 0;
       HEAP32[$17_1 >> 2] = $13_1;
       if ($13_1 >>> 0 > 999999999 >>> 0) {
        continue label$47
       }
       break label$47;
      };
     }
     $13_1 = Math_imul(($19_1 - $16_1 | 0) >> 2 | 0, 9);
     $18_1 = 10;
     $3_1 = HEAP32[$16_1 >> 2] | 0;
     if ($3_1 >>> 0 < 10 >>> 0) {
      break label$43
     }
     label$49 : while (1) {
      $13_1 = $13_1 + 1 | 0;
      $18_1 = Math_imul($18_1, 10);
      if ($3_1 >>> 0 >= $18_1 >>> 0) {
       continue label$49
      }
      break label$49;
     };
    }
    $18_1 = $17_1 + 4 | 0;
    $10_1 = $10_1 >>> 0 > $18_1 >>> 0 ? $18_1 : $10_1;
   }
   label$50 : {
    label$51 : while (1) {
     label$52 : {
      $18_1 = $10_1;
      if ($10_1 >>> 0 > $16_1 >>> 0) {
       break label$52
      }
      $21_1 = 0;
      break label$50;
     }
     $10_1 = $18_1 + -4 | 0;
     if (!(HEAP32[$10_1 >> 2] | 0)) {
      continue label$51
     }
     break label$51;
    };
    $21_1 = 1;
   }
   label$53 : {
    label$54 : {
     if (($12_1 | 0) == (103 | 0)) {
      break label$54
     }
     $15_1 = $4_1 & 8 | 0;
     break label$53;
    }
    $10_1 = $14_1 ? $14_1 : 1;
    $3_1 = ($10_1 | 0) > ($13_1 | 0) & ($13_1 | 0) > (-5 | 0) | 0;
    $14_1 = ($3_1 ? $13_1 ^ -1 | 0 : -1) + $10_1 | 0;
    $5_1 = ($3_1 ? -1 : -2) + $5_1 | 0;
    $15_1 = $4_1 & 8 | 0;
    if ($15_1) {
     break label$53
    }
    $10_1 = 9;
    label$55 : {
     if (!$21_1) {
      break label$55
     }
     $10_1 = 9;
     $9_1 = HEAP32[($18_1 + -4 | 0) >> 2] | 0;
     if (!$9_1) {
      break label$55
     }
     $3_1 = 10;
     $10_1 = 0;
     if (($9_1 >>> 0) % (10 >>> 0) | 0) {
      break label$55
     }
     label$56 : while (1) {
      $10_1 = $10_1 + 1 | 0;
      $3_1 = Math_imul($3_1, 10);
      if (!(($9_1 >>> 0) % ($3_1 >>> 0) | 0)) {
       continue label$56
      }
      break label$56;
     };
    }
    $3_1 = Math_imul(($18_1 - $19_1 | 0) >> 2 | 0, 9) + -9 | 0;
    label$57 : {
     if (($5_1 | 32 | 0 | 0) != (102 | 0)) {
      break label$57
     }
     $15_1 = 0;
     $10_1 = $3_1 - $10_1 | 0;
     $10_1 = ($10_1 | 0) > (0 | 0) ? $10_1 : 0;
     $14_1 = ($14_1 | 0) < ($10_1 | 0) ? $14_1 : $10_1;
     break label$53;
    }
    $15_1 = 0;
    $10_1 = ($3_1 + $13_1 | 0) - $10_1 | 0;
    $10_1 = ($10_1 | 0) > (0 | 0) ? $10_1 : 0;
    $14_1 = ($14_1 | 0) < ($10_1 | 0) ? $14_1 : $10_1;
   }
   $12_1 = $14_1 | $15_1 | 0;
   $3_1 = ($12_1 | 0) != (0 | 0);
   label$58 : {
    label$59 : {
     $17_1 = $5_1 | 32 | 0;
     if (($17_1 | 0) != (102 | 0)) {
      break label$59
     }
     $10_1 = ($13_1 | 0) > (0 | 0) ? $13_1 : 0;
     break label$58;
    }
    label$60 : {
     $10_1 = $13_1 >> 31 | 0;
     i64toi32_i32$4 = 0;
     $10_1 = $800(($13_1 + $10_1 | 0) ^ $10_1 | 0 | 0, i64toi32_i32$4 | 0, $11_1 | 0) | 0;
     if (($11_1 - $10_1 | 0 | 0) > (1 | 0)) {
      break label$60
     }
     label$61 : while (1) {
      $10_1 = $10_1 + -1 | 0;
      HEAP8[$10_1 >> 0] = 48;
      if (($11_1 - $10_1 | 0 | 0) < (2 | 0)) {
       continue label$61
      }
      break label$61;
     };
    }
    $20_1 = $10_1 + -2 | 0;
    HEAP8[$20_1 >> 0] = $5_1;
    HEAP8[($10_1 + -1 | 0) >> 0] = ($13_1 | 0) < (0 | 0) ? 45 : 43;
    $10_1 = $11_1 - $20_1 | 0;
   }
   $9_1 = ((($7_1 + $14_1 | 0) + $3_1 | 0) + $10_1 | 0) + 1 | 0;
   $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 | 0);
   $794($0_1 | 0, $8_1 | 0, $7_1 | 0);
   $797($0_1 | 0, 48 | 0, $2_1 | 0, $9_1 | 0, $4_1 ^ 65536 | 0 | 0);
   label$62 : {
    label$63 : {
     label$64 : {
      label$65 : {
       if (($17_1 | 0) != (102 | 0)) {
        break label$65
       }
       $17_1 = $6_1 + 16 | 0 | 8 | 0;
       $13_1 = $6_1 + 16 | 0 | 9 | 0;
       $3_1 = $16_1 >>> 0 > $19_1 >>> 0 ? $19_1 : $16_1;
       $16_1 = $3_1;
       label$66 : while (1) {
        i64toi32_i32$5 = $16_1;
        i64toi32_i32$4 = HEAP32[$16_1 >> 2] | 0;
        i64toi32_i32$0 = 0;
        $10_1 = $800(i64toi32_i32$4 | 0, i64toi32_i32$0 | 0, $13_1 | 0) | 0;
        label$67 : {
         label$68 : {
          if (($16_1 | 0) == ($3_1 | 0)) {
           break label$68
          }
          if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
           break label$67
          }
          label$69 : while (1) {
           $10_1 = $10_1 + -1 | 0;
           HEAP8[$10_1 >> 0] = 48;
           if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
            continue label$69
           }
           break label$67;
          };
         }
         if (($10_1 | 0) != ($13_1 | 0)) {
          break label$67
         }
         HEAP8[($6_1 + 24 | 0) >> 0] = 48;
         $10_1 = $17_1;
        }
        $794($0_1 | 0, $10_1 | 0, $13_1 - $10_1 | 0 | 0);
        $16_1 = $16_1 + 4 | 0;
        if ($16_1 >>> 0 <= $19_1 >>> 0) {
         continue label$66
        }
        break label$66;
       };
       label$70 : {
        if (!$12_1) {
         break label$70
        }
        $794($0_1 | 0, 3251 | 0, 1 | 0);
       }
       if ($16_1 >>> 0 >= $18_1 >>> 0) {
        break label$64
       }
       if (($14_1 | 0) < (1 | 0)) {
        break label$64
       }
       label$71 : while (1) {
        label$72 : {
         i64toi32_i32$5 = $16_1;
         i64toi32_i32$0 = HEAP32[$16_1 >> 2] | 0;
         i64toi32_i32$4 = 0;
         $10_1 = $800(i64toi32_i32$0 | 0, i64toi32_i32$4 | 0, $13_1 | 0) | 0;
         if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
          break label$72
         }
         label$73 : while (1) {
          $10_1 = $10_1 + -1 | 0;
          HEAP8[$10_1 >> 0] = 48;
          if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
           continue label$73
          }
          break label$73;
         };
        }
        $794($0_1 | 0, $10_1 | 0, (($14_1 | 0) < (9 | 0) ? $14_1 : 9) | 0);
        $10_1 = $14_1 + -9 | 0;
        $16_1 = $16_1 + 4 | 0;
        if ($16_1 >>> 0 >= $18_1 >>> 0) {
         break label$63
        }
        $3_1 = ($14_1 | 0) > (9 | 0);
        $14_1 = $10_1;
        if ($3_1) {
         continue label$71
        }
        break label$63;
       };
      }
      label$74 : {
       if (($14_1 | 0) < (0 | 0)) {
        break label$74
       }
       $17_1 = $21_1 ? $18_1 : $16_1 + 4 | 0;
       $19_1 = $6_1 + 16 | 0 | 8 | 0;
       $18_1 = $6_1 + 16 | 0 | 9 | 0;
       $13_1 = $16_1;
       label$75 : while (1) {
        label$76 : {
         i64toi32_i32$5 = $13_1;
         i64toi32_i32$4 = HEAP32[$13_1 >> 2] | 0;
         i64toi32_i32$0 = 0;
         $10_1 = $800(i64toi32_i32$4 | 0, i64toi32_i32$0 | 0, $18_1 | 0) | 0;
         if (($10_1 | 0) != ($18_1 | 0)) {
          break label$76
         }
         HEAP8[($6_1 + 24 | 0) >> 0] = 48;
         $10_1 = $19_1;
        }
        label$77 : {
         label$78 : {
          if (($13_1 | 0) == ($16_1 | 0)) {
           break label$78
          }
          if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
           break label$77
          }
          label$79 : while (1) {
           $10_1 = $10_1 + -1 | 0;
           HEAP8[$10_1 >> 0] = 48;
           if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
            continue label$79
           }
           break label$77;
          };
         }
         $794($0_1 | 0, $10_1 | 0, 1 | 0);
         $10_1 = $10_1 + 1 | 0;
         label$80 : {
          if ($15_1) {
           break label$80
          }
          if (($14_1 | 0) < (1 | 0)) {
           break label$77
          }
         }
         $794($0_1 | 0, 3251 | 0, 1 | 0);
        }
        $3_1 = $18_1 - $10_1 | 0;
        $794($0_1 | 0, $10_1 | 0, (($14_1 | 0) > ($3_1 | 0) ? $3_1 : $14_1) | 0);
        $14_1 = $14_1 - $3_1 | 0;
        $13_1 = $13_1 + 4 | 0;
        if ($13_1 >>> 0 >= $17_1 >>> 0) {
         break label$74
        }
        if (($14_1 | 0) > (-1 | 0)) {
         continue label$75
        }
        break label$75;
       };
      }
      $797($0_1 | 0, 48 | 0, $14_1 + 18 | 0 | 0, 18 | 0, 0 | 0);
      $794($0_1 | 0, $20_1 | 0, $11_1 - $20_1 | 0 | 0);
      break label$62;
     }
     $10_1 = $14_1;
    }
    $797($0_1 | 0, 48 | 0, $10_1 + 9 | 0 | 0, 9 | 0, 0 | 0);
   }
   $797($0_1 | 0, 32 | 0, $2_1 | 0, $9_1 | 0, $4_1 ^ 8192 | 0 | 0);
  }
  label$81 : {
   $23_1 = $6_1 + 560 | 0;
   if ($23_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $23_1;
  }
  return (($9_1 | 0) < ($2_1 | 0) ? $2_1 : $9_1) | 0;
 }
 
 function $803($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $2_1 = 0, $12_1 = 0, $12$hi = 0, $14_1 = 0, $14$hi = 0;
  $2_1 = ((HEAP32[$1_1 >> 2] | 0) + 15 | 0) & -16 | 0;
  HEAP32[$1_1 >> 2] = $2_1 + 16 | 0;
  i64toi32_i32$2 = $2_1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $12_1 = i64toi32_i32$0;
  $12$hi = i64toi32_i32$1;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 8 | 0) >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 12 | 0) >> 2] | 0;
  $14_1 = i64toi32_i32$1;
  $14$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $12$hi;
  i64toi32_i32$1 = $14$hi;
  HEAPF64[$0_1 >> 3] = +$787($12_1 | 0, i64toi32_i32$0 | 0, $14_1 | 0, i64toi32_i32$1 | 0);
 }
 
 function $804($0_1) {
  $0_1 = +$0_1;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  wasm2js_scratch_store_f64(+$0_1);
  i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
  i64toi32_i32$1 = wasm2js_scratch_load_i32(0 | 0) | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function $805($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $3_1 = 0, $2_1 = 0, $4_1 = 0, $6_1 = 0, $5_1 = 0;
  label$1 : {
   $2_1 = global$0 - 16 | 0;
   $5_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  HEAP8[($2_1 + 15 | 0) >> 0] = $1_1;
  label$3 : {
   label$4 : {
    $3_1 = HEAP32[($0_1 + 16 | 0) >> 2] | 0;
    if ($3_1) {
     break label$4
    }
    $3_1 = -1;
    if ($790($0_1 | 0) | 0) {
     break label$3
    }
    $3_1 = HEAP32[($0_1 + 16 | 0) >> 2] | 0;
   }
   label$5 : {
    $4_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
    if ($4_1 >>> 0 >= $3_1 >>> 0) {
     break label$5
    }
    $3_1 = $1_1 & 255 | 0;
    if (($3_1 | 0) == (HEAP8[($0_1 + 75 | 0) >> 0] | 0 | 0)) {
     break label$5
    }
    HEAP32[($0_1 + 20 | 0) >> 2] = $4_1 + 1 | 0;
    HEAP8[$4_1 >> 0] = $1_1;
    break label$3;
   }
   $3_1 = -1;
   if ((FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0]($0_1, $2_1 + 15 | 0, 1) | 0 | 0) != (1 | 0)) {
    break label$3
   }
   $3_1 = HEAPU8[($2_1 + 15 | 0) >> 0] | 0;
  }
  label$6 : {
   $6_1 = $2_1 + 16 | 0;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
  return $3_1 | 0;
 }
 
 function $806($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $807($0_1) {
  $0_1 = $0_1 | 0;
  return fimport$17($806(HEAP32[($0_1 + 60 | 0) >> 2] | 0 | 0) | 0 | 0) | 0 | 0;
 }
 
 function $808($0_1) {
  $0_1 = $0_1 | 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   return 0 | 0;
  }
  HEAP32[($777() | 0) >> 2] = $0_1;
  return -1 | 0;
 }
 
 function $809($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0, $7_1 = 0, $6_1 = 0, $8_1 = 0, $10_1 = 0, $9_1 = 0;
  label$1 : {
   $3_1 = global$0 - 32 | 0;
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  $4_1 = HEAP32[($0_1 + 28 | 0) >> 2] | 0;
  HEAP32[($3_1 + 16 | 0) >> 2] = $4_1;
  $5_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
  HEAP32[($3_1 + 28 | 0) >> 2] = $2_1;
  HEAP32[($3_1 + 24 | 0) >> 2] = $1_1;
  $1_1 = $5_1 - $4_1 | 0;
  HEAP32[($3_1 + 20 | 0) >> 2] = $1_1;
  $6_1 = $1_1 + $2_1 | 0;
  $5_1 = 2;
  $1_1 = $3_1 + 16 | 0;
  label$3 : while (1) {
   label$4 : {
    label$5 : {
     if (!($808(fimport$18(HEAP32[($0_1 + 60 | 0) >> 2] | 0 | 0, $1_1 | 0, $5_1 | 0, $3_1 + 12 | 0 | 0) | 0 | 0) | 0)) {
      break label$5
     }
     $4_1 = -1;
     HEAP32[($3_1 + 12 | 0) >> 2] = -1;
     break label$4;
    }
    $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
   }
   label$6 : {
    label$7 : {
     label$8 : {
      if (($6_1 | 0) != ($4_1 | 0)) {
       break label$8
      }
      $1_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
      HEAP32[($0_1 + 28 | 0) >> 2] = $1_1;
      HEAP32[($0_1 + 20 | 0) >> 2] = $1_1;
      HEAP32[($0_1 + 16 | 0) >> 2] = $1_1 + (HEAP32[($0_1 + 48 | 0) >> 2] | 0) | 0;
      $4_1 = $2_1;
      break label$7;
     }
     if (($4_1 | 0) > (-1 | 0)) {
      break label$6
     }
     $4_1 = 0;
     HEAP32[($0_1 + 28 | 0) >> 2] = 0;
     HEAP32[($0_1 + 16 | 0) >> 2] = 0;
     HEAP32[($0_1 + 20 | 0) >> 2] = 0;
     HEAP32[$0_1 >> 2] = HEAP32[$0_1 >> 2] | 0 | 32 | 0;
     if (($5_1 | 0) == (2 | 0)) {
      break label$7
     }
     $4_1 = $2_1 - (HEAP32[($1_1 + 4 | 0) >> 2] | 0) | 0;
    }
    label$9 : {
     $10_1 = $3_1 + 32 | 0;
     if ($10_1 >>> 0 < global$2 >>> 0) {
      fimport$29()
     }
     global$0 = $10_1;
    }
    return $4_1 | 0;
   }
   $7_1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
   $8_1 = $4_1 >>> 0 > $7_1 >>> 0;
   $1_1 = $8_1 ? $1_1 + 8 | 0 : $1_1;
   $7_1 = $4_1 - ($8_1 ? $7_1 : 0) | 0;
   HEAP32[$1_1 >> 2] = (HEAP32[$1_1 >> 2] | 0) + $7_1 | 0;
   HEAP32[($1_1 + 4 | 0) >> 2] = (HEAP32[($1_1 + 4 | 0) >> 2] | 0) - $7_1 | 0;
   $6_1 = $6_1 - $4_1 | 0;
   $5_1 = $5_1 - $8_1 | 0;
   continue label$3;
  };
 }
 
 function $810($0_1, $1_1, $1$hi, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $5_1 = 0, $4_1 = 0;
  label$1 : {
   $3_1 = global$0 - 16 | 0;
   $4_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $4_1;
  }
  label$3 : {
   label$4 : {
    i64toi32_i32$0 = $1$hi;
    if ($808($1074(HEAP32[($0_1 + 60 | 0) >> 2] | 0 | 0, $1_1 | 0, i64toi32_i32$0 | 0, $2_1 & 255 | 0 | 0, $3_1 + 8 | 0 | 0) | 0 | 0) | 0) {
     break label$4
    }
    i64toi32_i32$0 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
    $1_1 = i64toi32_i32$0;
    $1$hi = i64toi32_i32$1;
    break label$3;
   }
   i64toi32_i32$1 = -1;
   $1_1 = -1;
   $1$hi = i64toi32_i32$1;
   i64toi32_i32$0 = $3_1;
   i64toi32_i32$1 = -1;
   HEAP32[($3_1 + 8 | 0) >> 2] = -1;
   HEAP32[($3_1 + 12 | 0) >> 2] = i64toi32_i32$1;
  }
  label$5 : {
   $5_1 = $3_1 + 16 | 0;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  i64toi32_i32$1 = $1$hi;
  i64toi32_i32$0 = $1_1;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$0 | 0;
 }
 
 function $811($0_1) {
  $0_1 = $0_1 | 0;
  $314(3260 | 0);
  abort();
 }
 
 function $812($0_1) {
  $0_1 = $0_1 | 0;
  $813(3260 | 0);
  abort();
 }
 
 function $813($0_1) {
  $0_1 = $0_1 | 0;
  fimport$14();
  abort();
 }
 
 function $814($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $3_1 = 0, $2_1 = 0, $5_1 = 0, $4_1 = 0, i64toi32_i32$1 = 0;
  label$1 : {
   $2_1 = global$0 - 16 | 0;
   $4_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $4_1;
  }
  $242($815($1_1 | 0) | 0 | 0);
  $3_1 = $816($0_1 | 0, $2_1 + 8 | 0 | 0) | 0;
  label$3 : {
   label$4 : {
    if ($442($1_1 | 0) | 0) {
     break label$4
    }
    $1_1 = $447($1_1 | 0) | 0;
    $3_1 = $438($3_1 | 0) | 0;
    HEAP32[($3_1 + 8 | 0) >> 2] = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
    HEAP32[$3_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
    HEAP32[($3_1 + 4 | 0) >> 2] = i64toi32_i32$1;
    break label$3;
   }
   $817($0_1 | 0, $441($445($1_1 | 0) | 0 | 0) | 0 | 0, $443($1_1 | 0) | 0 | 0);
  }
  label$5 : {
   $5_1 = $2_1 + 16 | 0;
   if ($5_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  return $0_1 | 0;
 }
 
 function $815($0_1) {
  $0_1 = $0_1 | 0;
  return $818($0_1 | 0) | 0 | 0;
 }
 
 function $816($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $346($0_1 | 0) | 0;
  $820($0_1 | 0, $819($1_1 | 0) | 0 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $817($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0, $7_1 = 0, $6_1 = 0;
  label$1 : {
   $3_1 = global$0 - 16 | 0;
   $6_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
  label$3 : {
   if (($821($0_1 | 0) | 0) >>> 0 < $2_1 >>> 0) {
    break label$3
   }
   label$4 : {
    label$5 : {
     if ($2_1 >>> 0 > 10 >>> 0) {
      break label$5
     }
     $822($0_1 | 0, $2_1 | 0);
     $4_1 = $477($0_1 | 0) | 0;
     break label$4;
    }
    $4_1 = $823($2_1 | 0) | 0;
    $5_1 = $4_1 + 1 | 0;
    $4_1 = $825($824($0_1 | 0) | 0 | 0, $5_1 | 0) | 0;
    $826($0_1 | 0, $4_1 | 0);
    $827($0_1 | 0, $5_1 | 0);
    $828($0_1 | 0, $2_1 | 0);
   }
   $830($829($4_1 | 0) | 0 | 0, $1_1 | 0, $2_1 | 0) | 0;
   HEAP8[($3_1 + 15 | 0) >> 0] = 0;
   $831($4_1 + $2_1 | 0 | 0, $3_1 + 15 | 0 | 0);
   label$6 : {
    $7_1 = $3_1 + 16 | 0;
    if ($7_1 >>> 0 < global$2 >>> 0) {
     fimport$29()
    }
    global$0 = $7_1;
   }
   return;
  }
  $811($0_1 | 0);
  abort();
 }
 
 function $818($0_1) {
  $0_1 = $0_1 | 0;
  return $860($0_1 | 0) | 0 | 0;
 }
 
 function $819($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $820($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $819($1_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $821($0_1) {
  $0_1 = $0_1 | 0;
  return ($848($815($0_1 | 0) | 0 | 0) | 0) + -16 | 0 | 0;
 }
 
 function $822($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  HEAP8[(($438($0_1 | 0) | 0) + 11 | 0) >> 0] = $1_1;
 }
 
 function $823($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $7_1 = 0;
  $1_1 = 10;
  label$1 : {
   if ($0_1 >>> 0 < 11 >>> 0) {
    break label$1
   }
   $0_1 = $849($0_1 + 1 | 0 | 0) | 0;
   $7_1 = $0_1;
   $0_1 = $0_1 + -1 | 0;
   $1_1 = ($0_1 | 0) == (11 | 0) ? $7_1 : $0_1;
  }
  return $1_1 | 0;
 }
 
 function $824($0_1) {
  $0_1 = $0_1 | 0;
  return $836($0_1 | 0) | 0 | 0;
 }
 
 function $825($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return $850($0_1 | 0, $1_1 | 0, 0 | 0) | 0 | 0;
 }
 
 function $826($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  HEAP32[($438($0_1 | 0) | 0) >> 2] = $1_1;
 }
 
 function $827($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  HEAP32[(($438($0_1 | 0) | 0) + 8 | 0) >> 2] = $1_1 | -2147483648 | 0;
 }
 
 function $828($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  HEAP32[(($438($0_1 | 0) | 0) + 4 | 0) >> 2] = $1_1;
 }
 
 function $829($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $830($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if (!$2_1) {
    break label$1
   }
   $1043($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0;
  }
  return $0_1 | 0;
 }
 
 function $831($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  HEAP8[$0_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
 }
 
 function $832($0_1) {
  $0_1 = $0_1 | 0;
  label$1 : {
   if (!($442($0_1 | 0) | 0)) {
    break label$1
   }
   $834($824($0_1 | 0) | 0 | 0, $476($0_1 | 0) | 0 | 0, $833($0_1 | 0) | 0 | 0);
  }
  return $0_1 | 0;
 }
 
 function $833($0_1) {
  $0_1 = $0_1 | 0;
  return (HEAP32[(($447($0_1 | 0) | 0) + 8 | 0) >> 2] | 0) & 2147483647 | 0 | 0;
 }
 
 function $834($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $835($0_1 | 0, $1_1 | 0, $2_1 | 0);
 }
 
 function $835($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $186($1_1 | 0, $2_1 | 0, 1 | 0);
 }
 
 function $836($0_1) {
  $0_1 = $0_1 | 0;
  return $861($0_1 | 0) | 0 | 0;
 }
 
 function $837($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  label$1 : {
   if (($0_1 | 0) == ($1_1 | 0)) {
    break label$1
   }
   $838($0_1 | 0, $1_1 | 0);
   $839($0_1 | 0, $84($1_1 | 0) | 0 | 0, $89($1_1 | 0) | 0 | 0) | 0;
  }
  return $0_1 | 0;
 }
 
 function $838($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $840($0_1 | 0, $1_1 | 0);
 }
 
 function $839($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0, $7_1 = 0, $6_1 = 0;
  label$1 : {
   $3_1 = global$0 - 16 | 0;
   $6_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
  label$3 : {
   label$4 : {
    $4_1 = $841($0_1 | 0) | 0;
    if ($4_1 >>> 0 < $2_1 >>> 0) {
     break label$4
    }
    $4_1 = $829($90($0_1 | 0) | 0 | 0) | 0;
    $842($4_1 | 0, $1_1 | 0, $2_1 | 0) | 0;
    HEAP8[($3_1 + 15 | 0) >> 0] = 0;
    $831($4_1 + $2_1 | 0 | 0, $3_1 + 15 | 0 | 0);
    $843($0_1 | 0, $2_1 | 0);
    $844($0_1 | 0, $2_1 | 0);
    break label$3;
   }
   $5_1 = $89($0_1 | 0) | 0;
   $845($0_1 | 0, $4_1 | 0, $2_1 - $4_1 | 0 | 0, $5_1 | 0, 0 | 0, $5_1 | 0, $2_1 | 0, $1_1 | 0);
  }
  label$5 : {
   $7_1 = $3_1 + 16 | 0;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  return $0_1 | 0;
 }
 
 function $840($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
 }
 
 function $841($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = 10;
  label$1 : {
   if (!($442($0_1 | 0) | 0)) {
    break label$1
   }
   $1_1 = ($833($0_1 | 0) | 0) + -1 | 0;
  }
  return $1_1 | 0;
 }
 
 function $842($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if (!$2_1) {
    break label$1
   }
   $1045($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0;
  }
  return $0_1 | 0;
 }
 
 function $843($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  label$1 : {
   if (!($442($0_1 | 0) | 0)) {
    break label$1
   }
   $828($0_1 | 0, $1_1 | 0);
   return;
  }
  $822($0_1 | 0, $1_1 | 0);
 }
 
 function $844($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
 }
 
 function $845($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1, $7_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  $7_1 = $7_1 | 0;
  var $8_1 = 0, $9_1 = 0, $10_1 = 0, $12_1 = 0, $11_1 = 0;
  label$1 : {
   $8_1 = global$0 - 16 | 0;
   $11_1 = $8_1;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  label$3 : {
   $9_1 = $821($0_1 | 0) | 0;
   if (($9_1 + ($1_1 ^ -1 | 0) | 0) >>> 0 < $2_1 >>> 0) {
    break label$3
   }
   $10_1 = $90($0_1 | 0) | 0;
   label$4 : {
    label$5 : {
     if ((($9_1 >>> 1 | 0) + -16 | 0) >>> 0 <= $1_1 >>> 0) {
      break label$5
     }
     HEAP32[($8_1 + 8 | 0) >> 2] = $1_1 << 1 | 0;
     HEAP32[($8_1 + 12 | 0) >> 2] = $2_1 + $1_1 | 0;
     $2_1 = $823(HEAP32[($570($8_1 + 12 | 0 | 0, $8_1 + 8 | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
     break label$4;
    }
    $2_1 = $9_1 + -1 | 0;
   }
   $9_1 = $2_1 + 1 | 0;
   $2_1 = $825($824($0_1 | 0) | 0 | 0, $9_1 | 0) | 0;
   $847($0_1 | 0);
   label$6 : {
    if (!$4_1) {
     break label$6
    }
    $830($829($2_1 | 0) | 0 | 0, $829($10_1 | 0) | 0 | 0, $4_1 | 0) | 0;
   }
   label$7 : {
    if (!$6_1) {
     break label$7
    }
    $830(($829($2_1 | 0) | 0) + $4_1 | 0 | 0, $7_1 | 0, $6_1 | 0) | 0;
   }
   label$8 : {
    $3_1 = $3_1 - $5_1 | 0;
    $7_1 = $3_1 - $4_1 | 0;
    if (!$7_1) {
     break label$8
    }
    $830((($829($2_1 | 0) | 0) + $4_1 | 0) + $6_1 | 0 | 0, (($829($10_1 | 0) | 0) + $4_1 | 0) + $5_1 | 0 | 0, $7_1 | 0) | 0;
   }
   label$9 : {
    $4_1 = $1_1 + 1 | 0;
    if (($4_1 | 0) == (11 | 0)) {
     break label$9
    }
    $834($824($0_1 | 0) | 0 | 0, $10_1 | 0, $4_1 | 0);
   }
   $826($0_1 | 0, $2_1 | 0);
   $827($0_1 | 0, $9_1 | 0);
   $4_1 = $3_1 + $6_1 | 0;
   $828($0_1 | 0, $4_1 | 0);
   HEAP8[($8_1 + 7 | 0) >> 0] = 0;
   $831($2_1 + $4_1 | 0 | 0, $8_1 + 7 | 0 | 0);
   label$10 : {
    $12_1 = $8_1 + 16 | 0;
    if ($12_1 >>> 0 < global$2 >>> 0) {
     fimport$29()
    }
    global$0 = $12_1;
   }
   return;
  }
  $811($0_1 | 0);
  abort();
 }
 
 function $846($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  var $7_1 = 0, $8_1 = 0, $9_1 = 0, $11_1 = 0, $10_1 = 0;
  label$1 : {
   $7_1 = global$0 - 16 | 0;
   $10_1 = $7_1;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  label$3 : {
   $8_1 = $821($0_1 | 0) | 0;
   if (($8_1 - $1_1 | 0) >>> 0 < $2_1 >>> 0) {
    break label$3
   }
   $9_1 = $90($0_1 | 0) | 0;
   label$4 : {
    label$5 : {
     if ((($8_1 >>> 1 | 0) + -16 | 0) >>> 0 <= $1_1 >>> 0) {
      break label$5
     }
     HEAP32[($7_1 + 8 | 0) >> 2] = $1_1 << 1 | 0;
     HEAP32[($7_1 + 12 | 0) >> 2] = $2_1 + $1_1 | 0;
     $2_1 = $823(HEAP32[($570($7_1 + 12 | 0 | 0, $7_1 + 8 | 0 | 0) | 0) >> 2] | 0 | 0) | 0;
     break label$4;
    }
    $2_1 = $8_1 + -1 | 0;
   }
   $8_1 = $2_1 + 1 | 0;
   $2_1 = $825($824($0_1 | 0) | 0 | 0, $8_1 | 0) | 0;
   $847($0_1 | 0);
   label$6 : {
    if (!$4_1) {
     break label$6
    }
    $830($829($2_1 | 0) | 0 | 0, $829($9_1 | 0) | 0 | 0, $4_1 | 0) | 0;
   }
   label$7 : {
    $3_1 = ($3_1 - $5_1 | 0) - $4_1 | 0;
    if (!$3_1) {
     break label$7
    }
    $830((($829($2_1 | 0) | 0) + $4_1 | 0) + $6_1 | 0 | 0, (($829($9_1 | 0) | 0) + $4_1 | 0) + $5_1 | 0 | 0, $3_1 | 0) | 0;
   }
   label$8 : {
    $1_1 = $1_1 + 1 | 0;
    if (($1_1 | 0) == (11 | 0)) {
     break label$8
    }
    $834($824($0_1 | 0) | 0 | 0, $9_1 | 0, $1_1 | 0);
   }
   $826($0_1 | 0, $2_1 | 0);
   $827($0_1 | 0, $8_1 | 0);
   label$9 : {
    $11_1 = $7_1 + 16 | 0;
    if ($11_1 >>> 0 < global$2 >>> 0) {
     fimport$29()
    }
    global$0 = $11_1;
   }
   return;
  }
  $811($0_1 | 0);
  abort();
 }
 
 function $847($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $848($0_1) {
  $0_1 = $0_1 | 0;
  return $862($0_1 | 0) | 0 | 0;
 }
 
 function $849($0_1) {
  $0_1 = $0_1 | 0;
  return ($0_1 + 15 | 0) & -16 | 0 | 0;
 }
 
 function $850($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if (($863($0_1 | 0) | 0) >>> 0 >= $1_1 >>> 0) {
    break label$1
   }
   $314(3273 | 0);
   abort();
  }
  return $315($1_1 | 0, 1 | 0) | 0 | 0;
 }
 
 function $851($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $5_1 = 0, $3_1 = 0, $7_1 = 0, $6_1 = 0;
  label$1 : {
   $3_1 = global$0 - 16 | 0;
   $6_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
  label$3 : {
   label$4 : {
    $4_1 = $841($0_1 | 0) | 0;
    $5_1 = $89($0_1 | 0) | 0;
    if (($4_1 - $5_1 | 0) >>> 0 < $2_1 >>> 0) {
     break label$4
    }
    if (!$2_1) {
     break label$3
    }
    $4_1 = $829($90($0_1 | 0) | 0 | 0) | 0;
    $830($4_1 + $5_1 | 0 | 0, $1_1 | 0, $2_1 | 0) | 0;
    $2_1 = $5_1 + $2_1 | 0;
    $843($0_1 | 0, $2_1 | 0);
    HEAP8[($3_1 + 15 | 0) >> 0] = 0;
    $831($4_1 + $2_1 | 0 | 0, $3_1 + 15 | 0 | 0);
    break label$3;
   }
   $845($0_1 | 0, $4_1 | 0, ($5_1 + $2_1 | 0) - $4_1 | 0 | 0, $5_1 | 0, $5_1 | 0, 0 | 0, $2_1 | 0, $1_1 | 0);
  }
  label$5 : {
   $7_1 = $3_1 + 16 | 0;
   if ($7_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  return $0_1 | 0;
 }
 
 function $852($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return $851($0_1 | 0, $1_1 | 0, $6($1_1 | 0) | 0 | 0) | 0 | 0;
 }
 
 function $853($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $2_1 = 0, $3_1 = 0, $6_1 = 0, $5_1 = 0;
  label$1 : {
   $2_1 = global$0 - 16 | 0;
   $5_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  HEAP8[($2_1 + 15 | 0) >> 0] = $1_1;
  label$3 : {
   label$4 : {
    $3_1 = $442($0_1 | 0) | 0;
    if ($3_1) {
     break label$4
    }
    $1_1 = $444($0_1 | 0) | 0;
    $4_1 = 10;
    break label$3;
   }
   $4_1 = ($833($0_1 | 0) | 0) + -1 | 0;
   $1_1 = $443($0_1 | 0) | 0;
  }
  label$5 : {
   label$6 : {
    label$7 : {
     label$8 : {
      if (($1_1 | 0) != ($4_1 | 0)) {
       break label$8
      }
      $846($0_1 | 0, $4_1 | 0, 1 | 0, $4_1 | 0, $4_1 | 0, 0 | 0, 0 | 0);
      if (!($442($0_1 | 0) | 0)) {
       break label$7
      }
      break label$6;
     }
     if ($3_1) {
      break label$6
     }
    }
    $4_1 = $477($0_1 | 0) | 0;
    $822($0_1 | 0, $1_1 + 1 | 0 | 0);
    break label$5;
   }
   $4_1 = $476($0_1 | 0) | 0;
   $828($0_1 | 0, $1_1 + 1 | 0 | 0);
  }
  $0_1 = $4_1 + $1_1 | 0;
  $831($0_1 | 0, $2_1 + 15 | 0 | 0);
  HEAP8[($2_1 + 14 | 0) >> 0] = 0;
  $831($0_1 + 1 | 0 | 0, $2_1 + 14 | 0 | 0);
  label$9 : {
   $6_1 = $2_1 + 16 | 0;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
 }
 
 function $854($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $5_1 = 0, $4_1 = 0, $8_1 = 0, $7_1 = 0, $10_1 = 0, $9_1 = 0;
  label$1 : {
   $4_1 = global$0 - 16 | 0;
   $9_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  label$3 : {
   $5_1 = $89($0_1 | 0) | 0;
   if ($5_1 >>> 0 < $1_1 >>> 0) {
    break label$3
   }
   label$4 : {
    label$5 : {
     $6_1 = $841($0_1 | 0) | 0;
     if (($6_1 - $5_1 | 0) >>> 0 < $3_1 >>> 0) {
      break label$5
     }
     if (!$3_1) {
      break label$4
     }
     $6_1 = $829($90($0_1 | 0) | 0 | 0) | 0;
     label$6 : {
      $7_1 = $5_1 - $1_1 | 0;
      if (!$7_1) {
       break label$6
      }
      $8_1 = $6_1 + $1_1 | 0;
      $842($8_1 + $3_1 | 0 | 0, $8_1 | 0, $7_1 | 0) | 0;
      $2_1 = $8_1 >>> 0 <= $2_1 >>> 0 ? (($6_1 + $5_1 | 0) >>> 0 > $2_1 >>> 0 ? $2_1 + $3_1 | 0 : $2_1) : $2_1;
     }
     $842($6_1 + $1_1 | 0 | 0, $2_1 | 0, $3_1 | 0) | 0;
     $3_1 = $5_1 + $3_1 | 0;
     $843($0_1 | 0, $3_1 | 0);
     HEAP8[($4_1 + 15 | 0) >> 0] = 0;
     $831($6_1 + $3_1 | 0 | 0, $4_1 + 15 | 0 | 0);
     break label$4;
    }
    $845($0_1 | 0, $6_1 | 0, ($5_1 + $3_1 | 0) - $6_1 | 0 | 0, $5_1 | 0, $1_1 | 0, 0 | 0, $3_1 | 0, $2_1 | 0);
   }
   label$7 : {
    $10_1 = $4_1 + 16 | 0;
    if ($10_1 >>> 0 < global$2 >>> 0) {
     fimport$29()
    }
    global$0 = $10_1;
   }
   return $0_1 | 0;
  }
  $812($0_1 | 0);
  abort();
 }
 
 function $855($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return $854($0_1 | 0, $1_1 | 0, $2_1 | 0, $6($2_1 | 0) | 0 | 0) | 0 | 0;
 }
 
 function $856() {
  return $858() | 0 | 0;
 }
 
 function $857() {
  return $859() | 0 | 0;
 }
 
 function $858() {
  return -2147483648 | 0;
 }
 
 function $859() {
  return 2147483647 | 0;
 }
 
 function $860($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $861($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $862($0_1) {
  $0_1 = $0_1 | 0;
  return $863($0_1 | 0) | 0 | 0;
 }
 
 function $863($0_1) {
  $0_1 = $0_1 | 0;
  return -1 | 0;
 }
 
 function $864($0_1) {
  $0_1 = $0_1 | 0;
  $314(3341 | 0);
  abort();
 }
 
 function $865($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $3_1 = 0, $2_1 = 0;
  label$1 : {
   label$2 : {
    if ((HEAP32[($1_1 + 76 | 0) >> 2] | 0 | 0) < (0 | 0)) {
     break label$2
    }
    if ($775($1_1 | 0) | 0) {
     break label$1
    }
   }
   label$3 : {
    $2_1 = $0_1 & 255 | 0;
    if (($2_1 | 0) == (HEAP8[($1_1 + 75 | 0) >> 0] | 0 | 0)) {
     break label$3
    }
    $3_1 = HEAP32[($1_1 + 20 | 0) >> 2] | 0;
    if ($3_1 >>> 0 >= (HEAP32[($1_1 + 16 | 0) >> 2] | 0) >>> 0) {
     break label$3
    }
    HEAP32[($1_1 + 20 | 0) >> 2] = $3_1 + 1 | 0;
    HEAP8[$3_1 >> 0] = $0_1;
    return $2_1 | 0;
   }
   return $805($1_1 | 0, $0_1 | 0) | 0 | 0;
  }
  label$4 : {
   label$5 : {
    $2_1 = $0_1 & 255 | 0;
    if (($2_1 | 0) == (HEAP8[($1_1 + 75 | 0) >> 0] | 0 | 0)) {
     break label$5
    }
    $3_1 = HEAP32[($1_1 + 20 | 0) >> 2] | 0;
    if ($3_1 >>> 0 >= (HEAP32[($1_1 + 16 | 0) >> 2] | 0) >>> 0) {
     break label$5
    }
    HEAP32[($1_1 + 20 | 0) >> 2] = $3_1 + 1 | 0;
    HEAP8[$3_1 >> 0] = $0_1;
    break label$4;
   }
   $2_1 = $805($1_1 | 0, $0_1 | 0) | 0;
  }
  $776($1_1 | 0);
  return $2_1 | 0;
 }
 
 function $866($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0, $3_1 = 0;
  label$1 : {
   $2_1 = global$0 - 16 | 0;
   $3_1 = $2_1;
   if ($2_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $3_1;
  }
  HEAP32[($2_1 + 12 | 0) >> 2] = $1_1;
  $2_1 = HEAP32[(0 + 3256 | 0) >> 2] | 0;
  $801($2_1 | 0, $0_1 | 0, $1_1 | 0) | 0;
  $865(10 | 0, $2_1 | 0) | 0;
  fimport$14();
  abort();
 }
 
 function $867($0_1) {
  $0_1 = $0_1 | 0;
  return HEAP32[($0_1 + 4 | 0) >> 2] | 0 | 0;
 }
 
 function $868($0_1) {
  $0_1 = $0_1 | 0;
  return HEAP32[$0_1 >> 2] | 0 | 0;
 }
 
 function $869() {
  return $868(6300 | 0) | 0 | 0;
 }
 
 function $870() {
  $866(3348 | 0, 0 | 0);
  abort();
 }
 
 function $871($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $872($0_1) {
  $0_1 = $0_1 | 0;
  $769($0_1 | 0);
 }
 
 function $873($0_1) {
  $0_1 = $0_1 | 0;
  return 3378 | 0;
 }
 
 function $874($0_1) {
  $0_1 = $0_1 | 0;
  HEAP32[$0_1 >> 2] = 3448;
  $875($0_1 + 4 | 0 | 0) | 0;
  $871($0_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $875($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  label$1 : {
   if (!($774($0_1 | 0) | 0)) {
    break label$1
   }
   $1_1 = $876(HEAP32[$0_1 >> 2] | 0 | 0) | 0;
   if (($877($1_1 + 8 | 0 | 0) | 0 | 0) > (-1 | 0)) {
    break label$1
   }
   $769($1_1 | 0);
  }
  return $0_1 | 0;
 }
 
 function $876($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 + -12 | 0 | 0;
 }
 
 function $877($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = (HEAP32[$0_1 >> 2] | 0) + -1 | 0;
  HEAP32[$0_1 >> 2] = $1_1;
  return $1_1 | 0;
 }
 
 function $878($0_1) {
  $0_1 = $0_1 | 0;
  $769($874($0_1 | 0) | 0 | 0);
 }
 
 function $879($0_1) {
  $0_1 = $0_1 | 0;
  return $880($0_1 + 4 | 0 | 0) | 0 | 0;
 }
 
 function $880($0_1) {
  $0_1 = $0_1 | 0;
  return HEAP32[$0_1 >> 2] | 0 | 0;
 }
 
 function $881($0_1) {
  $0_1 = $0_1 | 0;
  $874($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $882($0_1) {
  $0_1 = $0_1 | 0;
  $874($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $883($0_1) {
  $0_1 = $0_1 | 0;
  return $0_1 | 0;
 }
 
 function $884($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $3_1 = 0, $2_1 = 0;
  $2_1 = HEAPU8[$1_1 >> 0] | 0;
  label$1 : {
   $3_1 = HEAPU8[$0_1 >> 0] | 0;
   if (!$3_1) {
    break label$1
   }
   if (($3_1 | 0) != ($2_1 & 255 | 0 | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $2_1 = HEAPU8[($1_1 + 1 | 0) >> 0] | 0;
    $3_1 = HEAPU8[($0_1 + 1 | 0) >> 0] | 0;
    if (!$3_1) {
     break label$1
    }
    $1_1 = $1_1 + 1 | 0;
    $0_1 = $0_1 + 1 | 0;
    if (($3_1 | 0) == ($2_1 & 255 | 0 | 0)) {
     continue label$2
    }
    break label$2;
   };
  }
  return $3_1 - ($2_1 & 255 | 0) | 0 | 0;
 }
 
 function $885($0_1) {
  $0_1 = $0_1 | 0;
  $883($0_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $886($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $887($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $888($0_1) {
  $0_1 = $0_1 | 0;
  $885($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $889($0_1) {
  $0_1 = $0_1 | 0;
  $885($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $890($0_1) {
  $0_1 = $0_1 | 0;
  $885($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $891($0_1) {
  $0_1 = $0_1 | 0;
  $885($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $892($0_1) {
  $0_1 = $0_1 | 0;
  $885($0_1 | 0) | 0;
  $769($0_1 | 0);
 }
 
 function $893($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return $894($0_1 | 0, $1_1 | 0, 0 | 0) | 0 | 0;
 }
 
 function $894($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if ($2_1) {
    break label$1
   }
   return ($0_1 | 0) == ($1_1 | 0) | 0;
  }
  return !($884($867($0_1 | 0) | 0 | 0, $867($1_1 | 0) | 0 | 0) | 0) | 0;
 }
 
 function $895($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0, $6_1 = 0, $5_1 = 0;
  label$1 : {
   $3_1 = global$0 - 64 | 0;
   $5_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $5_1;
  }
  $4_1 = 1;
  label$3 : {
   if ($894($0_1 | 0, $1_1 | 0, 0 | 0) | 0) {
    break label$3
   }
   $4_1 = 0;
   if (!$1_1) {
    break label$3
   }
   $4_1 = 0;
   $1_1 = $896($1_1 | 0, 3656 | 0, 3704 | 0, 0 | 0) | 0;
   if (!$1_1) {
    break label$3
   }
   HEAP32[($3_1 + 20 | 0) >> 2] = -1;
   HEAP32[($3_1 + 16 | 0) >> 2] = $0_1;
   $4_1 = 0;
   HEAP32[($3_1 + 12 | 0) >> 2] = 0;
   HEAP32[($3_1 + 8 | 0) >> 2] = $1_1;
   $1044($3_1 + 24 | 0 | 0, 0 | 0, 39 | 0) | 0;
   HEAP32[($3_1 + 56 | 0) >> 2] = 1;
   FUNCTION_TABLE[HEAP32[((HEAP32[$1_1 >> 2] | 0) + 28 | 0) >> 2] | 0]($1_1, $3_1 + 8 | 0, HEAP32[$2_1 >> 2] | 0, 1);
   if ((HEAP32[($3_1 + 32 | 0) >> 2] | 0 | 0) != (1 | 0)) {
    break label$3
   }
   HEAP32[$2_1 >> 2] = HEAP32[($3_1 + 24 | 0) >> 2] | 0;
   $4_1 = 1;
  }
  label$4 : {
   $6_1 = $3_1 + 64 | 0;
   if ($6_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $6_1;
  }
  return $4_1 | 0;
 }
 
 function $896($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $4_1 = 0, $5_1 = 0, $8_1 = 0, $7_1 = 0, $6_1 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0, wasm2js_i32$2 = 0, wasm2js_i32$3 = 0, wasm2js_i32$4 = 0, wasm2js_i32$5 = 0, wasm2js_i32$6 = 0, wasm2js_i32$7 = 0, wasm2js_i32$8 = 0;
  label$1 : {
   $4_1 = global$0 - 64 | 0;
   $7_1 = $4_1;
   if ($4_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  $5_1 = HEAP32[$0_1 >> 2] | 0;
  $6_1 = HEAP32[($5_1 + -8 | 0) >> 2] | 0;
  $5_1 = HEAP32[($5_1 + -4 | 0) >> 2] | 0;
  HEAP32[($4_1 + 20 | 0) >> 2] = $3_1;
  HEAP32[($4_1 + 16 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $2_1;
  $1_1 = 0;
  $1044($4_1 + 24 | 0 | 0, 0 | 0, 39 | 0) | 0;
  $0_1 = $0_1 + $6_1 | 0;
  label$3 : {
   label$4 : {
    if (!($894($5_1 | 0, $2_1 | 0, 0 | 0) | 0)) {
     break label$4
    }
    HEAP32[($4_1 + 56 | 0) >> 2] = 1;
    FUNCTION_TABLE[HEAP32[((HEAP32[$5_1 >> 2] | 0) + 20 | 0) >> 2] | 0]($5_1, $4_1 + 8 | 0, $0_1, $0_1, 1, 0);
    $1_1 = (HEAP32[($4_1 + 32 | 0) >> 2] | 0 | 0) == (1 | 0) ? $0_1 : 0;
    break label$3;
   }
   FUNCTION_TABLE[HEAP32[((HEAP32[$5_1 >> 2] | 0) + 24 | 0) >> 2] | 0]($5_1, $4_1 + 8 | 0, $0_1, 1, 0);
   $0_1 = HEAP32[($4_1 + 44 | 0) >> 2] | 0;
   if ($0_1 >>> 0 > 1 >>> 0) {
    break label$3
   }
   label$5 : {
    switch ($0_1 | 0) {
    default:
     $1_1 = (wasm2js_i32$0 = (wasm2js_i32$3 = (wasm2js_i32$6 = HEAP32[($4_1 + 28 | 0) >> 2] | 0, wasm2js_i32$7 = 0, wasm2js_i32$8 = (HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) == (1 | 0), wasm2js_i32$8 ? wasm2js_i32$6 : wasm2js_i32$7), wasm2js_i32$4 = 0, wasm2js_i32$5 = (HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) == (1 | 0), wasm2js_i32$5 ? wasm2js_i32$3 : wasm2js_i32$4), wasm2js_i32$1 = 0, wasm2js_i32$2 = (HEAP32[($4_1 + 48 | 0) >> 2] | 0 | 0) == (1 | 0), wasm2js_i32$2 ? wasm2js_i32$0 : wasm2js_i32$1);
     break label$3;
    case 1:
     break label$5;
    };
   }
   label$7 : {
    if ((HEAP32[($4_1 + 32 | 0) >> 2] | 0 | 0) == (1 | 0)) {
     break label$7
    }
    if (HEAP32[($4_1 + 48 | 0) >> 2] | 0) {
     break label$3
    }
    if ((HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$3
    }
    if ((HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$3
    }
   }
   $1_1 = HEAP32[($4_1 + 24 | 0) >> 2] | 0;
  }
  label$8 : {
   $8_1 = $4_1 + 64 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $1_1 | 0;
 }
 
 function $897($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $4_1 = 0;
  label$1 : {
   $4_1 = HEAP32[($1_1 + 16 | 0) >> 2] | 0;
   if ($4_1) {
    break label$1
   }
   HEAP32[($1_1 + 36 | 0) >> 2] = 1;
   HEAP32[($1_1 + 24 | 0) >> 2] = $3_1;
   HEAP32[($1_1 + 16 | 0) >> 2] = $2_1;
   return;
  }
  label$2 : {
   label$3 : {
    if (($4_1 | 0) != ($2_1 | 0)) {
     break label$3
    }
    if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) != (2 | 0)) {
     break label$2
    }
    HEAP32[($1_1 + 24 | 0) >> 2] = $3_1;
    return;
   }
   HEAP8[($1_1 + 54 | 0) >> 0] = 1;
   HEAP32[($1_1 + 24 | 0) >> 2] = 2;
   HEAP32[($1_1 + 36 | 0) >> 2] = (HEAP32[($1_1 + 36 | 0) >> 2] | 0) + 1 | 0;
  }
 }
 
 function $898($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0)) {
    break label$1
   }
   $897($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
  }
 }
 
 function $899($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0)) {
    break label$1
   }
   $897($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
   return;
  }
  $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
  FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 28 | 0) >> 2] | 0]($0_1, $1_1, $2_1, $3_1);
 }
 
 function $900($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $5_1 = 0, $4_1 = 0;
  $4_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    if ($2_1) {
     break label$2
    }
    $5_1 = 0;
    break label$1;
   }
   $5_1 = $4_1 >> 8 | 0;
   if (!($4_1 & 1 | 0)) {
    break label$1
   }
   $5_1 = HEAP32[((HEAP32[$2_1 >> 2] | 0) + $5_1 | 0) >> 2] | 0;
  }
  $0_1 = HEAP32[$0_1 >> 2] | 0;
  FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 28 | 0) >> 2] | 0]($0_1, $1_1, $2_1 + $5_1 | 0, $4_1 & 2 | 0 ? $3_1 : 2);
 }
 
 function $901($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $4_1 = 0, $5_1 = 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, 0 | 0) | 0)) {
    break label$1
   }
   $897($0_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
   return;
  }
  $4_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
  $5_1 = $0_1 + 16 | 0;
  $900($5_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
  label$2 : {
   if (($4_1 | 0) < (2 | 0)) {
    break label$2
   }
   $4_1 = $5_1 + ($4_1 << 3 | 0) | 0;
   $0_1 = $0_1 + 24 | 0;
   label$3 : while (1) {
    $900($0_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
    if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
     break label$2
    }
    $0_1 = $0_1 + 8 | 0;
    if ($0_1 >>> 0 < $4_1 >>> 0) {
     continue label$3
    }
    break label$3;
   };
  }
 }
 
 function $902($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0;
  $3_1 = 1;
  label$1 : {
   label$2 : {
    if ((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 24 | 0) {
     break label$2
    }
    $3_1 = 0;
    if (!$1_1) {
     break label$1
    }
    $4_1 = $896($1_1 | 0, 3656 | 0, 3752 | 0, 0 | 0) | 0;
    if (!$4_1) {
     break label$1
    }
    $3_1 = ((HEAPU8[($4_1 + 8 | 0) >> 0] | 0) & 24 | 0 | 0) != (0 | 0);
   }
   $3_1 = $894($0_1 | 0, $1_1 | 0, $3_1 | 0) | 0;
  }
  return $3_1 | 0;
 }
 
 function $903($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $4_1 = 0, $3_1 = 0, $6_1 = 0, $8_1 = 0, $7_1 = 0;
  label$1 : {
   $3_1 = global$0 - 64 | 0;
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  label$3 : {
   label$4 : {
    label$5 : {
     label$6 : {
      if (!($894($1_1 | 0, 4020 | 0, 0 | 0) | 0)) {
       break label$6
      }
      HEAP32[$2_1 >> 2] = 0;
      break label$5;
     }
     label$7 : {
      if (!($902($0_1 | 0, $1_1 | 0, $1_1 | 0) | 0)) {
       break label$7
      }
      $4_1 = 1;
      $1_1 = HEAP32[$2_1 >> 2] | 0;
      if (!$1_1) {
       break label$3
      }
      HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
      break label$3;
     }
     if (!$1_1) {
      break label$4
     }
     $4_1 = 0;
     $1_1 = $896($1_1 | 0, 3656 | 0, 3800 | 0, 0 | 0) | 0;
     if (!$1_1) {
      break label$3
     }
     label$8 : {
      $5_1 = HEAP32[$2_1 >> 2] | 0;
      if (!$5_1) {
       break label$8
      }
      HEAP32[$2_1 >> 2] = HEAP32[$5_1 >> 2] | 0;
     }
     $5_1 = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
     $6_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
     if (($5_1 & ($6_1 ^ -1 | 0) | 0) & 7 | 0) {
      break label$3
     }
     if ((($5_1 ^ -1 | 0) & $6_1 | 0) & 96 | 0) {
      break label$3
     }
     $4_1 = 1;
     if ($894(HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0, 0 | 0) | 0) {
      break label$3
     }
     label$9 : {
      if (!($894(HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0, 4008 | 0, 0 | 0) | 0)) {
       break label$9
      }
      $1_1 = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
      if (!$1_1) {
       break label$3
      }
      $4_1 = !($896($1_1 | 0, 3656 | 0, 3852 | 0, 0 | 0) | 0);
      break label$3;
     }
     $5_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
     if (!$5_1) {
      break label$4
     }
     $4_1 = 0;
     label$10 : {
      $5_1 = $896($5_1 | 0, 3656 | 0, 3800 | 0, 0 | 0) | 0;
      if (!$5_1) {
       break label$10
      }
      if (!((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 1 | 0)) {
       break label$3
      }
      $4_1 = $904($5_1 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0) | 0;
      break label$3;
     }
     $5_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
     if (!$5_1) {
      break label$3
     }
     $4_1 = 0;
     label$11 : {
      $5_1 = $896($5_1 | 0, 3656 | 0, 3912 | 0, 0 | 0) | 0;
      if (!$5_1) {
       break label$11
      }
      if (!((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 1 | 0)) {
       break label$3
      }
      $4_1 = $905($5_1 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0) | 0;
      break label$3;
     }
     $0_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
     if (!$0_1) {
      break label$3
     }
     $4_1 = 0;
     $0_1 = $896($0_1 | 0, 3656 | 0, 3704 | 0, 0 | 0) | 0;
     if (!$0_1) {
      break label$3
     }
     $1_1 = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
     if (!$1_1) {
      break label$3
     }
     $4_1 = 0;
     $1_1 = $896($1_1 | 0, 3656 | 0, 3704 | 0, 0 | 0) | 0;
     if (!$1_1) {
      break label$3
     }
     HEAP32[($3_1 + 20 | 0) >> 2] = -1;
     HEAP32[($3_1 + 16 | 0) >> 2] = $0_1;
     $4_1 = 0;
     HEAP32[($3_1 + 12 | 0) >> 2] = 0;
     HEAP32[($3_1 + 8 | 0) >> 2] = $1_1;
     $1044($3_1 + 24 | 0 | 0, 0 | 0, 39 | 0) | 0;
     HEAP32[($3_1 + 56 | 0) >> 2] = 1;
     FUNCTION_TABLE[HEAP32[((HEAP32[$1_1 >> 2] | 0) + 28 | 0) >> 2] | 0]($1_1, $3_1 + 8 | 0, HEAP32[$2_1 >> 2] | 0, 1);
     if ((HEAP32[($3_1 + 32 | 0) >> 2] | 0 | 0) != (1 | 0)) {
      break label$3
     }
     if (!(HEAP32[$2_1 >> 2] | 0)) {
      break label$5
     }
     HEAP32[$2_1 >> 2] = HEAP32[($3_1 + 24 | 0) >> 2] | 0;
    }
    $4_1 = 1;
    break label$3;
   }
   $4_1 = 0;
  }
  label$12 : {
   $8_1 = $3_1 + 64 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $904($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $3_1 = 0, $2_1 = 0;
  label$1 : {
   label$2 : while (1) {
    label$3 : {
     if ($1_1) {
      break label$3
     }
     return 0 | 0;
    }
    $2_1 = 0;
    $1_1 = $896($1_1 | 0, 3656 | 0, 3800 | 0, 0 | 0) | 0;
    if (!$1_1) {
     break label$1
    }
    if ((HEAP32[($1_1 + 8 | 0) >> 2] | 0) & ((HEAP32[($0_1 + 8 | 0) >> 2] | 0) ^ -1 | 0) | 0) {
     break label$1
    }
    label$4 : {
     if (!($894(HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0, 0 | 0) | 0)) {
      break label$4
     }
     return 1 | 0;
    }
    if (!((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 1 | 0)) {
     break label$1
    }
    $3_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
    if (!$3_1) {
     break label$1
    }
    label$5 : {
     $3_1 = $896($3_1 | 0, 3656 | 0, 3800 | 0, 0 | 0) | 0;
     if (!$3_1) {
      break label$5
     }
     $1_1 = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
     $0_1 = $3_1;
     continue label$2;
    }
    break label$2;
   };
   $0_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
   if (!$0_1) {
    break label$1
   }
   $2_1 = 0;
   $0_1 = $896($0_1 | 0, 3656 | 0, 3912 | 0, 0 | 0) | 0;
   if (!$0_1) {
    break label$1
   }
   $2_1 = $905($0_1 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0) | 0;
  }
  return $2_1 | 0;
 }
 
 function $905($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0;
  $2_1 = 0;
  label$1 : {
   if (!$1_1) {
    break label$1
   }
   $1_1 = $896($1_1 | 0, 3656 | 0, 3912 | 0, 0 | 0) | 0;
   if (!$1_1) {
    break label$1
   }
   if ((HEAP32[($1_1 + 8 | 0) >> 2] | 0) & ((HEAP32[($0_1 + 8 | 0) >> 2] | 0) ^ -1 | 0) | 0) {
    break label$1
   }
   $2_1 = 0;
   if (!($894(HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($1_1 + 12 | 0) >> 2] | 0 | 0, 0 | 0) | 0)) {
    break label$1
   }
   $2_1 = $894(HEAP32[($0_1 + 16 | 0) >> 2] | 0 | 0, HEAP32[($1_1 + 16 | 0) >> 2] | 0 | 0, 0 | 0) | 0;
  }
  return $2_1 | 0;
 }
 
 function $906($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  HEAP8[($1_1 + 53 | 0) >> 0] = 1;
  label$1 : {
   if ((HEAP32[($1_1 + 4 | 0) >> 2] | 0 | 0) != ($3_1 | 0)) {
    break label$1
   }
   HEAP8[($1_1 + 52 | 0) >> 0] = 1;
   label$2 : {
    $3_1 = HEAP32[($1_1 + 16 | 0) >> 2] | 0;
    if ($3_1) {
     break label$2
    }
    HEAP32[($1_1 + 36 | 0) >> 2] = 1;
    HEAP32[($1_1 + 24 | 0) >> 2] = $4_1;
    HEAP32[($1_1 + 16 | 0) >> 2] = $2_1;
    if (($4_1 | 0) != (1 | 0)) {
     break label$1
    }
    if ((HEAP32[($1_1 + 48 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$1
    }
    HEAP8[($1_1 + 54 | 0) >> 0] = 1;
    return;
   }
   label$3 : {
    if (($3_1 | 0) != ($2_1 | 0)) {
     break label$3
    }
    label$4 : {
     $3_1 = HEAP32[($1_1 + 24 | 0) >> 2] | 0;
     if (($3_1 | 0) != (2 | 0)) {
      break label$4
     }
     HEAP32[($1_1 + 24 | 0) >> 2] = $4_1;
     $3_1 = $4_1;
    }
    if ((HEAP32[($1_1 + 48 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$1
    }
    if (($3_1 | 0) != (1 | 0)) {
     break label$1
    }
    HEAP8[($1_1 + 54 | 0) >> 0] = 1;
    return;
   }
   HEAP8[($1_1 + 54 | 0) >> 0] = 1;
   HEAP32[($1_1 + 36 | 0) >> 2] = (HEAP32[($1_1 + 36 | 0) >> 2] | 0) + 1 | 0;
  }
 }
 
 function $907($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  label$1 : {
   if ((HEAP32[($1_1 + 4 | 0) >> 2] | 0 | 0) != ($2_1 | 0)) {
    break label$1
   }
   if ((HEAP32[($1_1 + 28 | 0) >> 2] | 0 | 0) == (1 | 0)) {
    break label$1
   }
   HEAP32[($1_1 + 28 | 0) >> 2] = $3_1;
  }
 }
 
 function $908($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0, $8_1 = 0, $6_1 = 0, $7_1 = 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $4_1 | 0) | 0)) {
    break label$1
   }
   $907($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
   return;
  }
  label$2 : {
   label$3 : {
    if (!($894($0_1 | 0, HEAP32[$1_1 >> 2] | 0 | 0, $4_1 | 0) | 0)) {
     break label$3
    }
    label$4 : {
     label$5 : {
      if ((HEAP32[($1_1 + 16 | 0) >> 2] | 0 | 0) == ($2_1 | 0)) {
       break label$5
      }
      if ((HEAP32[($1_1 + 20 | 0) >> 2] | 0 | 0) != ($2_1 | 0)) {
       break label$4
      }
     }
     if (($3_1 | 0) != (1 | 0)) {
      break label$2
     }
     HEAP32[($1_1 + 32 | 0) >> 2] = 1;
     return;
    }
    HEAP32[($1_1 + 32 | 0) >> 2] = $3_1;
    label$6 : {
     if ((HEAP32[($1_1 + 44 | 0) >> 2] | 0 | 0) == (4 | 0)) {
      break label$6
     }
     $5_1 = $0_1 + 16 | 0;
     $3_1 = $5_1 + ((HEAP32[($0_1 + 12 | 0) >> 2] | 0) << 3 | 0) | 0;
     $6_1 = 0;
     $7_1 = 0;
     label$7 : {
      label$8 : {
       label$9 : {
        label$10 : while (1) {
         if ($5_1 >>> 0 >= $3_1 >>> 0) {
          break label$9
         }
         HEAP16[($1_1 + 52 | 0) >> 1] = 0;
         $909($5_1 | 0, $1_1 | 0, $2_1 | 0, $2_1 | 0, 1 | 0, $4_1 | 0);
         if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
          break label$9
         }
         label$11 : {
          if (!(HEAPU8[($1_1 + 53 | 0) >> 0] | 0)) {
           break label$11
          }
          label$12 : {
           if (!(HEAPU8[($1_1 + 52 | 0) >> 0] | 0)) {
            break label$12
           }
           $8_1 = 1;
           if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) == (1 | 0)) {
            break label$8
           }
           $6_1 = 1;
           $7_1 = 1;
           $8_1 = 1;
           if ((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 2 | 0) {
            break label$11
           }
           break label$8;
          }
          $6_1 = 1;
          $8_1 = $7_1;
          if (!((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 1 | 0)) {
           break label$8
          }
         }
         $5_1 = $5_1 + 8 | 0;
         continue label$10;
        };
       }
       $5_1 = 4;
       $8_1 = $7_1;
       if (!($6_1 & 1 | 0)) {
        break label$7
       }
      }
      $5_1 = 3;
     }
     HEAP32[($1_1 + 44 | 0) >> 2] = $5_1;
     if ($8_1 & 1 | 0) {
      break label$2
     }
    }
    HEAP32[($1_1 + 20 | 0) >> 2] = $2_1;
    HEAP32[($1_1 + 40 | 0) >> 2] = (HEAP32[($1_1 + 40 | 0) >> 2] | 0) + 1 | 0;
    if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$2
    }
    if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) != (2 | 0)) {
     break label$2
    }
    HEAP8[($1_1 + 54 | 0) >> 0] = 1;
    return;
   }
   $5_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
   $8_1 = $0_1 + 16 | 0;
   $910($8_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
   if (($5_1 | 0) < (2 | 0)) {
    break label$2
   }
   $8_1 = $8_1 + ($5_1 << 3 | 0) | 0;
   $5_1 = $0_1 + 24 | 0;
   label$13 : {
    label$14 : {
     $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
     if ($0_1 & 2 | 0) {
      break label$14
     }
     if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
      break label$13
     }
    }
    label$15 : while (1) {
     if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
      break label$2
     }
     $910($5_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
     $5_1 = $5_1 + 8 | 0;
     if ($5_1 >>> 0 < $8_1 >>> 0) {
      continue label$15
     }
     break label$2;
    };
   }
   label$16 : {
    if ($0_1 & 1 | 0) {
     break label$16
    }
    label$17 : while (1) {
     if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
      break label$2
     }
     if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) == (1 | 0)) {
      break label$2
     }
     $910($5_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
     $5_1 = $5_1 + 8 | 0;
     if ($5_1 >>> 0 < $8_1 >>> 0) {
      continue label$17
     }
     break label$2;
    };
   }
   label$18 : while (1) {
    if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
     break label$2
    }
    label$19 : {
     if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
      break label$19
     }
     if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) == (1 | 0)) {
      break label$2
     }
    }
    $910($5_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
    $5_1 = $5_1 + 8 | 0;
    if ($5_1 >>> 0 < $8_1 >>> 0) {
     continue label$18
    }
    break label$18;
   };
  }
 }
 
 function $909($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $6_1 = 0, $7_1 = 0;
  $6_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
  $7_1 = $6_1 >> 8 | 0;
  label$1 : {
   if (!($6_1 & 1 | 0)) {
    break label$1
   }
   $7_1 = HEAP32[((HEAP32[$3_1 >> 2] | 0) + $7_1 | 0) >> 2] | 0;
  }
  $0_1 = HEAP32[$0_1 >> 2] | 0;
  FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 20 | 0) >> 2] | 0]($0_1, $1_1, $2_1, $3_1 + $7_1 | 0, $6_1 & 2 | 0 ? $4_1 : 2, $5_1);
 }
 
 function $910($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0, $6_1 = 0;
  $5_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
  $6_1 = $5_1 >> 8 | 0;
  label$1 : {
   if (!($5_1 & 1 | 0)) {
    break label$1
   }
   $6_1 = HEAP32[((HEAP32[$2_1 >> 2] | 0) + $6_1 | 0) >> 2] | 0;
  }
  $0_1 = HEAP32[$0_1 >> 2] | 0;
  FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 24 | 0) >> 2] | 0]($0_1, $1_1, $2_1 + $6_1 | 0, $5_1 & 2 | 0 ? $3_1 : 2, $4_1);
 }
 
 function $911($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $4_1 | 0) | 0)) {
    break label$1
   }
   $907($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
   return;
  }
  label$2 : {
   label$3 : {
    if (!($894($0_1 | 0, HEAP32[$1_1 >> 2] | 0 | 0, $4_1 | 0) | 0)) {
     break label$3
    }
    label$4 : {
     label$5 : {
      if ((HEAP32[($1_1 + 16 | 0) >> 2] | 0 | 0) == ($2_1 | 0)) {
       break label$5
      }
      if ((HEAP32[($1_1 + 20 | 0) >> 2] | 0 | 0) != ($2_1 | 0)) {
       break label$4
      }
     }
     if (($3_1 | 0) != (1 | 0)) {
      break label$2
     }
     HEAP32[($1_1 + 32 | 0) >> 2] = 1;
     return;
    }
    HEAP32[($1_1 + 32 | 0) >> 2] = $3_1;
    label$6 : {
     if ((HEAP32[($1_1 + 44 | 0) >> 2] | 0 | 0) == (4 | 0)) {
      break label$6
     }
     HEAP16[($1_1 + 52 | 0) >> 1] = 0;
     $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
     FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 20 | 0) >> 2] | 0]($0_1, $1_1, $2_1, $2_1, 1, $4_1);
     label$7 : {
      if (!(HEAPU8[($1_1 + 53 | 0) >> 0] | 0)) {
       break label$7
      }
      HEAP32[($1_1 + 44 | 0) >> 2] = 3;
      if (!(HEAPU8[($1_1 + 52 | 0) >> 0] | 0)) {
       break label$6
      }
      break label$2;
     }
     HEAP32[($1_1 + 44 | 0) >> 2] = 4;
    }
    HEAP32[($1_1 + 20 | 0) >> 2] = $2_1;
    HEAP32[($1_1 + 40 | 0) >> 2] = (HEAP32[($1_1 + 40 | 0) >> 2] | 0) + 1 | 0;
    if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$2
    }
    if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) != (2 | 0)) {
     break label$2
    }
    HEAP8[($1_1 + 54 | 0) >> 0] = 1;
    return;
   }
   $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
   FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 24 | 0) >> 2] | 0]($0_1, $1_1, $2_1, $3_1, $4_1);
  }
 }
 
 function $912($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $4_1 | 0) | 0)) {
    break label$1
   }
   $907($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0);
   return;
  }
  label$2 : {
   if (!($894($0_1 | 0, HEAP32[$1_1 >> 2] | 0 | 0, $4_1 | 0) | 0)) {
    break label$2
   }
   label$3 : {
    label$4 : {
     if ((HEAP32[($1_1 + 16 | 0) >> 2] | 0 | 0) == ($2_1 | 0)) {
      break label$4
     }
     if ((HEAP32[($1_1 + 20 | 0) >> 2] | 0 | 0) != ($2_1 | 0)) {
      break label$3
     }
    }
    if (($3_1 | 0) != (1 | 0)) {
     break label$2
    }
    HEAP32[($1_1 + 32 | 0) >> 2] = 1;
    return;
   }
   HEAP32[($1_1 + 20 | 0) >> 2] = $2_1;
   HEAP32[($1_1 + 32 | 0) >> 2] = $3_1;
   HEAP32[($1_1 + 40 | 0) >> 2] = (HEAP32[($1_1 + 40 | 0) >> 2] | 0) + 1 | 0;
   label$5 : {
    if ((HEAP32[($1_1 + 36 | 0) >> 2] | 0 | 0) != (1 | 0)) {
     break label$5
    }
    if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) != (2 | 0)) {
     break label$5
    }
    HEAP8[($1_1 + 54 | 0) >> 0] = 1;
   }
   HEAP32[($1_1 + 44 | 0) >> 2] = 4;
  }
 }
 
 function $913($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $7_1 = 0, $6_1 = 0, $8_1 = 0, $9_1 = 0, $10_1 = 0, $11_1 = 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $5_1 | 0) | 0)) {
    break label$1
   }
   $906($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
   return;
  }
  $6_1 = HEAPU8[($1_1 + 53 | 0) >> 0] | 0;
  $7_1 = HEAP32[($0_1 + 12 | 0) >> 2] | 0;
  HEAP8[($1_1 + 53 | 0) >> 0] = 0;
  $8_1 = HEAPU8[($1_1 + 52 | 0) >> 0] | 0;
  HEAP8[($1_1 + 52 | 0) >> 0] = 0;
  $9_1 = $0_1 + 16 | 0;
  $909($9_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0, $5_1 | 0);
  $10_1 = HEAPU8[($1_1 + 53 | 0) >> 0] | 0;
  $6_1 = $6_1 | $10_1 | 0;
  $11_1 = HEAPU8[($1_1 + 52 | 0) >> 0] | 0;
  $8_1 = $8_1 | $11_1 | 0;
  label$2 : {
   if (($7_1 | 0) < (2 | 0)) {
    break label$2
   }
   $9_1 = $9_1 + ($7_1 << 3 | 0) | 0;
   $7_1 = $0_1 + 24 | 0;
   label$3 : while (1) {
    if (HEAPU8[($1_1 + 54 | 0) >> 0] | 0) {
     break label$2
    }
    label$4 : {
     label$5 : {
      if (!($11_1 & 255 | 0)) {
       break label$5
      }
      if ((HEAP32[($1_1 + 24 | 0) >> 2] | 0 | 0) == (1 | 0)) {
       break label$2
      }
      if ((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 2 | 0) {
       break label$4
      }
      break label$2;
     }
     if (!($10_1 & 255 | 0)) {
      break label$4
     }
     if (!((HEAPU8[($0_1 + 8 | 0) >> 0] | 0) & 1 | 0)) {
      break label$2
     }
    }
    HEAP16[($1_1 + 52 | 0) >> 1] = 0;
    $909($7_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0, $5_1 | 0);
    $10_1 = HEAPU8[($1_1 + 53 | 0) >> 0] | 0;
    $6_1 = $10_1 | $6_1 | 0;
    $11_1 = HEAPU8[($1_1 + 52 | 0) >> 0] | 0;
    $8_1 = $11_1 | $8_1 | 0;
    $7_1 = $7_1 + 8 | 0;
    if ($7_1 >>> 0 < $9_1 >>> 0) {
     continue label$3
    }
    break label$3;
   };
  }
  HEAP8[($1_1 + 53 | 0) >> 0] = ($6_1 & 255 | 0 | 0) != (0 | 0);
  HEAP8[($1_1 + 52 | 0) >> 0] = ($8_1 & 255 | 0 | 0) != (0 | 0);
 }
 
 function $914($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $5_1 | 0) | 0)) {
    break label$1
   }
   $906($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
   return;
  }
  $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
  FUNCTION_TABLE[HEAP32[((HEAP32[$0_1 >> 2] | 0) + 20 | 0) >> 2] | 0]($0_1, $1_1, $2_1, $3_1, $4_1, $5_1);
 }
 
 function $915($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  label$1 : {
   if (!($894($0_1 | 0, HEAP32[($1_1 + 8 | 0) >> 2] | 0 | 0, $5_1 | 0) | 0)) {
    break label$1
   }
   $906($1_1 | 0, $1_1 | 0, $2_1 | 0, $3_1 | 0, $4_1 | 0);
  }
 }
 
 function $916() {
  return 0 | 0;
 }
 
 function $917($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0;
  label$1 : {
   $1_1 = ($767($0_1 | 0) | 0) + 1 | 0;
   $2_1 = $1040($1_1 | 0) | 0;
   if ($2_1) {
    break label$1
   }
   return 0 | 0;
  }
  return $1043($2_1 | 0, $0_1 | 0, $1_1 | 0) | 0 | 0;
 }
 
 function $918($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0, $6_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $6_1 = $917($867(HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) | 0 | 0) | 0;
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return $6_1 | 0;
 }
 
 function $919() {
  fimport$19($920() | 0 | 0, 4424 | 0);
  fimport$20($921() | 0 | 0, 4429 | 0, 1 | 0, 1 & 1 | 0 | 0, 0 & 1 | 0 | 0);
  $922(4434 | 0);
  $923(4439 | 0);
  $924(4451 | 0);
  $925(4465 | 0);
  $926(4471 | 0);
  $927(4486 | 0);
  $928(4490 | 0);
  $929(4503 | 0);
  $930(4508 | 0);
  $931(4522 | 0);
  $932(4528 | 0);
  fimport$21($933() | 0 | 0, 4535 | 0);
  fimport$21($934() | 0 | 0, 4547 | 0);
  fimport$22($935() | 0 | 0, 4 | 0, 4580 | 0);
  fimport$23($936() | 0 | 0, 4593 | 0);
  $937(4609 | 0);
  $938(4639 | 0);
  $939(4676 | 0);
  $940(4715 | 0);
  $941(4746 | 0);
  $942(4786 | 0);
  $943(4815 | 0);
  $944(4853 | 0);
  $945(4883 | 0);
  $938(4922 | 0);
  $939(4954 | 0);
  $940(4987 | 0);
  $941(5020 | 0);
  $942(5054 | 0);
  $943(5087 | 0);
  $946(5121 | 0);
  $947(5152 | 0);
  return;
 }
 
 function $920() {
  return $948() | 0 | 0;
 }
 
 function $921() {
  return $949() | 0 | 0;
 }
 
 function $922($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $12_1 = 0, $18_1 = 0, $17_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $17_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = 24;
  $12_1 = 24;
  fimport$24($950() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 1 | 0, (($951() | 0) << $8_1 | 0) >> $8_1 | 0 | 0, (($952() | 0) << $12_1 | 0) >> $12_1 | 0 | 0);
  label$3 : {
   $18_1 = $3_1 + 16 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return;
 }
 
 function $923($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $12_1 = 0, $18_1 = 0, $17_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $17_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = 24;
  $12_1 = 24;
  fimport$24($953() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 1 | 0, (($954() | 0) << $8_1 | 0) >> $8_1 | 0 | 0, (($955() | 0) << $12_1 | 0) >> $12_1 | 0 | 0);
  label$3 : {
   $18_1 = $3_1 + 16 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return;
 }
 
 function $924($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $16_1 = 0, $15_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($956() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 1 | 0, ($957() | 0) & 255 | 0 | 0, ($958() | 0) & 255 | 0 | 0);
  label$3 : {
   $16_1 = $3_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return;
 }
 
 function $925($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $12_1 = 0, $18_1 = 0, $17_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $17_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $17_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $8_1 = 16;
  $12_1 = 16;
  fimport$24($959() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 2 | 0, (($960() | 0) << $8_1 | 0) >> $8_1 | 0 | 0, (($961() | 0) << $12_1 | 0) >> $12_1 | 0 | 0);
  label$3 : {
   $18_1 = $3_1 + 16 | 0;
   if ($18_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $18_1;
  }
  return;
 }
 
 function $926($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $16_1 = 0, $15_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $15_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $15_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($962() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 2 | 0, ($963() | 0) & 65535 | 0 | 0, ($964() | 0) & 65535 | 0 | 0);
  label$3 : {
   $16_1 = $3_1 + 16 | 0;
   if ($16_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $16_1;
  }
  return;
 }
 
 function $927($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($965() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 4 | 0, $856() | 0 | 0, $857() | 0 | 0);
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $928($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($966() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 4 | 0, $967() | 0 | 0, $968() | 0 | 0);
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $929($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($969() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 4 | 0, $970() | 0 | 0, $508() | 0 | 0);
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $930($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $12_1 = 0, $11_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $11_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $11_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$24($971() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 4 | 0, $972() | 0 | 0, $973() | 0 | 0);
  label$3 : {
   $12_1 = $3_1 + 16 | 0;
   if ($12_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  return;
 }
 
 function $931($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$25($974() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 4 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $932($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$25($149() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0, 8 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $933() {
  return $975() | 0 | 0;
 }
 
 function $934() {
  return $976() | 0 | 0;
 }
 
 function $935() {
  return $977() | 0 | 0;
 }
 
 function $936() {
  return $978() | 0 | 0;
 }
 
 function $937($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($979() | 0 | 0, $980() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $938($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($981() | 0 | 0, $982() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $939($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($983() | 0 | 0, $984() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $940($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($985() | 0 | 0, $986() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $941($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($987() | 0 | 0, $988() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $942($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($989() | 0 | 0, $990() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $943($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($991() | 0 | 0, $992() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $944($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($993() | 0 | 0, $994() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $945($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($995() | 0 | 0, $996() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $946($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($997() | 0 | 0, $998() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $947($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $10_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $9_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $9_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  fimport$26($999() | 0 | 0, $1000() | 0 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0);
  label$3 : {
   $10_1 = $3_1 + 16 | 0;
   if ($10_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $10_1;
  }
  return;
 }
 
 function $948() {
  return 4008 | 0;
 }
 
 function $949() {
  return 4032 | 0;
 }
 
 function $950() {
  return $1003() | 0 | 0;
 }
 
 function $951() {
  var $1_1 = 0;
  $1_1 = 24;
  return (($1004() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $952() {
  var $1_1 = 0;
  $1_1 = 24;
  return (($1005() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $953() {
  return $1006() | 0 | 0;
 }
 
 function $954() {
  var $1_1 = 0;
  $1_1 = 24;
  return (($1007() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $955() {
  var $1_1 = 0;
  $1_1 = 24;
  return (($1008() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $956() {
  return $1009() | 0 | 0;
 }
 
 function $957() {
  return ($1010() | 0) & 255 | 0 | 0;
 }
 
 function $958() {
  return ($1011() | 0) & 255 | 0 | 0;
 }
 
 function $959() {
  return $1012() | 0 | 0;
 }
 
 function $960() {
  var $1_1 = 0;
  $1_1 = 16;
  return (($1013() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $961() {
  var $1_1 = 0;
  $1_1 = 16;
  return (($1014() | 0) << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $962() {
  return $1015() | 0 | 0;
 }
 
 function $963() {
  return ($1016() | 0) & 65535 | 0 | 0;
 }
 
 function $964() {
  return ($1017() | 0) & 65535 | 0 | 0;
 }
 
 function $965() {
  return $1018() | 0 | 0;
 }
 
 function $966() {
  return $1019() | 0 | 0;
 }
 
 function $967() {
  return $1020() | 0 | 0;
 }
 
 function $968() {
  return $1021() | 0 | 0;
 }
 
 function $969() {
  return $1022() | 0 | 0;
 }
 
 function $970() {
  return $1023() | 0 | 0;
 }
 
 function $971() {
  return $1024() | 0 | 0;
 }
 
 function $972() {
  return $1025() | 0 | 0;
 }
 
 function $973() {
  return $1026() | 0 | 0;
 }
 
 function $974() {
  return $1027() | 0 | 0;
 }
 
 function $975() {
  return 1788 | 0;
 }
 
 function $976() {
  return 5248 | 0;
 }
 
 function $977() {
  return 5336 | 0;
 }
 
 function $978() {
  return 2436 | 0;
 }
 
 function $979() {
  return $1028() | 0 | 0;
 }
 
 function $980() {
  return 0 | 0;
 }
 
 function $981() {
  return $1029() | 0 | 0;
 }
 
 function $982() {
  return 0 | 0;
 }
 
 function $983() {
  return $1030() | 0 | 0;
 }
 
 function $984() {
  return 1 | 0;
 }
 
 function $985() {
  return $1031() | 0 | 0;
 }
 
 function $986() {
  return 2 | 0;
 }
 
 function $987() {
  return $1032() | 0 | 0;
 }
 
 function $988() {
  return 3 | 0;
 }
 
 function $989() {
  return $1033() | 0 | 0;
 }
 
 function $990() {
  return 4 | 0;
 }
 
 function $991() {
  return $1034() | 0 | 0;
 }
 
 function $992() {
  return 5 | 0;
 }
 
 function $993() {
  return $1035() | 0 | 0;
 }
 
 function $994() {
  return 4 | 0;
 }
 
 function $995() {
  return $1036() | 0 | 0;
 }
 
 function $996() {
  return 5 | 0;
 }
 
 function $997() {
  return $1037() | 0 | 0;
 }
 
 function $998() {
  return 6 | 0;
 }
 
 function $999() {
  return $1038() | 0 | 0;
 }
 
 function $1000() {
  return 7 | 0;
 }
 
 function $1001() {
  FUNCTION_TABLE[70](6304) | 0;
  return;
 }
 
 function $1002($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $8_1 = 0, $7_1 = 0, $4_1 = 0;
  $3_1 = global$0 - 16 | 0;
  label$1 : {
   $7_1 = $3_1;
   if ($3_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $7_1;
  }
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
  $919();
  label$3 : {
   $8_1 = $3_1 + 16 | 0;
   if ($8_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $8_1;
  }
  return $4_1 | 0;
 }
 
 function $1003() {
  return 4044 | 0;
 }
 
 function $1004() {
  var $1_1 = 0;
  $1_1 = 24;
  return (128 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1005() {
  var $1_1 = 0;
  $1_1 = 24;
  return (127 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1006() {
  return 4068 | 0;
 }
 
 function $1007() {
  var $1_1 = 0;
  $1_1 = 24;
  return (128 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1008() {
  var $1_1 = 0;
  $1_1 = 24;
  return (127 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1009() {
  return 4056 | 0;
 }
 
 function $1010() {
  return 0 & 255 | 0 | 0;
 }
 
 function $1011() {
  return 255 & 255 | 0 | 0;
 }
 
 function $1012() {
  return 4080 | 0;
 }
 
 function $1013() {
  var $1_1 = 0;
  $1_1 = 16;
  return (32768 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1014() {
  var $1_1 = 0;
  $1_1 = 16;
  return (32767 << $1_1 | 0) >> $1_1 | 0 | 0;
 }
 
 function $1015() {
  return 4092 | 0;
 }
 
 function $1016() {
  return 0 & 65535 | 0 | 0;
 }
 
 function $1017() {
  return 65535 & 65535 | 0 | 0;
 }
 
 function $1018() {
  return 4104 | 0;
 }
 
 function $1019() {
  return 4116 | 0;
 }
 
 function $1020() {
  return 0 | 0;
 }
 
 function $1021() {
  return -1 | 0;
 }
 
 function $1022() {
  return 4128 | 0;
 }
 
 function $1023() {
  return -2147483648 | 0;
 }
 
 function $1024() {
  return 4140 | 0;
 }
 
 function $1025() {
  return 0 | 0;
 }
 
 function $1026() {
  return -1 | 0;
 }
 
 function $1027() {
  return 4152 | 0;
 }
 
 function $1028() {
  return 5392 | 0;
 }
 
 function $1029() {
  return 5432 | 0;
 }
 
 function $1030() {
  return 5472 | 0;
 }
 
 function $1031() {
  return 5512 | 0;
 }
 
 function $1032() {
  return 5552 | 0;
 }
 
 function $1033() {
  return 5592 | 0;
 }
 
 function $1034() {
  return 5632 | 0;
 }
 
 function $1035() {
  return 5672 | 0;
 }
 
 function $1036() {
  return 5712 | 0;
 }
 
 function $1037() {
  return 5752 | 0;
 }
 
 function $1038() {
  return 5792 | 0;
 }
 
 function $1039() {
  $1001();
  return;
 }
 
 function $1040($0_1) {
  $0_1 = $0_1 | 0;
  var $4_1 = 0, $5_1 = 0, $6_1 = 0, $8_1 = 0, $3_1 = 0, $2_1 = 0, $11_1 = 0, $7_1 = 0, i64toi32_i32$0 = 0, $9_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $1_1 = 0, $10_1 = 0, $13_1 = 0, $12_1 = 0, $88_1 = 0, $101_1 = 0, $112_1 = 0, $120_1 = 0, $128_1 = 0, $222_1 = 0, $233_1 = 0, $241_1 = 0, $249_1 = 0, $284_1 = 0, $362_1 = 0, $369_1 = 0, $462_1 = 0, $473_1 = 0, $481_1 = 0, $489_1 = 0, $1200 = 0, $1207 = 0, $1329 = 0, $1331 = 0, $1401 = 0, $1408 = 0, $1652 = 0, $1659 = 0;
  label$1 : {
   $1_1 = global$0 - 16 | 0;
   $12_1 = $1_1;
   if ($1_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $12_1;
  }
  label$3 : {
   label$4 : {
    label$5 : {
     label$6 : {
      label$7 : {
       label$8 : {
        label$9 : {
         label$10 : {
          label$11 : {
           label$12 : {
            label$13 : {
             label$14 : {
              if ($0_1 >>> 0 > 244 >>> 0) {
               break label$14
              }
              label$15 : {
               $2_1 = HEAP32[(0 + 6308 | 0) >> 2] | 0;
               $3_1 = $0_1 >>> 0 < 11 >>> 0 ? 16 : ($0_1 + 11 | 0) & -8 | 0;
               $4_1 = $3_1 >>> 3 | 0;
               $0_1 = $2_1 >>> $4_1 | 0;
               if (!($0_1 & 3 | 0)) {
                break label$15
               }
               $3_1 = (($0_1 ^ -1 | 0) & 1 | 0) + $4_1 | 0;
               $5_1 = $3_1 << 3 | 0;
               $4_1 = HEAP32[($5_1 + 6356 | 0) >> 2] | 0;
               $0_1 = $4_1 + 8 | 0;
               label$16 : {
                label$17 : {
                 $6_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
                 $5_1 = $5_1 + 6348 | 0;
                 if (($6_1 | 0) != ($5_1 | 0)) {
                  break label$17
                 }
                 HEAP32[(0 + 6308 | 0) >> 2] = $2_1 & (__wasm_rotl_i32(-2 | 0, $3_1 | 0) | 0) | 0;
                 break label$16;
                }
                HEAP32[(0 + 6324 | 0) >> 2] | 0;
                HEAP32[($6_1 + 12 | 0) >> 2] = $5_1;
                HEAP32[($5_1 + 8 | 0) >> 2] = $6_1;
               }
               $6_1 = $3_1 << 3 | 0;
               HEAP32[($4_1 + 4 | 0) >> 2] = $6_1 | 3 | 0;
               $4_1 = $4_1 + $6_1 | 0;
               HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 1 | 0;
               break label$3;
              }
              $7_1 = HEAP32[(0 + 6316 | 0) >> 2] | 0;
              if ($3_1 >>> 0 <= $7_1 >>> 0) {
               break label$13
              }
              label$18 : {
               if (!$0_1) {
                break label$18
               }
               label$19 : {
                label$20 : {
                 $88_1 = $0_1 << $4_1 | 0;
                 $0_1 = 2 << $4_1 | 0;
                 $0_1 = $88_1 & ($0_1 | (0 - $0_1 | 0) | 0) | 0;
                 $0_1 = ($0_1 & (0 - $0_1 | 0) | 0) + -1 | 0;
                 $101_1 = $0_1;
                 $0_1 = ($0_1 >>> 12 | 0) & 16 | 0;
                 $4_1 = $101_1 >>> $0_1 | 0;
                 $6_1 = ($4_1 >>> 5 | 0) & 8 | 0;
                 $112_1 = $6_1 | $0_1 | 0;
                 $0_1 = $4_1 >>> $6_1 | 0;
                 $4_1 = ($0_1 >>> 2 | 0) & 4 | 0;
                 $120_1 = $112_1 | $4_1 | 0;
                 $0_1 = $0_1 >>> $4_1 | 0;
                 $4_1 = ($0_1 >>> 1 | 0) & 2 | 0;
                 $128_1 = $120_1 | $4_1 | 0;
                 $0_1 = $0_1 >>> $4_1 | 0;
                 $4_1 = ($0_1 >>> 1 | 0) & 1 | 0;
                 $6_1 = ($128_1 | $4_1 | 0) + ($0_1 >>> $4_1 | 0) | 0;
                 $5_1 = $6_1 << 3 | 0;
                 $4_1 = HEAP32[($5_1 + 6356 | 0) >> 2] | 0;
                 $0_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
                 $5_1 = $5_1 + 6348 | 0;
                 if (($0_1 | 0) != ($5_1 | 0)) {
                  break label$20
                 }
                 $2_1 = $2_1 & (__wasm_rotl_i32(-2 | 0, $6_1 | 0) | 0) | 0;
                 HEAP32[(0 + 6308 | 0) >> 2] = $2_1;
                 break label$19;
                }
                HEAP32[(0 + 6324 | 0) >> 2] | 0;
                HEAP32[($0_1 + 12 | 0) >> 2] = $5_1;
                HEAP32[($5_1 + 8 | 0) >> 2] = $0_1;
               }
               $0_1 = $4_1 + 8 | 0;
               HEAP32[($4_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
               $5_1 = $4_1 + $3_1 | 0;
               $8_1 = $6_1 << 3 | 0;
               $6_1 = $8_1 - $3_1 | 0;
               HEAP32[($5_1 + 4 | 0) >> 2] = $6_1 | 1 | 0;
               HEAP32[($4_1 + $8_1 | 0) >> 2] = $6_1;
               label$21 : {
                if (!$7_1) {
                 break label$21
                }
                $8_1 = $7_1 >>> 3 | 0;
                $3_1 = ($8_1 << 3 | 0) + 6348 | 0;
                $4_1 = HEAP32[(0 + 6328 | 0) >> 2] | 0;
                label$22 : {
                 label$23 : {
                  $8_1 = 1 << $8_1 | 0;
                  if ($2_1 & $8_1 | 0) {
                   break label$23
                  }
                  HEAP32[(0 + 6308 | 0) >> 2] = $2_1 | $8_1 | 0;
                  $8_1 = $3_1;
                  break label$22;
                 }
                 $8_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
                }
                HEAP32[($3_1 + 8 | 0) >> 2] = $4_1;
                HEAP32[($8_1 + 12 | 0) >> 2] = $4_1;
                HEAP32[($4_1 + 12 | 0) >> 2] = $3_1;
                HEAP32[($4_1 + 8 | 0) >> 2] = $8_1;
               }
               HEAP32[(0 + 6328 | 0) >> 2] = $5_1;
               HEAP32[(0 + 6316 | 0) >> 2] = $6_1;
               break label$3;
              }
              $9_1 = HEAP32[(0 + 6312 | 0) >> 2] | 0;
              if (!$9_1) {
               break label$13
              }
              $0_1 = ($9_1 & (0 - $9_1 | 0) | 0) + -1 | 0;
              $222_1 = $0_1;
              $0_1 = ($0_1 >>> 12 | 0) & 16 | 0;
              $4_1 = $222_1 >>> $0_1 | 0;
              $6_1 = ($4_1 >>> 5 | 0) & 8 | 0;
              $233_1 = $6_1 | $0_1 | 0;
              $0_1 = $4_1 >>> $6_1 | 0;
              $4_1 = ($0_1 >>> 2 | 0) & 4 | 0;
              $241_1 = $233_1 | $4_1 | 0;
              $0_1 = $0_1 >>> $4_1 | 0;
              $4_1 = ($0_1 >>> 1 | 0) & 2 | 0;
              $249_1 = $241_1 | $4_1 | 0;
              $0_1 = $0_1 >>> $4_1 | 0;
              $4_1 = ($0_1 >>> 1 | 0) & 1 | 0;
              $5_1 = HEAP32[(((($249_1 | $4_1 | 0) + ($0_1 >>> $4_1 | 0) | 0) << 2 | 0) + 6612 | 0) >> 2] | 0;
              $4_1 = ((HEAP32[($5_1 + 4 | 0) >> 2] | 0) & -8 | 0) - $3_1 | 0;
              $6_1 = $5_1;
              label$24 : {
               label$25 : while (1) {
                label$26 : {
                 $0_1 = HEAP32[($6_1 + 16 | 0) >> 2] | 0;
                 if ($0_1) {
                  break label$26
                 }
                 $0_1 = HEAP32[($6_1 + 20 | 0) >> 2] | 0;
                 if (!$0_1) {
                  break label$24
                 }
                }
                $6_1 = ((HEAP32[($0_1 + 4 | 0) >> 2] | 0) & -8 | 0) - $3_1 | 0;
                $284_1 = $6_1;
                $6_1 = $6_1 >>> 0 < $4_1 >>> 0;
                $4_1 = $6_1 ? $284_1 : $4_1;
                $5_1 = $6_1 ? $0_1 : $5_1;
                $6_1 = $0_1;
                continue label$25;
               };
              }
              $10_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
              label$27 : {
               $8_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
               if (($8_1 | 0) == ($5_1 | 0)) {
                break label$27
               }
               label$28 : {
                $0_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
                if ((HEAP32[(0 + 6324 | 0) >> 2] | 0) >>> 0 > $0_1 >>> 0) {
                 break label$28
                }
                HEAP32[($0_1 + 12 | 0) >> 2] | 0;
               }
               HEAP32[($0_1 + 12 | 0) >> 2] = $8_1;
               HEAP32[($8_1 + 8 | 0) >> 2] = $0_1;
               break label$4;
              }
              label$29 : {
               $6_1 = $5_1 + 20 | 0;
               $0_1 = HEAP32[$6_1 >> 2] | 0;
               if ($0_1) {
                break label$29
               }
               $0_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
               if (!$0_1) {
                break label$12
               }
               $6_1 = $5_1 + 16 | 0;
              }
              label$30 : while (1) {
               $11_1 = $6_1;
               $8_1 = $0_1;
               $6_1 = $0_1 + 20 | 0;
               $0_1 = HEAP32[$6_1 >> 2] | 0;
               if ($0_1) {
                continue label$30
               }
               $6_1 = $8_1 + 16 | 0;
               $0_1 = HEAP32[($8_1 + 16 | 0) >> 2] | 0;
               if ($0_1) {
                continue label$30
               }
               break label$30;
              };
              HEAP32[$11_1 >> 2] = 0;
              break label$4;
             }
             $3_1 = -1;
             if ($0_1 >>> 0 > -65 >>> 0) {
              break label$13
             }
             $0_1 = $0_1 + 11 | 0;
             $3_1 = $0_1 & -8 | 0;
             $7_1 = HEAP32[(0 + 6312 | 0) >> 2] | 0;
             if (!$7_1) {
              break label$13
             }
             $11_1 = 0;
             label$31 : {
              $0_1 = $0_1 >>> 8 | 0;
              if (!$0_1) {
               break label$31
              }
              $11_1 = 31;
              if ($3_1 >>> 0 > 16777215 >>> 0) {
               break label$31
              }
              $4_1 = (($0_1 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
              $0_1 = $0_1 << $4_1 | 0;
              $362_1 = $0_1;
              $0_1 = (($0_1 + 520192 | 0) >>> 16 | 0) & 4 | 0;
              $6_1 = $362_1 << $0_1 | 0;
              $369_1 = $6_1;
              $6_1 = (($6_1 + 245760 | 0) >>> 16 | 0) & 2 | 0;
              $0_1 = (($369_1 << $6_1 | 0) >>> 15 | 0) - ($0_1 | $4_1 | 0 | $6_1 | 0) | 0;
              $11_1 = ($0_1 << 1 | 0 | (($3_1 >>> ($0_1 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
             }
             $6_1 = 0 - $3_1 | 0;
             label$32 : {
              label$33 : {
               label$34 : {
                label$35 : {
                 $4_1 = HEAP32[(($11_1 << 2 | 0) + 6612 | 0) >> 2] | 0;
                 if ($4_1) {
                  break label$35
                 }
                 $0_1 = 0;
                 $8_1 = 0;
                 break label$34;
                }
                $5_1 = $3_1 << (($11_1 | 0) == (31 | 0) ? 0 : 25 - ($11_1 >>> 1 | 0) | 0) | 0;
                $0_1 = 0;
                $8_1 = 0;
                label$36 : while (1) {
                 label$37 : {
                  $2_1 = ((HEAP32[($4_1 + 4 | 0) >> 2] | 0) & -8 | 0) - $3_1 | 0;
                  if ($2_1 >>> 0 >= $6_1 >>> 0) {
                   break label$37
                  }
                  $6_1 = $2_1;
                  $8_1 = $4_1;
                  if ($6_1) {
                   break label$37
                  }
                  $6_1 = 0;
                  $8_1 = $4_1;
                  $0_1 = $4_1;
                  break label$33;
                 }
                 $2_1 = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
                 $4_1 = HEAP32[(($4_1 + (($5_1 >>> 29 | 0) & 4 | 0) | 0) + 16 | 0) >> 2] | 0;
                 $0_1 = $2_1 ? (($2_1 | 0) == ($4_1 | 0) ? $0_1 : $2_1) : $0_1;
                 $5_1 = $5_1 << (($4_1 | 0) != (0 | 0)) | 0;
                 if ($4_1) {
                  continue label$36
                 }
                 break label$36;
                };
               }
               label$38 : {
                if ($0_1 | $8_1 | 0) {
                 break label$38
                }
                $0_1 = 2 << $11_1 | 0;
                $0_1 = ($0_1 | (0 - $0_1 | 0) | 0) & $7_1 | 0;
                if (!$0_1) {
                 break label$13
                }
                $0_1 = ($0_1 & (0 - $0_1 | 0) | 0) + -1 | 0;
                $462_1 = $0_1;
                $0_1 = ($0_1 >>> 12 | 0) & 16 | 0;
                $4_1 = $462_1 >>> $0_1 | 0;
                $5_1 = ($4_1 >>> 5 | 0) & 8 | 0;
                $473_1 = $5_1 | $0_1 | 0;
                $0_1 = $4_1 >>> $5_1 | 0;
                $4_1 = ($0_1 >>> 2 | 0) & 4 | 0;
                $481_1 = $473_1 | $4_1 | 0;
                $0_1 = $0_1 >>> $4_1 | 0;
                $4_1 = ($0_1 >>> 1 | 0) & 2 | 0;
                $489_1 = $481_1 | $4_1 | 0;
                $0_1 = $0_1 >>> $4_1 | 0;
                $4_1 = ($0_1 >>> 1 | 0) & 1 | 0;
                $0_1 = HEAP32[(((($489_1 | $4_1 | 0) + ($0_1 >>> $4_1 | 0) | 0) << 2 | 0) + 6612 | 0) >> 2] | 0;
               }
               if (!$0_1) {
                break label$32
               }
              }
              label$39 : while (1) {
               $2_1 = ((HEAP32[($0_1 + 4 | 0) >> 2] | 0) & -8 | 0) - $3_1 | 0;
               $5_1 = $2_1 >>> 0 < $6_1 >>> 0;
               label$40 : {
                $4_1 = HEAP32[($0_1 + 16 | 0) >> 2] | 0;
                if ($4_1) {
                 break label$40
                }
                $4_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
               }
               $6_1 = $5_1 ? $2_1 : $6_1;
               $8_1 = $5_1 ? $0_1 : $8_1;
               $0_1 = $4_1;
               if ($0_1) {
                continue label$39
               }
               break label$39;
              };
             }
             if (!$8_1) {
              break label$13
             }
             if ($6_1 >>> 0 >= ((HEAP32[(0 + 6316 | 0) >> 2] | 0) - $3_1 | 0) >>> 0) {
              break label$13
             }
             $11_1 = HEAP32[($8_1 + 24 | 0) >> 2] | 0;
             label$41 : {
              $5_1 = HEAP32[($8_1 + 12 | 0) >> 2] | 0;
              if (($5_1 | 0) == ($8_1 | 0)) {
               break label$41
              }
              label$42 : {
               $0_1 = HEAP32[($8_1 + 8 | 0) >> 2] | 0;
               if ((HEAP32[(0 + 6324 | 0) >> 2] | 0) >>> 0 > $0_1 >>> 0) {
                break label$42
               }
               HEAP32[($0_1 + 12 | 0) >> 2] | 0;
              }
              HEAP32[($0_1 + 12 | 0) >> 2] = $5_1;
              HEAP32[($5_1 + 8 | 0) >> 2] = $0_1;
              break label$5;
             }
             label$43 : {
              $4_1 = $8_1 + 20 | 0;
              $0_1 = HEAP32[$4_1 >> 2] | 0;
              if ($0_1) {
               break label$43
              }
              $0_1 = HEAP32[($8_1 + 16 | 0) >> 2] | 0;
              if (!$0_1) {
               break label$11
              }
              $4_1 = $8_1 + 16 | 0;
             }
             label$44 : while (1) {
              $2_1 = $4_1;
              $5_1 = $0_1;
              $4_1 = $0_1 + 20 | 0;
              $0_1 = HEAP32[$4_1 >> 2] | 0;
              if ($0_1) {
               continue label$44
              }
              $4_1 = $5_1 + 16 | 0;
              $0_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
              if ($0_1) {
               continue label$44
              }
              break label$44;
             };
             HEAP32[$2_1 >> 2] = 0;
             break label$5;
            }
            label$45 : {
             $0_1 = HEAP32[(0 + 6316 | 0) >> 2] | 0;
             if ($0_1 >>> 0 < $3_1 >>> 0) {
              break label$45
             }
             $4_1 = HEAP32[(0 + 6328 | 0) >> 2] | 0;
             label$46 : {
              label$47 : {
               $6_1 = $0_1 - $3_1 | 0;
               if ($6_1 >>> 0 < 16 >>> 0) {
                break label$47
               }
               HEAP32[(0 + 6316 | 0) >> 2] = $6_1;
               $5_1 = $4_1 + $3_1 | 0;
               HEAP32[(0 + 6328 | 0) >> 2] = $5_1;
               HEAP32[($5_1 + 4 | 0) >> 2] = $6_1 | 1 | 0;
               HEAP32[($4_1 + $0_1 | 0) >> 2] = $6_1;
               HEAP32[($4_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
               break label$46;
              }
              HEAP32[(0 + 6328 | 0) >> 2] = 0;
              HEAP32[(0 + 6316 | 0) >> 2] = 0;
              HEAP32[($4_1 + 4 | 0) >> 2] = $0_1 | 3 | 0;
              $0_1 = $4_1 + $0_1 | 0;
              HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($0_1 + 4 | 0) >> 2] | 0 | 1 | 0;
             }
             $0_1 = $4_1 + 8 | 0;
             break label$3;
            }
            label$48 : {
             $5_1 = HEAP32[(0 + 6320 | 0) >> 2] | 0;
             if ($5_1 >>> 0 <= $3_1 >>> 0) {
              break label$48
             }
             $4_1 = $5_1 - $3_1 | 0;
             HEAP32[(0 + 6320 | 0) >> 2] = $4_1;
             $0_1 = HEAP32[(0 + 6332 | 0) >> 2] | 0;
             $6_1 = $0_1 + $3_1 | 0;
             HEAP32[(0 + 6332 | 0) >> 2] = $6_1;
             HEAP32[($6_1 + 4 | 0) >> 2] = $4_1 | 1 | 0;
             HEAP32[($0_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
             $0_1 = $0_1 + 8 | 0;
             break label$3;
            }
            label$49 : {
             label$50 : {
              if (!(HEAP32[(0 + 6780 | 0) >> 2] | 0)) {
               break label$50
              }
              $4_1 = HEAP32[(0 + 6788 | 0) >> 2] | 0;
              break label$49;
             }
             i64toi32_i32$1 = 0;
             i64toi32_i32$0 = -1;
             HEAP32[(i64toi32_i32$1 + 6792 | 0) >> 2] = -1;
             HEAP32[(i64toi32_i32$1 + 6796 | 0) >> 2] = i64toi32_i32$0;
             i64toi32_i32$1 = 0;
             i64toi32_i32$0 = 4096;
             HEAP32[(i64toi32_i32$1 + 6784 | 0) >> 2] = 4096;
             HEAP32[(i64toi32_i32$1 + 6788 | 0) >> 2] = i64toi32_i32$0;
             HEAP32[(0 + 6780 | 0) >> 2] = (($1_1 + 12 | 0) & -16 | 0) ^ 1431655768 | 0;
             HEAP32[(0 + 6800 | 0) >> 2] = 0;
             HEAP32[(0 + 6752 | 0) >> 2] = 0;
             $4_1 = 4096;
            }
            $0_1 = 0;
            $7_1 = $3_1 + 47 | 0;
            $2_1 = $4_1 + $7_1 | 0;
            $11_1 = 0 - $4_1 | 0;
            $8_1 = $2_1 & $11_1 | 0;
            if ($8_1 >>> 0 <= $3_1 >>> 0) {
             break label$3
            }
            $0_1 = 0;
            label$51 : {
             $4_1 = HEAP32[(0 + 6748 | 0) >> 2] | 0;
             if (!$4_1) {
              break label$51
             }
             $6_1 = HEAP32[(0 + 6740 | 0) >> 2] | 0;
             $9_1 = $6_1 + $8_1 | 0;
             if ($9_1 >>> 0 <= $6_1 >>> 0) {
              break label$3
             }
             if ($9_1 >>> 0 > $4_1 >>> 0) {
              break label$3
             }
            }
            if ((HEAPU8[(0 + 6752 | 0) >> 0] | 0) & 4 | 0) {
             break label$8
            }
            label$52 : {
             label$53 : {
              label$54 : {
               $4_1 = HEAP32[(0 + 6332 | 0) >> 2] | 0;
               if (!$4_1) {
                break label$54
               }
               $0_1 = 6756;
               label$55 : while (1) {
                label$56 : {
                 $6_1 = HEAP32[$0_1 >> 2] | 0;
                 if ($6_1 >>> 0 > $4_1 >>> 0) {
                  break label$56
                 }
                 if (($6_1 + (HEAP32[($0_1 + 4 | 0) >> 2] | 0) | 0) >>> 0 > $4_1 >>> 0) {
                  break label$53
                 }
                }
                $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
                if ($0_1) {
                 continue label$55
                }
                break label$55;
               };
              }
              $5_1 = $1042(0 | 0) | 0;
              if (($5_1 | 0) == (-1 | 0)) {
               break label$9
              }
              $2_1 = $8_1;
              label$57 : {
               $0_1 = HEAP32[(0 + 6784 | 0) >> 2] | 0;
               $4_1 = $0_1 + -1 | 0;
               if (!($4_1 & $5_1 | 0)) {
                break label$57
               }
               $2_1 = ($8_1 - $5_1 | 0) + (($4_1 + $5_1 | 0) & (0 - $0_1 | 0) | 0) | 0;
              }
              if ($2_1 >>> 0 <= $3_1 >>> 0) {
               break label$9
              }
              if ($2_1 >>> 0 > 2147483646 >>> 0) {
               break label$9
              }
              label$58 : {
               $0_1 = HEAP32[(0 + 6748 | 0) >> 2] | 0;
               if (!$0_1) {
                break label$58
               }
               $4_1 = HEAP32[(0 + 6740 | 0) >> 2] | 0;
               $6_1 = $4_1 + $2_1 | 0;
               if ($6_1 >>> 0 <= $4_1 >>> 0) {
                break label$9
               }
               if ($6_1 >>> 0 > $0_1 >>> 0) {
                break label$9
               }
              }
              $0_1 = $1042($2_1 | 0) | 0;
              if (($0_1 | 0) != ($5_1 | 0)) {
               break label$52
              }
              break label$7;
             }
             $2_1 = ($2_1 - $5_1 | 0) & $11_1 | 0;
             if ($2_1 >>> 0 > 2147483646 >>> 0) {
              break label$9
             }
             $5_1 = $1042($2_1 | 0) | 0;
             if (($5_1 | 0) == ((HEAP32[$0_1 >> 2] | 0) + (HEAP32[($0_1 + 4 | 0) >> 2] | 0) | 0 | 0)) {
              break label$10
             }
             $0_1 = $5_1;
            }
            $5_1 = $0_1;
            label$59 : {
             if (($3_1 + 48 | 0) >>> 0 <= $2_1 >>> 0) {
              break label$59
             }
             if ($2_1 >>> 0 > 2147483646 >>> 0) {
              break label$59
             }
             if (($5_1 | 0) == (-1 | 0)) {
              break label$59
             }
             $0_1 = HEAP32[(0 + 6788 | 0) >> 2] | 0;
             $0_1 = (($7_1 - $2_1 | 0) + $0_1 | 0) & (0 - $0_1 | 0) | 0;
             if ($0_1 >>> 0 > 2147483646 >>> 0) {
              break label$7
             }
             label$60 : {
              if (($1042($0_1 | 0) | 0 | 0) == (-1 | 0)) {
               break label$60
              }
              $2_1 = $0_1 + $2_1 | 0;
              break label$7;
             }
             $1042(0 - $2_1 | 0 | 0) | 0;
             break label$9;
            }
            if (($5_1 | 0) != (-1 | 0)) {
             break label$7
            }
            break label$9;
           }
           $8_1 = 0;
           break label$4;
          }
          $5_1 = 0;
          break label$5;
         }
         if (($5_1 | 0) != (-1 | 0)) {
          break label$7
         }
        }
        HEAP32[(0 + 6752 | 0) >> 2] = HEAP32[(0 + 6752 | 0) >> 2] | 0 | 4 | 0;
       }
       if ($8_1 >>> 0 > 2147483646 >>> 0) {
        break label$6
       }
       $5_1 = $1042($8_1 | 0) | 0;
       $0_1 = $1042(0 | 0) | 0;
       if ($5_1 >>> 0 >= $0_1 >>> 0) {
        break label$6
       }
       if (($5_1 | 0) == (-1 | 0)) {
        break label$6
       }
       if (($0_1 | 0) == (-1 | 0)) {
        break label$6
       }
       $2_1 = $0_1 - $5_1 | 0;
       if ($2_1 >>> 0 <= ($3_1 + 40 | 0) >>> 0) {
        break label$6
       }
      }
      $0_1 = (HEAP32[(0 + 6740 | 0) >> 2] | 0) + $2_1 | 0;
      HEAP32[(0 + 6740 | 0) >> 2] = $0_1;
      label$61 : {
       if ($0_1 >>> 0 <= (HEAP32[(0 + 6744 | 0) >> 2] | 0) >>> 0) {
        break label$61
       }
       HEAP32[(0 + 6744 | 0) >> 2] = $0_1;
      }
      label$62 : {
       label$63 : {
        label$64 : {
         label$65 : {
          $4_1 = HEAP32[(0 + 6332 | 0) >> 2] | 0;
          if (!$4_1) {
           break label$65
          }
          $0_1 = 6756;
          label$66 : while (1) {
           $6_1 = HEAP32[$0_1 >> 2] | 0;
           $8_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
           if (($5_1 | 0) == ($6_1 + $8_1 | 0 | 0)) {
            break label$64
           }
           $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
           if ($0_1) {
            continue label$66
           }
           break label$63;
          };
         }
         label$67 : {
          label$68 : {
           $0_1 = HEAP32[(0 + 6324 | 0) >> 2] | 0;
           if (!$0_1) {
            break label$68
           }
           if ($5_1 >>> 0 >= $0_1 >>> 0) {
            break label$67
           }
          }
          HEAP32[(0 + 6324 | 0) >> 2] = $5_1;
         }
         $0_1 = 0;
         HEAP32[(0 + 6760 | 0) >> 2] = $2_1;
         HEAP32[(0 + 6756 | 0) >> 2] = $5_1;
         HEAP32[(0 + 6340 | 0) >> 2] = -1;
         HEAP32[(0 + 6344 | 0) >> 2] = HEAP32[(0 + 6780 | 0) >> 2] | 0;
         HEAP32[(0 + 6768 | 0) >> 2] = 0;
         label$69 : while (1) {
          $4_1 = $0_1 << 3 | 0;
          $6_1 = $4_1 + 6348 | 0;
          HEAP32[($4_1 + 6356 | 0) >> 2] = $6_1;
          HEAP32[($4_1 + 6360 | 0) >> 2] = $6_1;
          $0_1 = $0_1 + 1 | 0;
          if (($0_1 | 0) != (32 | 0)) {
           continue label$69
          }
          break label$69;
         };
         $0_1 = $2_1 + -40 | 0;
         $4_1 = ($5_1 + 8 | 0) & 7 | 0 ? (-8 - $5_1 | 0) & 7 | 0 : 0;
         $6_1 = $0_1 - $4_1 | 0;
         HEAP32[(0 + 6320 | 0) >> 2] = $6_1;
         $4_1 = $5_1 + $4_1 | 0;
         HEAP32[(0 + 6332 | 0) >> 2] = $4_1;
         HEAP32[($4_1 + 4 | 0) >> 2] = $6_1 | 1 | 0;
         HEAP32[(($5_1 + $0_1 | 0) + 4 | 0) >> 2] = 40;
         HEAP32[(0 + 6336 | 0) >> 2] = HEAP32[(0 + 6796 | 0) >> 2] | 0;
         break label$62;
        }
        if ((HEAPU8[($0_1 + 12 | 0) >> 0] | 0) & 8 | 0) {
         break label$63
        }
        if ($5_1 >>> 0 <= $4_1 >>> 0) {
         break label$63
        }
        if ($6_1 >>> 0 > $4_1 >>> 0) {
         break label$63
        }
        HEAP32[($0_1 + 4 | 0) >> 2] = $8_1 + $2_1 | 0;
        $0_1 = ($4_1 + 8 | 0) & 7 | 0 ? (-8 - $4_1 | 0) & 7 | 0 : 0;
        $6_1 = $4_1 + $0_1 | 0;
        HEAP32[(0 + 6332 | 0) >> 2] = $6_1;
        $5_1 = (HEAP32[(0 + 6320 | 0) >> 2] | 0) + $2_1 | 0;
        $0_1 = $5_1 - $0_1 | 0;
        HEAP32[(0 + 6320 | 0) >> 2] = $0_1;
        HEAP32[($6_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
        HEAP32[(($4_1 + $5_1 | 0) + 4 | 0) >> 2] = 40;
        HEAP32[(0 + 6336 | 0) >> 2] = HEAP32[(0 + 6796 | 0) >> 2] | 0;
        break label$62;
       }
       label$70 : {
        $8_1 = HEAP32[(0 + 6324 | 0) >> 2] | 0;
        if ($5_1 >>> 0 >= $8_1 >>> 0) {
         break label$70
        }
        HEAP32[(0 + 6324 | 0) >> 2] = $5_1;
        $8_1 = $5_1;
       }
       $6_1 = $5_1 + $2_1 | 0;
       $0_1 = 6756;
       label$71 : {
        label$72 : {
         label$73 : {
          label$74 : {
           label$75 : {
            label$76 : {
             label$77 : {
              label$78 : while (1) {
               if ((HEAP32[$0_1 >> 2] | 0 | 0) == ($6_1 | 0)) {
                break label$77
               }
               $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
               if ($0_1) {
                continue label$78
               }
               break label$76;
              };
             }
             if (!((HEAPU8[($0_1 + 12 | 0) >> 0] | 0) & 8 | 0)) {
              break label$75
             }
            }
            $0_1 = 6756;
            label$79 : while (1) {
             label$80 : {
              $6_1 = HEAP32[$0_1 >> 2] | 0;
              if ($6_1 >>> 0 > $4_1 >>> 0) {
               break label$80
              }
              $6_1 = $6_1 + (HEAP32[($0_1 + 4 | 0) >> 2] | 0) | 0;
              if ($6_1 >>> 0 > $4_1 >>> 0) {
               break label$74
              }
             }
             $0_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
             continue label$79;
            };
           }
           HEAP32[$0_1 >> 2] = $5_1;
           HEAP32[($0_1 + 4 | 0) >> 2] = (HEAP32[($0_1 + 4 | 0) >> 2] | 0) + $2_1 | 0;
           $11_1 = $5_1 + (($5_1 + 8 | 0) & 7 | 0 ? (-8 - $5_1 | 0) & 7 | 0 : 0) | 0;
           HEAP32[($11_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
           $5_1 = $6_1 + (($6_1 + 8 | 0) & 7 | 0 ? (-8 - $6_1 | 0) & 7 | 0 : 0) | 0;
           $0_1 = ($5_1 - $11_1 | 0) - $3_1 | 0;
           $6_1 = $11_1 + $3_1 | 0;
           label$81 : {
            if (($4_1 | 0) != ($5_1 | 0)) {
             break label$81
            }
            HEAP32[(0 + 6332 | 0) >> 2] = $6_1;
            $0_1 = (HEAP32[(0 + 6320 | 0) >> 2] | 0) + $0_1 | 0;
            HEAP32[(0 + 6320 | 0) >> 2] = $0_1;
            HEAP32[($6_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
            break label$72;
           }
           label$82 : {
            if ((HEAP32[(0 + 6328 | 0) >> 2] | 0 | 0) != ($5_1 | 0)) {
             break label$82
            }
            HEAP32[(0 + 6328 | 0) >> 2] = $6_1;
            $0_1 = (HEAP32[(0 + 6316 | 0) >> 2] | 0) + $0_1 | 0;
            HEAP32[(0 + 6316 | 0) >> 2] = $0_1;
            HEAP32[($6_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
            HEAP32[($6_1 + $0_1 | 0) >> 2] = $0_1;
            break label$72;
           }
           label$83 : {
            $4_1 = HEAP32[($5_1 + 4 | 0) >> 2] | 0;
            if (($4_1 & 3 | 0 | 0) != (1 | 0)) {
             break label$83
            }
            $7_1 = $4_1 & -8 | 0;
            label$84 : {
             label$85 : {
              if ($4_1 >>> 0 > 255 >>> 0) {
               break label$85
              }
              $3_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
              label$86 : {
               $2_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
               $9_1 = $4_1 >>> 3 | 0;
               $4_1 = ($9_1 << 3 | 0) + 6348 | 0;
               if (($2_1 | 0) == ($4_1 | 0)) {
                break label$86
               }
              }
              label$87 : {
               if (($3_1 | 0) != ($2_1 | 0)) {
                break label$87
               }
               HEAP32[(0 + 6308 | 0) >> 2] = (HEAP32[(0 + 6308 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $9_1 | 0) | 0) | 0;
               break label$84;
              }
              label$88 : {
               if (($3_1 | 0) == ($4_1 | 0)) {
                break label$88
               }
              }
              HEAP32[($2_1 + 12 | 0) >> 2] = $3_1;
              HEAP32[($3_1 + 8 | 0) >> 2] = $2_1;
              break label$84;
             }
             $9_1 = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
             label$89 : {
              label$90 : {
               $2_1 = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
               if (($2_1 | 0) == ($5_1 | 0)) {
                break label$90
               }
               label$91 : {
                $4_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
                if ($8_1 >>> 0 > $4_1 >>> 0) {
                 break label$91
                }
                HEAP32[($4_1 + 12 | 0) >> 2] | 0;
               }
               HEAP32[($4_1 + 12 | 0) >> 2] = $2_1;
               HEAP32[($2_1 + 8 | 0) >> 2] = $4_1;
               break label$89;
              }
              label$92 : {
               $4_1 = $5_1 + 20 | 0;
               $3_1 = HEAP32[$4_1 >> 2] | 0;
               if ($3_1) {
                break label$92
               }
               $4_1 = $5_1 + 16 | 0;
               $3_1 = HEAP32[$4_1 >> 2] | 0;
               if ($3_1) {
                break label$92
               }
               $2_1 = 0;
               break label$89;
              }
              label$93 : while (1) {
               $8_1 = $4_1;
               $2_1 = $3_1;
               $4_1 = $3_1 + 20 | 0;
               $3_1 = HEAP32[$4_1 >> 2] | 0;
               if ($3_1) {
                continue label$93
               }
               $4_1 = $2_1 + 16 | 0;
               $3_1 = HEAP32[($2_1 + 16 | 0) >> 2] | 0;
               if ($3_1) {
                continue label$93
               }
               break label$93;
              };
              HEAP32[$8_1 >> 2] = 0;
             }
             if (!$9_1) {
              break label$84
             }
             label$94 : {
              label$95 : {
               $3_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
               $4_1 = ($3_1 << 2 | 0) + 6612 | 0;
               if ((HEAP32[$4_1 >> 2] | 0 | 0) != ($5_1 | 0)) {
                break label$95
               }
               HEAP32[$4_1 >> 2] = $2_1;
               if ($2_1) {
                break label$94
               }
               HEAP32[(0 + 6312 | 0) >> 2] = (HEAP32[(0 + 6312 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $3_1 | 0) | 0) | 0;
               break label$84;
              }
              HEAP32[($9_1 + ((HEAP32[($9_1 + 16 | 0) >> 2] | 0 | 0) == ($5_1 | 0) ? 16 : 20) | 0) >> 2] = $2_1;
              if (!$2_1) {
               break label$84
              }
             }
             HEAP32[($2_1 + 24 | 0) >> 2] = $9_1;
             label$96 : {
              $4_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
              if (!$4_1) {
               break label$96
              }
              HEAP32[($2_1 + 16 | 0) >> 2] = $4_1;
              HEAP32[($4_1 + 24 | 0) >> 2] = $2_1;
             }
             $4_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
             if (!$4_1) {
              break label$84
             }
             HEAP32[($2_1 + 20 | 0) >> 2] = $4_1;
             HEAP32[($4_1 + 24 | 0) >> 2] = $2_1;
            }
            $0_1 = $7_1 + $0_1 | 0;
            $5_1 = $5_1 + $7_1 | 0;
           }
           HEAP32[($5_1 + 4 | 0) >> 2] = (HEAP32[($5_1 + 4 | 0) >> 2] | 0) & -2 | 0;
           HEAP32[($6_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
           HEAP32[($6_1 + $0_1 | 0) >> 2] = $0_1;
           label$97 : {
            if ($0_1 >>> 0 > 255 >>> 0) {
             break label$97
            }
            $4_1 = $0_1 >>> 3 | 0;
            $0_1 = ($4_1 << 3 | 0) + 6348 | 0;
            label$98 : {
             label$99 : {
              $3_1 = HEAP32[(0 + 6308 | 0) >> 2] | 0;
              $4_1 = 1 << $4_1 | 0;
              if ($3_1 & $4_1 | 0) {
               break label$99
              }
              HEAP32[(0 + 6308 | 0) >> 2] = $3_1 | $4_1 | 0;
              $4_1 = $0_1;
              break label$98;
             }
             $4_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
            }
            HEAP32[($0_1 + 8 | 0) >> 2] = $6_1;
            HEAP32[($4_1 + 12 | 0) >> 2] = $6_1;
            HEAP32[($6_1 + 12 | 0) >> 2] = $0_1;
            HEAP32[($6_1 + 8 | 0) >> 2] = $4_1;
            break label$72;
           }
           $4_1 = 0;
           label$100 : {
            $3_1 = $0_1 >>> 8 | 0;
            if (!$3_1) {
             break label$100
            }
            $4_1 = 31;
            if ($0_1 >>> 0 > 16777215 >>> 0) {
             break label$100
            }
            $4_1 = (($3_1 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
            $3_1 = $3_1 << $4_1 | 0;
            $1200 = $3_1;
            $3_1 = (($3_1 + 520192 | 0) >>> 16 | 0) & 4 | 0;
            $5_1 = $1200 << $3_1 | 0;
            $1207 = $5_1;
            $5_1 = (($5_1 + 245760 | 0) >>> 16 | 0) & 2 | 0;
            $4_1 = (($1207 << $5_1 | 0) >>> 15 | 0) - ($3_1 | $4_1 | 0 | $5_1 | 0) | 0;
            $4_1 = ($4_1 << 1 | 0 | (($0_1 >>> ($4_1 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
           }
           HEAP32[($6_1 + 28 | 0) >> 2] = $4_1;
           i64toi32_i32$1 = $6_1;
           i64toi32_i32$0 = 0;
           HEAP32[($6_1 + 16 | 0) >> 2] = 0;
           HEAP32[($6_1 + 20 | 0) >> 2] = i64toi32_i32$0;
           $3_1 = ($4_1 << 2 | 0) + 6612 | 0;
           label$101 : {
            label$102 : {
             $5_1 = HEAP32[(0 + 6312 | 0) >> 2] | 0;
             $8_1 = 1 << $4_1 | 0;
             if ($5_1 & $8_1 | 0) {
              break label$102
             }
             HEAP32[(0 + 6312 | 0) >> 2] = $5_1 | $8_1 | 0;
             HEAP32[$3_1 >> 2] = $6_1;
             HEAP32[($6_1 + 24 | 0) >> 2] = $3_1;
             break label$101;
            }
            $4_1 = $0_1 << (($4_1 | 0) == (31 | 0) ? 0 : 25 - ($4_1 >>> 1 | 0) | 0) | 0;
            $5_1 = HEAP32[$3_1 >> 2] | 0;
            label$103 : while (1) {
             $3_1 = $5_1;
             if (((HEAP32[($5_1 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($0_1 | 0)) {
              break label$73
             }
             $5_1 = $4_1 >>> 29 | 0;
             $4_1 = $4_1 << 1 | 0;
             $8_1 = ($3_1 + ($5_1 & 4 | 0) | 0) + 16 | 0;
             $5_1 = HEAP32[$8_1 >> 2] | 0;
             if ($5_1) {
              continue label$103
             }
             break label$103;
            };
            HEAP32[$8_1 >> 2] = $6_1;
            HEAP32[($6_1 + 24 | 0) >> 2] = $3_1;
           }
           HEAP32[($6_1 + 12 | 0) >> 2] = $6_1;
           HEAP32[($6_1 + 8 | 0) >> 2] = $6_1;
           break label$72;
          }
          $0_1 = $2_1 + -40 | 0;
          $8_1 = ($5_1 + 8 | 0) & 7 | 0 ? (-8 - $5_1 | 0) & 7 | 0 : 0;
          $11_1 = $0_1 - $8_1 | 0;
          HEAP32[(0 + 6320 | 0) >> 2] = $11_1;
          $8_1 = $5_1 + $8_1 | 0;
          HEAP32[(0 + 6332 | 0) >> 2] = $8_1;
          HEAP32[($8_1 + 4 | 0) >> 2] = $11_1 | 1 | 0;
          HEAP32[(($5_1 + $0_1 | 0) + 4 | 0) >> 2] = 40;
          HEAP32[(0 + 6336 | 0) >> 2] = HEAP32[(0 + 6796 | 0) >> 2] | 0;
          $0_1 = ($6_1 + (($6_1 + -39 | 0) & 7 | 0 ? (39 - $6_1 | 0) & 7 | 0 : 0) | 0) + -47 | 0;
          $8_1 = $0_1 >>> 0 < ($4_1 + 16 | 0) >>> 0 ? $4_1 : $0_1;
          HEAP32[($8_1 + 4 | 0) >> 2] = 27;
          i64toi32_i32$2 = 0;
          i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 6764 | 0) >> 2] | 0;
          i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 6768 | 0) >> 2] | 0;
          $1329 = i64toi32_i32$0;
          i64toi32_i32$0 = $8_1 + 16 | 0;
          HEAP32[i64toi32_i32$0 >> 2] = $1329;
          HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
          i64toi32_i32$2 = 0;
          i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 6756 | 0) >> 2] | 0;
          i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 6760 | 0) >> 2] | 0;
          $1331 = i64toi32_i32$1;
          i64toi32_i32$1 = $8_1;
          HEAP32[($8_1 + 8 | 0) >> 2] = $1331;
          HEAP32[($8_1 + 12 | 0) >> 2] = i64toi32_i32$0;
          HEAP32[(0 + 6764 | 0) >> 2] = $8_1 + 8 | 0;
          HEAP32[(0 + 6760 | 0) >> 2] = $2_1;
          HEAP32[(0 + 6756 | 0) >> 2] = $5_1;
          HEAP32[(0 + 6768 | 0) >> 2] = 0;
          $0_1 = $8_1 + 24 | 0;
          label$104 : while (1) {
           HEAP32[($0_1 + 4 | 0) >> 2] = 7;
           $5_1 = $0_1 + 8 | 0;
           $0_1 = $0_1 + 4 | 0;
           if ($6_1 >>> 0 > $5_1 >>> 0) {
            continue label$104
           }
           break label$104;
          };
          if (($8_1 | 0) == ($4_1 | 0)) {
           break label$62
          }
          HEAP32[($8_1 + 4 | 0) >> 2] = (HEAP32[($8_1 + 4 | 0) >> 2] | 0) & -2 | 0;
          $2_1 = $8_1 - $4_1 | 0;
          HEAP32[($4_1 + 4 | 0) >> 2] = $2_1 | 1 | 0;
          HEAP32[$8_1 >> 2] = $2_1;
          label$105 : {
           if ($2_1 >>> 0 > 255 >>> 0) {
            break label$105
           }
           $6_1 = $2_1 >>> 3 | 0;
           $0_1 = ($6_1 << 3 | 0) + 6348 | 0;
           label$106 : {
            label$107 : {
             $5_1 = HEAP32[(0 + 6308 | 0) >> 2] | 0;
             $6_1 = 1 << $6_1 | 0;
             if ($5_1 & $6_1 | 0) {
              break label$107
             }
             HEAP32[(0 + 6308 | 0) >> 2] = $5_1 | $6_1 | 0;
             $6_1 = $0_1;
             break label$106;
            }
            $6_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
           }
           HEAP32[($0_1 + 8 | 0) >> 2] = $4_1;
           HEAP32[($6_1 + 12 | 0) >> 2] = $4_1;
           HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
           HEAP32[($4_1 + 8 | 0) >> 2] = $6_1;
           break label$62;
          }
          $0_1 = 0;
          label$108 : {
           $6_1 = $2_1 >>> 8 | 0;
           if (!$6_1) {
            break label$108
           }
           $0_1 = 31;
           if ($2_1 >>> 0 > 16777215 >>> 0) {
            break label$108
           }
           $0_1 = (($6_1 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
           $6_1 = $6_1 << $0_1 | 0;
           $1401 = $6_1;
           $6_1 = (($6_1 + 520192 | 0) >>> 16 | 0) & 4 | 0;
           $5_1 = $1401 << $6_1 | 0;
           $1408 = $5_1;
           $5_1 = (($5_1 + 245760 | 0) >>> 16 | 0) & 2 | 0;
           $0_1 = (($1408 << $5_1 | 0) >>> 15 | 0) - ($6_1 | $0_1 | 0 | $5_1 | 0) | 0;
           $0_1 = ($0_1 << 1 | 0 | (($2_1 >>> ($0_1 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
          }
          i64toi32_i32$1 = $4_1;
          i64toi32_i32$0 = 0;
          HEAP32[($4_1 + 16 | 0) >> 2] = 0;
          HEAP32[($4_1 + 20 | 0) >> 2] = i64toi32_i32$0;
          HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
          $6_1 = ($0_1 << 2 | 0) + 6612 | 0;
          label$109 : {
           label$110 : {
            $5_1 = HEAP32[(0 + 6312 | 0) >> 2] | 0;
            $8_1 = 1 << $0_1 | 0;
            if ($5_1 & $8_1 | 0) {
             break label$110
            }
            HEAP32[(0 + 6312 | 0) >> 2] = $5_1 | $8_1 | 0;
            HEAP32[$6_1 >> 2] = $4_1;
            HEAP32[($4_1 + 24 | 0) >> 2] = $6_1;
            break label$109;
           }
           $0_1 = $2_1 << (($0_1 | 0) == (31 | 0) ? 0 : 25 - ($0_1 >>> 1 | 0) | 0) | 0;
           $5_1 = HEAP32[$6_1 >> 2] | 0;
           label$111 : while (1) {
            $6_1 = $5_1;
            if (((HEAP32[($5_1 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($2_1 | 0)) {
             break label$71
            }
            $5_1 = $0_1 >>> 29 | 0;
            $0_1 = $0_1 << 1 | 0;
            $8_1 = ($6_1 + ($5_1 & 4 | 0) | 0) + 16 | 0;
            $5_1 = HEAP32[$8_1 >> 2] | 0;
            if ($5_1) {
             continue label$111
            }
            break label$111;
           };
           HEAP32[$8_1 >> 2] = $4_1;
           HEAP32[($4_1 + 24 | 0) >> 2] = $6_1;
          }
          HEAP32[($4_1 + 12 | 0) >> 2] = $4_1;
          HEAP32[($4_1 + 8 | 0) >> 2] = $4_1;
          break label$62;
         }
         $0_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
         HEAP32[($0_1 + 12 | 0) >> 2] = $6_1;
         HEAP32[($3_1 + 8 | 0) >> 2] = $6_1;
         HEAP32[($6_1 + 24 | 0) >> 2] = 0;
         HEAP32[($6_1 + 12 | 0) >> 2] = $3_1;
         HEAP32[($6_1 + 8 | 0) >> 2] = $0_1;
        }
        $0_1 = $11_1 + 8 | 0;
        break label$3;
       }
       $0_1 = HEAP32[($6_1 + 8 | 0) >> 2] | 0;
       HEAP32[($0_1 + 12 | 0) >> 2] = $4_1;
       HEAP32[($6_1 + 8 | 0) >> 2] = $4_1;
       HEAP32[($4_1 + 24 | 0) >> 2] = 0;
       HEAP32[($4_1 + 12 | 0) >> 2] = $6_1;
       HEAP32[($4_1 + 8 | 0) >> 2] = $0_1;
      }
      $0_1 = HEAP32[(0 + 6320 | 0) >> 2] | 0;
      if ($0_1 >>> 0 <= $3_1 >>> 0) {
       break label$6
      }
      $4_1 = $0_1 - $3_1 | 0;
      HEAP32[(0 + 6320 | 0) >> 2] = $4_1;
      $0_1 = HEAP32[(0 + 6332 | 0) >> 2] | 0;
      $6_1 = $0_1 + $3_1 | 0;
      HEAP32[(0 + 6332 | 0) >> 2] = $6_1;
      HEAP32[($6_1 + 4 | 0) >> 2] = $4_1 | 1 | 0;
      HEAP32[($0_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
      $0_1 = $0_1 + 8 | 0;
      break label$3;
     }
     HEAP32[($777() | 0) >> 2] = 48;
     $0_1 = 0;
     break label$3;
    }
    label$112 : {
     if (!$11_1) {
      break label$112
     }
     label$113 : {
      label$114 : {
       $4_1 = HEAP32[($8_1 + 28 | 0) >> 2] | 0;
       $0_1 = ($4_1 << 2 | 0) + 6612 | 0;
       if (($8_1 | 0) != (HEAP32[$0_1 >> 2] | 0 | 0)) {
        break label$114
       }
       HEAP32[$0_1 >> 2] = $5_1;
       if ($5_1) {
        break label$113
       }
       $7_1 = $7_1 & (__wasm_rotl_i32(-2 | 0, $4_1 | 0) | 0) | 0;
       HEAP32[(0 + 6312 | 0) >> 2] = $7_1;
       break label$112;
      }
      HEAP32[($11_1 + ((HEAP32[($11_1 + 16 | 0) >> 2] | 0 | 0) == ($8_1 | 0) ? 16 : 20) | 0) >> 2] = $5_1;
      if (!$5_1) {
       break label$112
      }
     }
     HEAP32[($5_1 + 24 | 0) >> 2] = $11_1;
     label$115 : {
      $0_1 = HEAP32[($8_1 + 16 | 0) >> 2] | 0;
      if (!$0_1) {
       break label$115
      }
      HEAP32[($5_1 + 16 | 0) >> 2] = $0_1;
      HEAP32[($0_1 + 24 | 0) >> 2] = $5_1;
     }
     $0_1 = HEAP32[($8_1 + 20 | 0) >> 2] | 0;
     if (!$0_1) {
      break label$112
     }
     HEAP32[($5_1 + 20 | 0) >> 2] = $0_1;
     HEAP32[($0_1 + 24 | 0) >> 2] = $5_1;
    }
    label$116 : {
     label$117 : {
      if ($6_1 >>> 0 > 15 >>> 0) {
       break label$117
      }
      $0_1 = $6_1 + $3_1 | 0;
      HEAP32[($8_1 + 4 | 0) >> 2] = $0_1 | 3 | 0;
      $0_1 = $8_1 + $0_1 | 0;
      HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($0_1 + 4 | 0) >> 2] | 0 | 1 | 0;
      break label$116;
     }
     HEAP32[($8_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
     $5_1 = $8_1 + $3_1 | 0;
     HEAP32[($5_1 + 4 | 0) >> 2] = $6_1 | 1 | 0;
     HEAP32[($5_1 + $6_1 | 0) >> 2] = $6_1;
     label$118 : {
      if ($6_1 >>> 0 > 255 >>> 0) {
       break label$118
      }
      $4_1 = $6_1 >>> 3 | 0;
      $0_1 = ($4_1 << 3 | 0) + 6348 | 0;
      label$119 : {
       label$120 : {
        $6_1 = HEAP32[(0 + 6308 | 0) >> 2] | 0;
        $4_1 = 1 << $4_1 | 0;
        if ($6_1 & $4_1 | 0) {
         break label$120
        }
        HEAP32[(0 + 6308 | 0) >> 2] = $6_1 | $4_1 | 0;
        $4_1 = $0_1;
        break label$119;
       }
       $4_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
      }
      HEAP32[($0_1 + 8 | 0) >> 2] = $5_1;
      HEAP32[($4_1 + 12 | 0) >> 2] = $5_1;
      HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
      HEAP32[($5_1 + 8 | 0) >> 2] = $4_1;
      break label$116;
     }
     label$121 : {
      label$122 : {
       $4_1 = $6_1 >>> 8 | 0;
       if ($4_1) {
        break label$122
       }
       $0_1 = 0;
       break label$121;
      }
      $0_1 = 31;
      if ($6_1 >>> 0 > 16777215 >>> 0) {
       break label$121
      }
      $0_1 = (($4_1 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
      $4_1 = $4_1 << $0_1 | 0;
      $1652 = $4_1;
      $4_1 = (($4_1 + 520192 | 0) >>> 16 | 0) & 4 | 0;
      $3_1 = $1652 << $4_1 | 0;
      $1659 = $3_1;
      $3_1 = (($3_1 + 245760 | 0) >>> 16 | 0) & 2 | 0;
      $0_1 = (($1659 << $3_1 | 0) >>> 15 | 0) - ($4_1 | $0_1 | 0 | $3_1 | 0) | 0;
      $0_1 = ($0_1 << 1 | 0 | (($6_1 >>> ($0_1 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
     }
     HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
     i64toi32_i32$1 = $5_1;
     i64toi32_i32$0 = 0;
     HEAP32[($5_1 + 16 | 0) >> 2] = 0;
     HEAP32[($5_1 + 20 | 0) >> 2] = i64toi32_i32$0;
     $4_1 = ($0_1 << 2 | 0) + 6612 | 0;
     label$123 : {
      label$124 : {
       label$125 : {
        $3_1 = 1 << $0_1 | 0;
        if ($7_1 & $3_1 | 0) {
         break label$125
        }
        HEAP32[(0 + 6312 | 0) >> 2] = $7_1 | $3_1 | 0;
        HEAP32[$4_1 >> 2] = $5_1;
        HEAP32[($5_1 + 24 | 0) >> 2] = $4_1;
        break label$124;
       }
       $0_1 = $6_1 << (($0_1 | 0) == (31 | 0) ? 0 : 25 - ($0_1 >>> 1 | 0) | 0) | 0;
       $3_1 = HEAP32[$4_1 >> 2] | 0;
       label$126 : while (1) {
        $4_1 = $3_1;
        if (((HEAP32[($4_1 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($6_1 | 0)) {
         break label$123
        }
        $3_1 = $0_1 >>> 29 | 0;
        $0_1 = $0_1 << 1 | 0;
        $2_1 = ($4_1 + ($3_1 & 4 | 0) | 0) + 16 | 0;
        $3_1 = HEAP32[$2_1 >> 2] | 0;
        if ($3_1) {
         continue label$126
        }
        break label$126;
       };
       HEAP32[$2_1 >> 2] = $5_1;
       HEAP32[($5_1 + 24 | 0) >> 2] = $4_1;
      }
      HEAP32[($5_1 + 12 | 0) >> 2] = $5_1;
      HEAP32[($5_1 + 8 | 0) >> 2] = $5_1;
      break label$116;
     }
     $0_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
     HEAP32[($0_1 + 12 | 0) >> 2] = $5_1;
     HEAP32[($4_1 + 8 | 0) >> 2] = $5_1;
     HEAP32[($5_1 + 24 | 0) >> 2] = 0;
     HEAP32[($5_1 + 12 | 0) >> 2] = $4_1;
     HEAP32[($5_1 + 8 | 0) >> 2] = $0_1;
    }
    $0_1 = $8_1 + 8 | 0;
    break label$3;
   }
   label$127 : {
    if (!$10_1) {
     break label$127
    }
    label$128 : {
     label$129 : {
      $6_1 = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
      $0_1 = ($6_1 << 2 | 0) + 6612 | 0;
      if (($5_1 | 0) != (HEAP32[$0_1 >> 2] | 0 | 0)) {
       break label$129
      }
      HEAP32[$0_1 >> 2] = $8_1;
      if ($8_1) {
       break label$128
      }
      HEAP32[(0 + 6312 | 0) >> 2] = $9_1 & (__wasm_rotl_i32(-2 | 0, $6_1 | 0) | 0) | 0;
      break label$127;
     }
     HEAP32[($10_1 + ((HEAP32[($10_1 + 16 | 0) >> 2] | 0 | 0) == ($5_1 | 0) ? 16 : 20) | 0) >> 2] = $8_1;
     if (!$8_1) {
      break label$127
     }
    }
    HEAP32[($8_1 + 24 | 0) >> 2] = $10_1;
    label$130 : {
     $0_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
     if (!$0_1) {
      break label$130
     }
     HEAP32[($8_1 + 16 | 0) >> 2] = $0_1;
     HEAP32[($0_1 + 24 | 0) >> 2] = $8_1;
    }
    $0_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
    if (!$0_1) {
     break label$127
    }
    HEAP32[($8_1 + 20 | 0) >> 2] = $0_1;
    HEAP32[($0_1 + 24 | 0) >> 2] = $8_1;
   }
   label$131 : {
    label$132 : {
     if ($4_1 >>> 0 > 15 >>> 0) {
      break label$132
     }
     $0_1 = $4_1 + $3_1 | 0;
     HEAP32[($5_1 + 4 | 0) >> 2] = $0_1 | 3 | 0;
     $0_1 = $5_1 + $0_1 | 0;
     HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($0_1 + 4 | 0) >> 2] | 0 | 1 | 0;
     break label$131;
    }
    HEAP32[($5_1 + 4 | 0) >> 2] = $3_1 | 3 | 0;
    $6_1 = $5_1 + $3_1 | 0;
    HEAP32[($6_1 + 4 | 0) >> 2] = $4_1 | 1 | 0;
    HEAP32[($6_1 + $4_1 | 0) >> 2] = $4_1;
    label$133 : {
     if (!$7_1) {
      break label$133
     }
     $8_1 = $7_1 >>> 3 | 0;
     $3_1 = ($8_1 << 3 | 0) + 6348 | 0;
     $0_1 = HEAP32[(0 + 6328 | 0) >> 2] | 0;
     label$134 : {
      label$135 : {
       $8_1 = 1 << $8_1 | 0;
       if ($8_1 & $2_1 | 0) {
        break label$135
       }
       HEAP32[(0 + 6308 | 0) >> 2] = $8_1 | $2_1 | 0;
       $8_1 = $3_1;
       break label$134;
      }
      $8_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
     }
     HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
     HEAP32[($8_1 + 12 | 0) >> 2] = $0_1;
     HEAP32[($0_1 + 12 | 0) >> 2] = $3_1;
     HEAP32[($0_1 + 8 | 0) >> 2] = $8_1;
    }
    HEAP32[(0 + 6328 | 0) >> 2] = $6_1;
    HEAP32[(0 + 6316 | 0) >> 2] = $4_1;
   }
   $0_1 = $5_1 + 8 | 0;
  }
  label$136 : {
   $13_1 = $1_1 + 16 | 0;
   if ($13_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $13_1;
  }
  return $0_1 | 0;
 }
 
 function $1041($0_1) {
  $0_1 = $0_1 | 0;
  var $2_1 = 0, $5_1 = 0, $1_1 = 0, $4_1 = 0, $3_1 = 0, $7_1 = 0, $6_1 = 0, $408_1 = 0, $415_1 = 0;
  label$1 : {
   if (!$0_1) {
    break label$1
   }
   $1_1 = $0_1 + -8 | 0;
   $2_1 = HEAP32[($0_1 + -4 | 0) >> 2] | 0;
   $0_1 = $2_1 & -8 | 0;
   $3_1 = $1_1 + $0_1 | 0;
   label$2 : {
    if ($2_1 & 1 | 0) {
     break label$2
    }
    if (!($2_1 & 3 | 0)) {
     break label$1
    }
    $2_1 = HEAP32[$1_1 >> 2] | 0;
    $1_1 = $1_1 - $2_1 | 0;
    $4_1 = HEAP32[(0 + 6324 | 0) >> 2] | 0;
    if ($1_1 >>> 0 < $4_1 >>> 0) {
     break label$1
    }
    $0_1 = $2_1 + $0_1 | 0;
    label$3 : {
     if ((HEAP32[(0 + 6328 | 0) >> 2] | 0 | 0) == ($1_1 | 0)) {
      break label$3
     }
     label$4 : {
      if ($2_1 >>> 0 > 255 >>> 0) {
       break label$4
      }
      $5_1 = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
      label$5 : {
       $6_1 = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
       $7_1 = $2_1 >>> 3 | 0;
       $2_1 = ($7_1 << 3 | 0) + 6348 | 0;
       if (($6_1 | 0) == ($2_1 | 0)) {
        break label$5
       }
      }
      label$6 : {
       if (($5_1 | 0) != ($6_1 | 0)) {
        break label$6
       }
       HEAP32[(0 + 6308 | 0) >> 2] = (HEAP32[(0 + 6308 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $7_1 | 0) | 0) | 0;
       break label$2;
      }
      label$7 : {
       if (($5_1 | 0) == ($2_1 | 0)) {
        break label$7
       }
      }
      HEAP32[($6_1 + 12 | 0) >> 2] = $5_1;
      HEAP32[($5_1 + 8 | 0) >> 2] = $6_1;
      break label$2;
     }
     $7_1 = HEAP32[($1_1 + 24 | 0) >> 2] | 0;
     label$8 : {
      label$9 : {
       $5_1 = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
       if (($5_1 | 0) == ($1_1 | 0)) {
        break label$9
       }
       label$10 : {
        $2_1 = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
        if ($4_1 >>> 0 > $2_1 >>> 0) {
         break label$10
        }
        HEAP32[($2_1 + 12 | 0) >> 2] | 0;
       }
       HEAP32[($2_1 + 12 | 0) >> 2] = $5_1;
       HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
       break label$8;
      }
      label$11 : {
       $2_1 = $1_1 + 20 | 0;
       $4_1 = HEAP32[$2_1 >> 2] | 0;
       if ($4_1) {
        break label$11
       }
       $2_1 = $1_1 + 16 | 0;
       $4_1 = HEAP32[$2_1 >> 2] | 0;
       if ($4_1) {
        break label$11
       }
       $5_1 = 0;
       break label$8;
      }
      label$12 : while (1) {
       $6_1 = $2_1;
       $5_1 = $4_1;
       $2_1 = $5_1 + 20 | 0;
       $4_1 = HEAP32[$2_1 >> 2] | 0;
       if ($4_1) {
        continue label$12
       }
       $2_1 = $5_1 + 16 | 0;
       $4_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
       if ($4_1) {
        continue label$12
       }
       break label$12;
      };
      HEAP32[$6_1 >> 2] = 0;
     }
     if (!$7_1) {
      break label$2
     }
     label$13 : {
      label$14 : {
       $4_1 = HEAP32[($1_1 + 28 | 0) >> 2] | 0;
       $2_1 = ($4_1 << 2 | 0) + 6612 | 0;
       if ((HEAP32[$2_1 >> 2] | 0 | 0) != ($1_1 | 0)) {
        break label$14
       }
       HEAP32[$2_1 >> 2] = $5_1;
       if ($5_1) {
        break label$13
       }
       HEAP32[(0 + 6312 | 0) >> 2] = (HEAP32[(0 + 6312 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4_1 | 0) | 0) | 0;
       break label$2;
      }
      HEAP32[($7_1 + ((HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) == ($1_1 | 0) ? 16 : 20) | 0) >> 2] = $5_1;
      if (!$5_1) {
       break label$2
      }
     }
     HEAP32[($5_1 + 24 | 0) >> 2] = $7_1;
     label$15 : {
      $2_1 = HEAP32[($1_1 + 16 | 0) >> 2] | 0;
      if (!$2_1) {
       break label$15
      }
      HEAP32[($5_1 + 16 | 0) >> 2] = $2_1;
      HEAP32[($2_1 + 24 | 0) >> 2] = $5_1;
     }
     $2_1 = HEAP32[($1_1 + 20 | 0) >> 2] | 0;
     if (!$2_1) {
      break label$2
     }
     HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
     HEAP32[($2_1 + 24 | 0) >> 2] = $5_1;
     break label$2;
    }
    $2_1 = HEAP32[($3_1 + 4 | 0) >> 2] | 0;
    if (($2_1 & 3 | 0 | 0) != (3 | 0)) {
     break label$2
    }
    HEAP32[(0 + 6316 | 0) >> 2] = $0_1;
    HEAP32[($3_1 + 4 | 0) >> 2] = $2_1 & -2 | 0;
    HEAP32[($1_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
    HEAP32[($1_1 + $0_1 | 0) >> 2] = $0_1;
    return;
   }
   if ($3_1 >>> 0 <= $1_1 >>> 0) {
    break label$1
   }
   $2_1 = HEAP32[($3_1 + 4 | 0) >> 2] | 0;
   if (!($2_1 & 1 | 0)) {
    break label$1
   }
   label$16 : {
    label$17 : {
     if ($2_1 & 2 | 0) {
      break label$17
     }
     label$18 : {
      if ((HEAP32[(0 + 6332 | 0) >> 2] | 0 | 0) != ($3_1 | 0)) {
       break label$18
      }
      HEAP32[(0 + 6332 | 0) >> 2] = $1_1;
      $0_1 = (HEAP32[(0 + 6320 | 0) >> 2] | 0) + $0_1 | 0;
      HEAP32[(0 + 6320 | 0) >> 2] = $0_1;
      HEAP32[($1_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
      if (($1_1 | 0) != (HEAP32[(0 + 6328 | 0) >> 2] | 0 | 0)) {
       break label$1
      }
      HEAP32[(0 + 6316 | 0) >> 2] = 0;
      HEAP32[(0 + 6328 | 0) >> 2] = 0;
      return;
     }
     label$19 : {
      if ((HEAP32[(0 + 6328 | 0) >> 2] | 0 | 0) != ($3_1 | 0)) {
       break label$19
      }
      HEAP32[(0 + 6328 | 0) >> 2] = $1_1;
      $0_1 = (HEAP32[(0 + 6316 | 0) >> 2] | 0) + $0_1 | 0;
      HEAP32[(0 + 6316 | 0) >> 2] = $0_1;
      HEAP32[($1_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
      HEAP32[($1_1 + $0_1 | 0) >> 2] = $0_1;
      return;
     }
     $0_1 = ($2_1 & -8 | 0) + $0_1 | 0;
     label$20 : {
      label$21 : {
       if ($2_1 >>> 0 > 255 >>> 0) {
        break label$21
       }
       $4_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
       label$22 : {
        $5_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
        $3_1 = $2_1 >>> 3 | 0;
        $2_1 = ($3_1 << 3 | 0) + 6348 | 0;
        if (($5_1 | 0) == ($2_1 | 0)) {
         break label$22
        }
        HEAP32[(0 + 6324 | 0) >> 2] | 0;
       }
       label$23 : {
        if (($4_1 | 0) != ($5_1 | 0)) {
         break label$23
        }
        HEAP32[(0 + 6308 | 0) >> 2] = (HEAP32[(0 + 6308 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $3_1 | 0) | 0) | 0;
        break label$20;
       }
       label$24 : {
        if (($4_1 | 0) == ($2_1 | 0)) {
         break label$24
        }
        HEAP32[(0 + 6324 | 0) >> 2] | 0;
       }
       HEAP32[($5_1 + 12 | 0) >> 2] = $4_1;
       HEAP32[($4_1 + 8 | 0) >> 2] = $5_1;
       break label$20;
      }
      $7_1 = HEAP32[($3_1 + 24 | 0) >> 2] | 0;
      label$25 : {
       label$26 : {
        $5_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
        if (($5_1 | 0) == ($3_1 | 0)) {
         break label$26
        }
        label$27 : {
         $2_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
         if ((HEAP32[(0 + 6324 | 0) >> 2] | 0) >>> 0 > $2_1 >>> 0) {
          break label$27
         }
         HEAP32[($2_1 + 12 | 0) >> 2] | 0;
        }
        HEAP32[($2_1 + 12 | 0) >> 2] = $5_1;
        HEAP32[($5_1 + 8 | 0) >> 2] = $2_1;
        break label$25;
       }
       label$28 : {
        $2_1 = $3_1 + 20 | 0;
        $4_1 = HEAP32[$2_1 >> 2] | 0;
        if ($4_1) {
         break label$28
        }
        $2_1 = $3_1 + 16 | 0;
        $4_1 = HEAP32[$2_1 >> 2] | 0;
        if ($4_1) {
         break label$28
        }
        $5_1 = 0;
        break label$25;
       }
       label$29 : while (1) {
        $6_1 = $2_1;
        $5_1 = $4_1;
        $2_1 = $5_1 + 20 | 0;
        $4_1 = HEAP32[$2_1 >> 2] | 0;
        if ($4_1) {
         continue label$29
        }
        $2_1 = $5_1 + 16 | 0;
        $4_1 = HEAP32[($5_1 + 16 | 0) >> 2] | 0;
        if ($4_1) {
         continue label$29
        }
        break label$29;
       };
       HEAP32[$6_1 >> 2] = 0;
      }
      if (!$7_1) {
       break label$20
      }
      label$30 : {
       label$31 : {
        $4_1 = HEAP32[($3_1 + 28 | 0) >> 2] | 0;
        $2_1 = ($4_1 << 2 | 0) + 6612 | 0;
        if ((HEAP32[$2_1 >> 2] | 0 | 0) != ($3_1 | 0)) {
         break label$31
        }
        HEAP32[$2_1 >> 2] = $5_1;
        if ($5_1) {
         break label$30
        }
        HEAP32[(0 + 6312 | 0) >> 2] = (HEAP32[(0 + 6312 | 0) >> 2] | 0) & (__wasm_rotl_i32(-2 | 0, $4_1 | 0) | 0) | 0;
        break label$20;
       }
       HEAP32[($7_1 + ((HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) == ($3_1 | 0) ? 16 : 20) | 0) >> 2] = $5_1;
       if (!$5_1) {
        break label$20
       }
      }
      HEAP32[($5_1 + 24 | 0) >> 2] = $7_1;
      label$32 : {
       $2_1 = HEAP32[($3_1 + 16 | 0) >> 2] | 0;
       if (!$2_1) {
        break label$32
       }
       HEAP32[($5_1 + 16 | 0) >> 2] = $2_1;
       HEAP32[($2_1 + 24 | 0) >> 2] = $5_1;
      }
      $2_1 = HEAP32[($3_1 + 20 | 0) >> 2] | 0;
      if (!$2_1) {
       break label$20
      }
      HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
      HEAP32[($2_1 + 24 | 0) >> 2] = $5_1;
     }
     HEAP32[($1_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
     HEAP32[($1_1 + $0_1 | 0) >> 2] = $0_1;
     if (($1_1 | 0) != (HEAP32[(0 + 6328 | 0) >> 2] | 0 | 0)) {
      break label$16
     }
     HEAP32[(0 + 6316 | 0) >> 2] = $0_1;
     return;
    }
    HEAP32[($3_1 + 4 | 0) >> 2] = $2_1 & -2 | 0;
    HEAP32[($1_1 + 4 | 0) >> 2] = $0_1 | 1 | 0;
    HEAP32[($1_1 + $0_1 | 0) >> 2] = $0_1;
   }
   label$33 : {
    if ($0_1 >>> 0 > 255 >>> 0) {
     break label$33
    }
    $2_1 = $0_1 >>> 3 | 0;
    $0_1 = ($2_1 << 3 | 0) + 6348 | 0;
    label$34 : {
     label$35 : {
      $4_1 = HEAP32[(0 + 6308 | 0) >> 2] | 0;
      $2_1 = 1 << $2_1 | 0;
      if ($4_1 & $2_1 | 0) {
       break label$35
      }
      HEAP32[(0 + 6308 | 0) >> 2] = $4_1 | $2_1 | 0;
      $2_1 = $0_1;
      break label$34;
     }
     $2_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
    }
    HEAP32[($0_1 + 8 | 0) >> 2] = $1_1;
    HEAP32[($2_1 + 12 | 0) >> 2] = $1_1;
    HEAP32[($1_1 + 12 | 0) >> 2] = $0_1;
    HEAP32[($1_1 + 8 | 0) >> 2] = $2_1;
    return;
   }
   $2_1 = 0;
   label$36 : {
    $4_1 = $0_1 >>> 8 | 0;
    if (!$4_1) {
     break label$36
    }
    $2_1 = 31;
    if ($0_1 >>> 0 > 16777215 >>> 0) {
     break label$36
    }
    $2_1 = (($4_1 + 1048320 | 0) >>> 16 | 0) & 8 | 0;
    $4_1 = $4_1 << $2_1 | 0;
    $408_1 = $4_1;
    $4_1 = (($4_1 + 520192 | 0) >>> 16 | 0) & 4 | 0;
    $5_1 = $408_1 << $4_1 | 0;
    $415_1 = $5_1;
    $5_1 = (($5_1 + 245760 | 0) >>> 16 | 0) & 2 | 0;
    $2_1 = (($415_1 << $5_1 | 0) >>> 15 | 0) - ($4_1 | $2_1 | 0 | $5_1 | 0) | 0;
    $2_1 = ($2_1 << 1 | 0 | (($0_1 >>> ($2_1 + 21 | 0) | 0) & 1 | 0) | 0) + 28 | 0;
   }
   HEAP32[($1_1 + 16 | 0) >> 2] = 0;
   HEAP32[($1_1 + 20 | 0) >> 2] = 0;
   HEAP32[($1_1 + 28 | 0) >> 2] = $2_1;
   $4_1 = ($2_1 << 2 | 0) + 6612 | 0;
   label$37 : {
    label$38 : {
     label$39 : {
      label$40 : {
       $5_1 = HEAP32[(0 + 6312 | 0) >> 2] | 0;
       $3_1 = 1 << $2_1 | 0;
       if ($5_1 & $3_1 | 0) {
        break label$40
       }
       HEAP32[(0 + 6312 | 0) >> 2] = $5_1 | $3_1 | 0;
       HEAP32[$4_1 >> 2] = $1_1;
       HEAP32[($1_1 + 24 | 0) >> 2] = $4_1;
       break label$39;
      }
      $2_1 = $0_1 << (($2_1 | 0) == (31 | 0) ? 0 : 25 - ($2_1 >>> 1 | 0) | 0) | 0;
      $5_1 = HEAP32[$4_1 >> 2] | 0;
      label$41 : while (1) {
       $4_1 = $5_1;
       if (((HEAP32[($5_1 + 4 | 0) >> 2] | 0) & -8 | 0 | 0) == ($0_1 | 0)) {
        break label$38
       }
       $5_1 = $2_1 >>> 29 | 0;
       $2_1 = $2_1 << 1 | 0;
       $3_1 = ($4_1 + ($5_1 & 4 | 0) | 0) + 16 | 0;
       $5_1 = HEAP32[$3_1 >> 2] | 0;
       if ($5_1) {
        continue label$41
       }
       break label$41;
      };
      HEAP32[$3_1 >> 2] = $1_1;
      HEAP32[($1_1 + 24 | 0) >> 2] = $4_1;
     }
     HEAP32[($1_1 + 12 | 0) >> 2] = $1_1;
     HEAP32[($1_1 + 8 | 0) >> 2] = $1_1;
     break label$37;
    }
    $0_1 = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
    HEAP32[($0_1 + 12 | 0) >> 2] = $1_1;
    HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
    HEAP32[($1_1 + 24 | 0) >> 2] = 0;
    HEAP32[($1_1 + 12 | 0) >> 2] = $4_1;
    HEAP32[($1_1 + 8 | 0) >> 2] = $0_1;
   }
   $1_1 = (HEAP32[(0 + 6340 | 0) >> 2] | 0) + -1 | 0;
   HEAP32[(0 + 6340 | 0) >> 2] = $1_1;
   if ($1_1) {
    break label$1
   }
   $1_1 = 6764;
   label$42 : while (1) {
    $0_1 = HEAP32[$1_1 >> 2] | 0;
    $1_1 = $0_1 + 8 | 0;
    if ($0_1) {
     continue label$42
    }
    break label$42;
   };
   HEAP32[(0 + 6340 | 0) >> 2] = -1;
  }
 }
 
 function $1042($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0;
  label$1 : {
   $1_1 = $0() | 0;
   $2_1 = HEAP32[$1_1 >> 2] | 0;
   $0_1 = $2_1 + (($0_1 + 3 | 0) & -4 | 0) | 0;
   if (($0_1 | 0) > (-1 | 0)) {
    break label$1
   }
   HEAP32[($777() | 0) >> 2] = 48;
   return -1 | 0;
  }
  label$2 : {
   if ($0_1 >>> 0 <= (__wasm_memory_size() << 16 | 0) >>> 0) {
    break label$2
   }
   if (fimport$27($0_1 | 0) | 0) {
    break label$2
   }
   HEAP32[($777() | 0) >> 2] = 48;
   return -1 | 0;
  }
  HEAP32[$1_1 >> 2] = $0_1;
  return $2_1 | 0;
 }
 
 function $1043($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0;
  label$1 : {
   if ($2_1 >>> 0 < 8192 >>> 0) {
    break label$1
   }
   fimport$28($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0;
   return $0_1 | 0;
  }
  $3_1 = $0_1 + $2_1 | 0;
  label$2 : {
   label$3 : {
    if (($1_1 ^ $0_1 | 0) & 3 | 0) {
     break label$3
    }
    label$4 : {
     label$5 : {
      if (($2_1 | 0) >= (1 | 0)) {
       break label$5
      }
      $2_1 = $0_1;
      break label$4;
     }
     label$6 : {
      if ($0_1 & 3 | 0) {
       break label$6
      }
      $2_1 = $0_1;
      break label$4;
     }
     $2_1 = $0_1;
     label$7 : while (1) {
      HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
      $1_1 = $1_1 + 1 | 0;
      $2_1 = $2_1 + 1 | 0;
      if ($2_1 >>> 0 >= $3_1 >>> 0) {
       break label$4
      }
      if ($2_1 & 3 | 0) {
       continue label$7
      }
      break label$7;
     };
    }
    label$8 : {
     $4_1 = $3_1 & -4 | 0;
     if ($4_1 >>> 0 < 64 >>> 0) {
      break label$8
     }
     $5_1 = $4_1 + -64 | 0;
     if ($2_1 >>> 0 > $5_1 >>> 0) {
      break label$8
     }
     label$9 : while (1) {
      HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
      HEAP32[($2_1 + 4 | 0) >> 2] = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
      HEAP32[($2_1 + 8 | 0) >> 2] = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
      HEAP32[($2_1 + 12 | 0) >> 2] = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
      HEAP32[($2_1 + 16 | 0) >> 2] = HEAP32[($1_1 + 16 | 0) >> 2] | 0;
      HEAP32[($2_1 + 20 | 0) >> 2] = HEAP32[($1_1 + 20 | 0) >> 2] | 0;
      HEAP32[($2_1 + 24 | 0) >> 2] = HEAP32[($1_1 + 24 | 0) >> 2] | 0;
      HEAP32[($2_1 + 28 | 0) >> 2] = HEAP32[($1_1 + 28 | 0) >> 2] | 0;
      HEAP32[($2_1 + 32 | 0) >> 2] = HEAP32[($1_1 + 32 | 0) >> 2] | 0;
      HEAP32[($2_1 + 36 | 0) >> 2] = HEAP32[($1_1 + 36 | 0) >> 2] | 0;
      HEAP32[($2_1 + 40 | 0) >> 2] = HEAP32[($1_1 + 40 | 0) >> 2] | 0;
      HEAP32[($2_1 + 44 | 0) >> 2] = HEAP32[($1_1 + 44 | 0) >> 2] | 0;
      HEAP32[($2_1 + 48 | 0) >> 2] = HEAP32[($1_1 + 48 | 0) >> 2] | 0;
      HEAP32[($2_1 + 52 | 0) >> 2] = HEAP32[($1_1 + 52 | 0) >> 2] | 0;
      HEAP32[($2_1 + 56 | 0) >> 2] = HEAP32[($1_1 + 56 | 0) >> 2] | 0;
      HEAP32[($2_1 + 60 | 0) >> 2] = HEAP32[($1_1 + 60 | 0) >> 2] | 0;
      $1_1 = $1_1 + 64 | 0;
      $2_1 = $2_1 + 64 | 0;
      if ($2_1 >>> 0 <= $5_1 >>> 0) {
       continue label$9
      }
      break label$9;
     };
    }
    if ($2_1 >>> 0 >= $4_1 >>> 0) {
     break label$2
    }
    label$10 : while (1) {
     HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
     $1_1 = $1_1 + 4 | 0;
     $2_1 = $2_1 + 4 | 0;
     if ($2_1 >>> 0 < $4_1 >>> 0) {
      continue label$10
     }
     break label$2;
    };
   }
   label$11 : {
    if ($3_1 >>> 0 >= 4 >>> 0) {
     break label$11
    }
    $2_1 = $0_1;
    break label$2;
   }
   label$12 : {
    $4_1 = $3_1 + -4 | 0;
    if ($4_1 >>> 0 >= $0_1 >>> 0) {
     break label$12
    }
    $2_1 = $0_1;
    break label$2;
   }
   $2_1 = $0_1;
   label$13 : while (1) {
    HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    HEAP8[($2_1 + 1 | 0) >> 0] = HEAPU8[($1_1 + 1 | 0) >> 0] | 0;
    HEAP8[($2_1 + 2 | 0) >> 0] = HEAPU8[($1_1 + 2 | 0) >> 0] | 0;
    HEAP8[($2_1 + 3 | 0) >> 0] = HEAPU8[($1_1 + 3 | 0) >> 0] | 0;
    $1_1 = $1_1 + 4 | 0;
    $2_1 = $2_1 + 4 | 0;
    if ($2_1 >>> 0 <= $4_1 >>> 0) {
     continue label$13
    }
    break label$13;
   };
  }
  label$14 : {
   if ($2_1 >>> 0 >= $3_1 >>> 0) {
    break label$14
   }
   label$15 : while (1) {
    HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    $1_1 = $1_1 + 1 | 0;
    $2_1 = $2_1 + 1 | 0;
    if (($2_1 | 0) != ($3_1 | 0)) {
     continue label$15
    }
    break label$15;
   };
  }
  return $0_1 | 0;
 }
 
 function $1044($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, $4_1 = 0, $6_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, $6$hi = 0, i64toi32_i32$3 = 0, $5_1 = 0, $14_1 = 0, $104$hi = 0;
  label$1 : {
   if (!$2_1) {
    break label$1
   }
   $3_1 = $2_1 + $0_1 | 0;
   HEAP8[($3_1 + -1 | 0) >> 0] = $1_1;
   HEAP8[$0_1 >> 0] = $1_1;
   if ($2_1 >>> 0 < 3 >>> 0) {
    break label$1
   }
   HEAP8[($3_1 + -2 | 0) >> 0] = $1_1;
   HEAP8[($0_1 + 1 | 0) >> 0] = $1_1;
   HEAP8[($3_1 + -3 | 0) >> 0] = $1_1;
   HEAP8[($0_1 + 2 | 0) >> 0] = $1_1;
   if ($2_1 >>> 0 < 7 >>> 0) {
    break label$1
   }
   HEAP8[($3_1 + -4 | 0) >> 0] = $1_1;
   HEAP8[($0_1 + 3 | 0) >> 0] = $1_1;
   if ($2_1 >>> 0 < 9 >>> 0) {
    break label$1
   }
   $4_1 = (0 - $0_1 | 0) & 3 | 0;
   $3_1 = $0_1 + $4_1 | 0;
   $1_1 = Math_imul($1_1 & 255 | 0, 16843009);
   HEAP32[$3_1 >> 2] = $1_1;
   $4_1 = ($2_1 - $4_1 | 0) & -4 | 0;
   $2_1 = $3_1 + $4_1 | 0;
   HEAP32[($2_1 + -4 | 0) >> 2] = $1_1;
   if ($4_1 >>> 0 < 9 >>> 0) {
    break label$1
   }
   HEAP32[($3_1 + 8 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 4 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -8 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -12 | 0) >> 2] = $1_1;
   if ($4_1 >>> 0 < 25 >>> 0) {
    break label$1
   }
   HEAP32[($3_1 + 24 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 20 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 16 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 12 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -16 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -20 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -24 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -28 | 0) >> 2] = $1_1;
   $5_1 = $3_1 & 4 | 0 | 24 | 0;
   $2_1 = $4_1 - $5_1 | 0;
   if ($2_1 >>> 0 < 32 >>> 0) {
    break label$1
   }
   i64toi32_i32$0 = 0;
   $6_1 = $1_1;
   $6$hi = i64toi32_i32$0;
   i64toi32_i32$2 = $1_1;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 32;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
    $14_1 = 0;
   } else {
    i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
    $14_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   }
   $104$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $6$hi;
   i64toi32_i32$1 = $104$hi;
   i64toi32_i32$0 = $14_1;
   i64toi32_i32$2 = $6$hi;
   i64toi32_i32$3 = $6_1;
   i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
   $6_1 = i64toi32_i32$0 | $6_1 | 0;
   $6$hi = i64toi32_i32$2;
   $1_1 = $3_1 + $5_1 | 0;
   label$2 : while (1) {
    i64toi32_i32$2 = $6$hi;
    i64toi32_i32$0 = $1_1;
    HEAP32[($1_1 + 24 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 28 | 0) >> 2] = i64toi32_i32$2;
    i64toi32_i32$0 = $1_1;
    HEAP32[($1_1 + 16 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 20 | 0) >> 2] = i64toi32_i32$2;
    i64toi32_i32$0 = $1_1;
    HEAP32[($1_1 + 8 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 12 | 0) >> 2] = i64toi32_i32$2;
    i64toi32_i32$0 = $1_1;
    HEAP32[$1_1 >> 2] = $6_1;
    HEAP32[($1_1 + 4 | 0) >> 2] = i64toi32_i32$2;
    $1_1 = $1_1 + 32 | 0;
    $2_1 = $2_1 + -32 | 0;
    if ($2_1 >>> 0 > 31 >>> 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $0_1 | 0;
 }
 
 function $1045($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0;
  label$1 : {
   if (($0_1 | 0) == ($1_1 | 0)) {
    break label$1
   }
   label$2 : {
    label$3 : {
     if (($1_1 + $2_1 | 0) >>> 0 <= $0_1 >>> 0) {
      break label$3
     }
     $3_1 = $0_1 + $2_1 | 0;
     if ($3_1 >>> 0 > $1_1 >>> 0) {
      break label$2
     }
    }
    return $1043($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0 | 0;
   }
   $4_1 = ($1_1 ^ $0_1 | 0) & 3 | 0;
   label$4 : {
    label$5 : {
     label$6 : {
      if ($0_1 >>> 0 >= $1_1 >>> 0) {
       break label$6
      }
      label$7 : {
       if (!$4_1) {
        break label$7
       }
       $4_1 = $0_1;
       break label$4;
      }
      label$8 : {
       if ($0_1 & 3 | 0) {
        break label$8
       }
       $4_1 = $0_1;
       break label$5;
      }
      $4_1 = $0_1;
      label$9 : while (1) {
       if (!$2_1) {
        break label$1
       }
       HEAP8[$4_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
       $1_1 = $1_1 + 1 | 0;
       $2_1 = $2_1 + -1 | 0;
       $4_1 = $4_1 + 1 | 0;
       if (!($4_1 & 3 | 0)) {
        break label$5
       }
       continue label$9;
      };
     }
     label$10 : {
      if ($4_1) {
       break label$10
      }
      label$11 : {
       if (!($3_1 & 3 | 0)) {
        break label$11
       }
       label$12 : while (1) {
        if (!$2_1) {
         break label$1
        }
        $2_1 = $2_1 + -1 | 0;
        $4_1 = $0_1 + $2_1 | 0;
        HEAP8[$4_1 >> 0] = HEAPU8[($1_1 + $2_1 | 0) >> 0] | 0;
        if ($4_1 & 3 | 0) {
         continue label$12
        }
        break label$12;
       };
      }
      if ($2_1 >>> 0 <= 3 >>> 0) {
       break label$10
      }
      label$13 : while (1) {
       $2_1 = $2_1 + -4 | 0;
       HEAP32[($0_1 + $2_1 | 0) >> 2] = HEAP32[($1_1 + $2_1 | 0) >> 2] | 0;
       if ($2_1 >>> 0 > 3 >>> 0) {
        continue label$13
       }
       break label$13;
      };
     }
     if (!$2_1) {
      break label$1
     }
     label$14 : while (1) {
      $2_1 = $2_1 + -1 | 0;
      HEAP8[($0_1 + $2_1 | 0) >> 0] = HEAPU8[($1_1 + $2_1 | 0) >> 0] | 0;
      if ($2_1) {
       continue label$14
      }
      break label$1;
     };
    }
    if ($2_1 >>> 0 <= 3 >>> 0) {
     break label$4
    }
    $3_1 = $2_1;
    label$15 : while (1) {
     HEAP32[$4_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
     $1_1 = $1_1 + 4 | 0;
     $4_1 = $4_1 + 4 | 0;
     $3_1 = $3_1 + -4 | 0;
     if ($3_1 >>> 0 > 3 >>> 0) {
      continue label$15
     }
     break label$15;
    };
    $2_1 = $2_1 & 3 | 0;
   }
   if (!$2_1) {
    break label$1
   }
   label$16 : while (1) {
    HEAP8[$4_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    $4_1 = $4_1 + 1 | 0;
    $1_1 = $1_1 + 1 | 0;
    $2_1 = $2_1 + -1 | 0;
    if ($2_1) {
     continue label$16
    }
    break label$16;
   };
  }
  return $0_1 | 0;
 }
 
 function $1046($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  label$1 : {
   if (HEAP32[(0 + 6804 | 0) >> 2] | 0) {
    break label$1
   }
   HEAP32[(0 + 6808 | 0) >> 2] = $1_1;
   HEAP32[(0 + 6804 | 0) >> 2] = $0_1;
  }
 }
 
 function $1047($0_1) {
  $0_1 = $0_1 | 0;
  var $2_1 = 0, $1_1 = 0;
  label$1 : {
   label$2 : {
    if (!$0_1) {
     break label$2
    }
    label$3 : {
     if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) > (-1 | 0)) {
      break label$3
     }
     return $1048($0_1 | 0) | 0 | 0;
    }
    $1_1 = $775($0_1 | 0) | 0;
    $2_1 = $1048($0_1 | 0) | 0;
    if (!$1_1) {
     break label$1
    }
    $776($0_1 | 0);
    return $2_1 | 0;
   }
   $2_1 = 0;
   label$4 : {
    if (!(HEAP32[(0 + 6288 | 0) >> 2] | 0)) {
     break label$4
    }
    $2_1 = $1047(HEAP32[(0 + 6288 | 0) >> 2] | 0 | 0) | 0;
   }
   label$5 : {
    $0_1 = HEAP32[($788() | 0) >> 2] | 0;
    if (!$0_1) {
     break label$5
    }
    label$6 : while (1) {
     $1_1 = 0;
     label$7 : {
      if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) < (0 | 0)) {
       break label$7
      }
      $1_1 = $775($0_1 | 0) | 0;
     }
     label$8 : {
      if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0) >>> 0 <= (HEAP32[($0_1 + 28 | 0) >> 2] | 0) >>> 0) {
       break label$8
      }
      $2_1 = $1048($0_1 | 0) | 0 | $2_1 | 0;
     }
     label$9 : {
      if (!$1_1) {
       break label$9
      }
      $776($0_1 | 0);
     }
     $0_1 = HEAP32[($0_1 + 56 | 0) >> 2] | 0;
     if ($0_1) {
      continue label$6
     }
     break label$6;
    };
   }
   $789();
  }
  return $2_1 | 0;
 }
 
 function $1048($0_1) {
  $0_1 = $0_1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $1_1 = 0, $2_1 = 0;
  label$1 : {
   if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0) >>> 0 <= (HEAP32[($0_1 + 28 | 0) >> 2] | 0) >>> 0) {
    break label$1
   }
   FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0]($0_1, 0, 0) | 0;
   if (HEAP32[($0_1 + 20 | 0) >> 2] | 0) {
    break label$1
   }
   return -1 | 0;
  }
  label$2 : {
   $1_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
   $2_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
   if ($1_1 >>> 0 >= $2_1 >>> 0) {
    break label$2
   }
   i64toi32_i32$1 = $1_1 - $2_1 | 0;
   i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
   i64toi32_i32$0 = FUNCTION_TABLE[HEAP32[($0_1 + 40 | 0) >> 2] | 0]($0_1, i64toi32_i32$1, i64toi32_i32$0, 1) | 0;
   i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
  }
  HEAP32[($0_1 + 28 | 0) >> 2] = 0;
  i64toi32_i32$0 = $0_1;
  i64toi32_i32$1 = 0;
  HEAP32[($0_1 + 16 | 0) >> 2] = 0;
  HEAP32[($0_1 + 20 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$0 = $0_1;
  i64toi32_i32$1 = 0;
  HEAP32[($0_1 + 4 | 0) >> 2] = 0;
  HEAP32[($0_1 + 8 | 0) >> 2] = i64toi32_i32$1;
  return 0 | 0;
 }
 
 function $1049() {
  return ($1050() | 0 | 0) > (0 | 0) | 0;
 }
 
 function $1050() {
  return $916() | 0 | 0;
 }
 
 function $1051($0_1) {
  $0_1 = $0_1 | 0;
  global$2 = $0_1;
 }
 
 function $1052() {
  return global$0 | 0;
 }
 
 function $1053($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0;
  label$1 : {
   $1_1 = (global$0 - $0_1 | 0) & -16 | 0;
   $2_1 = $1_1;
   if ($1_1 >>> 0 < global$2 >>> 0) {
    fimport$29()
   }
   global$0 = $2_1;
  }
  return $1_1 | 0;
 }
 
 function $1054($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = $0_1;
  if ($1_1 >>> 0 < global$2 >>> 0) {
   fimport$29()
  }
  global$0 = $1_1;
 }
 
 function $1055($0_1) {
  $0_1 = $0_1 | 0;
  return abort() | 0;
 }
 
 function $1056($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1);
 }
 
 function $1057($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return FUNCTION_TABLE[$0_1]($1_1) | 0 | 0;
 }
 
 function $1058($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1, $4_1);
 }
 
 function $1059($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  return FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1, $4_1) | 0 | 0;
 }
 
 function $1060($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1, $2_1);
 }
 
 function $1061($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1);
 }
 
 function $1062($0_1) {
  $0_1 = $0_1 | 0;
  return FUNCTION_TABLE[$0_1]() | 0 | 0;
 }
 
 function $1063($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  return FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1) | 0 | 0;
 }
 
 function $1064($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = +$3_1;
  FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1);
 }
 
 function $1065($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return +(+FUNCTION_TABLE[$0_1]($1_1, $2_1));
 }
 
 function $1066($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return FUNCTION_TABLE[$0_1]($1_1, $2_1) | 0 | 0;
 }
 
 function $1067($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  return +(+FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1));
 }
 
 function $1068($0_1) {
  $0_1 = $0_1 | 0;
  FUNCTION_TABLE[$0_1]();
 }
 
 function $1069($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = +$2_1;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  return FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1, $4_1, $5_1, $6_1) | 0 | 0;
 }
 
 function $1070($0_1, $1_1, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = $2$hi;
  i64toi32_i32$0 = FUNCTION_TABLE[$0_1]($1_1, $2_1, i64toi32_i32$0, $3_1) | 0;
  i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$0 | 0;
 }
 
 function $1071($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1, $4_1, $5_1, $6_1);
 }
 
 function $1072($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  FUNCTION_TABLE[$0_1]($1_1, $2_1, $3_1, $4_1, $5_1);
 }
 
 function $1073($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $17_1 = 0, $18_1 = 0, $6_1 = 0, $7_1 = 0, $9_1 = 0, $9$hi = 0, $12$hi = 0, $5_1 = 0, $5$hi = 0;
  $6_1 = $0_1;
  $7_1 = $1_1;
  i64toi32_i32$0 = 0;
  $9_1 = $2_1;
  $9$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = $3_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $17_1 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $17_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $12$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $9$hi;
  i64toi32_i32$0 = $9_1;
  i64toi32_i32$2 = $12$hi;
  i64toi32_i32$3 = $17_1;
  i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
  i64toi32_i32$2 = $1070($6_1 | 0, $7_1 | 0, i64toi32_i32$0 | i64toi32_i32$3 | 0 | 0, i64toi32_i32$2 | 0, $4_1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  $5_1 = i64toi32_i32$2;
  $5$hi = i64toi32_i32$0;
  i64toi32_i32$1 = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $18_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $18_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
  }
  fimport$30($18_1 | 0);
  i64toi32_i32$2 = $5$hi;
  return $5_1 | 0;
 }
 
 function $1074($0_1, $1_1, $1$hi, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $12_1 = 0, $4_1 = 0, $6_1 = 0, i64toi32_i32$2 = 0;
  $4_1 = $0_1;
  i64toi32_i32$0 = $1$hi;
  $6_1 = $1_1;
  i64toi32_i32$2 = $1_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = 0;
   $12_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $12_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  return fimport$31($4_1 | 0, $6_1 | 0, $12_1 | 0, $2_1 | 0, $3_1 | 0) | 0 | 0;
 }
 
 function legalfunc$wasm2js_scratch_store_i64($0_1, $0$hi) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $8_1 = 0, $2_1 = 0, i64toi32_i32$2 = 0;
  i64toi32_i32$0 = $0$hi;
  $2_1 = $0_1;
  i64toi32_i32$2 = $0_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = 0;
   $8_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $8_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  legalimport$wasm2js_scratch_store_i64($2_1 | 0, $8_1 | 0);
 }
 
 function _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, var$2 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, var$3 = 0, var$4 = 0, var$5 = 0, $21_1 = 0, $22_1 = 0, var$6 = 0, $24_1 = 0, $17_1 = 0, $18_1 = 0, $23_1 = 0, $29_1 = 0, $45_1 = 0, $56$hi = 0, $62$hi = 0;
  i64toi32_i32$0 = var$1$hi;
  var$2 = var$1;
  var$4 = var$2 >>> 16 | 0;
  i64toi32_i32$0 = var$0$hi;
  var$3 = var$0;
  var$5 = var$3 >>> 16 | 0;
  $17_1 = Math_imul(var$4, var$5);
  $18_1 = var$2;
  i64toi32_i32$2 = var$3;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = 0;
   $21_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $21_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  $23_1 = $17_1 + Math_imul($18_1, $21_1) | 0;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$0 = var$1;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $22_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   $22_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
  }
  $29_1 = $23_1 + Math_imul($22_1, var$3) | 0;
  var$2 = var$2 & 65535 | 0;
  var$3 = var$3 & 65535 | 0;
  var$6 = Math_imul(var$2, var$3);
  var$2 = (var$6 >>> 16 | 0) + Math_imul(var$2, var$5) | 0;
  $45_1 = $29_1 + (var$2 >>> 16 | 0) | 0;
  var$2 = (var$2 & 65535 | 0) + Math_imul(var$4, var$3) | 0;
  i64toi32_i32$2 = 0;
  i64toi32_i32$1 = $45_1 + (var$2 >>> 16 | 0) | 0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   $24_1 = 0;
  } else {
   i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
   $24_1 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
  }
  $56$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  $62$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $56$hi;
  i64toi32_i32$2 = $24_1;
  i64toi32_i32$1 = $62$hi;
  i64toi32_i32$3 = var$2 << 16 | 0 | (var$6 & 65535 | 0) | 0;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  i64toi32_i32$2 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$2 | 0;
 }
 
 function _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$5 = 0, var$2 = 0, var$3 = 0, var$4 = 0, var$5 = 0, var$5$hi = 0, var$6 = 0, var$6$hi = 0, i64toi32_i32$6 = 0, $37_1 = 0, $38_1 = 0, $39_1 = 0, $40_1 = 0, $41_1 = 0, $42_1 = 0, $43_1 = 0, $44_1 = 0, var$8$hi = 0, $45_1 = 0, $46_1 = 0, $47_1 = 0, $48_1 = 0, var$7$hi = 0, $49_1 = 0, $63$hi = 0, $65_1 = 0, $65$hi = 0, $120$hi = 0, $129$hi = 0, $134$hi = 0, var$8 = 0, $140_1 = 0, $140$hi = 0, $142$hi = 0, $144_1 = 0, $144$hi = 0, $151_1 = 0, $151$hi = 0, $154$hi = 0, var$7 = 0, $165$hi = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             i64toi32_i32$0 = var$0$hi;
             i64toi32_i32$2 = var$0;
             i64toi32_i32$1 = 0;
             i64toi32_i32$3 = 32;
             i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
             if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
              i64toi32_i32$1 = 0;
              $37_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
             } else {
              i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
              $37_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
             }
             var$2 = $37_1;
             if (var$2) {
              block : {
               i64toi32_i32$1 = var$1$hi;
               var$3 = var$1;
               if (!var$3) {
                break label$11
               }
               i64toi32_i32$1 = var$1$hi;
               i64toi32_i32$0 = var$1;
               i64toi32_i32$2 = 0;
               i64toi32_i32$3 = 32;
               i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
               if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
                i64toi32_i32$2 = 0;
                $38_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
               } else {
                i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
                $38_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
               }
               var$4 = $38_1;
               if (!var$4) {
                break label$9
               }
               var$2 = Math_clz32(var$4) - Math_clz32(var$2) | 0;
               if (var$2 >>> 0 <= 31 >>> 0) {
                break label$8
               }
               break label$2;
              }
             }
             i64toi32_i32$2 = var$1$hi;
             i64toi32_i32$1 = var$1;
             i64toi32_i32$0 = 1;
             i64toi32_i32$3 = 0;
             if (i64toi32_i32$2 >>> 0 > i64toi32_i32$0 >>> 0 | ((i64toi32_i32$2 | 0) == (i64toi32_i32$0 | 0) & i64toi32_i32$1 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
              break label$2
             }
             i64toi32_i32$1 = var$0$hi;
             var$2 = var$0;
             i64toi32_i32$1 = var$1$hi;
             var$3 = var$1;
             var$2 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
             i64toi32_i32$1 = 0;
             legalfunc$wasm2js_scratch_store_i64(var$0 - Math_imul(var$2, var$3) | 0 | 0, i64toi32_i32$1 | 0);
             i64toi32_i32$1 = 0;
             i64toi32_i32$2 = var$2;
             i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
             return i64toi32_i32$2 | 0;
            }
            i64toi32_i32$2 = var$1$hi;
            i64toi32_i32$3 = var$1;
            i64toi32_i32$1 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$1 = 0;
             $39_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
            } else {
             i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
             $39_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
            }
            var$3 = $39_1;
            i64toi32_i32$1 = var$0$hi;
            if (!var$0) {
             break label$7
            }
            if (!var$3) {
             break label$6
            }
            var$4 = var$3 + -1 | 0;
            if (var$4 & var$3 | 0) {
             break label$6
            }
            i64toi32_i32$1 = 0;
            i64toi32_i32$2 = var$4 & var$2 | 0;
            i64toi32_i32$3 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$3 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
             $40_1 = 0;
            } else {
             i64toi32_i32$3 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
             $40_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
            }
            $63$hi = i64toi32_i32$3;
            i64toi32_i32$3 = var$0$hi;
            i64toi32_i32$1 = var$0;
            i64toi32_i32$2 = 0;
            i64toi32_i32$0 = -1;
            i64toi32_i32$2 = i64toi32_i32$3 & i64toi32_i32$2 | 0;
            $65_1 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
            $65$hi = i64toi32_i32$2;
            i64toi32_i32$2 = $63$hi;
            i64toi32_i32$3 = $40_1;
            i64toi32_i32$1 = $65$hi;
            i64toi32_i32$0 = $65_1;
            i64toi32_i32$1 = i64toi32_i32$2 | i64toi32_i32$1 | 0;
            legalfunc$wasm2js_scratch_store_i64(i64toi32_i32$3 | i64toi32_i32$0 | 0 | 0, i64toi32_i32$1 | 0);
            i64toi32_i32$1 = 0;
            i64toi32_i32$3 = var$2 >>> ((__wasm_ctz_i32(var$3 | 0) | 0) & 31 | 0) | 0;
            i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
            return i64toi32_i32$3 | 0;
           }
          }
          var$4 = var$3 + -1 | 0;
          if (!(var$4 & var$3 | 0)) {
           break label$5
          }
          var$2 = (Math_clz32(var$3) + 33 | 0) - Math_clz32(var$2) | 0;
          var$3 = 0 - var$2 | 0;
          break label$3;
         }
         var$3 = 63 - var$2 | 0;
         var$2 = var$2 + 1 | 0;
         break label$3;
        }
        var$4 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
        i64toi32_i32$3 = 0;
        i64toi32_i32$2 = var$2 - Math_imul(var$4, var$3) | 0;
        i64toi32_i32$1 = 0;
        i64toi32_i32$0 = 32;
        i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         $41_1 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
         $41_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
        }
        legalfunc$wasm2js_scratch_store_i64($41_1 | 0, i64toi32_i32$1 | 0);
        i64toi32_i32$1 = 0;
        i64toi32_i32$2 = var$4;
        i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
        return i64toi32_i32$2 | 0;
       }
       var$2 = Math_clz32(var$3) - Math_clz32(var$2) | 0;
       if (var$2 >>> 0 < 31 >>> 0) {
        break label$4
       }
       break label$2;
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      legalfunc$wasm2js_scratch_store_i64(var$4 & var$0 | 0 | 0, i64toi32_i32$2 | 0);
      if ((var$3 | 0) == (1 | 0)) {
       break label$1
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      $120$hi = i64toi32_i32$2;
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$3 = var$0;
      i64toi32_i32$1 = $120$hi;
      i64toi32_i32$0 = __wasm_ctz_i32(var$3 | 0) | 0;
      i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
      if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
       i64toi32_i32$1 = 0;
       $42_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
      } else {
       i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
       $42_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
      }
      i64toi32_i32$3 = $42_1;
      i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
      return i64toi32_i32$3 | 0;
     }
     var$3 = 63 - var$2 | 0;
     var$2 = var$2 + 1 | 0;
    }
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$3 = 0;
    $129$hi = i64toi32_i32$3;
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$2 = var$0;
    i64toi32_i32$1 = $129$hi;
    i64toi32_i32$0 = var$2 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $43_1 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
     $43_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$3 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    var$5 = $43_1;
    var$5$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$1 = 0;
    $134$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$3 = var$0;
    i64toi32_i32$2 = $134$hi;
    i64toi32_i32$0 = var$3 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
     $44_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$3 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
     $44_1 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
    }
    var$0 = $44_1;
    var$0$hi = i64toi32_i32$2;
    label$13 : {
     if (var$2) {
      block3 : {
       i64toi32_i32$2 = var$1$hi;
       i64toi32_i32$1 = var$1;
       i64toi32_i32$3 = -1;
       i64toi32_i32$0 = -1;
       i64toi32_i32$4 = i64toi32_i32$1 + i64toi32_i32$0 | 0;
       i64toi32_i32$5 = i64toi32_i32$2 + i64toi32_i32$3 | 0;
       if (i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0) {
        i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
       }
       var$8 = i64toi32_i32$4;
       var$8$hi = i64toi32_i32$5;
       label$15 : while (1) {
        i64toi32_i32$5 = var$5$hi;
        i64toi32_i32$2 = var$5;
        i64toi32_i32$1 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
         $45_1 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$5 << i64toi32_i32$3 | 0) | 0;
         $45_1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
        }
        $140_1 = $45_1;
        $140$hi = i64toi32_i32$1;
        i64toi32_i32$1 = var$0$hi;
        i64toi32_i32$5 = var$0;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 63;
        i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = 0;
         $46_1 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
        } else {
         i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
         $46_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$3 | 0) | 0;
        }
        $142$hi = i64toi32_i32$2;
        i64toi32_i32$2 = $140$hi;
        i64toi32_i32$1 = $140_1;
        i64toi32_i32$5 = $142$hi;
        i64toi32_i32$0 = $46_1;
        i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
        var$5 = i64toi32_i32$1 | i64toi32_i32$0 | 0;
        var$5$hi = i64toi32_i32$5;
        $144_1 = var$5;
        $144$hi = i64toi32_i32$5;
        i64toi32_i32$5 = var$8$hi;
        i64toi32_i32$5 = var$5$hi;
        i64toi32_i32$5 = var$8$hi;
        i64toi32_i32$2 = var$8;
        i64toi32_i32$1 = var$5$hi;
        i64toi32_i32$0 = var$5;
        i64toi32_i32$3 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
        i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
        i64toi32_i32$4 = i64toi32_i32$6 + i64toi32_i32$1 | 0;
        i64toi32_i32$4 = i64toi32_i32$5 - i64toi32_i32$4 | 0;
        i64toi32_i32$5 = i64toi32_i32$3;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 63;
        i64toi32_i32$1 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = i64toi32_i32$4 >> 31 | 0;
         $47_1 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
        } else {
         i64toi32_i32$2 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
         $47_1 = (((1 << i64toi32_i32$1 | 0) - 1 | 0) & i64toi32_i32$4 | 0) << (32 - i64toi32_i32$1 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$1 | 0) | 0;
        }
        var$6 = $47_1;
        var$6$hi = i64toi32_i32$2;
        i64toi32_i32$2 = var$1$hi;
        i64toi32_i32$2 = var$6$hi;
        i64toi32_i32$4 = var$6;
        i64toi32_i32$5 = var$1$hi;
        i64toi32_i32$0 = var$1;
        i64toi32_i32$5 = i64toi32_i32$2 & i64toi32_i32$5 | 0;
        $151_1 = i64toi32_i32$4 & i64toi32_i32$0 | 0;
        $151$hi = i64toi32_i32$5;
        i64toi32_i32$5 = $144$hi;
        i64toi32_i32$2 = $144_1;
        i64toi32_i32$4 = $151$hi;
        i64toi32_i32$0 = $151_1;
        i64toi32_i32$1 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
        i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
        i64toi32_i32$3 = i64toi32_i32$6 + i64toi32_i32$4 | 0;
        i64toi32_i32$3 = i64toi32_i32$5 - i64toi32_i32$3 | 0;
        var$5 = i64toi32_i32$1;
        var$5$hi = i64toi32_i32$3;
        i64toi32_i32$3 = var$0$hi;
        i64toi32_i32$5 = var$0;
        i64toi32_i32$2 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
         $48_1 = 0;
        } else {
         i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
         $48_1 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
        }
        $154$hi = i64toi32_i32$2;
        i64toi32_i32$2 = var$7$hi;
        i64toi32_i32$2 = $154$hi;
        i64toi32_i32$3 = $48_1;
        i64toi32_i32$5 = var$7$hi;
        i64toi32_i32$0 = var$7;
        i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
        var$0 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
        var$0$hi = i64toi32_i32$5;
        i64toi32_i32$5 = var$6$hi;
        i64toi32_i32$2 = var$6;
        i64toi32_i32$3 = 0;
        i64toi32_i32$0 = 1;
        i64toi32_i32$3 = i64toi32_i32$5 & i64toi32_i32$3 | 0;
        var$6 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
        var$6$hi = i64toi32_i32$3;
        var$7 = var$6;
        var$7$hi = i64toi32_i32$3;
        var$2 = var$2 + -1 | 0;
        if (var$2) {
         continue label$15
        }
        break label$15;
       };
       break label$13;
      }
     }
    }
    i64toi32_i32$3 = var$5$hi;
    legalfunc$wasm2js_scratch_store_i64(var$5 | 0, i64toi32_i32$3 | 0);
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$5 = var$0;
    i64toi32_i32$2 = 0;
    i64toi32_i32$0 = 1;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
     $49_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
     $49_1 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
    }
    $165$hi = i64toi32_i32$2;
    i64toi32_i32$2 = var$6$hi;
    i64toi32_i32$2 = $165$hi;
    i64toi32_i32$3 = $49_1;
    i64toi32_i32$5 = var$6$hi;
    i64toi32_i32$0 = var$6;
    i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
    i64toi32_i32$3 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
    i64toi32_i32$HIGH_BITS = i64toi32_i32$5;
    return i64toi32_i32$3 | 0;
   }
   i64toi32_i32$3 = var$0$hi;
   legalfunc$wasm2js_scratch_store_i64(var$0 | 0, i64toi32_i32$3 | 0);
   i64toi32_i32$3 = 0;
   var$0 = 0;
   var$0$hi = i64toi32_i32$3;
  }
  i64toi32_i32$3 = var$0$hi;
  i64toi32_i32$5 = var$0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$3;
  return i64toi32_i32$5 | 0;
 }
 
 function __wasm_i64_mul(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_i64_udiv(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_rotl_i32(var$0, var$1) {
  var$0 = var$0 | 0;
  var$1 = var$1 | 0;
  var var$2 = 0;
  var$2 = var$1 & 31 | 0;
  var$1 = (0 - var$1 | 0) & 31 | 0;
  return ((-1 >>> var$2 | 0) & var$0 | 0) << var$2 | 0 | (((-1 << var$1 | 0) & var$0 | 0) >>> var$1 | 0) | 0 | 0;
 }
 
 function __wasm_ctz_i32(var$0) {
  var$0 = var$0 | 0;
  if (var$0) {
   return 31 - Math_clz32((var$0 + -1 | 0) ^ var$0 | 0) | 0 | 0
  }
  return 32 | 0;
 }
 
 // EMSCRIPTEN_END_FUNCS;
 FUNCTION_TABLE[1] = $3;
 FUNCTION_TABLE[2] = $107;
 FUNCTION_TABLE[3] = $91;
 FUNCTION_TABLE[4] = $114;
 FUNCTION_TABLE[5] = $118;
 FUNCTION_TABLE[6] = $119;
 FUNCTION_TABLE[7] = $120;
 FUNCTION_TABLE[8] = $122;
 FUNCTION_TABLE[9] = $125;
 FUNCTION_TABLE[10] = $133;
 FUNCTION_TABLE[11] = $138;
 FUNCTION_TABLE[12] = $139;
 FUNCTION_TABLE[13] = $142;
 FUNCTION_TABLE[14] = $143;
 FUNCTION_TABLE[15] = $147;
 FUNCTION_TABLE[16] = $148;
 FUNCTION_TABLE[17] = $153;
 FUNCTION_TABLE[18] = $154;
 FUNCTION_TABLE[19] = $603;
 FUNCTION_TABLE[20] = $608;
 FUNCTION_TABLE[21] = $614;
 FUNCTION_TABLE[22] = $621;
 FUNCTION_TABLE[23] = $628;
 FUNCTION_TABLE[24] = $647;
 FUNCTION_TABLE[25] = $874;
 FUNCTION_TABLE[26] = $213;
 FUNCTION_TABLE[27] = $215;
 FUNCTION_TABLE[28] = $221;
 FUNCTION_TABLE[29] = $223;
 FUNCTION_TABLE[30] = $870;
 FUNCTION_TABLE[31] = $222;
 FUNCTION_TABLE[32] = $224;
 FUNCTION_TABLE[33] = $342;
 FUNCTION_TABLE[34] = $343;
 FUNCTION_TABLE[35] = $344;
 FUNCTION_TABLE[36] = $345;
 FUNCTION_TABLE[37] = $679;
 FUNCTION_TABLE[38] = $802;
 FUNCTION_TABLE[39] = $803;
 FUNCTION_TABLE[40] = $807;
 FUNCTION_TABLE[41] = $809;
 FUNCTION_TABLE[42] = $810;
 FUNCTION_TABLE[43] = $871;
 FUNCTION_TABLE[44] = $872;
 FUNCTION_TABLE[45] = $873;
 FUNCTION_TABLE[46] = $878;
 FUNCTION_TABLE[47] = $879;
 FUNCTION_TABLE[48] = $881;
 FUNCTION_TABLE[49] = $882;
 FUNCTION_TABLE[50] = $885;
 FUNCTION_TABLE[51] = $888;
 FUNCTION_TABLE[52] = $886;
 FUNCTION_TABLE[53] = $887;
 FUNCTION_TABLE[54] = $893;
 FUNCTION_TABLE[55] = $889;
 FUNCTION_TABLE[56] = $895;
 FUNCTION_TABLE[57] = $915;
 FUNCTION_TABLE[58] = $912;
 FUNCTION_TABLE[59] = $898;
 FUNCTION_TABLE[60] = $890;
 FUNCTION_TABLE[61] = $914;
 FUNCTION_TABLE[62] = $911;
 FUNCTION_TABLE[63] = $899;
 FUNCTION_TABLE[64] = $891;
 FUNCTION_TABLE[65] = $913;
 FUNCTION_TABLE[66] = $908;
 FUNCTION_TABLE[67] = $901;
 FUNCTION_TABLE[68] = $892;
 FUNCTION_TABLE[69] = $903;
 FUNCTION_TABLE[70] = $1002;
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }
 
 return {
  "__wasm_call_ctors": $1, 
  "_Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb": $91, 
  "malloc": $1040, 
  "__errno_location": $777, 
  "fflush": $1047, 
  "setThrew": $1046, 
  "_ZSt18uncaught_exceptionv": $1049, 
  "free": $1041, 
  "__getTypeName": $918, 
  "__embind_register_native_and_builtin_types": $919, 
  "__set_stack_limit": $1051, 
  "stackSave": $1052, 
  "stackAlloc": $1053, 
  "stackRestore": $1054, 
  "__growWasmMemory": $1055, 
  "dynCall_vi": $1056, 
  "dynCall_ii": $1057, 
  "dynCall_viiii": $1058, 
  "dynCall_iiiii": $1059, 
  "dynCall_vii": $1060, 
  "dynCall_viii": $1061, 
  "dynCall_i": $1062, 
  "dynCall_iiii": $1063, 
  "dynCall_viid": $1064, 
  "dynCall_dii": $1065, 
  "dynCall_iii": $1066, 
  "dynCall_diii": $1067, 
  "dynCall_v": $1068, 
  "dynCall_iidiiii": $1069, 
  "dynCall_jiji": $1073, 
  "dynCall_viiiiii": $1071, 
  "dynCall_viiiii": $1072
 };
}

var writeSegment = (
    function(mem) {
      var _mem = new Uint8Array(mem);
      return function(offset, s) {
        var bytes, i;
        if (typeof Buffer === 'undefined') {
          bytes = atob(s);
          for (i = 0; i < bytes.length; i++)
            _mem[offset + i] = bytes.charCodeAt(i);
        } else {
          bytes = Buffer.from(s, 'base64');
          for (i = 0; i < bytes.length; i++)
            _mem[offset + i] = bytes[i];
        }
      }
    }
  )(wasmMemory.buffer);
writeSegment(1024, "U0hEQ0EAbCA8IHIAc3RyYXRlZ3kuY3BwAGxpbmVhcgB8IAB8AGNhbGMAdmVjdG9yPHN0cmluZz4AU3RyYXRlZ3lSZXN1bHQAbWluSGFuZHMAc29sdXRpb25zAAAAAAAAqAQAABoAAAAbAAAAHAAAAB0AAAAyNU92ZXJhbGxWYWx1ZUNvc3RFc3RpbWF0b3IAMTNDb3N0RXN0aW1hdG9yAFQQAACQBAAAfBAAAHQEAACgBAAAAAAAAKAEAAAeAAAAHgAAAB8AAAAgAAAAb3JkZXIgPD0gMTIAZXN0aW1hdGUAYWN0dWFsUmFuayA+PSAxICYmIGFjdHVhbFJhbmsgPD0gMTAAYWN0dWFsUmFuayA+PSAxICYmIGFjdHVhbFJhbmsgPD0gMTIAYWN0dWFsUmFuayA+PSAxICYmIGFjdHVhbFJhbmsgPD0gMTMAcGxheVJhbmsudHlwZSBoYXMgdW5rbm93biB0eXBlAGNhcmRzLmZpcnN0IDw9IFJBTktfTUFYAGVzdGltYXRlQ2FyZHMAYWxsb2NhdG9yPFQ+OjphbGxvY2F0ZShzaXplX3QgbikgJ24nIGV4Y2VlZHMgbWF4aW11bSBzdXBwb3J0ZWQgc2l6ZQB3aWxkQ2FyZHMgPj0gMABlc3RpbWF0ZUNhcmRzSW1wAHJhbmtDb3VudHNbcmFua10gPj0gMAByYW5rQ291bnRzW3JhbmtdIDw9IDEwAAAAAAAAVAYAACEAAAAiAAAAIwAAACQAAAAyMU1pblBsYXlzQ29zdEVzdGltYXRvcgB8EAAAPAYAAKAEAACEBgAA/AYAAMwPAADADwAAMTRTdHJhdGVneVJlc3VsdAAAAABUEAAAcAYAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAE5TdDNfXzIyMV9fYmFzaWNfc3RyaW5nX2NvbW1vbklMYjFFRUUAAAAAVBAAAMsGAADYEAAAjAYAAAAAAAABAAAA9AYAAAAAAABpaWlpaQBwdXNoX2JhY2sAcmVzaXplAHNpemUAZ2V0AHNldABOU3QzX18yNnZlY3RvcklOU18xMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFTlM0X0lTNl9FRUVFAE5TdDNfXzIxM19fdmVjdG9yX2Jhc2VJTlNfMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRU5TNF9JUzZfRUVFRQBOU3QzX18yMjBfX3ZlY3Rvcl9iYXNlX2NvbW1vbklMYjFFRUUAAAAAVBAAAOwHAADYEAAAjgcAAAAAAAABAAAAFAgAAAAAAADYEAAAOAcAAAAAAAABAAAAHAgAAAAAAABQTlN0M19fMjZ2ZWN0b3JJTlNfMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRU5TNF9JUzZfRUVFRQAANBEAAEwIAAAAAAAANAgAAFBLTlN0M19fMjZ2ZWN0b3JJTlNfMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRU5TNF9JUzZfRUVFRQA0EQAAtAgAAAEAAAA0CAAAaWkAdgB2aQCkCAAAqA8AAKQIAAD8BgAAdmlpaQAAAAAAAAAAqA8AAKQIAAAsEAAA/AYAAHZpaWlpAAAALBAAAAwJAABpaWkAhAkAADQIAAAsEAAATjEwZW1zY3JpcHRlbjN2YWxFAABUEAAAcAkAAGlpaWkAAAAAAAAAAAAAAAAAAAAAwA8AADQIAAAsEAAA/AYAAGkAZGlpAHZpaWQAU0hEQ0EAcmFuayA+PSAxICYmIHJhbmsgPD0gMTQAY2MvY29tbW9uLmNwcABnZXRPcmRlcgAAQQBKAEsAUQAwAFhSAFhCAFdDIABTdGFydGluZ051bWJlciA+PSAxAEV4aXN0U2h1blppAFN0YXJ0aW5nTnVtYmVyICsgTGVuZ3RoIC0gMSA8PSAxNAAiaW52YWxpZCBjYXJkIiAmJiBmYWxzZQBwYXJzZVJhbmtGcm9tQ2hhcgByYW5rID49IDEgJiYgcmFuayA8PSBKT0tFUgBBZGRDYXJkAAAtKyAgIDBYMHgAKG51bGwpAAAAAAAAAAAAAAARAAoAERERAAAAAAUAAAAAAAAJAAAAAAsAAAAAAAAAABEADwoREREDCgcAARMJCwsAAAkGCwAACwAGEQAAABEREQAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAARAAoKERERAAoAAAIACQsAAAAJAAsAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAADAAAAAAMAAAAAAkMAAAAAAAMAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAA0AAAAEDQAAAAAJDgAAAAAADgAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAPAAAAAA8AAAAACRAAAAAAABAAABAAABIAAAASEhIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgAAABISEgAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAoAAAAACgAAAAAJCwAAAAAACwAACwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAMAAAAAAwAAAAACQwAAAAAAAwAAAwAADAxMjM0NTY3ODlBQkNERUYtMFgrMFggMFgtMHgrMHggMHgAaW5mAElORgBuYW4ATkFOAC4AAAAAkBcAAGJhc2ljX3N0cmluZwBhbGxvY2F0b3I8VD46OmFsbG9jYXRlKHNpemVfdCBuKSAnbicgZXhjZWVkcyBtYXhpbXVtIHN1cHBvcnRlZCBzaXplAHZlY3RvcgBQdXJlIHZpcnR1YWwgZnVuY3Rpb24gY2FsbGVkIQBzdGQ6OmV4Y2VwdGlvbgAAAAAAAAAAaA0AACsAAAAsAAAALQAAAFN0OWV4Y2VwdGlvbgAAAABUEAAAWA0AAAAAAACUDQAAGQAAAC4AAAAvAAAAU3QxMWxvZ2ljX2Vycm9yAHwQAACEDQAAaA0AAAAAAADMDQAAGQAAADAAAAAvAAAAU3QxNmludmFsaWRfYXJndW1lbnQAAAAAfBAAALQNAACUDQAAAAAAAAAOAAAZAAAAMQAAAC8AAABTdDEybGVuZ3RoX2Vycm9yAAAAAHwQAADsDQAAlA0AAFN0OXR5cGVfaW5mbwAAAABUEAAADA4AAE4xMF9fY3h4YWJpdjExNl9fc2hpbV90eXBlX2luZm9FAAAAAHwQAAAkDgAAHA4AAE4xMF9fY3h4YWJpdjExN19fY2xhc3NfdHlwZV9pbmZvRQAAAHwQAABUDgAASA4AAE4xMF9fY3h4YWJpdjExN19fcGJhc2VfdHlwZV9pbmZvRQAAAHwQAACEDgAASA4AAE4xMF9fY3h4YWJpdjExOV9fcG9pbnRlcl90eXBlX2luZm9FAHwQAAC0DgAAqA4AAE4xMF9fY3h4YWJpdjEyMF9fZnVuY3Rpb25fdHlwZV9pbmZvRQAAAAB8EAAA5A4AAEgOAABOMTBfX2N4eGFiaXYxMjlfX3BvaW50ZXJfdG9fbWVtYmVyX3R5cGVfaW5mb0UAAAB8EAAAGA8AAKgOAAAAAAAAmA8AADIAAAAzAAAANAAAADUAAAA2AAAATjEwX19jeHhhYml2MTIzX19mdW5kYW1lbnRhbF90eXBlX2luZm9FAHwQAABwDwAASA4AAHYAAABcDwAApA8AAERuAABcDwAAsA8AAGIAAABcDwAAvA8AAGMAAABcDwAAyA8AAGgAAABcDwAA1A8AAGEAAABcDwAA4A8AAHMAAABcDwAA7A8AAHQAAABcDwAA+A8AAGkAAABcDwAABBAAAGoAAABcDwAAEBAAAGwAAABcDwAAHBAAAG0AAABcDwAAKBAAAGYAAABcDwAANBAAAGQAAABcDwAAQBAAAAAAAAB4DgAAMgAAADcAAAA0AAAANQAAADgAAAA5AAAAOgAAADsAAAAAAAAAxBAAADIAAAA8AAAANAAAADUAAAA4AAAAPQAAAD4AAAA/AAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAAHwQAACcEAAAeA4AAAAAAAAgEQAAMgAAAEAAAAA0AAAANQAAADgAAABBAAAAQgAAAEMAAABOMTBfX2N4eGFiaXYxMjFfX3ZtaV9jbGFzc190eXBlX2luZm9FAAAAfBAAAPgQAAB4DgAAAAAAANgOAAAyAAAARAAAADQAAAA1AAAARQAAAHZvaWQAYm9vbABjaGFyAHNpZ25lZCBjaGFyAHVuc2lnbmVkIGNoYXIAc2hvcnQAdW5zaWduZWQgc2hvcnQAaW50AHVuc2lnbmVkIGludABsb25nAHVuc2lnbmVkIGxvbmcAZmxvYXQAZG91YmxlAHN0ZDo6c3RyaW5nAHN0ZDo6YmFzaWNfc3RyaW5nPHVuc2lnbmVkIGNoYXI+AHN0ZDo6d3N0cmluZwBlbXNjcmlwdGVuOjp2YWwAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxmbG9hdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZG91YmxlPgBOU3QzX18yMTJiYXNpY19zdHJpbmdJaE5TXzExY2hhcl90cmFpdHNJaEVFTlNfOWFsbG9jYXRvckloRUVFRQAA2BAAAEAUAAAAAAAAAQAAAPQGAAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSXdOU18xMWNoYXJfdHJhaXRzSXdFRU5TXzlhbGxvY2F0b3JJd0VFRUUAANgQAACYFAAAAAAAAAEAAAD0BgAAAAAAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWNFRQAAVBAAAPAUAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lhRUUAAFQQAAAYFQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaEVFAABUEAAAQBUAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQAAVBAAAGgVAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l0RUUAAFQQAACQFQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJaUVFAABUEAAAuBUAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQAAVBAAAOAVAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lsRUUAAFQQAAAIFgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbUVFAABUEAAAMBYAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWZFRQAAVBAAAFgWAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lkRUUAAFQQAACAFgAA");
writeSegment(5800, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkAAAAqAAAAnBgAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAP//////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
writeSegment(6176, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
return asmFunc({
    'Int8Array': Int8Array,
    'Int16Array': Int16Array,
    'Int32Array': Int32Array,
    'Uint8Array': Uint8Array,
    'Uint16Array': Uint16Array,
    'Uint32Array': Uint32Array,
    'Float32Array': Float32Array,
    'Float64Array': Float64Array,
    'NaN': NaN,
    'Infinity': Infinity,
    'Math': Math
  },
  asmLibraryArg,
  wasmMemory.buffer
)

}
)(asmLibraryArg, wasmMemory, wasmTable);
    return {
      'exports': exports
    };
  },

  instantiate: function(binary, info) {
    return {
      then: function(ok, err) {
        ok({
          'instance': new WebAssembly.Instance(new WebAssembly.Module(binary, info))
        });
      }
    };
  },

  RuntimeError: Error
};

// We don't need to actually download a wasm binary, mark it as present but empty.
wasmBinary = [];




if (typeof WebAssembly !== 'object') {
  abort('No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.');
}


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}





// Wasm globals

var wasmMemory;

// In fastcomp asm.js, we don't need a wasm Table at all.
// In the wasm backend, we polyfill the WebAssembly object,
// so this creates a (non-native-wasm) table for us.
var wasmTable = new WebAssembly.Table({
  'initial': 71,
  'maximum': 71 + 0,
  'element': 'anyfunc'
});


//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);

  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}

function cwrap(ident, returnType, argTypes, opts) {
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_DYNAMIC = 2; // Cannot be freed except through sbrk
var ALLOC_NONE = 3; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc,
    stackAlloc,
    dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}




// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}


// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = u8Array[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}


// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}




// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var STATIC_BASE = 1024,
    STACK_BASE = 5249856,
    STACKTOP = STACK_BASE,
    STACK_MAX = 6976,
    DYNAMIC_BASE = 5249856,
    DYNAMICTOP_PTR = 6816;

assert(STACK_BASE % 16 === 0, 'stack must start aligned');
assert(DYNAMIC_BASE % 16 === 0, 'heap must start aligned');



var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;if (!Object.getOwnPropertyDescriptor(Module, 'TOTAL_MEMORY')) Object.defineProperty(Module, 'TOTAL_MEMORY', { configurable: true, get: function() { abort('Module.TOTAL_MEMORY has been replaced with plain INITIAL_TOTAL_MEMORY') } });

assert(INITIAL_TOTAL_MEMORY >= TOTAL_STACK, 'TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');






// In standalone mode, the wasm creates the memory, and the user can't provide it.
// In non-standalone/normal mode, we create the memory here.

// Create the main memory. (Note: this isn't used in STANDALONE_WASM mode since the wasm
// memory is created in the wasm, not in JS.)

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
      ,
      'maximum': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
    });
  }


if (wasmMemory) {
  buffer = wasmMemory.buffer;
}

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['TOTAL_MEMORY'].
INITIAL_TOTAL_MEMORY = buffer.byteLength;
assert(INITIAL_TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;




// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  // The stack grows downwards
  HEAPU32[(STACK_MAX >> 2)+1] = 0x2135467;
  HEAPU32[(STACK_MAX >> 2)+2] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  var cookie1 = HEAPU32[(STACK_MAX >> 2)+1];
  var cookie2 = HEAPU32[(STACK_MAX >> 2)+2];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}

function abortStackOverflow(allocSize) {
  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
}




// Endianness check (note: assumes compiler arch was little-endian)
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';
})();

function abortFnPtrError(ptr, sig) {
	abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
}



function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}


assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;



// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  out(what);
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  var output = 'abort(' + what + ') at ' + stackTrace();
  what = output;

  // Throw a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  throw new WebAssembly.RuntimeError(what);
}


var memoryInitializer = null;



// show errors on likely calls to FS when it was not included
var FS = {
  error: function() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
  },
  init: function() { FS.error() },
  createDataFile: function() { FS.error() },
  createPreloadedFile: function() { FS.error() },
  createLazyFile: function() { FS.error() },
  open: function() { FS.error() },
  mkdev: function() { FS.error() },
  registerDevice: function() { FS.error() },
  analyzePath: function() { FS.error() },
  loadFilesFromDB: function() { FS.error() },

  ErrnoError: function ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;



// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}




var wasmBinaryFile = 'strategy.wasm';
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }

    var binary = tryParseAsDataURI(wasmBinaryFile);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // if we don't have the binary yet, and have the Fetch api, use that
  // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
    return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
      if (!response['ok']) {
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
      }
      return response['arrayBuffer']();
    }).catch(function () {
      return getBinary();
    });
  }
  // Otherwise, getBinary should be able to get it synchronously
  return new Promise(function(resolve, reject) {
    resolve(getBinary());
  });
}



// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module['asm'] = exports;
    removeRunDependency('wasm-instantiate');
  }
   // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');


  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiatedSource(output) {
    // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
      // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
      // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(output['instance']);
  }


  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);
      abort(reason);
    });
  }

  // Prefer streaming instantiation if available.
  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            instantiateArrayBuffer(receiveInstantiatedSource);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  instantiateAsync();
  return {}; // no exports yet; we'll fill them in later
}


// Globals used by JS i64 conversions
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  
};




// STATICTOP = STATIC_BASE + 5952;
/* global initializers */  __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });




/* no memory initializer */
// {{PRE_LIBRARY}}


  function demangle(func) {
      warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  function jsStackTrace() {
      var err = new Error();
      if (!err.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error(0);
        } catch(e) {
          err = e;
        }
        if (!err.stack) {
          return '(no stack trace available)';
        }
      }
      return err.stack.toString();
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function ___assert_fail(condition, filename, line, func) {
      abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    }

  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

  
  function _atexit(func, arg) {
      warnOnce('atexit() called, but EXIT_RUNTIME is not set, so atexits() will not be called. set EXIT_RUNTIME to 1 (see the FAQ)');
      __ATEXIT__.unshift({ func: func, arg: arg });
    }function ___cxa_atexit(
  ) {
  return _atexit.apply(null, arguments)
  }

  
  var ___exception_infos={};
  
  var ___exception_last=0;function ___cxa_throw(ptr, type, destructor) {
      ___exception_infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      ___exception_last = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

  function ___handle_stack_overflow() {
      abort('stack overflow')
    }

  function ___lock() {}

  function ___unlock() {}

  
  var structRegistrations={};
  
  function runDestructors(destructors) {
      while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
      }
    }
  
  function simpleReadValueFromPointer(pointer) {
      return this['fromWireType'](HEAPU32[pointer >> 2]);
    }
  
  
  var awaitingDependencies={};
  
  var registeredTypes={};
  
  var typeDependencies={};
  
  
  
  
  
  
  var char_0=48;
  
  var char_9=57;function makeLegalFunctionName(name) {
      if (undefined === name) {
          return '_unknown';
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
          return '_' + name;
      } else {
          return name;
      }
    }function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      /*jshint evil:true*/
      return new Function(
          "body",
          "return function " + name + "() {\n" +
          "    \"use strict\";" +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body);
    }function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
  
          var stack = (new Error(message)).stack;
          if (stack !== undefined) {
              this.stack = this.toString() + '\n' +
                  stack.replace(/^Error(:[^\n]*)?\n/, '');
          }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
          if (this.message === undefined) {
              return this.name;
          } else {
              return this.name + ': ' + this.message;
          }
      };
  
      return errorClass;
    }var InternalError=undefined;function throwInternalError(message) {
      throw new InternalError(message);
    }function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function(type) {
          typeDependencies[type] = dependentTypes;
      });
  
      function onComplete(typeConverters) {
          var myTypeConverters = getTypeConverters(typeConverters);
          if (myTypeConverters.length !== myTypes.length) {
              throwInternalError('Mismatched type converter count');
          }
          for (var i = 0; i < myTypes.length; ++i) {
              registerType(myTypes[i], myTypeConverters[i]);
          }
      }
  
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function(dt, i) {
          if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i] = registeredTypes[dt];
          } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                  awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(function() {
                  typeConverters[i] = registeredTypes[dt];
                  ++registered;
                  if (registered === unregisteredTypes.length) {
                      onComplete(typeConverters);
                  }
              });
          }
      });
      if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
      }
    }function __embind_finalize_value_object(structType) {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
  
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords.map(function(field) { return field.getterReturnType; }).
                concat(fieldRecords.map(function(field) { return field.setterArgumentType; }));
      whenDependentTypesAreResolved([structType], fieldTypes, function(fieldTypes) {
          var fields = {};
          fieldRecords.forEach(function(field, i) {
              var fieldName = field.fieldName;
              var getterReturnType = fieldTypes[i];
              var getter = field.getter;
              var getterContext = field.getterContext;
              var setterArgumentType = fieldTypes[i + fieldRecords.length];
              var setter = field.setter;
              var setterContext = field.setterContext;
              fields[fieldName] = {
                  read: function(ptr) {
                      return getterReturnType['fromWireType'](
                          getter(getterContext, ptr));
                  },
                  write: function(ptr, o) {
                      var destructors = [];
                      setter(setterContext, ptr, setterArgumentType['toWireType'](destructors, o));
                      runDestructors(destructors);
                  }
              };
          });
  
          return [{
              name: reg.name,
              'fromWireType': function(ptr) {
                  var rv = {};
                  for (var i in fields) {
                      rv[i] = fields[i].read(ptr);
                  }
                  rawDestructor(ptr);
                  return rv;
              },
              'toWireType': function(destructors, o) {
                  // todo: Here we have an opportunity for -O3 level "unsafe" optimizations:
                  // assume all fields are present without checking.
                  for (var fieldName in fields) {
                      if (!(fieldName in o)) {
                          throw new TypeError('Missing field');
                      }
                  }
                  var ptr = rawConstructor();
                  for (fieldName in fields) {
                      fields[fieldName].write(ptr, o[fieldName]);
                  }
                  if (destructors !== null) {
                      destructors.push(rawDestructor, ptr);
                  }
                  return ptr;
              },
              'argPackAdvance': 8,
              'readValueFromPointer': simpleReadValueFromPointer,
              destructorFunction: rawDestructor,
          }];
      });
    }

  
  function getShiftFromSize(size) {
      switch (size) {
          case 1: return 0;
          case 2: return 1;
          case 4: return 2;
          case 8: return 3;
          default:
              throw new TypeError('Unknown type size: ' + size);
      }
    }
  
  
  
  function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }var embind_charCodes=undefined;function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
  
  
  
  var BindingError=undefined;function throwBindingError(message) {
      throw new BindingError(message);
    }function registerType(rawType, registeredInstance, options) {
      options = options || {};
  
      if (!('argPackAdvance' in registeredInstance)) {
          throw new TypeError('registerType registeredInstance requires argPackAdvance');
      }
  
      var name = registeredInstance.name;
      if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
              return;
          } else {
              throwBindingError("Cannot register type '" + name + "' twice");
          }
      }
  
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
  
      if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach(function(cb) {
              cb();
          });
      }
    }function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(wt) {
              // ambiguous emscripten ABI: sometimes return values are
              // true or false, and sometimes integers (0 or 1)
              return !!wt;
          },
          'toWireType': function(destructors, o) {
              return o ? trueValue : falseValue;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': function(pointer) {
              // TODO: if heap is fixed (like in asm.js) this could be executed outside
              var heap;
              if (size === 1) {
                  heap = HEAP8;
              } else if (size === 2) {
                  heap = HEAP16;
              } else if (size === 4) {
                  heap = HEAP32;
              } else {
                  throw new TypeError("Unknown boolean type size: " + name);
              }
              return this['fromWireType'](heap[pointer >> shift]);
          },
          destructorFunction: null, // This type does not need a destructor
      });
    }

  
  
  
  function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
          return false;
      }
      if (!(other instanceof ClassHandle)) {
          return false;
      }
  
      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;
  
      while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
      }
  
      while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
      }
  
      return leftClass === rightClass && left === right;
    }
  
  
  function shallowCopyInternalPointer(o) {
      return {
          count: o.count,
          deleteScheduled: o.deleteScheduled,
          preservePointerOnDelete: o.preservePointerOnDelete,
          ptr: o.ptr,
          ptrType: o.ptrType,
          smartPtr: o.smartPtr,
          smartPtrType: o.smartPtrType,
      };
    }
  
  function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + ' instance already deleted');
    }
  
  
  var finalizationGroup=false;
  
  function detachFinalizer(handle) {}
  
  
  function runDestructor($$) {
      if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
          runDestructor($$);
      }
    }function attachFinalizer(handle) {
      if ('undefined' === typeof FinalizationGroup) {
          attachFinalizer = function (handle) { return handle; };
          return handle;
      }
      // If the running environment has a FinalizationGroup (see
      // https://github.com/tc39/proposal-weakrefs), then attach finalizers
      // for class handles.  We check for the presence of FinalizationGroup
      // at run-time, not build-time.
      finalizationGroup = new FinalizationGroup(function (iter) {
          for (var result = iter.next(); !result.done; result = iter.next()) {
              var $$ = result.value;
              if (!$$.ptr) {
                  console.warn('object already deleted: ' + $$.ptr);
              } else {
                  releaseClassHandle($$);
              }
          }
      });
      attachFinalizer = function(handle) {
          finalizationGroup.register(handle, handle.$$, handle.$$);
          return handle;
      };
      detachFinalizer = function(handle) {
          finalizationGroup.unregister(handle.$$);
      };
      return attachFinalizer(handle);
    }function ClassHandle_clone() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
  
      if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
      } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
              $$: {
                  value: shallowCopyInternalPointer(this.$$),
              }
          }));
  
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
      }
    }
  
  function ClassHandle_delete() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
  
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError('Object already scheduled for deletion');
      }
  
      detachFinalizer(this);
      releaseClassHandle(this.$$);
  
      if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = undefined;
          this.$$.ptr = undefined;
      }
    }
  
  function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }
  
  
  var delayFunction=undefined;
  
  var deletionQueue=[];
  
  function flushPendingDeletes() {
      while (deletionQueue.length) {
          var obj = deletionQueue.pop();
          obj.$$.deleteScheduled = false;
          obj['delete']();
      }
    }function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError('Object already scheduled for deletion');
      }
      deletionQueue.push(this);
      if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
      }
      this.$$.deleteScheduled = true;
      return this;
    }function init_ClassHandle() {
      ClassHandle.prototype['isAliasOf'] = ClassHandle_isAliasOf;
      ClassHandle.prototype['clone'] = ClassHandle_clone;
      ClassHandle.prototype['delete'] = ClassHandle_delete;
      ClassHandle.prototype['isDeleted'] = ClassHandle_isDeleted;
      ClassHandle.prototype['deleteLater'] = ClassHandle_deleteLater;
    }function ClassHandle() {
    }
  
  var registeredPointers={};
  
  
  function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
          var prevFunc = proto[methodName];
          // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
          proto[methodName] = function() {
              // TODO This check can be removed in -O3 level "unsafe" optimizations.
              if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                  throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
              }
              return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
          };
          // Move the previous function into the overload table.
          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
          if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
              throwBindingError("Cannot register public name '" + name + "' twice");
          }
  
          // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
          // that routes between the two.
          ensureOverloadTable(Module, name, name);
          if (Module.hasOwnProperty(numArguments)) {
              throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
          }
          // Add the new function into the overload table.
          Module[name].overloadTable[numArguments] = value;
      }
      else {
          Module[name] = value;
          if (undefined !== numArguments) {
              Module[name].numArguments = numArguments;
          }
      }
    }
  
  function RegisteredClass(
      name,
      constructor,
      instancePrototype,
      rawDestructor,
      baseClass,
      getActualType,
      upcast,
      downcast
    ) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
  
  
  
  function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
              throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
          }
          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
      }
      return ptr;
    }function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
          return 0;
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
  
          if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
              }
              return ptr;
          } else {
              return 0;
          }
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError('Cannot convert argument of type ' + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + ' to parameter type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
  
      if (this.isSmartPointer) {
          // TODO: this is not strictly true
          // We could support BY_EMVAL conversions from raw pointers to smart pointers
          // because the smart pointer can hold a reference to the handle
          if (undefined === handle.$$.smartPtr) {
              throwBindingError('Passing raw pointer to smart pointer is illegal');
          }
  
          switch (this.sharingPolicy) {
              case 0: // NONE
                  // no upcasting
                  if (handle.$$.smartPtrType === this) {
                      ptr = handle.$$.smartPtr;
                  } else {
                      throwBindingError('Cannot convert argument of type ' + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + ' to parameter type ' + this.name);
                  }
                  break;
  
              case 1: // INTRUSIVE
                  ptr = handle.$$.smartPtr;
                  break;
  
              case 2: // BY_EMVAL
                  if (handle.$$.smartPtrType === this) {
                      ptr = handle.$$.smartPtr;
                  } else {
                      var clonedHandle = handle['clone']();
                      ptr = this.rawShare(
                          ptr,
                          __emval_register(function() {
                              clonedHandle['delete']();
                          })
                      );
                      if (destructors !== null) {
                          destructors.push(this.rawDestructor, ptr);
                      }
                  }
                  break;
  
              default:
                  throwBindingError('Unsupporting sharing policy');
          }
      }
      return ptr;
    }
  
  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
          return 0;
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      if (handle.$$.ptrType.isConst) {
          throwBindingError('Cannot convert argument of type ' + handle.$$.ptrType.name + ' to parameter type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
      }
      return ptr;
    }
  
  function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
          this.rawDestructor(ptr);
      }
    }
  
  function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
          handle['delete']();
      }
    }
  
  
  function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
          return ptr;
      }
      if (undefined === desiredClass.baseClass) {
          return null; // no conversion
      }
  
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
          return null;
      }
      return desiredClass.downcast(rv);
    }
  
  
  
  
  function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }
  
  function getLiveInheritedInstances() {
      var rv = [];
      for (var k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
              rv.push(registeredInstances[k]);
          }
      }
      return rv;
    }
  
  function setDelayFunction(fn) {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
          delayFunction(flushPendingDeletes);
      }
    }function init_embind() {
      Module['getInheritedInstanceCount'] = getInheritedInstanceCount;
      Module['getLiveInheritedInstances'] = getLiveInheritedInstances;
      Module['flushPendingDeletes'] = flushPendingDeletes;
      Module['setDelayFunction'] = setDelayFunction;
    }var registeredInstances={};
  
  function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
          throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
      }
      return ptr;
    }function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }
  
  function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
          throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, {
          $$: {
              value: record,
          },
      }));
    }function RegisteredPointer_fromWireType(ptr) {
      // ptr is a raw pointer (or a raw smartpointer)
  
      // rawPointer is a maybe-null raw pointer
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
          this.destructor(ptr);
          return null;
      }
  
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (undefined !== registeredInstance) {
          // JS object has been neutered, time to repopulate it
          if (0 === registeredInstance.$$.count.value) {
              registeredInstance.$$.ptr = rawPointer;
              registeredInstance.$$.smartPtr = ptr;
              return registeredInstance['clone']();
          } else {
              // else, just increment reference count on existing object
              // it already has a reference to the smart pointer
              var rv = registeredInstance['clone']();
              this.destructor(ptr);
              return rv;
          }
      }
  
      function makeDefaultHandle() {
          if (this.isSmartPointer) {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                  ptrType: this.pointeeType,
                  ptr: rawPointer,
                  smartPtrType: this,
                  smartPtr: ptr,
              });
          } else {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                  ptrType: this,
                  ptr: ptr,
              });
          }
      }
  
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
      }
  
      var toType;
      if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
      } else {
          toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
          rawPointer,
          this.registeredClass,
          toType.registeredClass);
      if (dp === null) {
          return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp,
              smartPtrType: this,
              smartPtr: ptr,
          });
      } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp,
          });
      }
    }function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype['argPackAdvance'] = 8;
      RegisteredPointer.prototype['readValueFromPointer'] = simpleReadValueFromPointer;
      RegisteredPointer.prototype['deleteObject'] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype['fromWireType'] = RegisteredPointer_fromWireType;
    }function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
  
      // smart pointer properties
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
  
      // smart pointer properties
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
  
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
          if (isConst) {
              this['toWireType'] = constNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
          } else {
              this['toWireType'] = nonConstNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
          }
      } else {
          this['toWireType'] = genericPointerToWireType;
          // Here we must leave this.destructorFunction undefined, since whether genericPointerToWireType returns
          // a pointer that needs to be freed up is runtime-dependent, and cannot be evaluated at registration time.
          // TODO: Create an alternative mechanism that allows removing the use of var destructors = []; array in
          //       craftInvokerFunction altogether.
      }
    }
  
  function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
          throwInternalError('Replacing nonexistant public symbol');
      }
      // If there's an overload table for this symbol, replace the symbol in the overload table instead.
      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
          Module[name].overloadTable[numArguments] = value;
      }
      else {
          Module[name] = value;
          Module[name].argCount = numArguments;
      }
    }
  
  function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
  
      function makeDynCaller(dynCall) {
          var args = [];
          for (var i = 1; i < signature.length; ++i) {
              args.push('a' + i);
          }
  
          var name = 'dynCall_' + signature + '_' + rawFunction;
          var body = 'return function ' + name + '(' + args.join(', ') + ') {\n';
          body    += '    return dynCall(rawFunction' + (args.length ? ', ' : '') + args.join(', ') + ');\n';
          body    += '};\n';
  
          return (new Function('dynCall', 'rawFunction', body))(dynCall, rawFunction);
      }
  
      var fp;
      if (Module['FUNCTION_TABLE_' + signature] !== undefined) {
          fp = Module['FUNCTION_TABLE_' + signature][rawFunction];
      } else if (typeof FUNCTION_TABLE !== "undefined") {
          fp = FUNCTION_TABLE[rawFunction];
      } else {
          // asm.js does not give direct access to the function tables,
          // and thus we must go through the dynCall interface which allows
          // calling into a signature's function table by pointer value.
          //
          // https://github.com/dherman/asm.js/issues/83
          //
          // This has three main penalties:
          // - dynCall is another function call in the path from JavaScript to C++.
          // - JITs may not predict through the function table indirection at runtime.
          var dc = Module['dynCall_' + signature];
          if (dc === undefined) {
              // We will always enter this branch if the signature
              // contains 'f' and PRECISE_F32 is not enabled.
              //
              // Try again, replacing 'f' with 'd'.
              dc = Module['dynCall_' + signature.replace(/f/g, 'd')];
              if (dc === undefined) {
                  throwBindingError("No dynCall invoker for signature: " + signature);
              }
          }
          fp = makeDynCaller(dc);
      }
  
      if (typeof fp !== "function") {
          throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
      }
      return fp;
    }
  
  
  var UnboundTypeError=undefined;
  
  function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
          if (seen[type]) {
              return;
          }
          if (registeredTypes[type]) {
              return;
          }
          if (typeDependencies[type]) {
              typeDependencies[type].forEach(visit);
              return;
          }
          unboundTypes.push(type);
          seen[type] = true;
      }
      types.forEach(visit);
  
      throw new UnboundTypeError(message + ': ' + unboundTypes.map(getTypeName).join([', ']));
    }function __embind_register_class(
      rawType,
      rawPointerType,
      rawConstPointerType,
      baseClassRawType,
      getActualTypeSignature,
      getActualType,
      upcastSignature,
      upcast,
      downcastSignature,
      downcast,
      name,
      destructorSignature,
      rawDestructor
    ) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      if (upcast) {
          upcast = embind__requireFunction(upcastSignature, upcast);
      }
      if (downcast) {
          downcast = embind__requireFunction(downcastSignature, downcast);
      }
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
  
      exposePublicSymbol(legalFunctionName, function() {
          // this code cannot run if baseClassRawType is zero
          throwUnboundTypeError('Cannot construct ' + name + ' due to unbound types', [baseClassRawType]);
      });
  
      whenDependentTypesAreResolved(
          [rawType, rawPointerType, rawConstPointerType],
          baseClassRawType ? [baseClassRawType] : [],
          function(base) {
              base = base[0];
  
              var baseClass;
              var basePrototype;
              if (baseClassRawType) {
                  baseClass = base.registeredClass;
                  basePrototype = baseClass.instancePrototype;
              } else {
                  basePrototype = ClassHandle.prototype;
              }
  
              var constructor = createNamedFunction(legalFunctionName, function() {
                  if (Object.getPrototypeOf(this) !== instancePrototype) {
                      throw new BindingError("Use 'new' to construct " + name);
                  }
                  if (undefined === registeredClass.constructor_body) {
                      throw new BindingError(name + " has no accessible constructor");
                  }
                  var body = registeredClass.constructor_body[arguments.length];
                  if (undefined === body) {
                      throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
                  }
                  return body.apply(this, arguments);
              });
  
              var instancePrototype = Object.create(basePrototype, {
                  constructor: { value: constructor },
              });
  
              constructor.prototype = instancePrototype;
  
              var registeredClass = new RegisteredClass(
                  name,
                  constructor,
                  instancePrototype,
                  rawDestructor,
                  baseClass,
                  getActualType,
                  upcast,
                  downcast);
  
              var referenceConverter = new RegisteredPointer(
                  name,
                  registeredClass,
                  true,
                  false,
                  false);
  
              var pointerConverter = new RegisteredPointer(
                  name + '*',
                  registeredClass,
                  false,
                  false,
                  false);
  
              var constPointerConverter = new RegisteredPointer(
                  name + ' const*',
                  registeredClass,
                  false,
                  true,
                  false);
  
              registeredPointers[rawType] = {
                  pointerType: pointerConverter,
                  constPointerType: constPointerConverter
              };
  
              replacePublicSymbol(legalFunctionName, constructor);
  
              return [referenceConverter, pointerConverter, constPointerConverter];
          }
      );
    }

  
  function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
          array.push(HEAP32[(firstElement >> 2) + i]);
      }
      return array;
    }function __embind_register_class_constructor(
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      var args = [rawConstructor];
      var destructors = [];
  
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = 'constructor ' + classType.name;
  
          if (undefined === classType.registeredClass.constructor_body) {
              classType.registeredClass.constructor_body = [];
          }
          if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
              throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount-1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          }
          classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
              throwUnboundTypeError('Cannot construct ' + classType.name + ' due to unbound types', rawArgTypes);
          };
  
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
              classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
                  if (arguments.length !== argCount - 1) {
                      throwBindingError(humanName + ' called with ' + arguments.length + ' arguments, expected ' + (argCount-1));
                  }
                  destructors.length = 0;
                  args.length = argCount;
                  for (var i = 1; i < argCount; ++i) {
                      args[i] = argTypes[i]['toWireType'](destructors, arguments[i - 1]);
                  }
  
                  var ptr = invoker.apply(null, args);
                  runDestructors(destructors);
  
                  return argTypes[0]['fromWireType'](ptr);
              };
              return [];
          });
          return [];
      });
    }

  
  
  function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
          throw new TypeError('new_ called with constructor type ' + typeof(constructor) + " which is not a function");
      }
  
      /*
       * Previously, the following line was just:
  
       function dummy() {};
  
       * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
       * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
       * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
       * to write a test for this behavior.  -NRD 2013.02.22
       */
      var dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function(){});
      dummy.prototype = constructor.prototype;
      var obj = new dummy;
  
      var r = constructor.apply(obj, argumentList);
      return (r instanceof Object) ? r : obj;
    }function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
      // humanName: a human-readable string name for the function to be generated.
      // argTypes: An array that contains the embind type objects for all types in the function signature.
      //    argTypes[0] is the type object for the function return value.
      //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
      //    argTypes[2...] are the actual function parameters.
      // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
      // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
      // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
      var argCount = argTypes.length;
  
      if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
  
      var isClassMethodFunc = (argTypes[1] !== null && classType !== null);
  
      // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
  // TODO: This omits argument count check - enable only at -O3 or similar.
  //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
  //       return FUNCTION_TABLE[fn];
  //    }
  
  
      // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
      // TODO: Remove this completely once all function invokers are being dynamically generated.
      var needsDestructorStack = false;
  
      for(var i = 1; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here.
          if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { // The type does not define a destructor function - must use dynamic stack
              needsDestructorStack = true;
              break;
          }
      }
  
      var returns = (argTypes[0].name !== "void");
  
      var argsList = "";
      var argsListWired = "";
      for(var i = 0; i < argCount - 2; ++i) {
          argsList += (i!==0?", ":"")+"arg"+i;
          argsListWired += (i!==0?", ":"")+"arg"+i+"Wired";
      }
  
      var invokerFnBody =
          "return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n" +
          "if (arguments.length !== "+(argCount - 2)+") {\n" +
              "throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount - 2)+" args!');\n" +
          "}\n";
  
  
      if (needsDestructorStack) {
          invokerFnBody +=
              "var destructors = [];\n";
      }
  
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
      var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
  
  
      if (isClassMethodFunc) {
          invokerFnBody += "var thisWired = classParam.toWireType("+dtorStack+", this);\n";
      }
  
      for(var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += "var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";
          args1.push("argType"+i);
          args2.push(argTypes[i+2]);
      }
  
      if (isClassMethodFunc) {
          argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
  
      invokerFnBody +=
          (returns?"var rv = ":"") + "invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";
  
      if (needsDestructorStack) {
          invokerFnBody += "runDestructors(destructors);\n";
      } else {
          for(var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
              var paramName = (i === 1 ? "thisWired" : ("arg"+(i - 2)+"Wired"));
              if (argTypes[i].destructorFunction !== null) {
                  invokerFnBody += paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";
                  args1.push(paramName+"_dtor");
                  args2.push(argTypes[i].destructorFunction);
              }
          }
      }
  
      if (returns) {
          invokerFnBody += "var ret = retType.fromWireType(rv);\n" +
                           "return ret;\n";
      } else {
      }
      invokerFnBody += "}\n";
  
      args1.push(invokerFnBody);
  
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }function __embind_register_class_function(
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr, // [ReturnType, ThisType, Args...]
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
  
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = classType.name + '.' + methodName;
  
          if (isPureVirtual) {
              classType.registeredClass.pureVirtualFunctions.push(methodName);
          }
  
          function unboundTypesHandler() {
              throwUnboundTypeError('Cannot call ' + humanName + ' due to unbound types', rawArgTypes);
          }
  
          var proto = classType.registeredClass.instancePrototype;
          var method = proto[methodName];
          if (undefined === method || (undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2)) {
              // This is the first overload to be registered, OR we are replacing a function in the base class with a function in the derived class.
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
          } else {
              // There was an existing function with the same name registered. Set up a function overload routing table.
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
          }
  
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
  
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
  
              // Replace the initial unbound-handler-stub function with the appropriate member function, now that all types
              // are resolved. If multiple overloads are registered for this function, the function goes into an overload table.
              if (undefined === proto[methodName].overloadTable) {
                  // Set argCount in case an overload is registered later
                  memberFunction.argCount = argCount - 2;
                  proto[methodName] = memberFunction;
              } else {
                  proto[methodName].overloadTable[argCount - 2] = memberFunction;
              }
  
              return [];
          });
          return [];
      });
    }

  
  
  var emval_free_list=[];
  
  var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
          emval_handle_array[handle] = undefined;
          emval_free_list.push(handle);
      }
    }
  
  
  
  function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              ++count;
          }
      }
      return count;
    }
  
  function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              return emval_handle_array[i];
          }
      }
      return null;
    }function init_emval() {
      Module['count_emval_handles'] = count_emval_handles;
      Module['get_first_emval'] = get_first_emval;
    }function __emval_register(value) {
  
      switch(value){
        case undefined :{ return 1; }
        case null :{ return 2; }
        case true :{ return 3; }
        case false :{ return 4; }
        default:{
          var handle = emval_free_list.length ?
              emval_free_list.pop() :
              emval_handle_array.length;
  
          emval_handle_array[handle] = {refcount: 1, value: value};
          return handle;
          }
        }
    }function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(handle) {
              var rv = emval_handle_array[handle].value;
              __emval_decref(handle);
              return rv;
          },
          'toWireType': function(destructors, value) {
              return __emval_register(value);
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: null, // This type does not need a destructor
  
          // TODO: do we need a deleteObject here?  write a test where
          // emval is passed into JS via an interface
      });
    }

  
  function _embind_repr(v) {
      if (v === null) {
          return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
          return v.toString();
      } else {
          return '' + v;
      }
    }
  
  function floatReadValueFromPointer(name, shift) {
      switch (shift) {
          case 2: return function(pointer) {
              return this['fromWireType'](HEAPF32[pointer >> 2]);
          };
          case 3: return function(pointer) {
              return this['fromWireType'](HEAPF64[pointer >> 3]);
          };
          default:
              throw new TypeError("Unknown float type: " + name);
      }
    }function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              return value;
          },
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following if() and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              return value;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': floatReadValueFromPointer(name, shift),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
  
      rawInvoker = embind__requireFunction(signature, rawInvoker);
  
      exposePublicSymbol(name, function() {
          throwUnboundTypeError('Cannot call ' + name + ' due to unbound types', argTypes);
      }, argCount - 1);
  
      whenDependentTypesAreResolved([], argTypes, function(argTypes) {
          var invokerArgsArray = [argTypes[0] /* return value */, null /* no class 'this'*/].concat(argTypes.slice(1) /* actual params */);
          replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null /* no class 'this'*/, rawInvoker, fn), argCount - 1);
          return [];
      });
    }

  
  function integerReadValueFromPointer(name, shift, signed) {
      // integers are quite common, so generate very specialized functions
      switch (shift) {
          case 0: return signed ?
              function readS8FromPointer(pointer) { return HEAP8[pointer]; } :
              function readU8FromPointer(pointer) { return HEAPU8[pointer]; };
          case 1: return signed ?
              function readS16FromPointer(pointer) { return HEAP16[pointer >> 1]; } :
              function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1]; };
          case 2: return signed ?
              function readS32FromPointer(pointer) { return HEAP32[pointer >> 2]; } :
              function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2]; };
          default:
              throw new TypeError("Unknown integer type: " + name);
      }
    }function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);
      if (maxRange === -1) { // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come out as 'i32 -1'. Always treat those as max u32.
          maxRange = 4294967295;
      }
  
      var shift = getShiftFromSize(size);
  
      var fromWireType = function(value) {
          return value;
      };
  
      if (minRange === 0) {
          var bitshift = 32 - 8*size;
          fromWireType = function(value) {
              return (value << bitshift) >>> bitshift;
          };
      }
  
      var isUnsignedType = (name.indexOf('unsigned') != -1);
  
      registerType(primitiveType, {
          name: name,
          'fromWireType': fromWireType,
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following two if()s and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              if (value < minRange || value > maxRange) {
                  throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ', ' + maxRange + ']!');
              }
              return isUnsignedType ? (value >>> 0) : (value | 0);
          },
          'argPackAdvance': 8,
          'readValueFromPointer': integerReadValueFromPointer(name, shift, minRange !== 0),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
      ];
  
      var TA = typeMapping[dataTypeIndex];
  
      function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle]; // in elements
          var data = heap[handle + 1]; // byte offset into emscripten heap
          return new TA(heap['buffer'], data, size);
      }
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': decodeMemoryView,
          'argPackAdvance': 8,
          'readValueFromPointer': decodeMemoryView,
      }, {
          ignoreDuplicateRegistrations: true,
      });
    }

  function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8
      //process only std::string bindings with UTF8 support, in contrast to e.g. std::basic_string<unsigned char>
      = (name === "std::string");
  
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var length = HEAPU32[value >> 2];
  
              var str;
              if(stdStringIsUTF8) {
                  //ensure null termination at one-past-end byte if not present yet
                  var endChar = HEAPU8[value + 4 + length];
                  var endCharSwap = 0;
                  if(endChar != 0)
                  {
                    endCharSwap = endChar;
                    HEAPU8[value + 4 + length] = 0;
                  }
  
                  var decodeStartPtr = value + 4;
                  //looping here to support possible embedded '0' bytes
                  for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = value + 4 + i;
                    if(HEAPU8[currentBytePtr] == 0)
                    {
                      var stringSegment = UTF8ToString(decodeStartPtr);
                      if(str === undefined)
                        str = stringSegment;
                      else
                      {
                        str += String.fromCharCode(0);
                        str += stringSegment;
                      }
                      decodeStartPtr = currentBytePtr + 1;
                    }
                  }
  
                  if(endCharSwap != 0)
                    HEAPU8[value + 4 + length] = endCharSwap;
              } else {
                  var a = new Array(length);
                  for (var i = 0; i < length; ++i) {
                      a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
                  }
                  str = a.join('');
              }
  
              _free(value);
  
              return str;
          },
          'toWireType': function(destructors, value) {
              if (value instanceof ArrayBuffer) {
                  value = new Uint8Array(value);
              }
  
              var getLength;
              var valueIsOfTypeString = (typeof value === 'string');
  
              if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                  throwBindingError('Cannot pass non-string to std::string');
              }
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                  getLength = function() {return lengthBytesUTF8(value);};
              } else {
                  getLength = function() {return value.length;};
              }
  
              // assumes 4-byte alignment
              var length = getLength();
              var ptr = _malloc(4 + length + 1);
              HEAPU32[ptr >> 2] = length;
  
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                  stringToUTF8(value, ptr + 4, length + 1);
              } else {
                  if(valueIsOfTypeString) {
                      for (var i = 0; i < length; ++i) {
                          var charCode = value.charCodeAt(i);
                          if (charCode > 255) {
                              _free(ptr);
                              throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                          }
                          HEAPU8[ptr + 4 + i] = charCode;
                      }
                  } else {
                      for (var i = 0; i < length; ++i) {
                          HEAPU8[ptr + 4 + i] = value[i];
                      }
                  }
              }
  
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function __embind_register_std_wstring(rawType, charSize, name) {
      // nb. do not cache HEAPU16 and HEAPU32, they may be destroyed by emscripten_resize_heap().
      name = readLatin1String(name);
      var getHeap, shift;
      if (charSize === 2) {
          getHeap = function() { return HEAPU16; };
          shift = 1;
      } else if (charSize === 4) {
          getHeap = function() { return HEAPU32; };
          shift = 2;
      }
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var HEAP = getHeap();
              var length = HEAPU32[value >> 2];
              var a = new Array(length);
              var start = (value + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  a[i] = String.fromCharCode(HEAP[start + i]);
              }
              _free(value);
              return a.join('');
          },
          'toWireType': function(destructors, value) {
              // assumes 4-byte alignment
              var length = value.length;
              var ptr = _malloc(4 + length * charSize);
              var HEAP = getHeap();
              HEAPU32[ptr >> 2] = length;
              var start = (ptr + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  HEAP[start + i] = value.charCodeAt(i);
              }
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function __embind_register_value_object(
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor
    ) {
      structRegistrations[rawType] = {
          name: readLatin1String(name),
          rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
          rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
          fields: [],
      };
    }

  function __embind_register_value_object_field(
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) {
      structRegistrations[structType].fields.push({
          fieldName: readLatin1String(fieldName),
          getterReturnType: getterReturnType,
          getter: embind__requireFunction(getterSignature, getter),
          getterContext: getterContext,
          setterArgumentType: setterArgumentType,
          setter: embind__requireFunction(setterSignature, setter),
          setterContext: setterContext,
      });
    }

  function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          isVoid: true, // void return values can be optimized out sometimes
          name: name,
          'argPackAdvance': 0,
          'fromWireType': function() {
              return undefined;
          },
          'toWireType': function(destructors, o) {
              // TODO: assert if anything else is given?
              return undefined;
          },
      });
    }


  function __emval_incref(handle) {
      if (handle > 4) {
          emval_handle_array[handle].refcount += 1;
      }
    }

  
  function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
          throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }
      return impl;
    }function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, '_emval_take_value');
      var v = type['readValueFromPointer'](argv);
      return __emval_register(v);
    }

  function _abort() {
      abort();
    }

  function _emscripten_get_heap_size() {
      return HEAP8.length;
    }

  function _emscripten_get_sbrk_ptr() {
      return 6816;
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
    }

  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
    }function _emscripten_resize_heap(requestedSize) {
      abortOnCannotGrowMemory(requestedSize);
    }

  
  
  var PATH={splitPath:function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function(path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function(path) {
        return PATH.splitPath(path)[3];
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function(l, r) {
        return PATH.normalize(l + '/' + r);
      }};var SYSCALLS={buffers:[null,[],[]],printChar:function(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        assert(buffer);
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },varargs:0,get:function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
      },get64:function() {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function() {
        assert(SYSCALLS.get() === 0);
      }};function _fd_close(fd) {try {
  
      abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
  
      abort('it should not be possible to operate on streams when !SYSCALLS_REQUIRE_FILESYSTEM');
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  
  function flush_NO_FILESYSTEM() {
      // flush anything remaining in the buffers during shutdown
      var fflush = Module["_fflush"];
      if (fflush) fflush(0);
      var buffers = SYSCALLS.buffers;
      if (buffers[1].length) SYSCALLS.printChar(1, 10);
      if (buffers[2].length) SYSCALLS.printChar(2, 10);
    }function _fd_write(fd, iov, iovcnt, pnum) {try {
  
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(((iov)+(i*8))>>2)];
        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  
  function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      var aligned_dest_end = 0;
      var block_aligned_dest_end = 0;
      var dest_end = 0;
      // Test against a benchmarked cutoff limit for when HEAPU8.set() becomes faster to use.
      if ((num|0) >= 8192) {
        _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
        return dest|0;
      }
  
      ret = dest|0;
      dest_end = (dest + num)|0;
      if ((dest&3) == (src&3)) {
        // The initial unaligned < 4-byte front.
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        aligned_dest_end = (dest_end & -4)|0;
        block_aligned_dest_end = (aligned_dest_end - 64)|0;
        while ((dest|0) <= (block_aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          HEAP32[(((dest)+(4))>>2)]=((HEAP32[(((src)+(4))>>2)])|0);
          HEAP32[(((dest)+(8))>>2)]=((HEAP32[(((src)+(8))>>2)])|0);
          HEAP32[(((dest)+(12))>>2)]=((HEAP32[(((src)+(12))>>2)])|0);
          HEAP32[(((dest)+(16))>>2)]=((HEAP32[(((src)+(16))>>2)])|0);
          HEAP32[(((dest)+(20))>>2)]=((HEAP32[(((src)+(20))>>2)])|0);
          HEAP32[(((dest)+(24))>>2)]=((HEAP32[(((src)+(24))>>2)])|0);
          HEAP32[(((dest)+(28))>>2)]=((HEAP32[(((src)+(28))>>2)])|0);
          HEAP32[(((dest)+(32))>>2)]=((HEAP32[(((src)+(32))>>2)])|0);
          HEAP32[(((dest)+(36))>>2)]=((HEAP32[(((src)+(36))>>2)])|0);
          HEAP32[(((dest)+(40))>>2)]=((HEAP32[(((src)+(40))>>2)])|0);
          HEAP32[(((dest)+(44))>>2)]=((HEAP32[(((src)+(44))>>2)])|0);
          HEAP32[(((dest)+(48))>>2)]=((HEAP32[(((src)+(48))>>2)])|0);
          HEAP32[(((dest)+(52))>>2)]=((HEAP32[(((src)+(52))>>2)])|0);
          HEAP32[(((dest)+(56))>>2)]=((HEAP32[(((src)+(56))>>2)])|0);
          HEAP32[(((dest)+(60))>>2)]=((HEAP32[(((src)+(60))>>2)])|0);
          dest = (dest+64)|0;
          src = (src+64)|0;
        }
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      } else {
        // In the unaligned copy case, unroll a bit as well.
        aligned_dest_end = (dest_end - 4)|0;
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          HEAP8[(((dest)+(1))>>0)]=((HEAP8[(((src)+(1))>>0)])|0);
          HEAP8[(((dest)+(2))>>0)]=((HEAP8[(((src)+(2))>>0)])|0);
          HEAP8[(((dest)+(3))>>0)]=((HEAP8[(((src)+(3))>>0)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      }
      // The remaining unaligned < 4 byte tail.
      while ((dest|0) < (dest_end|0)) {
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
      }
      return ret|0;
    }

  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
      end = (ptr + num)|0;
  
      value = value & 0xff;
      if ((num|0) >= 67 /* 64 bytes for an unrolled loop + 3 bytes for unaligned head*/) {
        while ((ptr&3) != 0) {
          HEAP8[((ptr)>>0)]=value;
          ptr = (ptr+1)|0;
        }
  
        aligned_end = (end & -4)|0;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
  
        block_aligned_end = (aligned_end - 64)|0;
  
        while((ptr|0) <= (block_aligned_end|0)) {
          HEAP32[((ptr)>>2)]=value4;
          HEAP32[(((ptr)+(4))>>2)]=value4;
          HEAP32[(((ptr)+(8))>>2)]=value4;
          HEAP32[(((ptr)+(12))>>2)]=value4;
          HEAP32[(((ptr)+(16))>>2)]=value4;
          HEAP32[(((ptr)+(20))>>2)]=value4;
          HEAP32[(((ptr)+(24))>>2)]=value4;
          HEAP32[(((ptr)+(28))>>2)]=value4;
          HEAP32[(((ptr)+(32))>>2)]=value4;
          HEAP32[(((ptr)+(36))>>2)]=value4;
          HEAP32[(((ptr)+(40))>>2)]=value4;
          HEAP32[(((ptr)+(44))>>2)]=value4;
          HEAP32[(((ptr)+(48))>>2)]=value4;
          HEAP32[(((ptr)+(52))>>2)]=value4;
          HEAP32[(((ptr)+(56))>>2)]=value4;
          HEAP32[(((ptr)+(60))>>2)]=value4;
          ptr = (ptr + 64)|0;
        }
  
        while ((ptr|0) < (aligned_end|0) ) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      // The remaining bytes.
      while ((ptr|0) < (end|0)) {
        HEAP8[((ptr)>>0)]=value;
        ptr = (ptr+1)|0;
      }
      return (end-num)|0;
    }

  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }
InternalError = Module['InternalError'] = extendError(Error, 'InternalError');;
embind_init_charCodes();
BindingError = Module['BindingError'] = extendError(Error, 'BindingError');;
init_ClassHandle();
init_RegisteredPointer();
init_embind();;
UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');;
init_emval();;
var ASSERTIONS = true;

// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {String} input The string to decode.
 */
var decodeBase64 = typeof atob === 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, 'base64');
    } catch (_) {
      buf = new Buffer(s, 'base64');
    }
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


// ASM_LIBRARY EXTERN PRIMITIVES: Int8Array,Int32Array

var asmGlobalArg = {};
var asmLibraryArg = { "__assert_fail": ___assert_fail, "__cxa_allocate_exception": ___cxa_allocate_exception, "__cxa_atexit": ___cxa_atexit, "__cxa_throw": ___cxa_throw, "__handle_stack_overflow": ___handle_stack_overflow, "__lock": ___lock, "__unlock": ___unlock, "_embind_finalize_value_object": __embind_finalize_value_object, "_embind_register_bool": __embind_register_bool, "_embind_register_class": __embind_register_class, "_embind_register_class_constructor": __embind_register_class_constructor, "_embind_register_class_function": __embind_register_class_function, "_embind_register_emval": __embind_register_emval, "_embind_register_float": __embind_register_float, "_embind_register_function": __embind_register_function, "_embind_register_integer": __embind_register_integer, "_embind_register_memory_view": __embind_register_memory_view, "_embind_register_std_string": __embind_register_std_string, "_embind_register_std_wstring": __embind_register_std_wstring, "_embind_register_value_object": __embind_register_value_object, "_embind_register_value_object_field": __embind_register_value_object_field, "_embind_register_void": __embind_register_void, "_emval_decref": __emval_decref, "_emval_incref": __emval_incref, "_emval_take_value": __emval_take_value, "abort": _abort, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_resize_heap": _emscripten_resize_heap, "fd_close": _fd_close, "fd_seek": _fd_seek, "fd_write": _fd_write, "getTempRet0": getTempRet0, "memory": wasmMemory, "setTempRet0": setTempRet0, "table": wasmTable };
var asm = createWasm();
var real____wasm_call_ctors = asm["__wasm_call_ctors"];
asm["__wasm_call_ctors"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____wasm_call_ctors.apply(null, arguments);
};

var real___Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb = asm["_Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb"];
asm["_Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real___Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb.apply(null, arguments);
};

var real__malloc = asm["malloc"];
asm["malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__malloc.apply(null, arguments);
};

var real____errno_location = asm["__errno_location"];
asm["__errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____errno_location.apply(null, arguments);
};

var real__fflush = asm["fflush"];
asm["fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__fflush.apply(null, arguments);
};

var real__setThrew = asm["setThrew"];
asm["setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__setThrew.apply(null, arguments);
};

var real___ZSt18uncaught_exceptionv = asm["_ZSt18uncaught_exceptionv"];
asm["_ZSt18uncaught_exceptionv"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real___ZSt18uncaught_exceptionv.apply(null, arguments);
};

var real__free = asm["free"];
asm["free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__free.apply(null, arguments);
};

var real____getTypeName = asm["__getTypeName"];
asm["__getTypeName"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____getTypeName.apply(null, arguments);
};

var real____embind_register_native_and_builtin_types = asm["__embind_register_native_and_builtin_types"];
asm["__embind_register_native_and_builtin_types"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____embind_register_native_and_builtin_types.apply(null, arguments);
};

var real____set_stack_limit = asm["__set_stack_limit"];
asm["__set_stack_limit"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____set_stack_limit.apply(null, arguments);
};

var real_stackSave = asm["stackSave"];
asm["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackSave.apply(null, arguments);
};

var real_stackAlloc = asm["stackAlloc"];
asm["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackAlloc.apply(null, arguments);
};

var real_stackRestore = asm["stackRestore"];
asm["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackRestore.apply(null, arguments);
};

var real___growWasmMemory = asm["__growWasmMemory"];
asm["__growWasmMemory"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real___growWasmMemory.apply(null, arguments);
};

var real_dynCall_vi = asm["dynCall_vi"];
asm["dynCall_vi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_vi.apply(null, arguments);
};

var real_dynCall_ii = asm["dynCall_ii"];
asm["dynCall_ii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_ii.apply(null, arguments);
};

var real_dynCall_viiii = asm["dynCall_viiii"];
asm["dynCall_viiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiii.apply(null, arguments);
};

var real_dynCall_iiiii = asm["dynCall_iiiii"];
asm["dynCall_iiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiiii.apply(null, arguments);
};

var real_dynCall_vii = asm["dynCall_vii"];
asm["dynCall_vii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_vii.apply(null, arguments);
};

var real_dynCall_viii = asm["dynCall_viii"];
asm["dynCall_viii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viii.apply(null, arguments);
};

var real_dynCall_i = asm["dynCall_i"];
asm["dynCall_i"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_i.apply(null, arguments);
};

var real_dynCall_iiii = asm["dynCall_iiii"];
asm["dynCall_iiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiii.apply(null, arguments);
};

var real_dynCall_viid = asm["dynCall_viid"];
asm["dynCall_viid"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viid.apply(null, arguments);
};

var real_dynCall_dii = asm["dynCall_dii"];
asm["dynCall_dii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_dii.apply(null, arguments);
};

var real_dynCall_iii = asm["dynCall_iii"];
asm["dynCall_iii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iii.apply(null, arguments);
};

var real_dynCall_diii = asm["dynCall_diii"];
asm["dynCall_diii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_diii.apply(null, arguments);
};

var real_dynCall_v = asm["dynCall_v"];
asm["dynCall_v"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_v.apply(null, arguments);
};

var real_dynCall_iidiiii = asm["dynCall_iidiiii"];
asm["dynCall_iidiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iidiiii.apply(null, arguments);
};

var real_dynCall_jiji = asm["dynCall_jiji"];
asm["dynCall_jiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_jiji.apply(null, arguments);
};

var real_dynCall_viiiiii = asm["dynCall_viiiiii"];
asm["dynCall_viiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiiii.apply(null, arguments);
};

var real_dynCall_viiiii = asm["dynCall_viiiii"];
asm["dynCall_viiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiii.apply(null, arguments);
};

Module["asm"] = asm;
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__wasm_call_ctors"].apply(null, arguments)
};

var __Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb = Module["__Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_Z4calcNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEcb"].apply(null, arguments)
};

var _malloc = Module["_malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["malloc"].apply(null, arguments)
};

var ___errno_location = Module["___errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__errno_location"].apply(null, arguments)
};

var _fflush = Module["_fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["fflush"].apply(null, arguments)
};

var _setThrew = Module["_setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["setThrew"].apply(null, arguments)
};

var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["_ZSt18uncaught_exceptionv"].apply(null, arguments)
};

var _free = Module["_free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["free"].apply(null, arguments)
};

var ___getTypeName = Module["___getTypeName"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__getTypeName"].apply(null, arguments)
};

var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__embind_register_native_and_builtin_types"].apply(null, arguments)
};

var ___set_stack_limit = Module["___set_stack_limit"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__set_stack_limit"].apply(null, arguments)
};

var stackSave = Module["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackSave"].apply(null, arguments)
};

var stackAlloc = Module["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackAlloc"].apply(null, arguments)
};

var stackRestore = Module["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackRestore"].apply(null, arguments)
};

var __growWasmMemory = Module["__growWasmMemory"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__growWasmMemory"].apply(null, arguments)
};

var dynCall_vi = Module["dynCall_vi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vi"].apply(null, arguments)
};

var dynCall_ii = Module["dynCall_ii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_ii"].apply(null, arguments)
};

var dynCall_viiii = Module["dynCall_viiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiii"].apply(null, arguments)
};

var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiiii"].apply(null, arguments)
};

var dynCall_vii = Module["dynCall_vii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vii"].apply(null, arguments)
};

var dynCall_viii = Module["dynCall_viii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viii"].apply(null, arguments)
};

var dynCall_i = Module["dynCall_i"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_i"].apply(null, arguments)
};

var dynCall_iiii = Module["dynCall_iiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiii"].apply(null, arguments)
};

var dynCall_viid = Module["dynCall_viid"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viid"].apply(null, arguments)
};

var dynCall_dii = Module["dynCall_dii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_dii"].apply(null, arguments)
};

var dynCall_iii = Module["dynCall_iii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iii"].apply(null, arguments)
};

var dynCall_diii = Module["dynCall_diii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_diii"].apply(null, arguments)
};

var dynCall_v = Module["dynCall_v"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_v"].apply(null, arguments)
};

var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iidiiii"].apply(null, arguments)
};

var dynCall_jiji = Module["dynCall_jiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_jiji"].apply(null, arguments)
};

var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
};

var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
};




// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;

if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getValue")) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getMemory")) Module["getMemory"] = function() { abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString")) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8")) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addRunDependency")) Module["addRunDependency"] = function() { abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "removeRunDependency")) Module["removeRunDependency"] = function() { abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createFolder")) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPath")) Module["FS_createPath"] = function() { abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDataFile")) Module["FS_createDataFile"] = function() { abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createPreloadedFile")) Module["FS_createPreloadedFile"] = function() { abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLazyFile")) Module["FS_createLazyFile"] = function() { abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createLink")) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_createDevice")) Module["FS_createDevice"] = function() { abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "FS_unlink")) Module["FS_unlink"] = function() { abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynamicAlloc")) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadDynamicLibrary")) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadWebAssemblyModule")) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() { abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() { abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
Module["abortStackOverflow"] = abortStackOverflow;
if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromBase64")) Module["intArrayFromBase64"] = function() { abort("'intArrayFromBase64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "tryParseAsDataURI")) Module["tryParseAsDataURI"] = function() { abort("'tryParseAsDataURI' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", { configurable: true, get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", { configurable: true, get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_DYNAMIC")) Object.defineProperty(Module, "ALLOC_DYNAMIC", { configurable: true, get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NONE")) Object.defineProperty(Module, "ALLOC_NONE", { configurable: true, get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "calledRun")) Object.defineProperty(Module, "calledRun", { configurable: true, get: function() { abort("'calledRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") } });



var calledRun;


/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;


dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};





/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var print = out;
  var printErr = err;
  var has = false;
  out = err = function(x) {
    has = true;
  }
  try { // it doesn't matter if it fails
    var flush = flush_NO_FILESYSTEM;
    if (flush) flush(0);
  } catch(e) {}
  out = print;
  err = printErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -s FORCE_FILESYSTEM=1)');
  }
}

function exit(status, implicit) {
  checkUnflushedContent();

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && noExitRuntime && status === 0) {
    return;
  }

  if (noExitRuntime) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      err('program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)');
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  quit_(status, new ExitStatus(status));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}


  noExitRuntime = true;

run();





// {{MODULE_ADDITIONS}}



