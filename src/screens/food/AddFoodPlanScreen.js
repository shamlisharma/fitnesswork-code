import {useFocusEffect, useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  Platform,
  RefreshControl,
  Pressable,
  TextInput,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppButton, COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import GradientButton from '../../components/GradientButton';
import ImageCarousel from '../../components/ImageCarousel';
import {
  EmptyMinusIcon,
  EmptyPlusIcon,
  FilterIcon,
  HeartOutlined,
  SearchIcon,
} from '../../Svg';
import {useSelector, useDispatch} from 'react-redux';
import {
  FoodFilterKeyStatus,
  getDailyFoodPlanAction,
  getFoodPlanAction,
  getMealPlanByUserAction,
  removeDailyFoodPlan,
} from '../../_action/FoodAction';
import setting from '../../config/settings';
import FoodPlanNameModal from './FoodPlanNameModal';
import {updateDailyFoodPlanAction} from '../../_action/FoodAction';
import {Loader} from '../../common/Loader';
import {usersService} from '../../services/ApiServices';
import GradientContainer from '../../components/GradientContainer';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {capitalize} from 'lodash';
import AlertModal from '../modal/AlertModal';

const {height} = Dimensions.get('window');
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AddFoodPlanScreen = React.memo(() => {
  const [visibleToast, setvisibleToast] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  let mediaPath = setting.cdnUrl.url;
  const foodPlanByUser = useSelector(state => state?.food?.foodPlanByUser);
  const dailyAddedFoodPlan = useSelector(
    state => state?.food?.foodPlanByUser?.dailyFoodPlanId,
  );
  const food = useSelector(state => state?.food?.dailyFoodPlan);
  const foodPlan = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const [suggestedData, setSuggestedData] = useState([]);
  const [foodPlanId, setFoodPlanId] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState('');
  const {filterKey, searchKey} = useSelector(state => state.food.foodPlanList);
  const [onAddAlert, setAddAlert] = useState(false);
  const [itemById, setItemById] = useState();
  const [onRemvAlert, setRemvAlert] = useState(false);
  const [itemRemvById, setItemRemvById] = useState();
  const [rmvItem, setRemvItem] = useState();
  const [onCreatePlan, setCreatePlan] = useState(false);
  const [onCreateItem, setOnCreateItem] = useState();
  const [isLoader, setLoaderStatus] = useState(true);

  useEffect(() => setvisibleToast(false), [visibleToast]);
  const {time, foodPreferenceType, cuisionTypes} = useSelector(
    state => state.food.foodPlanList.filterData,
  );
console.log({foodPlanByUser});
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    let requestParams = {
      search: '',
      foodPreference: foodPreferenceType.map(item => item?.id),
      cuisine: cuisionTypes.map(item => item?.id),
    };
    dispatch(getFoodPlanAction(requestParams));
    wait(2000).then(() => setRefreshing(false));
  }, [foodPlanByUser]);

  const clearStatus = () => {
    dispatch(FoodFilterKeyStatus(false));
  };
  useFocusEffect(
    React.useCallback(() => {
      setLoader(true);
      let requestParams = {
        search: '',
        foodPreference: foodPreferenceType.map(item => item?.id),
        cuisine: cuisionTypes.map(item => item?.id),
      };
      dispatch(getFoodPlanAction(requestParams));
      setLoader(false);
    }, [cuisionTypes]),
  );

  useEffect(() => {
    dispatch(getDailyFoodPlanAction());
    let requestParams = {
      search: '',
      foodPreference: foodPreferenceType.map(item => item?.id),
      cuisine: cuisionTypes.map(item => item?.id),
    };
    dispatch(getFoodPlanAction(requestParams));
  }, [cuisionTypes]);

  useEffect(() => {
    setTimeout(() => {
      suggestedData?.length !== 0 && setLoaderStatus(false);
    },7500);
  }, [suggestedData]);




  useEffect(() => {
    if (foodPlan && foodPlanByUser) {
      if (foodPlan?.planName == 'Free') {
        // setSuggestedData(foodPlanByUser?.suggestedFoodPlan)
        setSuggestedData(foodPlanByUser?.suggestedFoodPlan);
        // setSuggestedData(
        //   foodPlanByUser?.suggestedFoodPlan?.filter((i, index) => index < 1),
        // );
        setLoader(false);
        //setLoaderStatus(false)
      }
        if (foodPlan?.planName == '7 Days Free Trial / Standard') {
          // setSuggestedData(foodPlanByUser?.suggestedFoodPlan)
          setSuggestedData(foodPlanByUser?.suggestedFoodPlan);
          // setSuggestedData(
          //   foodPlanByUser?.suggestedFoodPlan?.filter((i, index) => index < 1),
          // );
          setLoader(false);
          //setLoaderStatus(false)
        }
      if (foodPlan?.planName == 'Standard') {
        setSuggestedData(foodPlanByUser?.suggestedFoodPlan);
        setLoader(false);
        //setLoaderStatus(false)
      }
      if (foodPlan?.planName == 'Premium') {
        setSuggestedData(foodPlanByUser?.suggestedFoodPlan);
        setLoader(false);
        //setLoaderStatus(false)
      }
    }
    setLoader(false);
  }, [foodPlan, foodPlanByUser?.suggestedFoodPlan]);

  const completeLoadData=()=>{
    suggestedData?.length !== 0 && setLoaderStatus(false);
  }

  const onCreatePlanAlert = id => {
    setCreatePlan(true);
    setOnCreateItem(id);
  };

  const onCreateFoodPlan = meals => {
    const mealsData = [];
// console.log("meals", meals);
    meals?.mealsInfo.map(item =>
      mealsData.push({
        mealId: item._id,
        mealType: item.mealType,
      }),
    );

    let requestParams = {
      category: 3,
      foodTitle: capitalize(meals.foodTitle.trim()),
      meals: JSON.stringify(mealsData),
    };
    console.log({requestParams});
    usersService
      .addFoodPlan(requestParams)
      .then(res => {
        // console.log("response food added", res.data);
        dispatch(getFoodPlanAction());
        setCreatePlan(false);
        showMessage({
          message: 'Add food plan',
          description: 'your food plan added successfully.',
          type: 'default',
          backgroundColor: COLORS.lightGreen,
          color: COLORS.white,
        });
      })
      .catch(rej => {});
  };

  const onAddPlan = id => {
    setAddAlert(true);
    setItemById(id);
  };

  function addDailyFoodPlan(Id) {
    foodPlanId.push(Id);
    setFoodPlanId(foodPlanId);
    let req = {
      foodId: Id,
    };
    setLoader(true);
    dispatch(updateDailyFoodPlanAction(req)).then(res => {
      if (res.data.statusCode === 1) {
        setAddAlert(false);
        setLoader(false);
        dispatch(getFoodPlanAction());
        showMessage({
          message: 'Add food plan',
          description: 'your food plan added successfully',
          type: 'default',
          backgroundColor: COLORS.lightBlue,
          color: COLORS.white,
        });

        return null;
      }
    });
  }

  const foodPlanSelection = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access a customised food plan from me, please upgrade to premium',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const onRemovePlan = (id, item) => {
    setRemvAlert(true);
    setItemRemvById(id);
    setRemvItem(item);
  };

  function removeFoodPlan(Id, item) {
    // let data = new FormData();
    //   data.append('foodId', Id);
    //   data.append('category', item.category);
    let req = {
      foodId: Id,
      category: item.category,
    };
    setLoader(true);
    usersService.removeDailyFoodPlan(req).then(res => {
      if (res.data.statusCode === 1) {
        setLoader(false);
        setRemvAlert(false);
        dispatch(getFoodPlanAction());
        showMessage({
          message: 'Remove food plan',
          description: 'your food plan removed successfully.',
          type: 'default',
          backgroundColor: COLORS.lightGreen,
          color: COLORS.white,
        });
      } else {
        setLoader(false);
      }
    });
  }

  function suggestesPlanById(item, sId) {
    navigation.navigate('Carrot daily plan', {
      title: item.foodTitle,
      planFoodId: item,
      sId: sId,
    });
  }
  const onSearch = text => {
    let requestParams = {
      search: text,
    };
    dispatch(getFoodPlanAction(requestParams));
    setSearchText(text);
  };

  const Card = ({item}) => (
    <Pressable
      style={styles.cardContainer}
      onPress={() =>
        foodPlan?.planName == 'Free' ||
        foodPlan?.planName == 'Standard' ||
        foodPlan?.planName == '7 Days Free Trial / Standard'
          ? foodPlanSelection()
          : suggestesPlanById(item)
      }>
      <View style={styles.cardViewStyle}>
        <Image
          onLoadEnd={e => console.log('errooorr', e)}
          source={
            item?.foodImage
              ? {uri: mediaPath + item.foodImage}
              : require('../../../assets/vegcutlet.jpeg')
          }
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 5,
            opacity:
              foodPlan?.planName == 'Free' ||
              foodPlan?.planName == 'Standard' ||
              foodPlan?.planName == '7 Days Free Trial / Standard'
                ? 0.1
                : 3,
          }}
        />
        <Image
          source={require('assets/ShadedRectangle.png')}
          style={{
            height: '50%',
            width: '100%',
            borderRadius: 5,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
        {dailyAddedFoodPlan?.includes(item._id) ? (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() =>
              foodPlan?.planName == 'Free' ||
              foodPlan?.planName == 'Standard' ||
              foodPlan?.planName == '7 Days Free Trial / Standard'
                ? foodPlanSelection()
                : onRemovePlan(item._id, item)
            }>
            <EmptyMinusIcon />
          </Pressable>
        ) : (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() =>
              foodPlan?.planName == 'Free' ||
              foodPlan?.planName == 'Standard' ||
              foodPlan?.planName == '7 Days Free Trial / Standard'
                ? foodPlanSelection()
                : onAddPlan(item._id)
            }>
            <EmptyPlusIcon />
          </Pressable>
        )}
      </View>
      <Text style={styles.foodTitleTextStyle}>{`${item.foodTitle} ${
        item.order ? -item.order : ''
      }`}</Text>
    </Pressable>
  );

  const changeMemershipModal = msg => {
    Alert.alert(
      'Upgrade Plan',
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const StandardCard = ({item, index}) => (
    <Pressable
      style={styles.cardContainer}
      onPress={() => {
        if (
          (foodPlan?.planName == 'Free' ) &&
          index > 0
        ) {
          changeMemershipModal(
            'To access more meals please upgrade your account',
          );
        } else if (
          (foodPlan?.planName == 'Free') &&
          index == 0
        ) {
          suggestesPlanById(item, 1);
        } else {
          suggestesPlanById(item, 1);
        }
      }}>
      <View style={styles.cardViewStyle}>
        <Image
          onLoadEnd={e => setLoaderStatus(false)}
          source={
            item?.foodImage
              ? {uri: mediaPath + item.foodImage}
              : require('../../../assets/vegcutlet.jpeg')
          }
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 5,
            opacity:
              (foodPlan?.planName == 'Free') &&
              index > 0
                ? 0.3
                : 1,
          }}
        />
        <Image
          source={require('assets/ShadedRectangle.png')}
          style={{
            height: '50%',
            width: '100%',
            borderRadius: 5,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
        {dailyAddedFoodPlan?.includes(item._id) ? (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() =>
              (foodPlan?.planName == 'Free') &&
              index > 0
                ? changeMemershipModal(
                    'To access this feature, please upgrade to premium',
                  )
                : onRemovePlan(item._id, item)
            }>
            <EmptyMinusIcon />
          </Pressable>
        ) : (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() =>
              (foodPlan?.planName == 'Free' ) &&
              index > 0
                ? changeMemershipModal(
                    'To access this feature, please upgrade to premium',
                  )
                : onCreatePlanAlert(item)
            }>
            <EmptyPlusIcon />
          </Pressable>
        )}
      </View>
      <Text style={styles.foodTitleTextStyle}>{`${item.foodTitle} ${
        item.order ? -item.order : ''
      }`}</Text>
    </Pressable>
  );

  const MyFoodPlanCard = ({item,index}) => (
    <Pressable
    style={styles.cardContainer}
    onPress={() => {
      if (
        (foodPlan?.planName == 'Free') &&
        index > 0
      ) {
        changeMemershipModal(
          'To access more meals please upgrade your account',
        );
      } else if (
        (foodPlan?.planName == 'Free') &&
        index == 0
      ) {
        suggestesPlanById(item, 1);
      } else {
        suggestesPlanById(item, 1);
      }
    }}>
      <View style={styles.cardViewStyle}>
        <Image
          onLoadEnd={e => console.log('errooorr', e)}
          source={
            item?.foodImage
              ? {uri: mediaPath + item.foodImage}
              : require('../../../assets/vegcutlet.jpeg')
          }
          style={{height: '100%', width: '100%', borderRadius: 5, opacity: 3}}
        />
        <Image
          source={require('assets/ShadedRectangle.png')}
          style={{
            height: '50%',
            width: '100%',
            borderRadius: 5,
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
        {dailyAddedFoodPlan?.includes(item._id) ? (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() => onRemovePlan(item._id, item)}>
            <EmptyMinusIcon />
          </Pressable>
        ) : (
          <Pressable
            style={styles.addButtonStyle}
            onPress={() => onAddPlan(item._id)}>
            <EmptyPlusIcon />
          </Pressable>
        )}
      </View>
      <Text style={styles.foodTitleTextStyle}>{`${item.foodTitle} ${
        item.order ? -item.order : ''
      }`}</Text>
    </Pressable>
  );

  const createFoodPlan = () => {
    if (
      foodPlan?.planName == 'Free' 
    ) {
      changeMemershipModal('To access this feature, please upgrade to premium');
    } else {
      setModalVisible(true);
    }
  };

  return (
    <MainScreen>
      <AlertModal
        alert={onAddAlert}
        onResume={() => addDailyFoodPlan(itemById)}
        headertitle="Add Food Plan"
        content={
          dailyAddedFoodPlan
            ? dailyAddedFoodPlan?.length >= 1
              ? 'Are you sure you want to add one more food plan? Your food plans will work on a daily rotation.'
              : 'Do you want to add this meal plan?'
            : 'Do you want to add this meal plan?'
        }
        cancel={() => setAddAlert(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
        opacity={''}
      />
      <AlertModal
        alert={onRemvAlert}
        onResume={() => removeFoodPlan(itemRemvById, rmvItem)}
        headertitle="Remove Food Plan"
        content={'Do you want to remove this meal plan?'}
        cancel={() => setRemvAlert(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
        opacity={''}
      />

      <AlertModal
        alert={onCreatePlan}
        onResume={() => onCreateFoodPlan(onCreateItem)}
        headertitle="Add Food Plan"
        content={
          dailyAddedFoodPlan
            ? dailyAddedFoodPlan?.length >= 1
              ? 'Are you sure you want to add one more food plan? Your food plans will work on a daily rotation.'
              : 'Do you want to add this meal plan?'
            : 'Do you want to add this meal plan?'
        }
        cancel={() => setCreatePlan(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
        opacity={''}
      />
      {/* {loader ? <Loader loading={true} /> : null} */}

      <FoodPlanNameModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        navigation={navigation}
      />
      <ScrollView
        style={{marginBottom: 60}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* <View style={styles.headerContainer}>
          <View style={styles.textInputContainer}>
            <View style={{paddingHorizontal: 10}}>
              <SearchIcon />
            </View>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Search"
              onChangeText={text => onSearch(text)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.filterView}
            onPress={() =>
              navigation.navigate(' filter', {searchKey: searchText})
            }>
            {filterKey ? (
              <GradientContainer
                style={[styles.gradientStyle, {paddingHorizontal: 12}]}>
                <FilterIcon color={'white'} />
              </GradientContainer>
            ) : (
              <View
                style={[styles.withoutGradientStyle, {paddingHorizontal: 12}]}>
                <FilterIcon />
              </View>
            )}
          </TouchableOpacity>
        </View> */}

        {food ? (
          <View style={styles.currentFoodPlanView}>
            <Text style={styles.currentFoodText}>Current food plan</Text>
            <ImageBackground
              source={{uri: mediaPath + food?.foodImage}}
              style={{
                height: height * 0.255,
                width: '100%',
                borderRadius: 10,
                marginTop: 15,
              }}>
              {food?.category === 2 ? (
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={[COLORS.lightGreen, COLORS.lightBlue]}
                  style={styles.tagContainer}>
                  <Text style={{fontSize: 15, color: COLORS.white}}>
                    Customized Meal
                  </Text>
                </LinearGradient>
              ) : (
                <View />
              )}
              {/* <View style={styles.tagContainer}>
                
              </View> */}
            </ImageBackground>
            <Text style={styles.dietText}>{food?.foodTitle}</Text>
          </View>
        ) : null}

        <View style={styles.container}>
          {suggestedData && suggestedData?.length !== 0 ? (
            <>
              <Text style={styles.titleTextStyle}>Suggested food plans</Text>
              <ImageCarousel
                height={120}
                data={suggestedData}
                cardComponent={StandardCard}
              />
            </>
          ) : null}

          {isLoader && <Loader loading={true} />}

          {/* {
          foodPlanByUser?.customizedFoodPlan &&
          foodPlanByUser?.customizedFoodPlan.length !== 0 ? (
            <>
              <Text style={[styles.titleTextStyle]}>
                {foodPlan?.planName == 'Free' ||
                foodPlan?.planName == 'Standard'
                  ? 'Customized meals by nutritionist'
                  : 'Customized food plans'}
              </Text> 
              <ImageCarousel
                height={120}
                data={foodPlanByUser?.customizedFoodPlan}
                cardComponent={Card}
              />
              
            </>
          ) : null} */}

          {foodPlanByUser?.myFoodPlan &&
          foodPlanByUser?.myFoodPlan?.length !== 0 ? (
            <>
              <Text style={[styles.titleTextStyle]}>My food plans</Text>
              <ImageCarousel
                height={120}
                data={foodPlanByUser?.myFoodPlan}
                cardComponent={MyFoodPlanCard}
              />
            </>
          ) : null}
        </View>
      </ScrollView>
      <View
        style={{
          bottom: 0,
          position: 'absolute',
          alignSelf: 'center',
          paddingBottom: 20,
          opacity:
            foodPlanByUser === null ||
            foodPlan?.planName == 'Free' 
              ? 0.3
              : 1,
        }}>
        <AppButton title="Create new food plan" onPress={createFoodPlan} />
      </View>
    </MainScreen>
  );
});

export default AddFoodPlanScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 15,
    flex: 1,
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: COLORS.grey_2,
    fontSize: 16,
    marginTop: 15,
  },
  cardContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    width: 145,
  },
  cardViewStyle: {
    height: 120,
    width: 145,
  },
  addButtonStyle: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },

  tagContainer: {
    paddingVertical: 10,
    // width: 100,
    backgroundColor: 'green',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
  },
  foodTitleTextStyle: {
    fontFamily: 'Manrope-Medium',
    textTransform: 'capitalize',
    fontSize: 15,
    paddingTop: 5,
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 12,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 5,
    borderColor: COLORS.grey_5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    paddingVertical: 12,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  gradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  withoutGradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 10,
  },
  searchTxt: {
    marginLeft: 10,
    fontSize: 15,
    color: '#BDBDBD',
    fontFamily: 'Manrope-Regular',
    borderWidth: 1,
  },
  headerSubContainer: {
    marginRight: 6,
    borderWidth: 1.2,
    borderColor: '#F2F2F2',
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  filterView: {
    backgroundColor: '#F9F9F9',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitleTxt: {
    color: '#4F4F4F',
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginLeft: '3%',
  },
  flexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingVer: {
    paddingVertical: 8,
  },
  searchContainer: {
    marginRight: 6,
  },
  currentFoodText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: COLORS.grey_2,
  },
  dietText: {
    fontFamily: 'Manrope-Semibold',
    fontSize: 15,
    color: COLORS.grey_2,
    marginTop: 5,
  },
  currentFoodPlanView: {
    padding: 10,
  },
});
