import React, {useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import GradientButton from '../../components/GradientButton';
import ItemSelector from '../../components/ItemSelector';
import {useDispatch, useSelector} from 'react-redux';
import { getMealPlanByUserAction, mealPlanActionType, setFoodFilterKeyStatus, updateFoodFilterData } from '../../_action/FoodAction';
import GradientContainer from '../../components/GradientContainer';
import { Slider } from '@miblanchard/react-native-slider';
import { scale } from 'react-native-size-matters';

const FOODTYPES = [
  {
    id: 1,
    name: 'Standard',
  },
  {
    id: 2,
    name: 'Vegan',
  },
  {
    id: 3,
    name: 'Pescatarian',
  },
  {
    id: 4,
    name: 'Vegetarian',
  },
  
];

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

const FoodPreferenceType = [
  {
    id: 1,
    name: 'Office friendly',
  },
  {
    id: 2,
    name: 'Vegan friendly',
  },
  {
    id: 3,
    name: 'Vegetarian friendly',
  },
  {
    id: 4,
    name: 'Pescatarian friendly',
  },
  
];

const CuisineTypes = [
  {
    id: 1,
    name: 'World',
  },
  {
    id: 2,
    name: 'African',
  },
  {
    id: 3,
    name: 'Chinese',
  },
  {
    id: 4,
    name: 'Europe',
  },
  
];

const FoodFilter = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const { foodTypes,mealTypes,foodPreferenceType,cuisionTypes,time } = useSelector(
    state => state.food.foodList.filterData,
  );
  
  const [sliderValue, setSliderValue] = useState(time);

  const [selectedFoodTypes, setSelectedFoodTypes] = useState(foodTypes);
  const [selectedMealTypes, setSelectedMealTypes] = useState(mealTypes);
  const [selectedFoodPreferTypes, setSelectedFoodPreferTypes] = useState(foodPreferenceType)
  const [selectedCuisionTypes, setSelectedCuisionTypes] = useState(cuisionTypes)
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onRefresh}>
          <Text style={{fontSize:17,fontFamily:"Manrope-Regular"}}>Clear All</Text>
        </TouchableOpacity>
      ),
    });
  });

  const onRefresh = () => {
    dispatch({type: mealPlanActionType.RESET_FILTER_DATA});
    dispatch(setFoodFilterKeyStatus(false));
    let params = {
      search: route.params.searchKey,
      isFavourite: route.params.isFavourite ? 1 : "",
    };
    dispatch(getMealPlanByUserAction(params));
    setSelectedFoodTypes([]);
    setSelectedMealTypes([]);
    setSelectedFoodPreferTypes([]);
    setSelectedCuisionTypes([])
    setSliderValue([0, 200]);
    navigation.navigate("All meals")
  };
  const handleFoodTypeSelection = item => {
    let tempArray = selectedFoodTypes;
    let index = tempArray.indexOf(item);
    if (index > -1) {
        setSelectedFoodTypes(tempArray.slice(0, index).concat(tempArray.slice(index + 1)),);
        } else {
        setSelectedFoodTypes(tempArray.concat(item));
    }
  };

  const handleMealTypes = item => {
    let tempArray = selectedMealTypes;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedMealTypes(tempArray.slice(0, index).concat(tempArray.slice(index + 1)),);
    } else {
        setSelectedMealTypes(tempArray.concat(item));
    }
  };
  const handleFoodPreferenceTypes = item => {
    let tempArray = selectedFoodPreferTypes;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedFoodPreferTypes(tempArray.slice(0, index).concat(tempArray.slice(index + 1)),);
    } else {
      setSelectedFoodPreferTypes(tempArray.concat(item));
    }
  };

  const handleCuisionTypes = item => {
    let tempArray = selectedCuisionTypes;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedCuisionTypes(tempArray.slice(0, index).concat(tempArray.slice(index + 1)),);
    } else {
      setSelectedCuisionTypes(tempArray.concat(item));
    }
  };

  
  const handleResult = () => {
    let requestParams = {
      search:route?.params?.searchKey,
      isFavourite:route?.params?.isFavourite ? 1:"",
      foodType: selectedFoodTypes.map(item => item.id),
      mealType: selectedMealTypes.map(item => item.id),
      foodPreference: selectedFoodPreferTypes.map(item=>item.id),
      prepTime: sliderValue,
      cuisine:selectedCuisionTypes.map(item=>item.id)
    };
 
    dispatch(getMealPlanByUserAction(requestParams));
    dispatch(setFoodFilterKeyStatus(true));
    let data = {
        foodTypes: selectedFoodTypes,
        mealTypes: selectedMealTypes,
        foodPreferenceType:selectedFoodPreferTypes,
        time: sliderValue,
        cuisionTypes:selectedCuisionTypes,
      };
      dispatch(updateFoodFilterData(data));
    navigation.navigate("All meals")
  };

  const handleDuration = item => {
    setSliderValue(item);
  };

  return (
    <MainScreen>
      <ScrollView style={{ paddingBottom: 30}}>
      <View style={{padding: 10}}>
      <ItemSelector
          title="Food Preference type"
          itemListArray={FoodPreferenceType}
          selectedItemsList={selectedFoodPreferTypes.map(item => item.name)}
          onItemSelect={item => handleFoodPreferenceTypes(item)}
          style={styles.padding}
        />

        {/* <ItemSelector
          title="Food type"
          itemListArray={FOODTYPES}
          selectedItemsList={selectedFoodTypes.map(item => item.name)}
          onItemSelect={item => handleFoodTypeSelection(item)}
          style={styles.padding}
        /> */}
        
        <ItemSelector
          title="Meal type"
          itemListArray={MEALTYPES}
          selectedItemsList={selectedMealTypes.map(item => item.name)}
          onItemSelect={item => handleMealTypes(item)}
          style={styles.padding}
        />
        <ItemSelector
          title="Cuisine type"
          itemListArray={CuisineTypes}
          selectedItemsList={selectedCuisionTypes.map(item => item.name)}
          onItemSelect={item => handleCuisionTypes(item)}
          style={styles.padding}
        />
        <View style={styles.padding}>
          <Text style={styles.titleTextStyle}>Time, min</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.sliderValueTextStyle}>{sliderValue[0]}</Text>
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Slider
                value={sliderValue}
                onValueChange={value => handleDuration(value)}
                maximumValue={200}
                minimumValue={0}
                step={5}
                minimumTrackTintColor={COLORS.lightGreen}
                maximumTrackTintColor={COLORS.grey_5}
                trackStyle={{width: 0}}
                renderThumbComponent={() => (
                  <View>
                    <GradientContainer style={styles.sliderThumbStyle} />
                  </View>
                )}
              />
              <View style={styles.boxStyle} />
            </View>
            <Text style={styles.sliderValueTextStyle}>{sliderValue[1]}</Text>
          </View>
        </View>
        
        
        
      </View>
      </ScrollView>
       <View style={styles.submitButtonView}>
          <GradientButton title="Show the results" onPress={handleResult} />
        </View>
    </MainScreen>
  );
});

