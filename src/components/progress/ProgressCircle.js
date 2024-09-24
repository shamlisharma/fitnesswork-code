import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { COLORS } from "../../common/Constant";

const ProgressCircle = React.memo((props) => {
  const { color, percent, fillColor, gradient, performance } = props;
  const CIRCUMFERENCE = 2 * 3.14 * 24;
  console.log({ CIRCUMFERENCE },"<<====>>",CIRCUMFERENCE * (1 - percent / 100));
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0DB8DA" />
            <Stop offset="100%" stopColor="#0CDD99" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="27"
          cy="27"
          r="24"
          strokeWidth="5"
          stroke={performance ? COLORS.grey_6 : "white"}
          fill={fillColor || "transparent"}
        />
        
         <Circle
          cx="27"
          cy="27"
          r="24"
          fill="white"
          
          strokeWidth="5"
          stroke={gradient ? "url(#linear)" : color || COLORS.white}
          // strokeDasharray={CIRCUMFERENCE}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
          strokeLinecap="round"
        /> 
      </Svg>
    </View>
  );
});

export default ProgressCircle;

const styles = StyleSheet.create({
  container: {
    width: 54,
    height: 54,
    transform: [{ rotate: "-90deg" }, { scaleY: -1 }],
  },
});
