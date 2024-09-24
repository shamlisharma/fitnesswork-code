import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../common/Constant';
import {
  DeleteIcon,
  InfoCircleIcon,
  InfoIcon,
  PenIcon,
  TipsIcon,
} from '../../Svg';

import ImageCarousel from '../../components/ImageCarousel';
import GradientButton from '../../components/GradientButton';
import TabHeader from '../../components/header/TabHeader';
import PhaseContainer from '../../components/phaseContainer/PhaseContainer';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/core';
import {MainScreen} from '../../common/Screen';
import ModifyFoodTargetModal from './ModifyFoodTargetModal';
import {useDispatch, useSelector} from 'react-redux';
import {
  getDailyFoodPlanAction,
  getDailyFoodTarget,
  getFoodPreferences,
  removeDailyFoodPlan,
} from '../../_action/FoodAction';
import ModifyFoodPreferencesModal from './ModifyFoodPreferencesModal';
import CaloriesAndProteinProgress from '../../components/CaloriesAndProteinProgress';
import FoodSubContainer from './FoodSubContainer';
import setting from '../../config/settings';
import DietPlanModal from './DietPlanModal';
import Imageb from 'react-native-image-progress';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
import {useNetInfo} from '@react-native-community/netinfo';
import moment from 'moment';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AlertModal from '../modal/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoodInfoModel from './FoodInfoModel';

