const util = require('util')
const fs = require('fs')
const source = fs.readFileSync('./lib/strategy.wasm')
const env = {
    __memory_base: 0,
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
        initial: 256,
    }),
    table: new WebAssembly.Table({
        initial: 0,
        element: 'anyfunc',
    }),
    abort: function abort() {
        throw new Error('abort')
    },
    abortOnCannotGrowMemory: function abortOnCannotGrowMemory() {
        throw new Error('abort: cannot grow memory')
    },
    ___cxa_uncaught_exception: function () {
        throw new Error('___cxa_uncaught_exception')
    },
    _puts: function puts(...args) {
        console.log('puts', args)
    },
}

const typedArray = new Uint8Array(source)

WebAssembly.instantiate(typedArray, {
    env,
}).then(result => {
    console.log(util.inspect(result.instance.exports, true, 0))
    console.log(result.instance.exports._add(2, 3))
}).catch(err => {
    console.error(err)
})
