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

export interface Solution {
  actualHands: HandRaw[]
}

export interface StrategyResult {
  minHands: number
  solutionsRaw: string[]
  solutions: Solution[]
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(`${src} had some errors when loading`)
    document.body.appendChild(s)
  })
}

export function loadCppModule(): Promise<PortedCppModule> {
  if (window.Module) {
    return Promise.resolve(portCppModule(window.Module))
  } else {
    const modulePromise = new Promise<PortedCppModule>((resolve, reject) => {
      ;(window.Module as any) = {
        onRuntimeInitialized() {
          resolve(portCppModule(window.Module))
        },
        onAbort() {
          reject('wasm module aborted during loading')
        },
      }
    })
    return loadScript('res/strategy.js')
      .then(() => modulePromise)
      .catch(() => {
        return Promise.reject('wasm module failed to load')
      })
  }
}
