import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { COLORS } from "../common/Constant";
import AntDesign from "react-native-vector-icons/AntDesign";

const Upload = ({ label, onPress, image = "" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Pressable onPress={onPress}>
        <View style={styles.boxContainer}>
          {image != "" ? (
            <Image
              style={styles.image}
              source={{ uri: image }}
              onError={(e) => console.log(e)}
            />
          ) : (
            <AntDesign name="pluscircle" color={COLORS.lightGreen} size={30} />
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxContainer: {
    height: 220,
    width: "100%",
    borderColor: COLORS.lightGreen,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 5,
    overflow: "hidden",
  },
  text: {
    fontSize: 17,
    fontFamily: "Manrope-Bold",
    marginLeft: 5,
  },
  image: {
    // height:220,
    height: "100%",
    width: "100%",
    // aspectRatio:1,
    backgroundColor: "red",
    overflow: "hidden",
  },
});
