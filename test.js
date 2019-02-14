const cppModule = require('./lib/strategy')

cppModule.onRuntimeInitialized = () => {
    console.log(cppModule.add(2, 3))
    console.log(cppModule.concat('Hello,', ' World'))
}
