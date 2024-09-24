import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AppButton, COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {useNavigation, useRoute,useFocusEffect} from '@react-navigation/native';
import GradientButton from '../../components/GradientButton';
import ItemSelector from '../../components/ItemSelector';
import {useDispatch, useSelector} from 'react-redux';
import { FoodFilterKeyStatus, getFoodPlanAction,  mealPlanActionType, setFoodFilterKeyStatus, updateFoodFilter,  } from '../../_action/FoodAction';
import { Slider } from '@miblanchard/react-native-slider';
import GradientContainer from '../../components/GradientContainer';
import { communityFilterData, communityFilterKeyStatus, communityTypes, getLearnAction } from '../../_action/CommunityAction';
import { usersService } from '../../services/ApiServices';


const communityType = [
  {
    id: 1,
    name: 'Travel',
  },
  {
    id: 2,
    name: 'Lifestyle',
  },
  {
    id: 3,
    name: 'Transformation',
  },
  {
    id: 4,
    name: 'Fitness',
  },
  {
    id: 5,
    name: 'Gym',
  },
  {
    id: 6,
    name: 'Challenges',
  },
  {
    id: 7,
    name: 'Recipes',
  },
  
];

const sortBy = ["Most Recent","Oldest","New","Last month","Today"]

const CommunityFilter = React.memo((props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { category,sortValue } = useSelector(
    state => state.community.communityList.filterData,
  );
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [select,setSelect] = useState([])
  const [learnCat,setLearnCat]=useState([])
  const [sort,setSort] = useState(sortValue)
  const categoryTypes = props?.route?.params?.cateogryOfLearn
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onRefresh}>
          <Text style={{fontSize:17,fontFamily:"Manrope-Regular"}}>Clear All</Text>
        </TouchableOpacity>
      ),
    });
  });
  useFocusEffect(
    React.useCallback(()=> {
     if(sort==='Most Recent') {
       setSelect([0])
     }
     if(sort==='Oldest') {
      setSelect([1])
    }
    if(sort==='New') {
      setSelect([2])
    }
    if(sort==='Last month') {
      setSelect([3])
    }
    if(sort==='Today') {
      setSelect([4])
    }
    if(sort===''){
      setSelect([])  
    }
    
  },[])
  )
  const onItemSelect = (item) =>{

    useEffect(()=>{
      
      learnCategory()
    },[navigation])

  }
  const learnCategory=async()=>{
    const result = await usersService.getLearnCategory()
    if(result?.data?.statusCode==1){
    setLearnCat(result?.data?.responseData?.result)
  }
    
  }
 

  const onRefresh = () => {
    dispatch({type: communityTypes.RESET_FILTER_DATA});
    dispatch(communityFilterKeyStatus(false));
    // let params = {
    //   search: route.params.searchKey,
    // };
    setSort('')
    setSelect([]) 
    dispatch(getLearnAction());
    setSelectedCategory([]);
    navigation.navigate("Learn")
  };
  
  const handleCategoryTypes = item => {
    let tempArray = selectedCategory;
    let index = tempArray.indexOf(item);
    if (index > -1) {
      setSelectedCategory([]);
    } else {
        setSelectedCategory([item]);
    }
  };
  
  const onSort = (item,index) =>{
    setSort(item)
    let tempArr = select;
  let i = tempArr.indexOf(index);
  if(i > -1) {
    setSelect("All")
  }
  else {
    setSelect([index]);
  }
  }
  const handleResult = () => {
    let catFilterId =selectedCategory.map(item => item?._id);
    let requestParams = {
    category: catFilterId[0],
    sortBy:sort
    };

    dispatch(getLearnAction(requestParams, null));
    dispatch(communityFilterKeyStatus(true));
    let data = {
        category:selectedCategory,
        sortValue:sort
      };

    console.log('requestParams neeraj===',requestParams);
    console.log('data neeraj===',data);
    dispatch(communityFilterData(data));
    navigation.navigate("Learn")
  };


  useEffect(()=>{
  
      console.log({selectedCategory})
  },[])
  return (
    <MainScreen>
      <View style={{padding: 10}}>
       <ItemSelector
          title="Filter by"
          itemListArray={categoryTypes}
          selectedItemsList={selectedCategory.map(item => item?.name)}
          onItemSelect={item => handleCategoryTypes(item)}
          style={styles.padding}
        />
        <View>
          <View>
            <Text style={{fontSize:15,fontFamily:"Manrope-Regular",color:COLORS.grey_4}}>Sort by</Text>
            <View>
              {sortBy.map((item,index)=>{
                return(
                  <TouchableOpacity style={{paddingVertical:5}} onPress={()=>onSort(item,index)}>
                  <Text style={{fontSize:15,fontFamily:"Manrope-Regular",color:select.includes(index) ? COLORS.blue:COLORS.grey_3}}>{item}</Text>
                  </TouchableOpacity>
                )
              })}
              
            </View>
          </View>
          <View>
            
          {/* <GradientButton /> */}
          </View>
        </View>
        
      </View>
      <View style={{bottom:0,position:"absolute",alignSelf:"center",paddingBottom:50}}>
              <AppButton title="Show the results" onPress={handleResult}/>
            </View>
    </MainScreen>
  );
});

export default CommunityFilter;

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
