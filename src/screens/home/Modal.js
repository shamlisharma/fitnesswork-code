import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../common/Constant";
import GradientButton from "../../components/GradientButton";
const ExpiredModal = (props) => {
  const { isDowngrade, visible } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
        //   setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText1}>
            {props.type == "Free" && !isDowngrade
              ? `Welcome back!`
              : "Your membership has expired"}
          </Text>
          <Text style={styles.modalText}>
            {props.type == "Free" && !isDowngrade
              ? `We are excited to offer you a free trial of the entire app for 7 days.`
              : ' Your membership has expired. In order to continue using the app you need to activate your plan again. \n (Please confirm membership. Don’t worry you won’t be charged for this if you already have an plan).'}
          </Text>
          {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                props.onClick();
              }}>
              <Text style={styles.textStyle}>
                {props.type == 'Free'
                  ? `Start Free Trial`
                  : 'Upgrade Membership'}
              </Text>
            </Pressable> */}
          <GradientButton
            title={
              props.type == "Free" && !isDowngrade
                ? `Start free trial`
                : "Activate the plan"
            }
            style={{
              paddingVertical: 10,
              marginHorizontal: 6,
              marginTop: 10,
              marginBottom: 10,
              width: 250,
            }}
            textStyle={{ fontSize: 18 }}
            onPress={() => props.onClick()}
            width={"90%"}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: COLORS.blue,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 15,
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center",
    color: COLORS.grey,
    paddingVertical: 10,
  },
  modalText1: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: COLORS.black,
    fontWeight: "bold",
  },
});

export default ExpiredModal;
