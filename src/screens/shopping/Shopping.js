import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View,Text, FlatList,TouchableOpacity,StyleSheet } from 'react-native';
import { COLORS } from '../../common/Constant';
import { MainScreen } from '../../common/Screen';
import { RightArrowIcon } from '../../Svg';

const DATA = [
    {
      title:'Shopping list title',
      item:"29 items",
    },
    {
      title:'Products for new diet',
      item:"29 items",
    },
    {
      title:'To buy in Eco store',
      item:"29 items",
    },
    
  ]
let Shopping = React.memo(function Shopping(){
    const navigation = useNavigation()
  const renderItem = ({item}) => (
    <TouchableOpacity 
      style={styles.componentContainerStyle}
      onPress={()=>navigation.navigate('To buy in Eco store',{title:item.title, length:true})}
      >
          <View>
      <Text style={styles.componentTextStyle}>{item.title}</Text>
      <Text style={styles.itemTitle}>{item.item}</Text>
      </View>
      <RightArrowIcon />
    </TouchableOpacity>
  )
    return(
        <MainScreen>
        <FlatList 
          data={DATA}
          renderItem={renderItem}
          style={{padding:10}}
         />
      </MainScreen>
    )
})
export default Shopping;
const styles = StyleSheet.create({
    componentContainerStyle: {
      backgroundColor:COLORS.light_grey, 
      padding:15, 
      flexDirection:'row', 
      alignItems:'center', 
      justifyContent:'space-between', 
      marginVertical:1 
    },
    componentTextStyle: {
      fontFamily:'Manrope-Regular', 
      fontSize:15,
      color:COLORS.grey_2
    },
    itemTitle:{
        fontSize:14,
        color:COLORS.grey_3,
        fontFamily:"Manrope-Regular"
    }
  })