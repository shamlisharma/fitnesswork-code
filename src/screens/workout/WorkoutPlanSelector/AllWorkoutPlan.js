import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {COLORS, isLoggedIn} from '../../../common/Constant';
import {Loader} from '../../../common/Loader';
import {MainScreen} from '../../../common/Screen';
import GradientContainer from '../../../components/GradientContainer';
import {usersService} from '../../../services/ApiServices';
import {
  FilterIcon,
  GredientRatingIcon,
  SearchIcon,
  StarIcon,
} from '../../../Svg';
import {updateAllWorkoutPageName} from '../../../_action/CommonAction';
import {
  getWorkoutList,
  setSearchKeyStatus,
  setFilterKeyStatus,
  setFavouriteKeyStatus,
} from '../../../_action/WorkoutAction';
import {AllWorkout, RatingWorkout} from './AllWorkoutList';

const AllWorkOutPlan = React.memo(props => {
  const [searchText, setSearchText] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [fetchCount, setFetchCount] = useState(0);
  // const [gymWorkouts, setGymWorkouts] = useState([]);
  // const [homeWorkouts, setHomeWorkouts] = useState([]);
  // const [hotelWorkouts, setHotelWorkouts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [modalOverlay, setModalOverlay] = useState(false);
  const {loading, data, filterKey, favouriteKey, searchKey, filterData} =
    useSelector(state => state.workout.workoutList);

  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const dispatch = useDispatch();

  const gymWorkouts = data.filter(item => item._id === 1);
  const homeWorkouts = data.filter(item => item._id === 2);
  const hotelWorkouts = data.filter(item => item._id === 3);

  const clearStatus = () => {
    dispatch(setSearchKeyStatus(false));
    dispatch(setFavouriteKeyStatus(false));
    dispatch(setFilterKeyStatus(false));
  };

  useEffect(() => {
    dispatch(getWorkoutList());
    console.log('favouriteKey status', favouriteKey);
    setModalOverlay(true);
    setTimeout(() => {
      setModalOverlay(false);
    }, 1000);
  }, [favouriteKey]);

  useEffect(() => {
    usersService
      .getAllEquipments()
      .then(res => setEquipmentList(res?.data?.responseData?.result))
      .catch(err => console.error('equipments', err));
  }, []);

  useEffect(() => {
    clearStatus();
  }, [props.navigation]);

  // React.useEffect( () => {
  //   const unsubscribe = props.navigation.addListener('focus', async () => {
  //       // dispatch(updateAllWorkoutPageName('allworkouts'));

  //     // dispatch(updateAllWorkoutPageName('allworkouts'));

  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      // dispatch(updateAllWorkoutPageName('allworkouts'));
      if (searchText == '' && filterKey == false && favouriteKey == false) {
        setWorkoutPage();

        // setTimeout(() => {
        // dispatch(getWorkoutList());
        // },3000)
      }
    }, [searchText, filterKey, favouriteKey, fetchCount]),
  );

  const setWorkoutPage = async () => {
    await AsyncStorage.setItem('workoutPage', 'allworkouts');
  };

  const handleFavourite = () => {
    setModalOverlay(true);
    dispatch(setFavouriteKeyStatus(!favouriteKey));
    let requestParams = {
      //favourite: !favouriteKey ? 1 : 0,
      search: searchText,
      isFilter: 1,
      // isFilter: searchText.length > 0 || !favouriteKey ? 1 : 0,
      //bodyParts: filterData?.bodyParts.map(item => item.id),
      time: filterKey ? filterData.time : [],
      //equipments: filterData.equipments.map(item => item._id),
      //strength: [filterData.strength[0]?.id],
    };

    if (filterData.strength[0]?.id) {
      requestParams = {
        ...requestParams,
        strength: [filterData.strength[0]?.id],
      };
    }

    if (filterData?.bodyParts?.length > 0) {
      requestParams = {
        ...requestParams,
        bodyParts: filterData?.bodyParts.map(item => item.id),
      };
    }
    if (filterData?.equipments?.length > 0) {
      requestParams = {
        ...requestParams,
        equipments: filterData.equipments.map(item => item._id),
      };
    }

    if (!favouriteKey != 0) {
      requestParams = {
        ...requestParams,
        favourite: !favouriteKey ? 1 : 0,
      };
    }
    console.log('requestParams=== fav', requestParams);
    dispatch(getWorkoutList(requestParams));
  };

  const onSearch = text => {
    let requestParams = {
      search: text,
      isFilter:
        favouriteKey || filterKey
          ? 1
          : // filterKey ||
          text.length > 0
          ? 1
          : 0,
      // favourite: favouriteKey ? 1 : 0,
      //bodyParts: filterData?.bodyParts.map(item => item.id),
      //time: filterKey ? filterData.time : [],
      //equipments: filterData?.equipments.map(item => item._id),
      //strength: [filterData?.strength[0]?.id === undefined ? 1 : filterData?.strength[0]?.id ],
    };

    //console.log("requested paramssss on search",filterData?.strength[0]?.id)

    if (favouriteKey === 1) {
      requestParams = {
        ...requestParams,
        favourite: favouriteKey ? 1 : 0,
      };
    }

    if (filterData.strength[0]?.id) {
      // requestParams = {
      //   ...requestParams,
      //   strength: [filterData?.strength[0]?.id === undefined ? 1 : filterData?.strength[0]?.id ],
      // }
    }

    if (filterData?.bodyParts?.length > 0) {
      requestParams = {
        ...requestParams,
        bodyParts: filterData?.bodyParts.map(item => item.id),
      };
    }
    if (filterData?.equipments?.length > 0) {
      requestParams = {
        ...requestParams,
        equipments: filterData.equipments.map(item => item._id),
      };
    }

    console.log('search text going===', text);
    console.log(
      'requested paramssss on search',
      requestParams,
      favouriteKey,
      '---',
      filterKey,
    );


    if (text.length > 0) {
      dispatch(setSearchKeyStatus(true));
    } else {
      dispatch(setSearchKeyStatus(false));
    }

    setSearchText(text);
  };
  useEffect(() => {
    if (!data.length) {
      setLoader(true);
    } else {
      setLoader(false);
      setModalOverlay(false);
    }
  }, [data]);

  return (
    <MainScreen>
      {/* {loading ? <Loader loading={true} /> : null} */}
      <View style={styles.headerContainer}>
        <View style={styles.textInputContainer}>
          <View style={{paddingHorizontal: 10}}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Search"
            value={searchText}
            onChangeText={text => onSearch(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleFavourite()}
          activeOpacity={0.9}
          style={styles.searchContainer}>
          {favouriteKey ? (
            <GradientContainer style={styles.gradientStyle}>
              <StarIcon />
            </GradientContainer>
          ) : (
            <View style={styles.withoutGradientStyle}>
              <GredientRatingIcon />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Filter', {
              searchKeyword: searchText,
              favourite: favouriteKey,
              equipmentList: equipmentList || [],
            })
          }
          activeOpacity={0.5}
          style={styles.filterView}>
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
      </View>

      {/* <Modal
        visible={loading && modalOverlay}
        animationType={'fade'}
        transparent={true}
        statusBarTranslucent={true}>
        <TouchableOpacity activeOpacity={0.9} style={styles.modalView} disabled>
           <ActivityIndicator size="large" animating={true} color= "#0DB8DA" />
        </TouchableOpacity>
      </Modal> */}

      {loading || modalOverlay ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <ScrollView styles={{flex: 1}} showsVerticalScrollIndicator={false}>
          {filterKey === true || favouriteKey === true || searchKey === true ? (
            <View>
              <Text style={styles.listTitleTxt}>
                {searchKey || filterKey === true
                  ? `Found ${
                      data.length > 1
                        ? data.length + ' workouts'
                        : data.length + ' workout'
                    } `
                  : 'Favourite workouts'}
              </Text>
              {console.log('data for rating workout', data)}
              <RatingWorkout data={data} planName={getProfileData?.planName} />
            </View>
          ) : (
            <View>
              {gymWorkouts.length !== 0 ? (
                <View style={styles.paddingVer}>
                  <Text style={styles.listTitleTxt}>{'Gym workouts'}</Text>
                  <AllWorkout
                    data={gymWorkouts}
                    navigation={props.navigation}
                    planName={getProfileData?.planName}
                  />
                </View>
              ) : null}
              {homeWorkouts.length !== 0 ? (
                <View style={styles.paddingVer}>
                  <Text style={styles.listTitleTxt}>{'Home workouts'}</Text>
                  <AllWorkout
                    data={homeWorkouts}
                    navigation={props.navigation}
                    planName={getProfileData?.planName}
                  />
                </View>
              ) : null}
              {hotelWorkouts.length !== 0 ? (
                <View style={styles.paddingVer}>
                  <Text style={styles.listTitleTxt}>
                    {'Minimal Equipment workouts'}
                  </Text>
                  <AllWorkout
                    data={hotelWorkouts}
                    navigation={props.navigation}
                    planName={getProfileData?.planName}
                  />
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      )}
    </MainScreen>
  );
});

export default AllWorkOutPlan;

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 12,
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
    color: COLORS.grey_3,
  },
  gradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  withoutGradientStyle: {
    borderRadius: 5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
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
  modalView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});
