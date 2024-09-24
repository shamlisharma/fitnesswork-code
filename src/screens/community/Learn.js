import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {MainScreen} from '../../common/Screen';
import {communityFilterData, getLearnAction} from '../../_action/CommunityAction';
import LearnScreen from './LearnScreen';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {COLORS} from '../../common/Constant';
import {FilterIcon, SearchIcon, SmallArrowIcon} from '../../Svg';
import GradientContainer from '../../components/GradientContainer';
import {usersService} from '../../services/ApiServices';
import {Loader} from '../../common/Loader';
import {debounce} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
let catFilterId;
let Learn = React.memo(function Learn(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const Category = {
    id: 0,
    name: 'All',
  };

  const listRef = useRef();
  const [firstItemId, setFirstItemId] = useState('');
  const [select, setSelect] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentVideoPlayId, setCurrentlyVideoPlayId] = useState('');
  const [selectFilter, setFilter] = useState(null);
  var learn = useSelector(state => state?.community?.getLearn);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnCat, setLearnCat] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isPaused, setPaused] = useState(true);
  //const handler = useCallback(debounce(()=>updateListData(), 1000), []);


  console.log("props values for warmup",props?.route?.params?.isWarmUp)

  const onViewRef = useRef(props => {
    const {viewableItems, changed, filterValue} = props;
    setCurrentIndex(viewableItems);
  });
  const {data, loading, filterKey, searchKey} = useSelector(
    state => state?.community?.communityList,
  );
  const {category, sortValue} = useSelector(
    state => state.community.communityList.filterData,
  );
  catFilterId = category.map(item => item?._id);

  const onRefresh = React.useCallback(() => {
    setCurrentlyVideoPlayId('');
    onItemSelect(Category, 0);
    setSearchText('');
    setRefreshing(true);
    dispatch(getLearnAction());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (catFilterId.length === 0) {
      setSelect([0]);
    } else {
      let updatedIndex = learnCat.findIndex(item => {
        return item._id == category[0]._id;
      });
      setSelect([updatedIndex + 1]);
    }
  }, [category]);


  // useFocusEffect(
  //   React.useCallback(() => {
  //     setSelect([0]);
  //   }, []),
  // );
  const onItemSelect = (item, i) => {
    console.log('onItemSelect', learn);
    //learn = undefined
    setCurrentlyVideoPlayId('');
    setLoader(true);
    setSearchText('');
    let requestParams = {
      category: item._id === 0 ? [] : item._id,
    };

    let data = {
      category: item,
    };
    let tempArr = select;
    let index = tempArr.indexOf(i);
    if (index > -1) {
      setSelect('All');
    } else {
      setSelect([i]);
    }
    setTimeout(() => {
      dispatch(getLearnAction(requestParams));
      //setPaused(true)
      // let data = {
      //   category: [item],
      //   sortValue:sortValue
      // };
      // dispatch(communityFilterData(data));
      setLoader(false);
    }, 1000);
  };
  useEffect(() => {
    if(props?.route?.params?.isWarmUp){
       onSearch('Warm')
       learnCategory();
    }else{
      dispatch(getLearnAction(null, id => setFirstItemId(id)));
      learnCategory();
    }
    //dispatch(getLearnAction(null, id => setFirstItemId(id)));
    //learnCategory();
  }, [props]);

  useEffect(() => {
    navigation.addListener('blur', route => {
      setCurrentlyVideoPlayId('');
    });
  }, [navigation]);

  useEffect(() => {
    const onFocus = navigation.addListener('focus', async() => {
      //setLoader(true);
      const value = await AsyncStorage.getItem('isFilter');
      value === 'true' && setLoader(true);
      console.log('loader on');
      stopLoader();
    });

    return onFocus;
  }, []);

  

  const stopLoader = () => {
    setTimeout(async() => {
      console.log('loader off');
      setLoader(false);
      await AsyncStorage.setItem('isFilter',"false");
    }, 1000);
  };

  const getSelectedCategoryIndex = () => {
    if (select[0] == 0) {
      return '';
    } else {
      return learnCat[select[0] - 1]._id;
    }
  };

  // const updateListData=()=>{
  //   console.log("learn screen called again 3322",searchText);
  //   setLoader(true)
  // }

  const onSearch = text => {
    setSearchText(text);

    //handler();
    // console.log('select coming neeraj====',learnCat[select[0] - 1] );
    //  console.log('catfilterid=====',catFilterId)
    //    console.log('cauht===',getSelectedCategoryIndex())
    let req = {
      search: text,
      category: getSelectedCategoryIndex(),
      sortBy: sortValue,
    };
    setTimeout(() => {
      setLoader(true);
      dispatch(getLearnAction(req));
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }, 1000);
  };
  const handleFavourite = () => {
    dispatch(setFoodFavouriteKeyStatus(!favouriteFood));
    let requestParams = {
      search: searchText,
      isFavourite: !favouriteFood ? 1 : '',
      foodType: foodTypes.map(item => item.id),
      mealType: mealTypes.map(item => item.id),
    };
    dispatch(getMealPlanByUserAction(requestParams));
  };

  const learnCategory = async () => {
    const result = await usersService.getLearnCategory();
    if (result?.data?.statusCode == 1) {
      // console.log('learnCategory data',result?.data?.responseData?.result);
      setLearnCat(result?.data?.responseData?.result);
    }
  };

  const moveToFilter=async()=>{
    
    await AsyncStorage.setItem('isFilter',"true");
  
    navigation.navigate('filter ', {cateogryOfLearn: learnCat})
  }

  console.log('filter keys are', filterKey);

  return (
    <MainScreen>
      <View style={styles.headerContainer}>
        <View style={styles.textInputContainer}>
          <View style={{paddingHorizontal: 10}}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Search for a materials"
            onChangeText={text => onSearch(text)}
            value={searchText}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.filterView}
          onPress={() =>moveToFilter()}>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingVertical: 2,
          paddingHorizontal: 15,
        }}>
        {learnCat.length ? (
          <TouchableOpacity onPress={() => onItemSelect(Category, 0)}>
            <Text
              style={[
                styles.learnCategory,
                {color: select.includes(0) ? COLORS.blue : COLORS.grey_3},
              ]}>
              {'All'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <FlatList
          ref={listRef}
          data={learnCat}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{itemVisiblePercentThreshold: 50}}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => onItemSelect(item, index + 1)}>
              <Text
                style={[
                  styles.learnCategory,
                  {
                    color: select.includes(index + 1)
                      ? COLORS.blue
                      : COLORS.grey_3,
                  },
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {learnCat.length == 0 ||
        currentIndex[currentIndex?.length - 1]?.index ===
          learnCat.length - 1 ? null : (
          <TouchableOpacity
            onPress={() =>
              listRef.current.scrollToIndex({
                index: currentIndex[currentIndex?.length - 1].index + 1,
                viewPosition: 0.5,
              })
            }>
            <SmallArrowIcon width={30} height={30} />
          </TouchableOpacity>
        )}
      </View>

      {loader ? (
        <Loader />
      ) : learn?.length === 0 ? (
        <Text style={{padding: 10, textAlign: 'center', color: COLORS.grey_4}}>
          No data found
        </Text>
      ) : (
        <FlatList
          data={learn}
          extraData={[learn, currentVideoPlayId, firstItemId]}
          keyExtractor={(item, index) => index + ''}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
          renderItem={({item, index}) => {
            return (
              <LearnScreen
                learnData={item}
                firstItemId={firstItemId}
                index={index}
                isPause={isPaused}
                currentVideoPlayId={currentVideoPlayId}
                getCurrentlyPlayingVideoId={id => setCurrentlyVideoPlayId(id)}
              />
            );
          }}
        />
      )}

     
       
    </MainScreen>
  );
});

export default Learn;

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
  filterView: {
    backgroundColor: '#F9F9F9',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnCategory: {
    padding: 10,
  },
});
