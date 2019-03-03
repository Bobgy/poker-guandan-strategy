import React, { useState, FunctionComponent, useLayoutEffect } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'

interface FadeProps {
  in: boolean
  style?: StyleProp<ViewStyle>
  timeout: number
}

function delay(func: () => void, timeout: number = 0) {
  const timeoutID = setTimeout(func, 0)

  return () => clearTimeout(timeoutID)
}

// extra time to wait until unmount
const UNMOUNT_DELAY = 100

export const Fade: FunctionComponent<FadeProps> = ({
  children,
  in: show,
  style,
  timeout,
}) => {
  const [fadeAnim, _] = useState(new Animated.Value(0))
  const [mounted, updateMount] = useState(show)

  useLayoutEffect(() => {
    if (show) {
      // mount immediately if it is shown
      if (!mounted) {
        updateMount(true)
      }
      // then animate fading in
      return delay(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: timeout,
        }).start()
      })
    } else {
      // animate fading out immediately
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: timeout,
      }).start()
      // unmount after fading out
      return delay(() => void updateMount(false), timeout + UNMOUNT_DELAY)
    }
  }, [show])

  if (mounted) {
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    )
  } else {
    return null
  }
}
