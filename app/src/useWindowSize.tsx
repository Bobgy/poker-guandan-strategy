import { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'

export type WindowSize = 'BIG' | 'SMALL'
const LARGE_SCREEN_LENGTH = 720

function calcWindowSize(): WindowSize {
  const { width, height } = Dimensions.get('window')
  return width >= LARGE_SCREEN_LENGTH && height >= LARGE_SCREEN_LENGTH
    ? 'BIG'
    : 'SMALL'
}

export function useWindowSize() {
  const [size, setSize] = useState<WindowSize>(calcWindowSize)
  useEffect(() => {
    function handleWindowSizeChange() {
      setSize(calcWindowSize())
    }
    Dimensions.addEventListener('change', handleWindowSizeChange)
    // unsubscribe when effect destroyed
    return () =>
      Dimensions.removeEventListener('change', handleWindowSizeChange)
  }, [setSize])
  return size
}
