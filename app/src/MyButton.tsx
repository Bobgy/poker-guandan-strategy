import React, { FunctionComponent, ReactNode } from 'react'
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
} from 'react-native'
import { theme } from './CardsChooser'

interface MyButtonProps extends TouchableOpacityProps {
  title: ReactNode
  titleStyle?: StyleProp<TextStyle>
}

export const MyButton: FunctionComponent<MyButtonProps> = ({
  style,
  titleStyle,
  title,
  disabled,
  ...restProps
}) => (
  <TouchableOpacity
    style={[
      {
        backgroundColor: disabled
          ? theme.disabled.background
          : theme.button.background,
        borderRadius: 2,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
      style,
    ]}
    disabled={disabled}
    {...restProps}
  >
    <Text
      style={[
        {
          color: disabled ? theme.disabled.text : 'white',
          textAlign: 'center',
        },
        titleStyle,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
)
