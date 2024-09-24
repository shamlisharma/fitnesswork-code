import React, {useState, useEffect, useLayoutEffect, useRef } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import FoodDetailsCard from './FoodDetailsCard';
import {useSelector, useDispatch} from 'react-redux';
import {
  addFoodPlan,
  getFoodPlanAction,
  getMealPlanByUserAction,
} from '../../_action/FoodAction';
import { BottomToast } from '../../components/toasts//BottomToast';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import GradientButton from '../../components/GradientButton';
import {FlatList} from 'react-native-gesture-handler';
import {usersService} from '../../services/ApiServices';
import {capitalize} from 'lodash';
import ItemSelector from '../../components/ItemSelector';
import {showMessage, hideMessage} from 'react-native-flash-message';
import { Loader } from '../../common/Loader';

const RECIPE_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
const MEALTYPES = [
  {
    id: 1,
    name: 'BreakFast',
  },
  {
    id: 2,
    name: 'Lunch',
  },
  {
    id: 3,
    name: 'Snack',
  },
  {
    id: 4,
    name: 'Dinner',
  },
];
const AddFood = React.memo(({route}) => {
  const snackbarRef = useRef(null);
  const {mealTypes, mealFoodArray} = useSelector(
    state => state.food.foodList.filterData,
  );
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const navigation = useNavigation();
  const [selectedRecipeTypes, setSelectedRecipeTypes] = useState('');
  const [selectedMealTypes, setSelectedMealTypes] = useState(mealFoodArray);
  const [breakfastArr, setBreakfastArr] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [snack, setSnack] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [mealId, setMealId] = useState();
  const [newFoodPlan, setNewFoodPlan] = useState([]);
  const [loader,setLoader] = useState(false)
  const dispatch = useDispatch();
  const mealPlanByUser = useSelector(state => state?.food?.mealPlanByuser);
  const changeMemershipModal = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access this feature, please upgrade your account',
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

  useFocusEffect(
    React.useCallback(() => {
      setSelectedRecipeTypes('Breakfast');
      let mealId = selectedMealTypes.map(item => item.id);
      console.log("user food details mealid",mealId,selectedMealTypes.id,mealId[0])  
      let requestParams = {
        mealType: mealId,
      };
      setLoader(true)
      usersService.getMealPlanByUser(requestParams).then(res => {
      console.log("user food details",res,"requestParams",requestParams)  
      setLoader(false)
        let response = res?.data?.responseData?.result;
        console.log("user food details response",response) 
        let mealTypeData = selectedMealTypes.map(item => item.id);
        setMealId(mealTypeData);
        if (mealTypeData.includes(1)) {
          console.log("user food details 1",response)  
          setBreakfastArr(response);
        } else if (mealTypeData.includes(2)) {
          console.log("user food details 2",response)  
          setLunch(response);
        } else if (mealTypeData.includes(3)) {
          console.log("user food details 3",response)  
          setSnack(response);
        } else if (mealTypeData.includes(4)) {
          console.log("user food details 4",response)  
          setDinner(response);
        }
      });
    }, [selectedMealTypes]),
  );
  
  function handleRecipeTypeSelected(item) {
    let tempArray = selectedMealTypes;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedMealTypes([]);
    } else {
      setSelectedMealTypes([item]);
    }
  }

  const MealTypeFormater = item => {
    let value = `${RECIPE_TYPES[item.mealType - 1]}`;
    return (
      <FoodDetailsCard
        item={item}
        mealTypeId={item.mealType}
        newFoodPlan={newFoodPlan}
        setNewFoodPlan={setNewFoodPlan}
        selectedRecipeTypes={selectedRecipeTypes}
        selectedMealTypes={selectedMealTypes}
        onAddOrRemoveItem={(msg) => snackbarRef.current.getData(msg)}
      />
    );
  };

  const onCreateFoodPlan = () => {
   if (
     getProfileData?.planName == 'Free'
   ) {
     changeMemershipModal();
   } else {
     const mealsData = [];

     newFoodPlan.map(item =>
       mealsData.push({
         mealId: item._id,
         mealType: item.mealType,
       }),
     );
     if (newFoodPlan.length < 3) {
       alert('Please select minimum 3 meals');
     } else {
       let requestParams = {
         category: 3,
         foodTitle: capitalize(route.params.title.trim()),
         meals: JSON.stringify(mealsData),
       };
       usersService
         .addFoodPlan(requestParams)
         .then(res => {
           navigation.goBack();

           showMessage({
             message: 'Add food plan',
             description: 'your food plan added successfully.',
             type: 'default',
             backgroundColor: COLORS.lightGreen,
             color: COLORS.white,
           });
         })
         .catch(rej => {});
     }
   }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{ opacity: getProfileData?.planName == 'Free' ? 0.4 : 1}}
        >
        <GradientButton
          title={'Create'}
          onPress={() => onCreateFoodPlan()}
          style={{padding: 6, paddingHorizontal: 10,}}
          textStyle={{fontSize: 13}}
        />
        </View>
      ),
    });
  }, [navigation, newFoodPlan]);

  const mealData = () => {
    if (mealId?.includes(1))
      return (
        <FlatList
          data={breakfastArr}
          renderItem={({item, index}) => MealTypeFormater(item)}
          bounces={false}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      );
    if (mealId?.includes(2))
      return (
        <FlatList
          data={lunch}
          renderItem={({item, index}) => MealTypeFormater(item)}
          bounces={false}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      );
    if (mealId?.includes(3))
      return (
        <FlatList
          data={snack}
          renderItem={({item, index}) => MealTypeFormater(item)}
          bounces={false}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      );
    if (mealId?.includes(4))
      return (
        <FlatList
          data={dinner}
          renderItem={({item, index}) => MealTypeFormater(item)}
          bounces={false}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      );
  };

  return (
    <MainScreen>
      <View style={styles.headerButtonContainerStyle}>
        {loader && <Loader loading={true}/>}
        <ItemSelector
          itemListArray={MEALTYPES}
          selectedItemsList={selectedMealTypes.map(item => item.name)}
          onItemSelect={item => handleRecipeTypeSelected(item)}
          style={styles.padding}
          fromAddFood={'true'}
        />
        {/* {MEALTYPES.map((item, index)=> (
            <TouchableOpacity 
            onPress={()=>handleRecipeTypeSelected(item)}
            style={[styles.headerButtonStyle,{marginRight:(index!==3?4:0),  backgroundColor:selectedRecipeTypes===item?COLORS.lightGreen:'white'} ]}>
              <Text style={[styles.headerTextStyle, {color:mealId===item?.id? 'white': COLORS.lightGreen}]}>{item.name}</Text>
            </TouchableOpacity>
          ))} */}
      </View>
      {mealData()}
      <BottomToast 
        ref={snackbarRef}
      />
    </MainScreen>
  );
});

export default AddFood;

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingHorizontal: 10,
  },
  headerButtonContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  headerButtonStyle: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 5,
    borderColor: COLORS.lightGreen,
  },
  headerTextStyle: {
    textAlign: 'center',
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
  },
});
