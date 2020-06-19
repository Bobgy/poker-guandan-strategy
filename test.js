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
    const strategyResult = cppModule.calc("BJADKDJH0S0C0CAH8D7S7H4H4D4H3D3C2H9C7CAH6C5CKSQSJS0S9S", "A".charCodeAt(0))
    console.log(strategyResult.minHands)
    console.log(vector2Array(strategyResult.solutions))
}
