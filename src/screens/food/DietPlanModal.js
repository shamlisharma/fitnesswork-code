import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {getProfileAction} from '../../_action/ProfileAction';
import {Diet} from '../../common/ArrayConstants';
import { useDispatch } from 'react-redux';
import {COLORS} from '../../common/Constant';
import {usersService} from '../../services/ApiServices';
import {StepsCloseIcon} from '../../Svg';
import {showMessage, hideMessage} from 'react-native-flash-message';
import AlertModal from '../modal/AlertModal';

let DietPlanModal = React.memo(function DietPlanModal(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {visible, close, setFromHomeTab} = props;
  const [diet, setDiet] = useState(Diet);
  const [alert, setAlert] = useState(false);
  const _onPressDiet = async item => {
    var tempArr = diet;
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].id === item.id) {
        tempArr[i].isChecked = true;
      } else {
        tempArr[i].isChecked = false;
      }
    }
    setDiet([...tempArr]);
   
    let req = {
      myDiet: item?.isDiet,
    };
    const res = await usersService.updateDiet(req);
    if (res.data.statusCode === 1)
      // showMessage({
      //   description: 'Thank you for updating me on your diet!',
      //   type: 'default',
      //   backgroundColor: COLORS.lightGreen,
      //   color: COLORS.white,
      // })
      close();
    setAlert(true);
    await AsyncStorage.removeItem('fromHomeTab');
    setFromHomeTab(false);
    
  };
  return (
    <>
      <AlertModal
        alert={alert}
        onResume={() => {
          navigation.navigate('Home')
          dispatch(getProfileAction())
          setAlert(false)}}
        headertitle="Food"
        content={'Thank you for updating me on your diet!'}
        cancelBtn=""
        saveBtn="Ok"
        width={100}
        opacity={'#000000cf'}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={close}>
        <View style={styles.fadedBackground} />
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TouchableOpacity onPress={close} style={styles.closeButtonStyle}>
              <StepsCloseIcon color={COLORS.lightBlue} width={34} height={34} />
            </TouchableOpacity>
            <View style={{paddingBottom:  0}}>
              <Text style={styles.titleTextStyle}> How's your diet going?</Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={{paddingVertical: 0}}>
                <View>
                  {diet.map(item => {
                    return (
                      <TouchableOpacity
                        onPress={() => _onPressDiet(item)}
                        key={item.id}
                        activeOpacity={0.6}
                        style={[
                          styles.titleContainer,
                          {
                            width: '100%',
                            marginVertical: 4,
                            backgroundColor: item.isChecked
                              ? '#0CDD99'
                              : '#F9F9F9',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.titleTxt,
                            {
                              fontFamily: 'Manrope-SemiBold',
                              color: item.isChecked ? 'white' : '#4F4F4F',
                            },
                          ]}>
                          {item.val}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text
                 style={[
                  styles.titleTxt,
                  {
                    fontFamily: 'Manrope-SemiBold',
                    color: COLORS.lightGreen,
                    fontSize: 11
                  }
                ]}
              >
                Your average daily entries will be used as part of the calculation for your performance score
              </Text>
              </View>
              
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
})
export default DietPlanModal;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  titleTxt: {
    textAlign: 'center',
    color: '#828282',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
  },
  fadedBackground: {
    backgroundColor: 'black',
    height: '100%',
    opacity: 0.5,
    position: 'absolute',
    width: '100%',
  },
  subContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 5,
    padding: 10,
    paddingBottom: 15,
  },
  closeButtonStyle: {
    position: 'absolute',
    left: 5,
    top: 8,
    zIndex: 10,
  },
  titleTextStyle: {
    textAlign: 'center',
    fontFamily: 'Manrope-SemiBold',
    fontSize: 20,
    color: COLORS.grey_2,
  },
  contentContainer: {
    borderTopWidth: 1.5,
    paddingTop: 5,
    paddingHorizontal: 5,
    borderTopColor: COLORS.grey_5,
  },
  content: {
    fontFamily: 'Manrope',
    fontSize: 14,
    textAlign: 'auto',
    paddingTop: 10,
    lineHeight: 20,
  },
  timesContainer: {
    color: '#828282',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
  },
  titleContainer: {
    width: 39,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
