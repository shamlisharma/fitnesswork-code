import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {COLORS} from '../common/Constant';
import GradientContainer from './GradientContainer';

const DayCard = React.memo(props => {
  const {title, subtitle, isActive, onPress, phase,textStyle} = props;

  const onChangePhase = item => {
    onPress();
  };

  return (
    <TouchableOpacity style={{height:40,width:40,borderRadius:20, marginRight:10,height:20}} onPress={() => onChangePhase(title)}>
      {phase ? (
        <GradientContainer
          style={phase ? [styles.phaseContainer] : [styles.container]}>
          <Text style={[styles.cardTitleTextStyle,textStyle]}>{title}</Text>
          {subtitle&&<Text style={styles.cardSubtitleTextStyle}>{subtitle}</Text>}
        </GradientContainer>
      ) : (
        <View style={phase ? [styles.phaseContainer] : [styles.container,{}]}>
          <Text
            style={[
              styles.cardTitleTextStyle,
              {color: COLORS.grey_2, fontFamily: 'Manrope-Bold', fontSize: 15},
              textStyle
            ]}>
            {title}
          </Text>
         {subtitle && <Text
            style={[
              styles.cardSubtitleTextStyle,
              {
                color: COLORS.grey_2,
                fontFamily: 'Manrope-Regular',
                fontSize: 14,
              },
            ]}>
            {subtitle}
          </Text>}
        </View>
      )}
    </TouchableOpacity>
  );
});

export default DayCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light_grey,
    // padding: 10,
    borderRadius: 20,
    height:40,
    width:40,
    justifyContent:"center",
    alignItems:"center"
  },
  phaseContainer: {
    backgroundColor: COLORS.light_grey,
    // padding: 10,
    borderRadius: 20,
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    height:40,
    width:40,
    justifyContent:"center",
    alignItems:"center"
  },
  cardTitleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: 'white',
    textAlign: 'center',
  },
  cardSubtitleTextStyle: {
    fontFamily: 'Manrope-Regular',
    color: 'white',
    textAlign: 'center',
  },
});
