import React, { useState, FunctionComponent } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'
import { Transition } from 'react-transition-group'
import { TransitionProps } from 'react-transition-group/Transition'

interface FadeProps extends TransitionProps {
  style?: StyleProp<ViewStyle>
  timeout: number
}

function delay(fn: () => void) {
  return requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fn()
    })
  })
}

const EXTRA_TIMEOUT = 100

export const Fade: FunctionComponent<FadeProps> = ({
  children,
  style,
  timeout,
  ...restProps
}) => {
  const [fadeAnim, _] = useState(new Animated.Value(0))

  return (
    <Transition
      timeout={timeout + EXTRA_TIMEOUT}
      onEntering={() => {
        // start fading in from the next frame (react is rendering in current frame, so animation would be laggy if started immediately)
        delay(() => {
          Animated.timing(fadeAnim, { toValue: 1, duration: timeout }).start()
        })
      }}
      onExiting={() => {
        // start fading out after a delay
        delay(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: timeout,
          }).start()
        })
      }}
      {...restProps}
    >
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
    </Transition>
  )
}
Fade.defaultProps = {
  appear: true,
  enter: true,
  mountOnEnter: true,
  unmountOnExit: true,
}
