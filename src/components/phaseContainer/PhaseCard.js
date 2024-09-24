import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {COLORS} from '../../common/Constant';
import GradientContainer from '../GradientContainer';

const PhaseCard = React.memo(props => {
  const {title, subtitle, isActive, onPress, phase,textStyle} = props;

  const onChangePhase = item => {
    onPress();
  };

  return (
    <TouchableOpacity style={{flex: 1,marginRight:10,}} onPress={() => onChangePhase(title)}>
      {phase ? (
        <GradientContainer
          style={phase ? [styles.phaseContainer] : [styles.container]}>
          <Text style={[styles.cardTitleTextStyle,textStyle]}>{title}</Text>
          {subtitle&&<Text style={styles.cardSubtitleTextStyle}>{subtitle}</Text>}
        </GradientContainer>
      ) : (
        <View style={phase ? [styles.phaseContainer] : [styles.container,{paddingHorizontal:0}]}>
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

export default PhaseCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light_grey,
    padding: 10,
    borderRadius: 5,
  },
  phaseContainer: {
    backgroundColor: COLORS.light_grey,
    padding: 10,
    borderRadius: 5,
    borderColor: COLORS.lightGreen,
    // borderWidth: 1,
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
