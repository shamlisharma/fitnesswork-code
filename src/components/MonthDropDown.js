import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import { COLORS } from '../common/Constant';
import {DropdownArrowIcon} from '../Svg';


const MonthDropDown = React.memo((props) => {
  const {style, onMonthSelect} = props
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([]);
  const listOfMonths = moment.months();

  useEffect(() => {
    const currentMonth = moment().format('MMMM')
    let item = (data) => {
      return {
        label: currentMonth === data? 'This month': data,
        value: data
      }
    }
    setItems(listOfMonths.map((i) => item(i)));
    setValue(currentMonth)
  },[])

  useEffect(() => {
    onMonthSelect(value)
  },[value])

  const renderItems = (props) => {
    return (
    <TouchableOpacity
      style={value===props.value?props.selectedItemContainerStyle: null} 
      onPress={()=>{
        props.onPress({...props})
      }}
      >
      <Text style={styles.listItemTextStyle}>{props.value}</Text>
    </TouchableOpacity>
  )}

  return (
    <View style={[styles.container, style]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setValue={setValue}
        setOpen={setOpen}
        setItems={setItems}
        style={styles.dropDownStyle}
        containerStyle={styles.dropDownContainerStyle}
        textStyle={styles.dropDownTextStyle}
        dropDownContainerStyle={styles.dropMenuStyle}
        ArrowDownIconComponent={() => <View><DropdownArrowIcon /></View>}
        ArrowUpIconComponent={() => <View style={styles.arrowUpIconStyle}><DropdownArrowIcon /></View>}
        showTickIcon={false}
        selectedItemContainerStyle={{backgroundColor:COLORS.grey_5}}
        flatListProps={{showsVerticalScrollIndicator:false}}
        labelStyle={styles.labelStyle}
        renderListItem={renderItems}
      />
    </View>
  )
})

export default MonthDropDown

const styles = StyleSheet.create({
  container: {
    width:'35%'
  },
  dropDownStyle: { 
    backgroundColor:COLORS.light_grey,
    borderWidth:1, 
    borderColor:COLORS.light_grey, 
    borderTopLeftRadius:0, 
    borderBottomLeftRadius:0,
    height:35
  },
  dropDownContainerStyle: {
    borderWidth:0,
  },
  dropDownTextStyle: {
    fontFamily:'Manrope-Regular', 
    fontSize:15
  },
  dropMenuStyle: {
    borderWidth:1, 
    borderColor:COLORS.light_grey,
  },
  arrowUpIconStyle: {
    transform:[
      {scaleY:-1}
    ]
  },
  labelStyle: {
    fontSize:15, 
    fontFamily:'Manrope-Regular', 
    textAlign:'right'
  },
  listItemTextStyle: {
    padding:5, 
    fontFamily:'Manrope-Regular'
  },
})
