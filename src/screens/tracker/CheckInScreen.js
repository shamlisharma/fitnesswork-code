import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {Diet, TrainingWeek, week} from '../../common/ArrayConstants';
import {MainScreen} from '../../common/Screen';
import GradientButton from '../../components/GradientButton';
import {CameraGreyIcon} from '../../Svg';
import DropDown from '../../components/DropDown';
import {launchImageLibrary} from 'react-native-image-picker';
import {usersService} from '../../services/ApiServices';
import {Loader} from '../../common/Loader';

import InlineError from '../../common/InlineError';
import InlineModal from '../../common/InlineModal';
import {COLORS} from '../../common/Constant';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import io from 'socket.io-client';
import setting from '../../config/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {getChat} from '../../_action/CommunityAction';
import {showMessage, hideMessage} from 'react-native-flash-message';
import { result } from 'lodash';

const CheckInScreen = React.memo(props => {
  const dispatch = useDispatch();
  let { weekValue, programmeId } = props?.route?.params;
  const [weeks, setWeeks] = useState(week);
  const [trainigWeek, setTrainingWeek] = useState(TrainingWeek);
  const [diet, setDiet] = useState(Diet);
  const [inputLastWeek, setInputLastWeek] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [dropDownItem, setDropDownItem] = useState('');
  const [dropDownWeight, setDropDownWeight] = useState('');
  const [frontImg, setFrontImg] = useState('');
  const [sideImg, setSideImg] = useState('');
  const [backImg, setBackImg] = useState('');
  const [description, setDescription] = useState('');
  const [loader, setLoader] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [weightInputError, setWeightInputError] = useState('');
  const [noteError, setNoteError] = useState('');
  const [imgError, setImgError] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [weekData, setWeekData] = useState('');
  const [weekError, setWeekError] = useState('');
  const [trainFeedBack, setTraiFeedBack] = useState('');
  const [trainFeedBackError, setTraiFeedBackError] = useState('');
  const [dietData, setDietData] = useState('');
  const [dietDataError, setDietDataError] = useState('');
  const [height, setHeight] = useState(0);
  const userChat = useSelector(state => state?.community?.getChat?.result[0]);
  const userProfile = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const inputRef = useRef(null);
  // const socketRef = useRef();
  // const socketUrl = setting.socketDevUrl.url;
  let mediaPath = setting.s3Url.url;
  const handleChange = e => {
    if (description.length >= 0) setNoteError('');
  };

  useEffect(async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    // dispatch(getChat());
    // socketRef.current = io(socketUrl, {
    //   query: {accessToken: accessToken},
    //   transports: ['websocket'],
    // });
  }, []);

  useEffect(()=>{
    getCheckInData()
  },[])

  useEffect(() => {
    if (inputLastWeek?.length >= 0) setWeightError('');
    if (inputWeight?.length >= 0) setWeightInputError('');
    if (weekData !== '') setWeekError('');
    if (trainFeedBack !== '') setTraiFeedBackError('');
    if (dietData !== '') setDietDataError('');
  }, [inputLastWeek, inputWeight, weekData, trainFeedBack, dietData]);

  const getCheckInData = async() =>{
    var result =await usersService.getCheckinData({
      programmeId,
      week: weekValue
    })
    
    if(result?.status === 200) {
      if(result?.data?.statusCode === 1) {
        const { 
          lastWeekWeight,
          weightNow,
          trainingFrequency,
          notes,
          trainingFeedback,
          describes,
          backImageUrl,
          frontImageUrl,
          sideImageUrl
         } = result?.data?.responseData?.result;
         let tempData = [];
         
        setInputLastWeek(lastWeekWeight);
        setInputWeight(weightNow);
        setDescription(notes);
        tempData = [...weeks];
        tempData = tempData.map((item,index) => (item?.val == trainingFrequency)? { ...item, isChecked: true }: item)
        setWeeks([...tempData]);
        setWeekData(trainingFrequency);
        tempData = [];
        tempData = [...trainigWeek];
        tempData = tempData.map((item,index) => (item?.val == trainingFeedback)? { ...item, isChecked: true }: item)
        setTrainingWeek([...tempData]);
        setTraiFeedBack(trainingFeedback);
        tempData = [];
        tempData = [...diet];
        tempData = tempData.map((item,index) => (item?.val == describes)? { ...item, isChecked: true }: item)
        setDiet([...tempData]);
        setDietData(describes);
        tempData = [];
        

         if(frontImageUrl) {
          setFrontImg(mediaPath + frontImageUrl)
         }

         if(sideImageUrl) {
          setSideImg(mediaPath + sideImageUrl)
         }

         if(backImageUrl) {
           
          setBackImg(mediaPath + backImageUrl)
         }
        


        }}}

  
  useEffect(() => {
    var tempArr = weeks;
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i].isChecked = false;
    }
    setWeeks([...tempArr]);
    var tempArr = trainigWeek;
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i].isChecked = false;
    }
    setTrainingWeek([...tempArr]);
    var tempArr = diet;
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i].isChecked = false;
    }
    setDiet([...tempArr]);
  }, []);

  const _onPressWeek = (item, index) => {
    setWeekData(item?.val);
    
    var tempArr = weeks;
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].id === item.id) {
        tempArr[i].isChecked = true;
      } else {
        tempArr[i].isChecked = false;
      }
    }
    setWeeks([...tempArr]);
  };

  const _onPressTraining = item => {
    setTraiFeedBack(item?.val);
    var tempArr = trainigWeek;
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].id === item.id) {
        tempArr[i].isChecked = true;
      } else {
        tempArr[i].isChecked = false;
      }
    }
    setTrainingWeek([...tempArr]);
  };

  const _onPressDiet = item => {
    setDietData(item?.val);
    var tempArr = diet;
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].id === item.id) {
        tempArr[i].isChecked = true;
      } else {
        tempArr[i].isChecked = false;
      }
    }
    setDiet([...tempArr]);
  };

  function handleChoosePhoto(val) {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
        aspect: [4, 3],
        quality: 0.3,
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('cancel user');
      } else {
        const source = {uri: response?.assets[0]};
        if (val == 'front') {
          setFrontImg(response?.assets[0].uri);
          setImgError('');
        } else if (val == 'side') {
          setSideImg(response?.assets[0].uri);
          setImgError('');
        } else {
          setBackImg(response?.assets[0].uri);
          setImgError('');
        }
      }
    });
  }
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setHeight(200); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setHeight(0) // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const _onSubmit = async () => {
    
    if (inputLastWeek == '') {
      setWeightError('Please insert Last week weight');
    } else if (inputWeight == '') {
      setWeightInputError('Please fill Weight');
    } else if (weekData === '') {
      setWeekError('Please select week');
    } else if (trainFeedBack === '') {
      setTraiFeedBackError('Please select value');
    } else if (dietData === '') {
      setDietDataError('Please select diet');
    } 
    
    // else if (frontImg == '' || sideImg == '' || backImg == '') {
    //   setImgError('Please insert image');
    // } 
    // else if (description == '') {
    //   setNoteError('Please Enter Notes');
    // } 
    
    else {
      
      var data = new FormData();
      let dulpicateWeekArr = weeks
        .filter(item => {
          return item.isChecked == true;
        })
        .map(val => {
          return val;
        });
      
      let dulpicateTrainingArr = trainigWeek.filter(item => {
        return item.isChecked == true;
      }).map(val => {
        return val;
      });
      let dulpicateDietArr = diet
        .filter(item => {
          return item.isChecked == true;
        })
        .map(val => {
          return val;
        });
        
    
      data.append('programmeId', programmeId)
      data.append('week', weekValue)
      data.append('lastWeekWeight', inputLastWeek);
      data.append('weightNow', inputWeight);
      data.append('unitFirst', dropDownItem);
      data.append('unitLast', dropDownWeight);
      data.append('trainingFrequency', dulpicateWeekArr[0].val);
      data.append('trainingFeedback', dulpicateTrainingArr[0].val);
      data.append('describes', dulpicateDietArr[0]?.val);
      data.append('notes', description);
   
      if(frontImg && (!frontImg.includes('http'))) {
        data.append('frontImage', {
          uri: frontImg,
          type: frontImg,
          name: frontImg,
        })
      }
      if(sideImg && (!sideImg.includes('http'))) {
        data.append('sideImage', {
          uri: sideImg,
          type: sideImg,
          name: sideImg,
        })
      }

      if(backImg && (!backImg.includes('http'))) {
        data.append('backImage', {
          uri: backImg,
          type: backImg,
          name: backImg,
        })
      }

      

        
      console.log('datra going===',data)
   
    
      try {
        setLoader(true);
        const res = await usersService.checkInService(data);
        
        console.log('response coming neeraj==',res)
        setLoader(false);
        if (res?.data?.statusCode === 1) {
          setLoader(false);
          showMessage({
            message: '',
            description: 'Congrats! Your check in has been submitted',
            type: 'default',
            backgroundColor: COLORS.lightGreen,
            color: COLORS.white,
          });
          props.navigation.goBack()
          // setSuccessModal(true);
          let checkInData = {
            created: new Date(),
            week: weekValue,
            lastWeekWeight: inputLastWeek + dropDownItem,
            weightNow: inputWeight + dropDownWeight,
            trainingFrequency: dulpicateWeekArr[0].val,
            trainingFeedback: dulpicateTrainingArr[0].val,
            describes: dulpicateDietArr[0].val,
            notes: description,
            frontImage: res?.data?.responseData?.result?.frontImageUrl,
            backImage: res?.data?.responseData?.result?.backImageUrl,
            sideImage: res?.data?.responseData?.result?.sideImageUrl,
          };
          let newMsg = {
            created:new Date(),
            groupId: userChat?._id,
            checkInData: checkInData,
            receiverId: userChat?.coachId._id,
            senderId: userProfile._id,
          };
          
          // socketRef.current.emit('chatMessage', newMsg);
        } else {
          setLoader(false);
          alert(res.data.error.responseMessage);
        }
      } catch (e) {
        console.log('error caught----',e.message);
        setLoader(false);
        console.error('error ', e);
      }
    }
  };

  return (
    <MainScreen>
      {loader ? <Loader loading={true} /> : null}
      {/* {successModal ? (
        <InlineModal
          errorMessage={'Your submission has been sent.'}
          close={() => props.navigation.goBack()}
        />
      ) : null} */}

      <ScrollView style={{flex: 1}} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={{flex:1}}>
       <View style={{flex:1}}>
       <View style={styles.txtContainer}>
          <Text style={styles.titleTxt}>
            {
              'To ensure you get most out of the programme, be honest with your reflection'
            }
          </Text>
        </View>
        <View style={{paddingHorizontal: 12}}>
          <View style={styles.kgContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.weightTxt}>{'Last week weight'}</Text>
              <View style={styles.dropdownContainer}>
                <DropDown
                  onChangeText={text => {
                    setInputLastWeek(text);
                  }}
                  textInputValue={`${inputLastWeek||''}`}
                  getDropDownValue={setDropDownItem}
                  inputRef={inputRef}
                />
              </View>
            </View>

            <View style={{width: 25}} />
            <View style={{flex: 1}}>
              <Text style={styles.weightTxt}>{'Weight now'}</Text>
              <View style={styles.dropdownContainer}>
                <DropDown
                  onChangeText={text => {
                    setInputWeight(text);
                  }}
                  textInputValue={`${inputWeight||''}`}
                  getDropDownValue={setDropDownWeight}
                  inputRef={inputRef}
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{paddingVertical: 15, marginTop: -65}}>
              {weightError ? (
                <View style={{position: 'absolute', top: -20, marginTop: 18}}>
                  <InlineError errorMessage={weightError} />
                </View>
              ) : null}
              {weightInputError ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    marginTop: 18,
                    left: '53%',
                    width: '48%',
                  }}>
                  <InlineError errorMessage={weightInputError} />
                </View>
              ) : null}
              <Text style={styles.timesContainer}>
                {'How many times did you train this week?'}
              </Text>
              <View style={styles.weekContainer}>
                {weeks.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => _onPressWeek(item, index)}
                      key={item.id}
                      style={[
                        styles.titleContainer,
                        {
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
            </View>
            <View style={{paddingVertical: 10}}>
              {weekError ? (
                <View style={{position: 'absolute', top: -8}}>
                  <InlineError errorMessage={weekError} />
                </View>
              ) : null}
              <Text style={styles.timesContainer}>
                {'How was training this week?'}
              </Text>
              <View style={styles.weekContainer}>
                {trainigWeek.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => _onPressTraining(item)}
                      key={item.id}
                      style={[
                        styles.titleContainer,
                        {
                          margin: 5,
                          width: 80,
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
            </View>
            <View style={{paddingVertical: 17}}>
              {trainFeedBackError ? (
                <View style={{position: 'absolute', top: -8}}>
                  <InlineError errorMessage={trainFeedBackError} />
                </View>
              ) : null}
              <Text style={styles.timesContainer}>
                {'Which option best describes your diet?'}
              </Text>
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
            </View>
            <View style={styles.imgContainer}>
              {dietDataError ? (
                <View style={{position: 'absolute', top: -15}}>
                  <InlineError errorMessage={dietDataError} />
                </View>
              ) : null}
              <View style={{flex: 1}}>
                <Text style={styles.timesContainer}>{'Front photo'}</Text>
                <TouchableOpacity
                  onPress={() => handleChoosePhoto('front')}
                  style={styles.imgView}>
                  {frontImg ? (
                    <Image
                      source={{uri: frontImg}}
                      style={styles.imgViews}
                    />
                  ) : (
                    <CameraGreyIcon />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.timesContainer}>{'Side photo'}</Text>
                <TouchableOpacity
                  onPress={() => handleChoosePhoto('side')}
                  style={styles.imgView}>
                  {sideImg ? (
                    <Image
                      source={{uri: sideImg}}
                      style={styles.imgViews}
                    />
                  ) : (
                    <CameraGreyIcon />
                  )}
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.timesContainer}>{'Back photo'}</Text>
                <TouchableOpacity
                  onPress={() => handleChoosePhoto('back')}
                  style={[styles.imgView, {marginRight: 0}]}>
                  {backImg ? (
                    <Image
                      source={{uri: backImg}}
                      style={styles.imgViews}
                    />
                  ) : (
                    <CameraGreyIcon />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {imgError ? (
              <View style={{padding: 2}}>
                <InlineError errorMessage={imgError} />
              </View>
            ) : null}

            <View style={{paddingVertical: 10}}>
              <Text style={styles.timesContainer}>{'Notes'}</Text>

              <TextInput
                value={description}
                onChangeText={text => setDescription(text)}
                style={styles.noteContainer}
                multiline
                numberOfLines={6}
                placeholderTextColor={COLORS.grey_2}
                placeholder={'How has your week been?'}
                onChange={e => handleChange(e)}
                maxLength={750}
              />
            </View>

            {noteError ? (
              <View style={{padding: 2}}>
                <InlineError errorMessage={noteError} />
              </View>
            ) : null}
            <View style={{height: 50, marginTop: 5, marginBottom: 15}}>
              <GradientButton
                onPress={() => _onSubmit()}
                title="Submit"
                disabled={false}
              />
            </View>
          </View>
        </View>
       </View>
       <View style={{height:height}}/>
        </KeyboardAvoidingView>
      </ScrollView>
    </MainScreen>
  );
});

export default CheckInScreen;

const styles = StyleSheet.create({
  txtContainer: {
    paddingVertical: 17,
    paddingHorizontal: 30,
  },
  titleTxt: {
    textAlign: 'center',
    color: '#828282',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
  },
  weightTxt: {
    color: '#828282',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Manrope-Regular',
  },
  kgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
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
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    justifyContent: 'space-between',
  },
  imgView: {
    backgroundColor: '#F9F9F9',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    height: 115,
    marginTop: 5,
  },
  imgContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteContainer: {
    borderWidth: 1.2,
    borderColor: '#F2F2F2',
    borderRadius: 5,
    height: 120,
    backgroundColor: '#FFFFFF',
    marginVertical: 7,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    color: COLORS.grey_2,
  },
  dropdownContainer: {
    zIndex: 100,
    width: '92%',
    marginTop: 10,
  },
  imgViews: {
    height: '100%',
    width: '100%',
    borderRadius: 6,
  },
});
