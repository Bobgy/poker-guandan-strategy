interface VectorString {
    size: () => number;
    get: (index: number) => string;
}

interface OriginalStrategyResult {
    minHands: number,
    solutions: VectorString,
}

interface StrategyResult {
    minHands: number,
    solutions: string[],
}

interface CppModule {
    onRuntimeInitialized: () => void,
    onAbort: () => void,
    add: (a: number, b: number) => number,
    calc: (cards: string, mainRank: number) => OriginalStrategyResult,
}

interface PortedCppModule {
    calc: (cards: string, mainRank: string) => StrategyResult,
}

declare global {
    interface Window {
        Module: CppModule,
    }
}

function vector2Array(vec: VectorString): string[] {
    const arr = [];
    for (let i = 0; i < vec.size(); ++i) {
        arr.push(vec.get(i));
    }

    return arr;
}

export function loadCppModule(): Promise<PortedCppModule> {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'res/strategy.js'
        s.onload = () => {
            const cppModule = window.Module
            cppModule.onRuntimeInitialized = () => {
                resolve({
                    calc: (cards, mainRank): StrategyResult => {
                        const { minHands, solutions: originalSolutions } = cppModule.calc(cards, mainRank.charCodeAt(0))

                        return {
                            minHands,
                            solutions: vector2Array(originalSolutions),
                        }
                    }
                })
            }
            cppModule.onAbort = () => {
                reject('wasm module aborted during loading')
            }
        }
        s.onerror = () => reject('wasm module failed to load')
        document.body.appendChild(s)
    })
}