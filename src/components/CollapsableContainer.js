import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import {COLORS} from '../common/Constant';
import {DropdownIcon} from '../Svg';
import { useNavigation } from '@react-navigation/core';

const CollapsableContainer = React.memo(props => {
  const {title, children, titleLeft, titleRight, blueDropDown, expanded,cartIcon, onToggle} = props;
  const navigation = useNavigation();
  const [showDropDown, setShowDropDown] = useState(expanded?true:false);

  useEffect(() => {
    onToggle && onToggle(showDropDown);
  },[showDropDown])

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={() => setShowDropDown(!showDropDown)}>
        {titleLeft && showDropDown ? (
          <View style={styles.leftButtonContainer}>{titleLeft}</View>
        ) : null}
        <View
          style={styles.mainTitleContainer}>
          <View style={styles.titleTextContainer}>
            <Text
              style={styles.titleTextStyle}>
              {title}
            </Text>
            <View>
              <View
                style={[styles.dropDownIconContainer, {transform: [{scaleY: showDropDown ? -1 : 1}]}]}>
                <DropdownIcon blue={blueDropDown}/>
              </View>
            </View>
          </View>
        </View>
        {cartIcon? 
            <Pressable  style={styles.cartButtonContainer}>{cartIcon}</Pressable>:null
            }
        {titleRight && showDropDown ? (
          <TouchableOpacity
            style={styles.rightButtonContainer}
            onPress={()=> navigation.navigate('FoodTab')}>
            {/* onPress={()=> navigation.navigate('Setting')}> */}
            {titleRight}
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      {showDropDown ? <View style={styles.childrenContainer}>{children}</View> : null}
    </View>
  );
});

export default CollapsableContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputTxtColor,
    flexDirection: 'row',
  },
  leftButtonContainer: {
    backgroundColor: COLORS.inputTxtColor,
    alignSelf: 'flex-start',
    borderRightWidth: 2,
    borderColor: 'white',
    padding: 10,
  },
  rightButtonContainer: {
    backgroundColor: COLORS.inputTxtColor,
    alignSelf: 'flex-end',
    padding: 10,
    borderLeftWidth: 2,
    borderColor: 'white',
  },
  mainTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: COLORS.grey_2,
    textAlign: 'center',
  },
  dropDownIconContainer: {
    top: 3, 
  },
  childrenContainer: {
    marginTop: 2
  },
  titleTextContainer: {
    flexDirection: 'row'
  },
  closeIcon:{
    position:'absolute',
    right:10,
    top:7,
  },
  cartButtonContainer: {
    backgroundColor: COLORS.inputTxtColor,
    alignSelf: 'flex-end',
    padding: 10,
  },
});