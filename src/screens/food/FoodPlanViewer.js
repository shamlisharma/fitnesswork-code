import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import CaloriesAndProteinProgress from '../../components/CaloriesAndProteinProgress';
import ProgressIndicator from '../../components/ProgressIndicator';
import FoodDetailsCard from './FoodDetailsCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getFoodPlanAction,
  removeDailyFoodPlan,
  updateDailyFoodPlanAction,
} from '../../_action/FoodAction';
import {usersService} from '../../services/ApiServices';
import {MinusCircleIcon, PlusIcon} from '../../Svg';
import {Loader} from '../../common/Loader';
import {capitalize} from 'lodash';
import {showMessage, hideMessage} from 'react-native-flash-message';

const FoodPlanViewer = React.memo(props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [totalCalories, setTotalCalories] = useState();
  const [totalProtein, setTotalProtein] = useState();
  const [foodPlan, setFoodPlan] = useState([]);
  const [loader, setLoader] = useState(false);
  const foodPlanId = props?.route?.params?.planFoodId;
  const foodPlanByUser = useSelector(state => state?.food?.foodPlanByUser);
const sId=props?.route?.params?.sId
  useEffect(() => {
    getMealPlan();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            foodPlanByUser?.dailyFoodPlanId?.includes(foodPlanId?._id)
              ? removeFoodPlan(foodPlanId)
              :sId==1? createSuggestedFoodPlan(foodPlanId):addDailyFoodPlan(foodPlanId)
          }>
          {foodPlanByUser?.dailyFoodPlanId?.includes(foodPlanId?._id) ? (
            <MinusCircleIcon />
          ) : (
            <PlusIcon />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const createSuggestedFoodPlan = (meals) => {
    const mealsData = [];
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
      usersService
        .addFoodPlan(requestParams)
        .then(res => {
          dispatch(getFoodPlanAction());
          navigation.goBack();
          showMessage({
            message: 'Add food plan',
            description: 'your food plan added successfully.',
            type: 'default',
            backgroundColor: COLORS.lightGreen,
            color: COLORS.white,
          });
        })
        .catch(rej => {
          
        });
    
  };

  function addDailyFoodPlan(Id) {
    let req = {
      foodId: Id,
    };
    dispatch(updateDailyFoodPlanAction(req)).then(res => {
      if (res.data.statusCode === 1) {
        navigation.goBack();
      }
    });
  }

  const removeFoodPlan = () => {
    let req = {
      foodId: foodPlanId?._id,
      category:foodPlanId?.category
    };
    setLoader(true);
    dispatch(removeDailyFoodPlan(req));
    setLoader(false);
    navigation.goBack();
  };

  async function getMealPlan() {
    const foodId = foodPlanId;
    let req = {
      foodId: foodId,
    };
    setLoader(true);
    try {
      const result = await usersService.getMealPlanById(req);
      if (result.data.statusCode === 1) {
        setFoodPlan(result?.data?.responseData?.result[0]?.mealsInfo);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (e) {
      setLoader(false);
    }
  }

  useEffect(() => {
    let canAndProtein = foodPlanId?.mealsInfo?.filter(e => e.foodType !== '');
    var totalCal = canAndProtein?.reduce((total, cal) => {
      return total + cal?.calories;
    }, 0);
    setTotalCalories(totalCal);
    var totalPro = canAndProtein?.reduce((total, cal) => {
      return total + cal?.proteins;
    }, 0);
    setTotalProtein(totalPro);
  }, [foodPlanId]);
  return (
    <MainScreen>
      {loader ? <Loader loading={true} /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        <CaloriesAndProteinProgress
          totalCalories={totalCalories || 0}
          totalProtein={totalProtein || 0}
        />
        {foodPlanId?.mealsInfo?.map(item => (
          <FoodDetailsCard item={item} getMealPlan={getMealPlan} />
        ))}
      </ScrollView>
    </MainScreen>
  );
});

export default FoodPlanViewer;
