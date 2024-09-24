import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,RefreshControl
} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import CaloriesAndProteinProgress from '../../components/CaloriesAndProteinProgress';
import ProgressIndicator from '../../components/ProgressIndicator';
import FoodDetailsCard from './FoodDetailsCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getMealPlanByUserAction,
  setFoodFavouriteKeyStatus,
  setFoodFilterKeyStatus,
  setFoodSearchKeyStatus,
  getNewMealPlanByUserAction
} from '../../_action/FoodAction';
import {usersService} from '../../services/ApiServices';
import {
  FilterIcon,
  GredientRatingIcon,
  HeartFilled,
  HeartOutlined,
  MinusCircleIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
} from '../../Svg';
import {Loader} from '../../common/Loader';
import GradientContainer from '../../components/GradientContainer';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AllMeals = React.memo(props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [favFoodStatus, setFavFoodStatus] = React.useState(false);
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const mealPlanByUser = useSelector(state => state?.food?.mealPlanByuser);
  const {data, loading, favouriteFood, filterKey, searchKey} = useSelector(
    state => state.food.foodList,
  );
  const {foodTypes, mealTypes, cuisionTypes, time} = useSelector(
    state => state.food.foodList?.filterData,
  );
  const [searchText, setSearchKey] = useState('');

  const clearStatus = () => {
    dispatch(setFoodFavouriteKeyStatus(false));
    dispatch(setFoodFilterKeyStatus(false));
    dispatch(setFoodSearchKeyStatus(false));
  };

  useEffect(() => {
    console.log("request params neeraj====== parms type",foodTypes)
    dispatch(getNewMealPlanByUserAction());
    clearStatus();
  }, []);

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      if (
        getProfileData?.planName == 'Free' 
      ) {
        changeMemershipModal();
      }
    });

    return onFocus;
  }, []);

  const onSearch = text => {
    let requestParams = {
      search: text,
      isFavourite: favouriteFood ? 1 : '',
      foodType: foodTypes.map(item => item.id),
      mealType: mealTypes.map(item => item.id),
      cuisine: cuisionTypes.map(item => item.id),
      prepTime: time,
    };
    console.log('request params neeraj======',requestParams);
    dispatch(getMealPlanByUserAction(requestParams));
    if (text.length > 0) {
      dispatch(setFoodSearchKeyStatus(true));
    } else {
      dispatch(setFoodSearchKeyStatus(false));
    }
    setSearchKey(text);
  };

  const handleFavourite = () => {
    
    dispatch(setFoodFavouriteKeyStatus(!favouriteFood));
    let requestParams = {
      search: searchText,
      isFavourite: !favouriteFood ? 1 : '',
      foodType: foodTypes.map(item => item.id),
      mealType: mealTypes.map(item => item.id),
      cuisine: cuisionTypes.map(item => item.id),
      prepTime: time,
    };
    dispatch(getMealPlanByUserAction(requestParams));
  };

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
        {text: 'OK', onPress: () => props.navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const onRefresh = React.useCallback(() => {
    console.log("on Refresh from reducer....",favouriteFood)
    setRefreshing(true);
    setSearchKey('');
    favouriteFood ? handleFavouriteNew(): dispatch(getNewMealPlanByUserAction());
    wait(2000).then(() => setRefreshing(false));
  }, [favouriteFood]);

  const handleFavouriteNew = () => {
    dispatch(setFoodFavouriteKeyStatus(favouriteFood));
    let requestParams = {
      search: searchText,
      isFavourite: favouriteFood ? 1 : '',
      foodType: foodTypes.map(item => item.id),
      mealType: mealTypes.map(item => item.id),
      cuisine: cuisionTypes.map(item => item.id),
      prepTime: time,
    };
    dispatch(getMealPlanByUserAction(requestParams));
  };

  console.log('fav food coming====',favouriteFood)
  return (
    <MainScreen>
      <View style={styles.headerContainer}>
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
        <TouchableOpacity activeOpacity={0.9} style={styles.searchContainer}>
          <TouchableOpacity
            onPress={handleFavourite}
            style={styles.withoutGradientStyle}>
            {favouriteFood ? (
              <View style={styles.withoutGradientStyle}>
                <HeartFilled />
              </View>
            ) : (
              <View style={styles.withoutGradientStyle}>
                <HeartOutlined />
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('filter', {
              title: 'Filter',
              searchKey: searchText,
              isFavourite: favouriteFood,
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
      {loader ? <Loader loading={true} /> : null}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" animating={true} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{padding: 10}}>
          {filterKey === true ||
          favouriteFood === true ||
          searchKey === true ? (
            <View>
              <Text style={styles.listTitleTxt}>
                {searchKey || filterKey === true
                  ? `Found ${
                      mealPlanByUser?.length == undefined
                        ? 0
                        : mealPlanByUser?.length
                    } Meal plans`
                  : 'Favourite meals'}
              </Text>
            </View>
          ) : null}
          {mealPlanByUser?.map(item => (
            <FoodDetailsCard
              item={item}
              mealId={item._id}
              searchKey={searchText}
              isFavourite={favouriteFood}
              foodType={foodTypes}
              mealType={mealTypes}
              allMeals={'allMeals'}
            />
          ))}
        </ScrollView>
      )}
      {getProfileData?.planName == 'Free' && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => changeMemershipModal()}
          style={styles.transparentSheetOverlay}
        />
      )}
    </MainScreen>
  );
});
const styles = StyleSheet.create({
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

  transparentSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    opacity: 0.8,
  },
});

export default AllMeals;
