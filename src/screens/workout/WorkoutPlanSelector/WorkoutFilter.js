import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {COLORS} from '../../../common/Constant';
import {MainScreen} from '../../../common/Screen';
import {RefreshIcon} from '../../../Svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import GradientButton from '../../../components/GradientButton';
import {Slider} from '@miblanchard/react-native-slider';
import GradientContainer from '../../../components/GradientContainer';
import ItemSelector from '../../../components/ItemSelector';
import {useDispatch, useSelector} from 'react-redux';
import {
  getWorkoutList,
  setFilterKeyStatus,
  updateFilterData,
  workoutProgrammeActionTypes,
} from '../../../_action/WorkoutAction';
import { scale } from 'react-native-size-matters';

const BODYPARTS = [
  {
    id: 1,
    name: 'Full body',
  },
  {
    id: 2,
    name: 'Upper body',
  },
  {
    id: 3,
    name: 'Lower body',
  },
  {
    id: 4,
    name: 'Arms',
  },
  {
    id: 5,
    name: 'Chest',
  },
  {
    id: 6,
    name: 'Glutes',
  },
  {
    id: 7,
    name: 'Shoulder',
  },
  {
    id: 8,
    name: 'Quads',
  },
  {
    id: 9,
    name: 'Back',
  },
];

const STRENGTH = [
  {
    id: 1,
    name: 'Beginner',
  },
  {
    id: 2,
    name: 'Intermediate',
  },
  {
    id: 3,
    name: 'Advanced',
  },
];
const WorkoutFilter = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const {bodyParts, time, equipments, strength} = useSelector(
    state => state.workout.workoutList.filterData,
  );
  const [selectedBodyParts, setSelectedBodyParts] = useState(bodyParts);
  const [selectedStrength, setSelectedStrength] = useState(strength);
  const [selectedEquipments, setSelectedEquipments] = useState(equipments);
  const [sliderValue, setSliderValue] = useState(time);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onRefresh}>
          <Text style={{fontSize: 17, fontFamily: 'Manrope-Regular'}}>
            Clear All
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  const onRefresh = () => {
    dispatch({type: workoutProgrammeActionTypes.RESET_FILTER_DATA});
    dispatch(setFilterKeyStatus(false));
    let params = {
      search: route.params.searchKeyword,
      favourite: route.params.favourite ? 1 : 0,
      isFilter:
        route.params.searchKeyword.length > 0 || route.params.favourite ? 1 : 0,
    };
    dispatch(getWorkoutList(params));
    setSelectedBodyParts([]);
    setSelectedEquipments([]);
    setSelectedStrength([
      // { id: 1, name: 'Beginner'}
    ]);
    setSliderValue([0, 120]);
    navigation.navigate('Workouts');
  };

  const handleBodyPartsSelection = item => {
    let tempArray = selectedBodyParts;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedBodyParts(
        tempArray.slice(0, index).concat(tempArray.slice(index + 1)),
      );
    } else {
      setSelectedBodyParts(tempArray.concat(item));
    }
  };

  const handleStrengthSelection = item => {
    let tempArray = strength;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedStrength([]);
    } else {
      setSelectedStrength([item]);
    }
  };

  const handleEquipmentsSelection = item => {
    let tempArray = selectedEquipments;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedEquipments(
        tempArray.slice(0, index).concat(tempArray.slice(index + 1)),
      );
    } else {
      setSelectedEquipments(tempArray.concat(item));
    }
  };

  const handleDuration = item => {
    setSliderValue(item);
  };
  console.log('seleced equipment===',selectedEquipments)
  const handleResult = () => {
    console.log('seleced equipment===',selectedEquipments)
    let requestParams = {
      //bodyParts: selectedBodyParts.map(item => item.id),
      time: sliderValue.map(item => item),
      //equipments: selectedEquipments.map(item => item._id),
      //strength: [selectedStrength[0]?.id],
      isFilter: 1,
      favourite: route.params.favourite ? 1 : 0,
      search: route.params.searchKeyword,
     };
     if(selectedStrength[0]?.id != undefined ){
      requestParams = {
        ...requestParams,
        strength: [selectedStrength[0]?.id]
      }
     }
     if(selectedBodyParts?.length > 0 ){
      requestParams = {
        ...requestParams,
        bodyParts: selectedBodyParts.map(item => item.id)
      }
     }
     if(selectedEquipments?.length > 0 ){
      requestParams = {
        ...requestParams,
        equipments: selectedEquipments.map(item => item._id)
      }
     }



    console.log('requestParams===',requestParams)
    
    dispatch(getWorkoutList(requestParams));
    dispatch(setFilterKeyStatus(true));
    let data = {
      bodyParts: selectedBodyParts,
      strength: selectedStrength,
      time: sliderValue,
      equipments: selectedEquipments,
    };
    dispatch(updateFilterData(data));
    navigation.navigate('Workouts');
  };
  console.log('selectedStrength cinig===',selectedStrength)
  return (
    <MainScreen>
      <ScrollView style={{ paddingBottom: 30}}>
      <View style={{padding: 10}}>
        <ItemSelector
          title="Body parts"
          itemListArray={BODYPARTS}
          selectedItemsList={selectedBodyParts.map(item => item.name)}
          onItemSelect={item => handleBodyPartsSelection(item)}
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
                maximumValue={120}
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
        <ItemSelector
          title="Level"
          itemListArray={STRENGTH}
          selectedItemsList={selectedStrength.map(item => item.name)}
          onItemSelect={item => handleStrengthSelection(item)}
          style={styles.padding}
        />
        <ItemSelector
          title="Equipments"
          itemListArray={route.params.equipmentList}
          selectedItemsList={selectedEquipments.map(item => item.name)}
          onItemSelect={item => handleEquipmentsSelection(item)}
          style={styles.padding}
        />

      </View>
      </ScrollView>
       <View style={styles.submitButtonView}>
          <GradientButton title="Show the results" onPress={handleResult} />
        </View>
    </MainScreen>
  );
});

export default WorkoutFilter;

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

  submitButtonView: {
    marginHorizontal: scale(15),
    marginBottom: scale(10)
  }
});
