import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import GradientContainer from "./GradientContainer";
const GradientButton = React.memo((props) => {
  const {
    title,
    style,
    onPress,
    disabled,
    textStyle,
    width,
    o,
    leftIcon,
    containerStyle,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.gradientStyle,
        { padding: 0, overflow: "hidden", width: width, containerStyle },
      ]}
    >
      <GradientContainer
        style={[styles.gradientStyle, style, { opacity: disabled ? 0.4 : 1 }]}
      >
        {leftIcon}
        <Text style={[styles.titleTextStyle, textStyle]}>{title}</Text>
      </GradientContainer>
    </TouchableOpacity>
  );
});

export default GradientButton;

const styles = StyleSheet.create({
  gradientStyle: {
    padding: 15,
    borderRadius: 30,
  },
  titleTextStyle: {
    fontFamily: "Manrope-Bold",
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
