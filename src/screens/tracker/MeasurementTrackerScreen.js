import { useNavigation } from "@react-navigation/core";
import React from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../common/Constant";
import { MainScreen } from "../../common/Screen";
import { RightArrowIcon } from "../../Svg";

const DATA = [
  {
    name: "Arm",
  },
  {
    name: "Chest",
  },
  {
    name: "Waist",
  },
  {
    name: "Hip",
  },
  {
    name: "Thigh",
  },
  {
    name: "Calf",
  },
];

const MeasurementTrackerScreen = React.memo(({ route }) => {
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.componentContainerStyle}
      onPress={() => 
        navigation.navigate("TrackDataScreen", {
          title: item.name,
          length: true,
          type: route.params.type,
          category: index + 1,
          screen:"measure"
        })
      }
    >
      <Text style={styles.componentTextStyle}>{item.name}</Text>
      <RightArrowIcon />
    </TouchableOpacity>
  );

  return (
    <MainScreen>
      <FlatList data={DATA} renderItem={renderItem} style={{ padding: 10 }} />
    </MainScreen>
  );
});

export default MeasurementTrackerScreen;

const styles = StyleSheet.create({
  componentContainerStyle: {
    backgroundColor: COLORS.light_grey,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 1,
  },
  componentTextStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
  },
});
