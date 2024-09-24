import { View } from 'native-base'
import React from 'react'
import Svg, {Line, LinearGradient, Stop, Defs}  from 'react-native-svg'

const ProgressBar = React.memo((props) => {
  const {width, progress,color1,color2,strokeColor} = props
  return (
    <View style={{height:15, width: width+5}}>
      <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="100%" stopColor={color2||"#0CDD99"}/>
          <Stop offset="0%"   stopColor={color1||"#e56930"}/>
        </LinearGradient>
      </Defs>
      <Line x1="4" y1="5" x2={`${width}`} y2="5" stroke={strokeColor||"white"} strokeWidth="10" strokeLinecap="round"/>
      <Line x1="5" y1="5" x2={`${width*progress}`} y2="5" stroke="url(#linear)" strokeWidth="8" strokeLinecap="round"/>

      </Svg>
    </View>
  )
})

export default ProgressBar
