import React, {useEffect, useReducer} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Linking,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import Header from '../../components/header/Header';
import {useNavigation} from '@react-navigation/native';
import {AppButton, COLORS} from '../../common/Constant';
import {DropdownIcon, UploadFileIcon} from '../../Svg';
import SelectDropdown from 'react-native-select-dropdown';
import {useDispatch} from 'react-redux';
import {Platform} from 'react-native';
import {MainScreen} from '../../common/Screen';

let Contact = React.memo(function Contact() {
  let navigation = useNavigation();
  let dispatch = useDispatch();
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      topic: '',
      description: '',
      uploadFile: null,
      baseFile: null,
      uploadfile: [],
      setFiles: [],
    },
  );
  const Data = [
    'App Issue',
    'Membership',
    'Trainer Support',
    'Nutrition',
    'Training',
    '60 Day Challenge',
  ];

  function contactUs() {
    let {topic, description, setFiles} = userInput;
    Linking.openURL(
      `mailto:<info@fitnessvwork.com>?subject=${topic}&body=${description}`,
    ).then(() => {
      setUserInput({description: ''});
    });
  }

  return (
    <MainScreen>
      <Header title={'Contact us'} status="drawer" />
      <ScrollView>
        <View style={styles.subjectOfQuest}>
          <Text style={styles.subject}>
            Subject of your question (optional)
          </Text>
        </View>
        <View style={styles.selectTopic}>
          <SelectDropdown
            data={Data}
            defaultButtonText={'Select the topic'}
            onSelect={(selectedItem, index) => {
              setUserInput({topic: selectedItem});
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={() => {
              return <DropdownIcon />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
        </View>
        <View style={styles.subjectOfQuest}>
          <Text style={styles.Description}>Description</Text>
        </View>
        <View style={styles.selectTopic}>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Describe your problem"
            placeholderTextColor="#E0E0E0"
            style={styles.textInputArea}
            value={userInput.description}
            onChangeText={description => setUserInput({description})}
            selectionColor={COLORS.blue}
          />
        </View>

        <>
          {/* {userInput.description.trim() !== '' || userInput.description.trim().length !== 0 ? ( */}

          <View
            style={{
              opacity:
                userInput.description.trim() !== '' ||
                userInput.description.trim().length !== 0
                  ? 1
                  : 0.2,
            }}>
            <AppButton
              title="Send"
              onPress={() => {
                if (
                  userInput.description.trim() !== '' ||
                  userInput.description.trim().length !== 0
                ) {
                  contactUs();
                }
              }}
            />
          </View>
        </>
      </ScrollView>
    </MainScreen>
  );
});

const styles = StyleSheet.create({
  subjectOfQuest: {
    padding: 15,
  },
  subject: {
    fontSize: 15,
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
    fontWeight: '400',
  },
  Description: {
    fontSize: 15,
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
    fontWeight: '400',
    marginTop: 5,
  },
  dropdown1BtnStyle: {
    width: '100%',
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    top: 6,
    borderColor: COLORS.grey_6,
  },
  uploadFile: {
    backgroundColor: COLORS.light_grey,
    height: 84,
  },
  uploadFileAdded: {
    backgroundColor: COLORS.light_grey,
    height: 'auto',
  },
  uploadIcon: {
    alignSelf: 'center',
    paddingTop: 10,
  },
  dropdown1BtnTxtStyle: {
    color: '#4d4c4c',
    textAlign: 'left',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
  },
  dropdown1DropdownStyle: {
    backgroundColor: '#EFEFEF',
    textTransform: 'capitalize',
  },
  dropdown1RowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: COLORS.lightGrey,
    padding: 0,
  },
  dropdown1RowTxtStyle: {
    color: '#4d4c4c',
    textAlign: 'left',
    textTransform: 'capitalize',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    padding: 0,
  },
  selectTopic: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  textInputArea: {
    borderWidth: 1,
    borderColor: COLORS.grey_6,
    textAlignVertical: 'top',
    fontFamily: 'Manrope-Regular',
    padding: 10,
    fontSize: 15,
    height: 80,
    color: 'black',
  },
});
export default Contact;
