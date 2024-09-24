import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../common/Constant";
import { CheckboxSelected, CheckboxUnselected } from "../../../Svg";
import { useIsFocused } from "@react-navigation/native";
import { LbsToKg } from "../../../utils/helper";

const ExerciseDetailRow = React.memo((props) => {
  const {
    setNumber,
    initialData,
    onDataUpdate,
    kG,
    repS,
    resT,
    setUserInput,
    exercise,
    setExerId,
    onComplete,
    selectedUnit,
    disableCheck
  } = props;
  const { noOfReps, restTime, _id, weight } = initialData;
  const [completed, setCompleted] = useState(false);
  const [isFieldChanged, setFieldChanged] = useState(false);
  const [submitScores, setSubmitScores] = useState(false);
  const [kg, setKG] = useState(weight);
  const [reps, setReps] = useState(noOfReps);
  const [rest, setRest] = useState(restTime);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setReps(noOfReps);
      weight != null && weight != ""
        ? setKG(
            selectedUnit == "LBS"
              ? (Number(weight) * 2.20462).toFixed(0)
              : weight
          )
        : setKG("");
      setRest(restTime);
      // setCompleted(initialData?.completed)
      setSubmitScores(initialData?.completed);
      // if (kg && reps && rest) {
      //   setCompleted(true);
      // } else setCompleted(false);
    }
  }, [isFocused, weight, noOfReps, restTime, initialData?.completed]);
// useEffect(() => {
 
// }, [kg,reps,rest])

  // useEffect(() => {

  //   setUserInput({kG: LbsToKg(kg,selectedUnit), repS: reps, resT: rest});

  //   setExerId(exercise?.exerciseId);
  //   const obj = {
  //     set: setNumber,
  //     weight: LbsToKg(kg,selectedUnit),
  //     reps: reps,
  //     restTime: rest,
  //     // exerciseId:exercise?.exerciseId,
  //     exerciseId: initialData._id,
  //   };
  //   onDataUpdate(obj, exercise?.exerciseId);
  //   if (kg && reps && rest) {
  //     setCompleted(true);

  //   } else setCompleted(false);
  // }, [kg, reps, rest]);
  const handleRepsInput = useCallback(() => {
    setUserInput({ kG: LbsToKg(kg, selectedUnit), repS: reps, resT: rest });
    setExerId(exercise?.exerciseId);
    const obj = {
      set: setNumber,
      weight: LbsToKg(kg, selectedUnit),
      reps: reps,
      restTime: rest,
      // exerciseId:exercise?.exerciseId,
      exerciseId: initialData._id,
    };
    onDataUpdate(obj, exercise?.exerciseId);
    if (kg && reps && rest) {
      setCompleted(true);
    } else setCompleted(false);
  }, [kg, reps, rest]);

  const validateText = (text, prevText) => {
    const regex = /^[0-9]*$/;
    if (regex.test(text)) {
      return text;
    } else return prevText;
  };

  return (
    <View style={styles.rowContainer}>
      <View style={styles.separatorOne}>
        <Text style={styles.setNumberTextStyle}>{setNumber}</Text>
      </View>
      <View style={styles.separatorTwo}>
        <View style={styles.inputBoxContainer}>
          <TextInput
            keyboardType="decimal-pad"
            maxLength={4}
            value={`${kg < 0 || kg === null ? "" : kg}`}
            // value={`${kg < 0 || kg === null ? "" : kg}`}
            style={[styles.inputBoxStyle, kg < 0 && { borderColor: "red" }]}
            onBlur={handleRepsInput}
            onChangeText={(text) => {
              setKG(text.replace(',', '.'));
              // handleRepsInput()
              setSubmitScores(false);
              if (!isFieldChanged) {
                setFieldChanged(true);
              }
            }}
          />
        </View>
        <View style={styles.inputBoxContainer}>
          <TextInput
            keyboardType="number-pad"
            maxLength={3}
            value={`${reps > 0 ? reps : ""}`}
            style={[styles.inputBoxStyle, reps < 0 && { borderColor: "red" }]}
            onBlur={handleRepsInput}
            onChangeText={(text) => {
              setReps(validateText(text, reps, exercise?.title));
              // handleRepsInput()
              setSubmitScores(false);
              if (!isFieldChanged) {
                setFieldChanged(true);
              }
            }}
          />
        </View>
        <View style={styles.inputBoxContainer}>
          <TextInput
            keyboardType="number-pad"
            maxLength={3}
            value={`${rest > 0 ? rest : ""}`}
            style={[styles.inputBoxStyle, rest < 0 && { borderColor: "red" }]}
            onBlur={handleRepsInput}
            onChangeText={(text) => {
              setRest(validateText(text, rest, exercise?.title));
              // handleRepsInput()
              setSubmitScores(false);
              if (!isFieldChanged) {
                setFieldChanged(true);
              }
            }}
          />
        </View>
      </View>
      <View style={styles.separatorThree}>
        <TouchableOpacity
          onPress={() => {
            onComplete && onComplete(Number(rest), _id);
            setSubmitScores(true);
          }}
          disabled={!completed||disableCheck}
          style={styles.checkboxContainer}
        >
          {submitScores ? (
            <CheckboxSelected small />
          ) : (
            <CheckboxUnselected small />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ExerciseDetailRow;

const styles = StyleSheet.create({
  inputBoxStyle: {
    backgroundColor: "white",
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 5,
    paddingVertical: 10,
    borderColor: COLORS.grey_4,
    color: COLORS.grey_2,
    fontFamily: "Manrope-Regular",
    fontSize: 15,
  },
  inputBoxContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  contentContainer: {
    backgroundColor: COLORS.light_grey,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  tableHeaderContainer: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  separatorOne: {
    flexDirection: "row",
    width: "15%",
  },
  separatorThree: {
    flexDirection: "row",
    width: "15%",
  },
  separatorTwo: {
    flexDirection: "row",
    width: "70%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    justifyContent: "space-around",
  },
  checkboxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  setNumberTextStyle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: COLORS.grey_2,
  },
});
