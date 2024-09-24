import React, { useEffect, useRef, useState } from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { COLORS } from '../common/Constant';
import { DropdownIcon } from '../Svg';

const DropDown = React.memo((props) => {
  const { onChangeText, textInputValue, style, zIndex, length, getDropDownValue, inputRef } = props
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(length ? 'CM' : 'KG');
  const [items, setItems] = useState(length
    ? ([
      { label: 'CM', value: 'CM' },
      { label: 'IN', value: 'IN' }
    ])
    : ([
      { label: 'KG', value: 'KG' },
      { label: 'LBS', value: 'LBS' }
    ]));


  useEffect(() => {
    getDropDownValue(value)
  }, [value])


  return (
    <View style={styles.container}>
      <View style={styles.textInputContainerStyle}>
        <TextInput
          style={{ fontSize: 15,color:"black" }}
          value={textInputValue}
          onChangeText={onChangeText}
          keyboardType={'number-pad'}
          ref={inputRef}
          maxLength={3}
        />
      </View>
      {/* <View style={{minHeight:200}}> */}
      <DropDownPicker
        listMode='SCROLLVIEW'
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        disableBorderRadius
        style={[styles.dropDownStyle, style]}
        containerStyle={styles.dropDownContainerStyle}
        textStyle={styles.dropDownTextStyle}
        dropDownContainerStyle={[styles.dropMenuStyle]}
        zIndex={zIndex}
        showTickIcon={false}
        labelStyle={{ textAlign: 'right' }}
        ArrowDownIconComponent={() => <DropdownIcon />}
        ArrowUpIconComponent={() => <View style={{ transform: [{ scaleY: -1 }] }}><DropdownIcon /></View>}
      />
    </View>
  );

})

export default DropDown

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 120,
    // marginBottom: -128
  },
  textInputContainerStyle: {
    borderWidth: 1,
    height: 50,
    width: '60%',
    paddingLeft: 10,
    borderColor: COLORS.grey_6,
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center'
  },
  dropDownStyle: {
    backgroundColor: COLORS.light_grey,
    borderWidth: 1,
    borderColor: COLORS.grey_6,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  dropDownContainerStyle: {
    width: '48%',
    borderColor: COLORS.light_grey,
    borderWidth: 0,
    // marginBottom:100,
    // height:40,
    // minHeight: 500,

  },
  dropDownTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13
  },
  dropMenuStyle: {
    borderWidth: 1,
    borderColor: COLORS.light_grey,
  },
  viewContainer: { marginHorizontal: 16, zIndex: 1 },
  androidContainer: {
    minHeight: 500,
    marginBottom: -428,
  },
})
