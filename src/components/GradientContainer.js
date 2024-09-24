import React from 'react'
import { View } from 'react-native'
import { COLORS } from '../common/Constant'
import LinearGradient from 'react-native-linear-gradient'

const GradientContainer = React.memo((props) => {
  const {style,colors=[COLORS.lightGreen, COLORS.lightBlue]} = props

  return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={colors}
        style={style}>
          {props.children}
        </LinearGradient>
  )
})

export default GradientContainer
