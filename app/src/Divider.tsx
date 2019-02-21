import React from 'react'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  divider: {
    height: 2, // avoid floating error
    backgroundColor: 'black',
    marginHorizontal: 10,
  },
})

export function Divider() {
  return <View style={styles.divider} />
}
