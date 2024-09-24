import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../common/Constant';

const BottomToast = forwardRef((prop, ref) => {
  const opacityAnimation = useRef(new Animated.Value(0));
  const scaleAnimation = useRef(new Animated.Value(0));
  const [toastMsg, setToastMsg] = useState('');
  const [visibility, setVisibility] = useState(false);
  useEffect(() => {}, []);

  const opacityInterpolationMotion = opacityAnimation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const scaleInterpolationMotion = scaleAnimation.current.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.7, 1.2, 1],
  });

  const opacityStyle = {
    opacity: opacityInterpolationMotion,
  };

  const scaleStyle = {
    transform: [{scale: scaleInterpolationMotion}],
  };

  useImperativeHandle(ref, () => ({
    getData(message) {
      setToastMsg(message);
      opacityAnimation.current.setValue(0);
      scaleAnimation.current.setValue(0);
      Animated.sequence([
        Animated.timing(scaleAnimation.current, {
            toValue: 2,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimation.current, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: false,
          })
      ]).start()
      
      
    },
  }));

  return toastMsg ? (
    <Animated.View ref={ref} style={[styles.containerView, opacityStyle, scaleStyle]}>
      <Text style={styles.label}>{toastMsg}</Text>
    </Animated.View>
  ) : null;
});

const styles = StyleSheet.create({
  containerView: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: scale(30),
    alignSelf: 'center',
    borderRadius: 20,
  },
  label: {
    color: COLORS.white,
    textAlign: 'center'
  },
});

export {BottomToast};