export default FoodFilter;

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonView: {
    marginHorizontal: scale(15)
  },
  iosHeader: {
    marginLeft: 10,
    flex: 1,
  },
  andHeader: {
    left: 10,
    flex: 0.8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  HeaderTitle: {
    color: '#333333',
    fontSize: 20,
    fontFamily: 'Manrope-SemiBold',
  },
  timerContainer: {
    flex: 1,
    marginRight: 8,
    alignItems: 'flex-end',
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: COLORS.grey_4,
  },
  padding: {
    paddingBottom: 20,
  },
  sliderValueTextStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    color: COLORS.grey_3,
    borderColor: COLORS.grey_5,
  },
  sliderThumbStyle: {
    height: 20,
    width: 20,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'white',
  },
  boxStyle: {
    height: 1,
    backgroundColor: COLORS.grey_5,
    position: 'absolute',
    width: '100%',
    marginHorizontal: 10,
    top: 20,
    zIndex: -1,
  },
  timerContainer: {
    flex: 1,
    marginRight: 8,
    alignItems: 'flex-end',
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: COLORS.grey_4,
  },
  padding: {
    paddingBottom: 20,
  },
  sliderValueTextStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    color: COLORS.grey_3,
    borderColor: COLORS.grey_5,
  },
  sliderThumbStyle: {
    height: 20,
    width: 20,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'white',
  },
  boxStyle: {
    height: 1,
    backgroundColor: COLORS.grey_5,
    position: 'absolute',
    width: '100%',
    marginHorizontal: 10,
    top: 20,
    zIndex: -1,
  },
});
