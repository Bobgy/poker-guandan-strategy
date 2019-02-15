declare global {
    interface Window {
        Module: unknown,
    }
}

export function loadCppModule(): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'res/strategy.js'
        s.onload = () => resolve(window.Module)
        s.onerror = () => reject('wasm module failed to load')
        document.body.appendChild(s)
    })
}
