import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../common/Constant";
import LinearGradient from "react-native-linear-gradient";
import GradientButton from "./GradientButton";

const FloatButton = ({ onPress, label, width }) => {
  return (
    <View style={styles.button}>
      <GradientButton title={label} onPress={onPress} width={width} />
      {/* <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[COLORS.lightGreen, COLORS.lightBlue]}
        style={[styles.button,{width: width}]}
      >
      <Text style={styles.label}>{label}</Text>
      </LinearGradient> */}
    </View>
  );
};

export default FloatButton;

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    position: "absolute",
    alignSelf: "center",
  },
  label: {
    marginHorizontal: 20,
    fontSize: 17,
    color: COLORS.white,
  },
});