let Food = React.memo(function Food(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const netState = useNetInfo();
  const food = useSelector(state => state?.food);
  // console.log("food", JSON.stringify(food))
  const [totalCalories, setTotalCalories] = useState();
  const [totalProtein, setTotalProtein] = useState();
  let mediaPath = setting.s3Url.url;
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dietModal, setDietModal] = useState(false);
  const [deleteMealPlan, setDeleteMealPlan] = useState(false);
  const [accesFoodTab, setAccessFoodTab] = useState(false);
  const [fromHomeTab, setFromHomeTab] = useState(false);
  const [foodInfoModal, setFoodInfoModel] = useState(false);
  const dailyAddedFoodPlan = useSelector(
    state => state?.food?.foodPlanByUser?.dailyFoodPlanId,
  );
  const deleteContent =
    'Are you sure you want to delete this food plan. Your food plans will work on a daily rotation.';
  const IngredientFormatter = array => {
    if (array?.length === 0) {
      return 'None';
    }
    return array?.map((item, index) => {
      if (index < array.length - 1) return item + ', ';
      else return item;
    });
  };

  const FoodTypeConverter = foodType => {
    if (foodType == 1) {
      return 'Standard';
    }
    if (foodType == 3) {
      return 'Pescatarian';
    }
    if (foodType == 4) {
      return 'Vegetarian';
    }
    if (foodType == 2) {
      return 'Vegan';
    }
  };
  useEffect(() => {
    let canAndProtein = food?.dailyFoodPlan?.mealsInfo?.filter(
      e => e.foodType !== '',
    );
    var totalCal = canAndProtein?.reduce((total, cal) => {
      return total + cal?.calories;
    }, 0);
    setTotalCalories(totalCal || 0);
    var totalPro = canAndProtein?.reduce((total, cal) => {
      return total + cal?.proteins;
    }, 0);
    setTotalProtein(totalPro || 0);
  }, [food.dailyFoodPlan]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getDailyFoodPlanAction());
    wait(2000).then(() => setRefreshing(false));
  }, [food.dailyFoodPlan]);

  const onRemoveFoodPlan = () => {
    setDeleteMealPlan(true);
  };

  const removeFoodPlan = () => {
    if (food?.dailyFoodPlan?._id) {
      let req = {
        foodId: food?.dailyFoodPlan?._id,
        category: food?.dailyFoodPlan?.category,
      };

      dispatch(removeDailyFoodPlan(req));
      setDeleteMealPlan(false);
      setTimeout(() => dispatch(getDailyFoodPlanAction()), 500);
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getDailyFoodTarget());
      dispatch(getFoodPreferences());
      dispatch(getDailyFoodPlanAction());
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      if (
        food?.dailyFoodTarget?.caloriesTarget == 0 ||
        food?.dailyFoodTarget?.caloriesTarget == ''
      ) {
        setAccessFoodTab(true);
      }
      getDietKeyFromHome();
    }, [food?.dailyFoodTarget?.caloriesTarget]),
  );
  useEffect(() => {}, [fromHomeTab]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Food tips', {
              title: 'Food tips',
              calTarget: food?.dailyFoodTarget?.caloriesTarget,
              proTarget: food?.dailyFoodTarget?.proteinsTarget,
            })
          }>
          <TipsIcon />
        </TouchableOpacity>
      ),
    });
  });
  const getDietKeyFromHome = async () => {
    const fromHome = await AsyncStorage.getItem('fromHomeTab');
    setFromHomeTab(fromHome);
  };
  const onGoBack = () => {
    setAccessFoodTab(false);
    navigation.navigate('HomeTab');
  };

  const onOkay = () => {
    setAccessFoodTab(false);
    navigation.navigate('Questionnaire');
  };

  const onFoodInfo = () => {
    setFoodInfoModel(true);
  };

  return (
    <MainScreen>
      <FoodInfoModel
        visible={foodInfoModal}
        onRequestClose={() => setFoodInfoModel(false)}
      />
      <DietPlanModal
        visible={dietModal}
        close={() => setDietModal(false)}
        setFromHomeTab={setFromHomeTab}
      />
      <ModifyFoodTargetModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        setModalVisible={setModalVisible}
      />
      <AlertModal
        alert={deleteMealPlan}
        onResume={() => removeFoodPlan()}
        headertitle="Delete Meal Plan"
        content={
          dailyAddedFoodPlan
            ? dailyAddedFoodPlan?.length >= 1
              ? deleteContent
              : 'Are you sure you want to delete your meal plan?'
            : 'Are you sure you want to delete your meal plan?'
        }
        cancel={() => setDeleteMealPlan(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
      />
      <AlertModal
        alert={accesFoodTab}
        onResume={() => onOkay()}
        headertitle="Food"
        content={
          'To access the food section, please complete the questionnaire first.'
        }
        cancel={() => onGoBack()}
        cancelBtn="Cancel"
        saveBtn="Ok"
        width={100}
        opacity={'#000000cf'}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <FoodSubContainer
          title={'Daily Food Target'}
          icon={<PenIcon />}
          infoIcon={<InfoIcon />}
          onPressInfoIcon={() => onFoodInfo()}
          onPressIcon={() => setModalVisible(true)}>
          <View style={styles.subContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.progressView}>
                <Text style={styles.steps}>Calories</Text>
                <Text style={styles.num}>
                  {food?.dailyFoodTarget?.caloriesTarget || 0}
                </Text>
              </View>
              <View style={styles.progressView}>
                <Text style={styles.steps}>Protein</Text>

                <Text style={styles.num}>
                  {food?.dailyFoodTarget?.proteinsTarget || 0}
                </Text>
                <Text style={[styles.steps, {marginLeft: 5}]}>grams</Text>
              </View>
            </View>
          </View>
        </FoodSubContainer>

        {fromHomeTab == 'true' ? (
          <TouchableOpacity
            onPress={() => setDietModal(true)}
            style={[
              styles.timesContainer,
              {
                backgroundColor: '#0CDD99',
              },
            ]}>
            <Text
              style={[
                styles.titleTxt,
                {
                  fontFamily: 'Manrope-SemiBold',
                  color: 'white',
                },
              ]}>
              How’s your diet going today?
            </Text>
          </TouchableOpacity>
        ) : null}

        <FoodSubContainer
          title={'Food Preferences'}
          icon={<PenIcon />}
          onPressIcon={() => navigation.navigate('Edit food preferences')}
          foodPreferences={'true'}>
          <View style={styles.subContainer}>
            <Text style={styles.ingredientTypeStyle}>
              {`Diet type: `}
              <Text style={styles.ingredientContentStyle}>
                {FoodTypeConverter(food?.foodPreferences?.foodType) || 'None'}
              </Text>
            </Text>
            <Text style={styles.ingredientTypeStyle}>
              {`Exclude Ingredients: `}
              <Text style={styles.ingredientContentStyle}>
                {IngredientFormatter(
                  food?.foodPreferences?.excludeIngredients,
                ) || 'None'}
              </Text>
            </Text>
            <Text style={styles.ingredientTypeStyle}>
              {`Favorite Ingredients: `}
              <Text style={styles.ingredientContentStyle}>
                {IngredientFormatter(
                  food?.foodPreferences?.favouriteIngredients,
                ) || 'None'}
              </Text>
            </Text>
          </View>
        </FoodSubContainer>

        {food?.dailyFoodPlan ? (
          <FoodSubContainer
            title={`${moment(new Date()).format('dddd')} Food Plan`}
            icon={<DeleteIcon />}
            editIcon={<PenIcon />}
            onPressIcon={onRemoveFoodPlan}
            meal={'true'}>
            <CaloriesAndProteinProgress
              totalCalories={totalCalories}
              totalProtein={totalProtein}
            />
            <View style={{flexDirection: 'row'}}>
              <ImageCarousel
                data={food?.dailyFoodPlan?.mealsInfo}
                height={150}
                cardComponent={({item}) => (
                  <TouchableOpacity
                    onPress={() => 
                      navigation.navigate('FoodDetailsScreen', {
                        mealId: item._id,
                        itemById: item,
                      })
                    }
                    style={styles.cardContainerStyle}>
                    {/* <Image
                      source={{uri: mediaPath + item.mealImage}}
                      style={styles.cardImageStyle}
                    /> */}
                    <Imageb
                      source={{uri: mediaPath + item.mealImage}}
                      indicator={
                        <ActivityIndicator
                          size={'large'}
                          color={COLORS.lightGreen}
                        />
                      }
                      style={styles.cardImageStyle}
                    />
                    <Text style={styles.cardTitleTextStyle}>
                      {item.mealType === 1
                        ? 'Breakfast'
                        : item.mealType === 2
                        ? 'Lunch'
                        : item.mealType === 3
                        ? 'Snack'
                        : item?.mealType === 4
                        ? 'Dinner'
                        : ''}
                    </Text>
                    <Text style={styles.cardSubtitleTextStyle}>
                      {item.mealName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </FoodSubContainer>
        ) : null}
        {food?.dailyFoodPlan ? null : (
          <View>
            <GradientButton
              title="Add a food plan"
              style={{
                width: Dimensions.get('window').width - 20,
                marginTop: 50,
              }}
              onPress={() => navigation.navigate('Meals')}
            />
          </View>
        )}
      </ScrollView>
    </MainScreen>
  );
});
const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 0,
    paddingBottom: 20,
  },
  progressView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'center',
  },
  steps: {
    fontSize: 14,
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
  },
  num: {
    fontSize: 22,
    fontFamily: 'Manrope-ExtraBold',
    color: COLORS.grey_2,
    marginLeft: 10,
  },
  progressNum: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.grey_2,
    height: 40,
  },
  progressView2: {
    left: 40,
  },
  progressView3: {
    left: 15,
  },
  phase: {
    marginRight: 10,
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: COLORS.light_grey,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  phaseTitle: {
    textAlign: 'center',
  },
  phaseTitleP: {
    color: COLORS.grey_2,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  phaseTitleD: {
    color: COLORS.grey_2,
    fontSize: 14,
    lineHeight: 20,
  },
  cardContainerStyle: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
  },
  cardImageStyle: {
    width: 180,
    height: 150,
    borderRadius: 5,
  },
  cardTitleTextStyle: {
    color: COLORS.blue,
    fontFamily: 'Manrope',
    fontSize: 14,
    marginTop: 5,
  },
  cardSubtitleTextStyle: {
    color: COLORS.grey_2,
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
    textTransform: 'capitalize',
    width: 180,
  },
  ingredientTypeStyle: {
    fontSize: 14,
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
  },
  ingredientContentStyle: {
    color: COLORS.lightGreen,
    textTransform: 'capitalize',
    fontFamily: 'Manrope-SemiBold',
  },
  subContainer: {
    backgroundColor: COLORS.inputTxtColor,
    padding: 15,
  },
  titleContainer: {
    width: 39,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    textAlign: 'center',
    color: '#828282',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
  },
  timesContainer: {
    paddingVertical: 15,
    marginTop: 8,
    color: '#828282',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
  },
});
export default Food;
