import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../common/Constant";

const ProgressTab = ({ state, descriptors, navigation, position }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };
        return (
          <Pressable style={styles.tabView} onPress={onPress}>
            <View style={styles.textView}>
           
              <Text
                style={[
                  styles.text,
                  { color: isFocused ? COLORS.lightGreen : COLORS.grey_3 },
                ]}
              >
                {route.name}
              </Text>
              
            </View>

            <View
              style={[
                styles.line,
                {
                  backgroundColor: isFocused ? COLORS.lightGreen : COLORS.white,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export default ProgressTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height:50,
    backgroundColor: COLORS.white
  },
  tabView: {
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:20,
  
  },
  text: {
    fontSize: 18,
    color: "#000",
    fontFamily:"Manrope-Regular"
  },
  line: {
    height: 2,
    width: "100%",
    backgroundColor: "red",
  },
  textView: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
});
