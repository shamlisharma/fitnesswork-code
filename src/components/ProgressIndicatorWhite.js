import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../common/Constant';
import ProgressCircle from './progress/ProgressCircleWhite';
import {SmallArrowIcon, WorkOutIcon} from '../Svg';

const ProgressIndicator = React.memo(props => {
  const {
    title,
    percent,
    getPercentValueDirectly,
    color,
    indicator,
    progressValue,
    targetValue,
    gradient,
    workoutFromHome,
    onPress,
    dataFromSleep,
    minute,
    calories,
    icon,
    fromCalories,
  } = props;

  const getSleepTime = () => {
    if (dataFromSleep) {
      return progressValue + 'h ' + (minute ? minute : 0) + ' m';
    } else {
      return progressValue;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={{paddingHorizontal: 8}}>
        <ProgressCircle
          percent={
            getPercentValueDirectly
              ? percent
              : progressValue === 0
              ? null
              : targetValue
              ? targetValue < progressValue
                ? 100
                : Math.floor((progressValue / targetValue) * 100)
              : percent
          }
          performance={calories}
          color={color}
          gradient={targetValue == 0 ? '' : gradient}
        />
        <View
          style={{
            position: 'absolute',
            paddingHorizontal: 23,
            paddingVertical: 15,
          }}>
          {icon}
        </View>
      </View>

      <View style={{flex: 1}}>
        <View style={styles.subContainer}>
          <Text style={styles.titleTextStyle}>{title}</Text>
          <View style={{top: 2}}>{indicator ? <SmallArrowIcon /> : null}</View>
        </View>
        {workoutFromHome ? (
          <Text
            style={[
              styles.progressTextStyle,
              {color: calories ? color : null},
            ]}>
            {getSleepTime()}
          </Text>
        ) : (
          <Text style={[styles.progressTextStyle]}>
            {`${progressValue}${targetValue ? '/' : ''}`}
            {targetValue ? (
              <Text style={styles.targetTextStyle}>{targetValue}</Text>
            ) : null}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

export default ProgressIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    flex: 1,
    // marginTop: 5,
    paddingLeft: 5,
  },
  titleTextStyle: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: COLORS.grey_3,
  },
  progressTextStyle: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 20,
    marginLeft: 5,
  },
  targetTextStyle: {
    fontFamily: 'Manrope-Light',
    fontSize: 14,
  },
});
