import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../common/Constant'

const WorkoutSubContainer = React.memo((props) => {
  const {containerTitle} = props;
  return (
    <View style={styles.container}>
      {
        containerTitle?
          <View style={styles.titleContainer}>
            <Text style={styles.titleTextStyle}>{containerTitle}</Text>
          </View>:<View />
      }
      <View style={styles.childrenContainer}>
        {props.children}
      </View>
    </View>
  )
})

export default WorkoutSubContainer

const styles = StyleSheet.create({
  container: {
    marginTop:10
  },
  titleContainer: {
    paddingVertical:10, 
    backgroundColor:COLORS.light_grey, 
    borderTopLeftRadius:5, 
    borderTopRightRadius:5
  },
  titleTextStyle: {
    fontFamily:'Manrope-Bold', 
    fontSize:16, 
    textAlign:'center'
  },
  childrenContainer: {
    marginTop:2, 
    backgroundColor:COLORS.light_grey,
    flex:1, 
    borderBottomLeftRadius:5, 
    borderBottomRightRadius:5
  },
})