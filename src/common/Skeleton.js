import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS, DeviceScreen} from './Constant';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import ProgressIndicator from '../components/ProgressIndicator';

export const Skeleton = React.memo(() => {
  const CIRCUMFERENCE = 2 * 3.14 * 24;
  return (
    <SkeletonPlaceholder>
      <View style={{}}>
        <View
          style={{
            width: 250,
            height: 20,
            borderRadius: 4,
            marginTop: 10,
            alignSelf: 'center',
          }}
        />
        <View
          style={{
            marginTop: 6,
            width: DeviceScreen.width - 20,
            height: 50,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            marginTop: 8,
            width: DeviceScreen.width - 20,
            height: 15,
            borderRadius: 4,
          }}
        />
        <View style={{
            marginTop: 8,
            width: 54,
            height: 54,
            borderRadius: 20,
          }}>
<View style={{
            marginTop: 8,
            width: 50,
            height: 50,
            borderRadius: 20,
            // highlightColor:"white"
          }}></View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
});
