import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {COLORS} from '../../common/Constant';
const ExistingUsermodal = props => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          //   setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Welcome back! We're excited to offer you a free trial.
            </Text>
            <Text style={styles.modalText}>
              'Start Free Trial' button to begin using all of our standard
              features
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                props.onClick();
              }}>
              <Text style={styles.textStyle}>Start Free Trial</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: COLORS.blue,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
    color: COLORS.grey,
  },
});

export default ExistingUsermodal;
