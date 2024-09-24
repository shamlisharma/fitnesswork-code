import React, {useState, useReducer, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableOpacityComponent,
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { 
  AppButton,
  COLORS,
  DeviceScreen,
  SignupStepsNum,
} from '../../common/Constant';
import {
  CloseFoodIcon,
  FoodTapIcon,
  MinusCircleIcon,
  PlusIcon,
  SearchIcon,
} from '../../Svg';
import AuthHeader from '../../components/header/AuthHeader';
import {useDispatch} from 'react-redux';
import {getIngListAction} from '../../_action/IngredientsAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authAction} from '../../_action/AuthAction';
import {Loader} from '../../common/Loader';
import {Screen} from '../../common/Screen';
import {ScrollView} from 'react-native-gesture-handler';
import RadioButton from '../../components/RadioButton';
import FoodRadioButton from '../../components/FoodRadioButton';
import DeviceInfo from 'react-native-device-info';
const PERSISTENCE_KEY = 'NAVIGATION_STATE';

function FoodPreferences(props) {
  let dispatch = useDispatch();
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      search: '',
      isLoader: false,
      ingList: [],
      setIngList: [],
    },
  );
  const freePlan = props?.route?.params?.planName;

  const navigation = useNavigation();
  const [excludeIng, setExcludeIng] = useState(false);
  const [fvrtIng, setFvrtIng] = useState(false);
  const [dataItemArray, setDataItemArray] = useState([]);
  const [fvrtDataArray, setFvrtDataArray] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedFvrtIds, setSelectedFvrtIds] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [freeP, setFree] = useState(false);
  const [dietType, setDietType] = useState(1);
  const firstCall = useRef(true);

  function onExcludeIng() {
    setExcludeIng(true);
  }

  function onFvrtIng() {
    setFvrtIng(true);
  }

  useEffect(() => {
    if (isApiSuccess)
      navigation.reset({
        index: 0,
        routes: [{name: 'drawer'}],
      });
    let data = userInput.ingList.filter(
      item => selectedIds.indexOf(item.ingredientName.toLowerCase()) < 0,
    );
    setFilterData(data);
  }, [isApiSuccess, userInput.ingList]);

  useEffect(() => {
    if (firstCall.current) {
      removeIngredient();
      removeFvrtIngredient();
      firstCall.current = false;
    }
    listOfIngredients();
  }, [
    userInput.search,
    dataItemArray,
    selectedIds,
    selectedFvrtIds,
    fvrtDataArray,
  ]);

  useEffect(() => {
    if (freePlan) {
      setFree(true);
    }
  }, [freePlan]);

  async function listOfIngredients() {
    let userId = await AsyncStorage.getItem('userId');
    let req = {
      userId: userId,
      ingredientName: userInput.search ? userInput.search : '',
    };
    dispatch(getIngListAction(req)).then(res => {
      if (res.data.statusCode === 1) {
        setUserInput({ingList: res.data.responseData.result});
      } else {
        setIsApiSuccess(false);
        // setUserInput({
        //   otpError: res.data.error.responseMessage,
        // });
      }
    });
  }

  function removeIngredient(data, index) {
    if (index > -1) {
      setDataItemArray(item => {
        return [
          ...item.filter((value, i) => {
            return i !== index;
          }),
        ];
      });
      setSelectedIds(item => {
        return [
          ...item.filter((value, i) => {
            return i !== index;
          }),
        ];
      });
    }
  }

  function removeFvrtIngredient(data, index) {
    if (index > -1) {
      setSelectedFvrtIds(item => {
        return [
          ...item.filter((value, i) => {
            return i !== index;
          }),
        ];
      });
      setFvrtDataArray(item => {
        return [
          ...item.filter((value, i) => {
            return i !== index;
          }),
        ];
      });
    }
  }

  const onExcludeRemoveIngredient = item => {
    const index = selectedIds.indexOf(item.ingredientName);
    setSelectedIds(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
  };

  const onExcludeAddIngredient = item => {
    setSelectedIds(prevState =>
      prevState.concat(item.ingredientName.toLowerCase()),
    );
  };

  const onRemoveIngredient = item => {
    const index = selectedFvrtIds.indexOf(item.ingredientName);
    setSelectedFvrtIds(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
  };

  const onAddIngredient = item => {
    setSelectedFvrtIds(prevState =>
      prevState.concat(item.ingredientName.toLowerCase()),
    );
  };

  async function onSignup() {
    let uniqueId = DeviceInfo.getUniqueId();
   
    
    if (dietType == '') {
      alert('Please select the food preferences');
    } else {
      let userId = await AsyncStorage.getItem('userId');
      let token = await AsyncStorage.getItem('nToken');
      let userName = await AsyncStorage.getItem('userName');
      let req = {
        userId: userId,
        password: props.route.params.password,
        fname: props.route.params.firstName,
        lname: props.route.params.lastName,
        age: props.route.params.age,
        gender: props.route.params.gender,
        excludeIngredients: selectedIds,
        favouriteIngredients: selectedFvrtIds,
        foodType: dietType.toString(),
        planId: props.route.params.planId,
        deviceToken: token,
        userName: userName,
        deviceId: Platform.OS == 'android'? 'android': 'ios',
      };
      setLoader(true);
      dispatch(authAction(req))
        .then(async res => {
         
          if (res.data.statusCode === 1) {
            setIsApiSuccess(true);
            await AsyncStorage.removeItem(PERSISTENCE_KEY);
            setLoader(false);
            await AsyncStorage.setItem(
              'accessToken',
              res.data.responseData.accessToken,
            );
          } else {
            setIsApiSuccess(false);
            setLoader(false);
          }
        })
        .catch(error => {
          
          setLoader(false);
          alert(error.message);
        });
    }
  }

  function closeListOfIng() {
    setUserInput({search: ''});
    setExcludeIng(false);
    setFvrtIng(false);
  }

  return (
    <Screen auth={'true'}>
      <ImageBackground
        source={require('../../../assets/bgSignin.png')}
        style={{width: DeviceScreen.width, height: '100%'}}>
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        <View style={styles.Container}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={{height: '100%', paddingBottom: '45%'}}>
              <View style={{paddingTop: 40, paddingLeft: 30, paddingRight: 30}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.white,
                    fontWeight: 'bold',
                  }}>
                  Your diet preference
                </Text>
              </View>
              <View
                style={{
                  paddingTop: 5,
                  paddingBottom: 20,
                  paddingLeft: 30,
                  paddingRight: 30,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.grey_4,
                  }}>
                  I’ll give you food suggestions based off your preference
                </Text>
              </View>
              <View>
                <View style={{flexDirection: 'row', paddingBottom: 20}}>
                  <FoodRadioButton
                    name="Standard"
                    style={styles.radioButtonStyle}
                    onSelect={() => setDietType(1)}
                    selected={dietType === 1}
                  />
                  <FoodRadioButton
                    name="Pescatarian"
                    style={styles.radioButtonStyle}
                    onSelect={() => setDietType(3)}
                    selected={dietType === 3}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <FoodRadioButton
                    name="Vegetarian"
                    style={styles.radioButtonStyle}
                    onSelect={() => setDietType(4)}
                    selected={dietType === 4}
                  />
                  <FoodRadioButton
                    name="Vegan"
                    style={styles.radioButtonStyle}
                    onSelect={() => setDietType(2)}
                    selected={dietType === 2}
                  />
                </View>
              </View>{' '}
              {freePlan === 'Free' ? null : (
                <View
                  style={{paddingTop: 40, paddingLeft: 30, paddingRight: 30}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.white,
                      fontWeight: 'bold',
                    }}>
                    Your food preferences
                  </Text>
                </View>
              )}
              {freePlan === 'Free' ? null : (
                <View
                  style={{
                    paddingTop: 5,
                    paddingBottom: 20,
                    paddingLeft: 30,
                    paddingRight: 30,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.grey_4,
                    }}>
                    I’ll select the most suitable food plan for you
                  </Text>
                </View>
              )}
              {/* Exclude food selected item shows here */}
              {freeP == true ? null : (
                <>
                  {excludeIng === false ? (
                    <>
                      {fvrtIng === false ? (
                        <View style={{padding: 30}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{color: COLORS.grey_4, fontSize: 14}}>
                                Exclude Ingredients:
                              </Text>
                              {dataItemArray.length == 0 ? (
                                <Text
                                  style={{
                                    color: COLORS.lightGreen,
                                    fontSize: 14,
                                    left: 5,
                                  }}>
                                  None
                                </Text>
                              ) : (
                                <></>
                              )}
                            </View>
                            <TouchableOpacity onPress={onExcludeIng}>
                              <PlusIcon />
                            </TouchableOpacity>
                          </View>
                          <View>
                            {selectedIds?.map((item, index) => {
                              return (
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      padding: 5,
                                      alignItems: 'center',
                                    }}
                                    onPress={() =>
                                      removeIngredient(item, index)
                                    }>
                                    <MinusCircleIcon />
                                    <Text
                                      style={{
                                        color: COLORS.lightBlue,
                                        left: 10,
                                      }}>
                                      {item}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingTop: '5%',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{color: COLORS.grey_4, fontSize: 14}}>
                                Favorite ingredients:
                              </Text>
                              {fvrtDataArray.length == 0 ? (
                                <Text
                                  style={{
                                    color: COLORS.lightGreen,
                                    fontSize: 14,
                                    left: 5,
                                  }}>
                                  None
                                </Text>
                              ) : (
                                <></>
                              )}
                            </View>
                            <TouchableOpacity onPress={onFvrtIng}>
                              <View>
                                <PlusIcon />
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View>
                            {/* fvrt food selected item shows here */}

                            {selectedFvrtIds?.map((item, index) => {
                              return (
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: 'row',
                                      padding: 5,
                                      alignItems: 'center',
                                    }}
                                    onPress={() =>
                                      removeFvrtIngredient(item, index)
                                    }>
                                    <MinusCircleIcon />
                                    <Text
                                      style={{
                                        color: COLORS.lightBlue,
                                        left: 10,
                                      }}>
                                      {item}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {/* exclude Ingredients list */}
              {freePlan === 'Free'  ? null : (
                <>
                  {excludeIng === true ? (
                    <View>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={excludeIng}
                        onRequestClose={() => {
                          setExcludeIng(false);
                        }}>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: COLORS.grey_1,
                            paddingLeft: 30,
                            paddingRight: 30,
                            paddingTop: 30,
                            marginTop: 172,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                color: COLORS.white,
                                fontSize: 16,
                                lineHeight: 20,
                                fontWeight: 'bold',
                              }}>
                              Add Exclude Ingredients
                            </Text>
                            <TouchableOpacity onPress={() => closeListOfIng()}>
                              <CloseFoodIcon />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.inputField}>
                            <View style={styles.icon}>
                              <SearchIcon />
                            </View>
                            <TextInput
                              keyboardType="email-address"
                              style={styles.searchInputField}
                              placeholderTextColor="#828282"
                              placeholder="Enter product name"
                              value={userInput.search}
                              name="search"
                              onChangeText={search => setUserInput({search})}
                            />
                          </View>
                          {userInput.ingList.length === 0 ||
                          userInput.search.length === 0 ? (
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'center',
                                top: '30%',
                              }}>
                              <FoodTapIcon />
                              <Text
                                style={{
                                  fontSize: 15,
                                  lineHeight: 20,
                                  fontWeight: '500',
                                  color: COLORS.white,
                                }}>
                                No Exclude Ingredients yet
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  lineHeight: 20,
                                  fontWeight: '400',
                                  color: COLORS.grey_3,
                                }}>
                                Add Ingredients you would like to exclude
                              </Text>
                            </View>
                          ) : (
                            <></>
                          )}
                          {userInput.search ? (
                            <>
                              <FlatList
                                style={{marginTop: 25}}
                                data={userInput.ingList}
                                extraData={selectedIds}
                                keyExtractor={({id}, index) => id}
                                renderItem={({item, index}) => (
                                  <View style={styles.resultItemStyle}>
                                    {selectedIds.indexOf(
                                      item.ingredientName.toLowerCase(),
                                    ) >= 0 ? (
                                      <TouchableOpacity
                                        onPress={() =>
                                          onExcludeRemoveIngredient(item)
                                        }>
                                        <MinusCircleIcon />
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          onExcludeAddIngredient(item)
                                        }>
                                        <PlusIcon />
                                      </TouchableOpacity>
                                    )}
                                    <Text
                                      style={{
                                        color: COLORS.lightBlue,
                                        left: 10,
                                      }}>
                                      {item.ingredientName}
                                    </Text>
                                  </View>
                                )}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </View>
                      </Modal>
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {/* fvrt Ing start here */}
              {fvrtIng === true ? (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={fvrtIng}
                  onRequestClose={() => {
                    setFvrtIng(false);
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.grey_1,
                      paddingLeft: 30,
                      paddingRight: 30,
                      paddingTop: 30,
                      marginTop: 172,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: 16,
                          lineHeight: 20,
                          fontWeight: 'bold',
                        }}>
                        Add Favorite Ingredients
                      </Text>
                      <TouchableOpacity onPress={() => closeListOfIng()}>
                        <CloseFoodIcon />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputField}>
                      <View style={styles.icon}>
                        <SearchIcon />
                      </View>
                      <TextInput
                        keyboardType="email-address"
                        style={styles.searchInputField}
                        placeholderTextColor="#828282"
                        placeholder="Enter product name"
                        value={userInput.search}
                        name="search"
                        onChangeText={search => setUserInput({search})}
                      />
                    </View>
                    {userInput.ingList.length === 0 ||
                    userInput.search.length === 0 ? (
                      <View style={{flex: 1, alignItems: 'center', top: '30%'}}>
                        <FoodTapIcon />
                        <Text
                          style={{
                            fontSize: 15,
                            lineHeight: 20,
                            fontWeight: '500',
                            color: COLORS.white,
                          }}>
                          No Favorite Ingredients yet
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 20,
                            fontWeight: '400',
                            color: COLORS.grey_3,
                          }}>
                          Add Ingredients you would like to exclude
                        </Text>
                      </View>
                    ) : (
                      <></>
                    )}
                    {userInput.search ? (
                      <>
                        <FlatList
                          style={{marginTop: 25}}
                          data={filterData}
                          extraData={selectedFvrtIds}
                          keyExtractor={({id}, index) => id}
                          renderItem={({item, index}) => (
                            <View style={styles.resultItemStyle}>
                              {selectedFvrtIds.indexOf(
                                item.ingredientName.toLowerCase(),
                              ) >= 0 ? (
                                <TouchableOpacity
                                  onPress={() => onRemoveIngredient(item)}>
                                  <MinusCircleIcon />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => onAddIngredient(item)}>
                                  <PlusIcon />
                                </TouchableOpacity>
                              )}
                              <Text style={{color: COLORS.lightBlue, left: 10}}>
                                {item.ingredientName}
                              </Text>
                            </View>
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                </Modal>
              ) : (
                <></>
              )}
              {excludeIng === false ? (
                <>
                  {fvrtIng === false ? (
                    <View>
                      <AppButton
                        title="Save and complete sign up"
                        onPress={onSignup}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                          top: '20%',
                        }}>
                        <SignupStepsNum num1="8" />
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
      {loader && (
        <View style={styles.loadingWholeView}>
          <View style={styles.transparentsheetView} />
          <ActivityIndicator size={'large'} color="#0DB8DA" />
        </View>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  Container: {
    height: DeviceScreen.height,
    backgroundColor: 'rgba(7,7,7,0.4)',
  },
  inputField: {
    flexDirection: 'row',
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    height: 45,
    borderRadius: 0,
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 12,
  },
  errorField: {
    fontSize: 16,
    marginVertical: 5,
    color: COLORS.white,
  },
  searchInputField: {
    height: 50,
    fontSize: 15,
    color: COLORS.grey_5,
    paddingLeft: 10,
  },
  resultItemStyle: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonStyle: {
    width: '50%',
    paddingLeft: '8%',
  },
  loadingWholeView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040'
  },

  transparentsheetView: {
    backgroundColor: COLORS.black,
    opacity: 0.5,

  }
});

export default FoodPreferences;
