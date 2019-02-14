const binding = require('./binding')

binding.cppModule.onRuntimeInitialized = () => {
    console.log(binding.add(1, 2))
}
