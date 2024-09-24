import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../common/Constant";
import { FilterIcon, SearchIcon } from "../Svg";
import { TextInput } from "react-native-gesture-handler";


const CustomSearch = ({ value, onChangeText ,onPress}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchView}>
        <View style={{ paddingHorizontal: 10 }}>
          <SearchIcon />
        </View>
        <TextInput
          placeholder="Search"
          style={{ flex: 1 }}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity activeOpacity={0.5} style={styles.gradientStyle} onPress={onPress}>
        <FilterIcon />
      </TouchableOpacity>
    </View>
  );
};

export default CustomSearch;

const styles = StyleSheet.create({
  searchContainer: {
    height: 50,
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  searchView: {
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: COLORS.grey_5,
    borderWidth: 1,
  },
  gradientStyle: {
    height: 50,
    width: 50,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 5,
  },
});
