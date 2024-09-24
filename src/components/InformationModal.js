import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../common/Constant";
import GradientButton from "./GradientButton";
interface Props {
  visible: Boolean;
  label: String;
  onChoose: () => void;
  onClose: () => void;
  description: String;
  onDismiss:()=> void;
  info:Boolean
}

const InformationModal = ({
  visible,
  label,
  onChoose,
  onClose,
  description,
  onDismiss, info
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide"
        onDismiss={onDismiss}
     >
      <View style={styles.modalView}>
        <View style={styles.card}>
          <Text style={styles.cardTitleTextStyle}>{label}</Text>
          <Text
            style={{
              color: COLORS.grey_3,
              paddingHorizontal: 20,
              fontSize: 14,
            }}
          >
            {description}
          </Text>
          {info ? null :
          <GradientButton
            title="Choose as my programme"
            onPress={onChoose}
            // textStyle={styles.signinButtonTextStyle}
            style={{
              padding: 10,
              width: "90%",
              alignSelf: "center",
              marginTop: 15,
            }}
          />}

          <Text onPress={onClose}
            style={styles.closeTextStyle}
          >
            Close
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default InformationModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#00000066",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    // height: 300,
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  cardTitleTextStyle: {
    fontFamily: "Manrope-SemiBold",
    paddingVertical: 4,
    fontSize: 16,
    color: COLORS.grey_2,
    textAlign: "center",
    paddingVertical: 15,
    //textTransform: 'capitalize',
  },
  closeTextStyle:{
    marginTop: 10,
    textDecorationLine: "underline",
    color: "#0CDD99",
    fontFamily: "Manrope-SemiBold",
    textAlign:'center',
    marginBottom:15
  }
});
