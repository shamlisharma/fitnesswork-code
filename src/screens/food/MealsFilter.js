import React, {useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {useNavigation, useRoute} from '@react-navigation/native';
import GradientButton from '../../components/GradientButton';
import ItemSelector from '../../components/ItemSelector';
import {useDispatch, useSelector} from 'react-redux';
import { FoodFilterKeyStatus, getFoodPlanAction,  mealPlanActionType, setFoodFilterKeyStatus, updateFoodFilter,  } from '../../_action/FoodAction';
import { Slider } from '@miblanchard/react-native-slider';
import GradientContainer from '../../components/GradientContainer';


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

const MealFilter = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { time,foodPreferenceType,cuisionTypes } = useSelector(
    state => state.food.foodPlanList.filterData,
  );
  const [sliderValue, setSliderValue] = useState(time);
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
    dispatch(FoodFilterKeyStatus(false));
    let params = {
      search: route.params.searchKey,
    };
    dispatch(getFoodPlanAction(params));
    setSelectedFoodPreferTypes([]);
    setSelectedCuisionTypes([])
    setSliderValue([15, 30]);
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
  const handleDuration = item => {
    setSliderValue(item);
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
      foodPreference: selectedFoodPreferTypes.map(item=>item.id),
      time: sliderValue.map(item => item),
      cuisine:selectedCuisionTypes.map(item=>item.id)
    };
   
    dispatch(getFoodPlanAction(requestParams));
    dispatch(FoodFilterKeyStatus(true));
    let data = {
        foodPreferenceType:selectedFoodPreferTypes,
        time: sliderValue,
        cuisionTypes:selectedCuisionTypes,
      };
      dispatch(updateFoodFilter(data));
    navigation.navigate("Plans")
  };

  

  return (
    <MainScreen>
      <View style={{padding: 10}}>
      <ItemSelector
          title="Food Preference type"
          itemListArray={FoodPreferenceType}
          selectedItemsList={selectedFoodPreferTypes.map(item => item.name)}
          onItemSelect={item => handleFoodPreferenceTypes(item)}
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
                minimumValue={15}
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
        
        <View>
          <GradientButton title="Show the results" onPress={handleResult} />
        </View>
      </View>
    </MainScreen>
  );
});

export default MealFilter;

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_6,
    flexDirection: 'row',
    alignItems: 'center',
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
});
