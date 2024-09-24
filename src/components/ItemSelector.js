import React, { useEffect, useState } from 'react'
import { FlatList, Text, View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { COLORS } from '../common/Constant';

const ItemSelector = React.memo((props) => {
  const {title, itemListArray, selectedItemsList, onItemSelect, style,fromAddFood} = props;

  const ListItem = ({text, selected, onPress}) => (
    <Pressable style={[fromAddFood == true ? styles.componentAddFoodStyle:styles.componentStyle,{backgroundColor:(selected?COLORS.lightGreen:null)}]} onPress={onPress}>
      <Text style={[styles.componentTextStyle,{color:(selected?'white':COLORS.lightGreen)}]}>{text}</Text>
    </Pressable>
  )

  return (
    <View style={style}>
      <Text style={styles.titleTextStyle}>{title}</Text>
      <ScrollView contentContainerStyle={{flexDirection:'row', flexWrap:'wrap'}} bounces={false}>
        {itemListArray.map((item, index)=> <ListItem key={index} text={item.name} selected={selectedItemsList.includes(item.name)} onPress={()=>onItemSelect(item)}/>)}
      </ScrollView>
 
    </View>
  )
})

export default ItemSelector

const styles = StyleSheet.create({
  componentStyle: {
    paddingHorizontal: 15,
    paddingVertical: 7.5,
    borderRadius: 5,
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    marginTop: 5,
    marginRight: 11,
  },
  componentAddFoodStyle:{
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 5,
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    marginRight: 11,
  },
  componentTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: COLORS.lightGreen,
    textTransform:'capitalize'
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: COLORS.grey_4,
  },
})