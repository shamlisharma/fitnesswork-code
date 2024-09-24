import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
// import { COLOR } from 'react-native-material-design';
import { COLORS } from '../common/Constant';
const CountDownTimer = React.memo((props) => {
  const {duration,hit} = props;
  const [timeLeft, setTimeLeft] = useState((duration/1000)-1);

  useEffect(() => {
    let timerId
    if(timeLeft>0)
      timerId = setInterval(()=> setTimeLeft(prevState => prevState-1), 1000)
    else if(timeLeft<=0)
      setTimeLeft(0)
    return () => {
      clearInterval(timerId);
    }
  })
  return (
      <Text style={{color:hit== "true" ? COLORS.blue:'white',fontSize:hit== "true" ? 16:12}}>{timeLeft}</Text>
  )
})

export default CountDownTimer
