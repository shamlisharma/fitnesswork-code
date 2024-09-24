import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS } from '../../common/Constant'
import { RightArrowIcon } from '../../Svg'

const FoodSubContainer = React.memo(props => {
  const navigation = useNavigation();
  const { title, icon, onPressIcon, children, arrowIcon,infoIcon,editIcon,onPressInfoIcon } = props
  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
         <TouchableOpacity>
          <View style={styles.titleSubContainer}>
            <Text style={styles.containerTitleTextStyle}>
              {title}
            </Text>
            {arrowIcon && <View style={{left:-10}}><RightArrowIcon /></View>}
          </View>
          </TouchableOpacity>
          {editIcon?
          <View style={{width:20}}>
          <TouchableOpacity 
            style={styles.editButtonStyle}
            onPress={()=>navigation.navigate('Meals')} >
            {editIcon}
          </TouchableOpacity></View>
          :null
}
{infoIcon?
          <View style={{width:20}}>
          <TouchableOpacity 
            style={styles.editButtonStyle}
            onPress={onPressInfoIcon} >
            {infoIcon}
          </TouchableOpacity></View>
          :null
}
          
           <TouchableOpacity 
            style={styles.buttonStyle}
            onPress={onPressIcon} >
            {icon}
           </TouchableOpacity>
        </View>
      </View>
        {children}
     </>

  )
})

export default FoodSubContainer

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputTxtColor,
    marginTop:10,
    marginBottom:2,
  },
  titleContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between'
  },
  titleSubContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'flex-start'
  },
  containerTitleTextStyle: {
    fontSize: 16,
    color: COLORS.grey_2,
    padding:15,
    fontFamily:'Manrope-Bold',
    flexDirection:'row'
  },
  buttonStyle: {
    borderLeftWidth:2, 
    borderColor:'white', 
    padding:18
  },
  editButtonStyle:{
    borderLeftWidth:2, 
    borderColor:'white', 
    padding:16,
    paddingLeft:25 ,
    width:5,
  }
  
})