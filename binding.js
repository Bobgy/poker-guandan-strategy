const cppModule = require('./lib/strategy.js')
const add = cppModule.cwrap('add', 'number', ['number'])

module.exports = {
    cppModule,
    add,
}
