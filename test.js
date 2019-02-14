const cppModule = require('./lib/strategy')

function vector2Array(vec) {
    const arr = [];
    for (let i = 0; i < vec.size(); ++i) {
        arr.push(vec.get(i));
    }

    return arr;
}

cppModule.onRuntimeInitialized = () => {
    console.log(cppModule.add(2, 3))
    console.log(cppModule.concat('Hello,', ' World'))
    console.log(vector2Array(cppModule.makeArr("abc", "def")))
}
