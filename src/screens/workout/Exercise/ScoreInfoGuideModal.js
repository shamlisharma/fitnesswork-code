import React, { useState } from "react";
import { Linking, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../common/Constant";
import CustomModal from "../../../components/CustomModal";
import { CheckboxSelected, CheckboxUnselected } from "../../../Svg";

let ScoreInfoGuideModal = React.memo(function WarmUpGuideModal(props) {
  const { visible, close } = props;
  const [data, setData] = useState([{id:1, reps:120, weight:6},{id:2,reps:130, weight:8},{id:3,reps:140, weight:5}]);
  const navigation = useNavigation();
  return (
    <CustomModal
      visible={visible}
      onRequestClose={close}
      modalTitle={"How Volume Calculated"}
    >
      <View style={{ height: 40, width: "100%", flexDirection: "row" }}>
        <View style={styles.setView}>
          <Text style={{ color: COLORS.grey_3, marginRight: 6 }}>Set</Text>
        </View>
        <View style={styles.setView}>
          <Text style={{ color: COLORS.grey_3, marginRight: 30 }}>Reps</Text>
        </View>
        <View style={styles.setView}>
          <Text style={{ color: COLORS.grey_3, marginLeft: 5 }}>Weight</Text>
        </View>
        <View style={styles.setView}>
          <Text style={{ color: COLORS.grey_3, marginRight: 10 }}>Done</Text>
        </View>
      </View>
      {data.map((item, index) => (
        <View style={{ marginBottom: 5 }}>
          <View style={styles.repsView}>
            <View style={styles.view}>
              <Text style={{ color: COLORS.black }}>1</Text>
            </View>
            <View style={styles.commonView}>
              <Text style={{ color: COLORS.black }}>{item.reps}</Text>
            </View>
            <Text> X </Text>
            <View style={styles.commonView}>
              <Text style={{ color: COLORS.black }}>{item.weight}</Text>
            </View>
            <View style={styles.separatorThree}>
              <CheckboxSelected small />
            </View>
          </View>

          <Text style={{ fontSize: 25, textAlign: "center" }}>
            {index != data.length - 1 ? "+" : "="}
          </Text>
        </View>
      ))}
      <View style={[styles.repsView, { flexDirection: "column" }]}>
        <Text style={{ fontSize: 17, marginTop: 10 }}>Volume 2460</Text>
        <View
          style={{
            height: 4,
            width: "80%",
            alignSelf: "center",
            borderRadius: 2,
            backgroundColor: COLORS.grey_5,
            marginTop: 8,
          }}
        >
          <View
            style={{
              height: 4,
              width: "80%",
              backgroundColor: COLORS.lightGreen,
            }}
          />
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontFamily: "Manrope-regular",
            marginBottom: 5,
            color: COLORS.grey_3,
          }}
        >
          Score is a measurement of the total weight lifted in any given
          exercise. Score = Sets x Reps x Weights Used. Eg. 3 sets of 10 reps
          performed at 100kg = 3 x 10 x 100 = Total Volume of 3,000.
        </Text>
        <Text
          style={{
            fontFamily: "Manrope-regular",
            marginVertical: 5,
            color: COLORS.grey_3,
          }}
        >
          The aim to see hit your target or beat your score each week. This will
          help you make progress when it comes to building muscle.
          {/* 🎯 */}
        </Text>
      </View>
    </CustomModal>
  );
});

const styles = StyleSheet.create({
  setView: { flex: 1, alignItems: "center", justifyContent: "center" },
  repsView: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.grey_6,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  commonView: {
    height: 40,
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderColor: COLORS.black,
    borderWidth: 1,
    marginRight: 5,
    marginLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  view: {
    height: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separatorThree: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ScoreInfoGuideModal;
