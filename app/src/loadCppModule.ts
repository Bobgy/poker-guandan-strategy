import { portCppModule } from './portCppModule'

interface VectorString {
  size: () => number
  get: (index: number) => string
}

interface OriginalStrategyResult {
  minHands: number
  solutions: VectorString
}

export type CardRaw = string

export type HandRaw = CardRaw[]

export interface StrategyResult {
  minHands: number
  solutionsRaw: string[]
  solutions: {
    asHands: HandRaw[]
  }[]
}

export interface CppModule {
  onRuntimeInitialized: () => void
  onAbort: () => void
  add: (a: number, b: number) => number
  calc: (cards: string, mainRank: number) => OriginalStrategyResult
}

export interface PortedCppModule {
  calc: (cards: string, mainRank: string) => StrategyResult
}

declare global {
  interface Window {
    Module: CppModule
  }
}

export function vector2Array(vec: VectorString): string[] {
  const arr = []
  for (let i = 0; i < vec.size(); ++i) {
    arr.push(vec.get(i))
  }

  return arr
}

export function loadCppModule(): Promise<PortedCppModule> {
  return new Promise((resolve, reject) => {
    if (window.Module) {
      return resolve(portCppModule(window.Module))
    } else {
      const s = document.createElement('script')
      s.src = 'res/strategy.js'
      s.onload = () => {
        const cppModule = window.Module
        cppModule.onRuntimeInitialized = () => {
          resolve(portCppModule(window.Module))
        }
        cppModule.onAbort = () => {
          reject('wasm module aborted during loading')
        }
      }
      s.onerror = () => reject('wasm module failed to load')
      document.body.appendChild(s)
    }
  })
}
