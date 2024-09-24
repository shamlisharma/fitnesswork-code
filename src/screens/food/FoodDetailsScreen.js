import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {hasNotch} from 'react-native-device-info';
import {
  BackArrowIcon,
  EmptyPlusIcon,
  HeartFilled,
  HeartOutlined,
  ShoppingCartIcon,
} from '../../Svg';
import {MainScreen} from '../../common/Screen';
import {COLORS} from '../../common/Constant';
import {onToggleCollapsableStatus} from '../../_action/CommonAction';
import CollapsableContainer from '../../components/CollapsableContainer';
import CollapsableFoodContainer from '../../components/CollapsableFoodContainer';
import {addFoodPlan, getMealPlanByUserAction} from '../../_action/FoodAction';
import {AddFoodDetailsModal} from '../modal/AddFoodDetailsModal';
import {ShoppingModal} from '../modal/ShoppingModal';
import {AddMealPlanModal} from '../modal/AddMealPlanModal';
import {useDispatch, useSelector} from 'react-redux';
import settings from '../../config/settings';
import {usersService} from '../../services/ApiServices';
import AlertModal from '../modal/AlertModal';

const {height, width} = Dimensions.get('window');

const FoodDetailsScreen = React.memo(({navigation, route}) => {
  const dispatch = useDispatch();
  const [addFood, setAddFood] = useState(false);
  const [addCart, setAddCart] = useState(false);
  const [addMealPlan, setAddMealPlan] = useState(false);
  const [addFvrt, setAddFvrt] = useState(false);
  const [remvFvrt, setRemvFvrt] = useState(false);
  const getCollapsableData = useSelector(
    state => state?.commonReducer?.collapsibleData,
  );
  let mediaPath = settings.s3Url.url;
  let foodType = route?.params?.foodType;
  let mealType = route?.params?.mealType;
  // const mealPlanByUser = useSelector(state => state?.food?.mealPlanByuser[0])
  const mealPlanByUser = route?.params?.itemById;
  console.log("mealPlanByUser", mealPlanByUser);
  const {isFavourite} = route?.params?.itemById;
  const [like, setLiked] = useState(isFavourite ? true : false);

  useEffect(() => {
    // let params = {
    //   search: route?.params?.searchKey,
    //   isFavourite: route?.params?.isFavourite ? 1 : '',
    //   foodType: foodType ? foodType.map(item => item.id) : [],
    //   mealType: mealType ? mealType.map(item => item.id) : [],
    // };
    // dispatch(getMealPlanByUserAction(params));
  }, [navigation]);

  function unitFormater(key) {
    switch (key) {
      case 1:
        return 'Gram';
      case 2:
        return 'Kilo Grams';
      case 3:
        return 'Millimeters';
      case 4:
        return 'Milliliter';
      case 5:
        return 'Whole';
      case 6:
        return 'Cup';
      case 7:
        return 'Tablespoon';
      case 8:
        return 'Teaspoon';
      default:
        return 'unit';
    }
  }

  async function addMealToFavourite() {
    setLiked(true);
    let req = {
      mealId: route?.params?.mealId,
    };
    try {
      await usersService.addMealPlanToFavourite(req);
      setAddFvrt(true);
    } catch (e) {
      setLiked(false);
    }
  }
  async function removeMealFromFavourite() {
    setLiked(false);
    let req = {
      mealId: route?.params?.mealId,
    };
    try {
      await usersService.removeMealPlanFromFavourite(req);
      setRemvFvrt(true);
    } catch (e) {}
  }

  const renderContent = () => {
    return (
      <>
            
            {
        Platform.OS != 'android'&&
        <View
        style={{
          zIndex: 10,
          // position: 'absolute',
          width: width,
          height: getStatusBarHeight(),
          backgroundColor: COLORS.blue,
        }}
      />}
      {addFood ? (
        <AddFoodDetailsModal addFood={true} close={() => setAddFood(false)} />
      ) : null}
      {addCart ? (
        <ShoppingModal addCart={true} closeShopping={() => setAddCart(false)} />
      ) : null}
      {addMealPlan ? (
        <AddMealPlanModal
          addMealPlan={true}
          closeMealPlan={() => setAddMealPlan(false)}
        />
      ) : null}
      <AlertModal
        alert={addFvrt}
        onResume={() => setAddFvrt(false)}
        headertitle="Add Favourite Meal"
        content={'Meal has been added successfully to your favourites.'}
        cancel={() => setAddFvrt(false)}
        cancelBtn=""
        saveBtn="Ok"
        width={100}
        opacity={''}
      />
      <AlertModal
        alert={remvFvrt}
        onResume={() => setRemvFvrt(false)}
        headertitle="Remove Favourite Meal"
        content={'Meal has been removed successfully from favourites.'}
        cancelBtn=""
        saveBtn="Ok"
        width={100}
        opacity={''}
      />

      <ImageBackground
        source={
          {uri: mediaPath + mealPlanByUser?.mealImage} ||
          require('../../../assets/fooddetails.png')
        }
        style={{height: height * 0.305, width: '100%', position: 'absolute'}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              borderColor: 'white',
              paddingVertical: 5,
              height: 50,
              width: 50,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              overflow: 'hidden',
              borderColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'black',
                opacity: 0.3,
              }}
            />
            <BackArrowIcon color={'white'} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{
          position: 'absolute',
          top: height * 0.315,
          padding: 10,
          width: '100%',
          bottom: 0,
        }}
        contentContainerStyle={{paddingBottom: 25}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '63%'}}>
            <Text style={styles.foodTitle}>{mealPlanByUser?.mealName}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={{paddingHorizontal: 15}}
              onPress={() => {
                like ? removeMealFromFavourite() : addMealToFavourite();
              }}>
              {like ? <HeartFilled /> : <HeartOutlined />}
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={()=>setAddMealPlan(true)}>
            <EmptyPlusIcon />
            </TouchableOpacity> */}
          </View>
        </View>
        <View>
          <Text style={styles.serveTitle}>
            {mealPlanByUser?.noOfServing} servings
          </Text>
        </View>

        <View style={styles.foodTab}>
          <View style={styles.container}>
            <View style={[styles.item]}>
              <Text style={styles.subSection}>
                {~~mealPlanByUser?.calories}
              </Text>
              <Text style={styles.healthQuantity || 0}>Kcal</Text>
            </View>
            <View style={[styles.item]}>
              <Text style={styles.subSection}>
                {~~mealPlanByUser?.proteins || 0}g
              </Text>
              <Text style={styles.healthQuantity}>Protein</Text>
            </View>
            <View style={[styles.item]}>
              <Text style={styles.subSection}>
                {mealPlanByUser?.carbohydrates || 0}g
              </Text>
              <Text style={styles.healthQuantity}>Carbs</Text>
            </View>
            <View style={[styles.item]}>
              <Text style={styles.subSection}>
                {mealPlanByUser?.fats || 0}g
              </Text>
              <Text style={styles.healthQuantity}>Fat</Text>
            </View>
            <View style={[styles.item, {backgroundColor: COLORS.blue}]}>
              <Text
                style={{
                  justifyContent: 'center',
                  color: COLORS.white,
                  fontFamily: 'Manrope-Semibold',
                  fontSize: 14,
                  textAlign: 'center',
                }}>
                {mealPlanByUser?.prepTime}
              </Text>
              <Text
                style={{
                  justifyContent: 'center',
                  color: COLORS.white,
                  fontFamily: 'Manrope-Regular',
                  textAlign: 'center',
                }}>
                min
              </Text>
            </View>
          </View>
        </View>
        {mealPlanByUser?.description!= "" &&
        <CollapsableFoodContainer
          title={'Description'}
          expanded={getCollapsableData.descriptionContainer}
          onToggle={value =>
            dispatch(onToggleCollapsableStatus('descriptionContainer', value))
          }
          closeIcon={true}>
          <View
            style={{
              padding: 10,
              marginTop: 5,
              backgroundColor: COLORS.light_grey,
            }}>
            <Text style={styles.foodDesc}>{mealPlanByUser?.description}</Text>
          </View>
        </CollapsableFoodContainer>}
        <View style={styles.customPadding}>
          <CollapsableFoodContainer
            title={'Ingredients'}
            expanded={getCollapsableData.ingredientsContainer}
            onToggle={value =>
              dispatch(onToggleCollapsableStatus('ingredientsContainer', value))
            }>
            <View style={styles.customPadding}>
              {mealPlanByUser?.ingredientInfo?.map(item => {
                return (
                  <View style={styles.ingContainer}>
                    <View>
                      <Text style={styles.ingTitle}>
                        {item?.ingredientName}
                      </Text>
                      <Text style={styles.ingDescTitle}>
                        {item?.qty * item?.count +
                          ' ' +
                          unitFormater(item?.unit)}{' '}
                      </Text>
                    </View>
                    <View>
                      {/* <Pressable>
              <ShoppingCartIcon />
              </Pressable> */}
                    </View>
                  </View>
                );
              })}
            </View>
          </CollapsableFoodContainer>
        </View>
        {mealPlanByUser?.method?.length !== 0 ? (
          <View style={{paddingTop: 6, padding: 4}}>
            <CollapsableContainer
              title={'Method'}
              onToggle={value =>
                dispatch(onToggleCollapsableStatus('methodContainer', value))
              }
              expanded={getCollapsableData.methodContainer}
              closeIcon={true}>
              <View style={{padding: 10, backgroundColor: COLORS.light_grey}}>
                {mealPlanByUser?.method.map((item, index) => {
                  return (
                    <View style={{flexDirection: 'row', padding: 4}}>
                      <Text style={styles.foodDesc}>{index + 1}. </Text>
                      <Text style={styles.foodDesc}>{item}</Text>
                    </View>
                  );
                })}
              </View>
            </CollapsableContainer>
          </View>
        ) : null}
      </ScrollView>
      </>
    )
  }

  return (
   
     Platform.OS == 'android'?
     <MainScreen 
     style={{flex: 1}} 
     lightContent 
     statusBarColor={COLORS.blue}
     
     
     >
       {renderContent()}
   </MainScreen>:
    <View 
      style={{flex: 1}} 
      lightContent 
      statusBarColor={COLORS.blue}
      
      
      >
        <StatusBar barStyle='light-content'/>
        {renderContent()}
    </View>
   
  );
});

export default FoodDetailsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: hasNotch() ? scale(90) : scale(60),
    // paddingHorizontal: 15,
  },
  foodTitle: {
    fontSize: 20,
    lineHeight: 22,
    fontFamily: 'Manrope-Regular',
    color: COLORS.grey_1,
  },
  tabTextColor: {
    color: COLORS.lightBlue,
  },
  foodDesc: {
    color: COLORS.grey_3,
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    textTransform: 'capitalize',
  },
  foodTab: {
    height: 60,
    backgroundColor: COLORS.light_grey,
    marginVertical: 10,
  },
  ingTitle: {
    fontSize: 15,
    fontFamily: 'Manrope-Semibold',
    color: COLORS.grey_2,
  },
  ingDescTitle: {
    fontSize: 14,
    fontFamily: 'Manrope-Semibold',
    color: COLORS.grey_3,
  },
  ingContainer: {
    backgroundColor: COLORS.light_grey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    margin: 2,
  },
  customPadding: {
    paddingTop: 6,
  },
  subTitle: {
    flexDirection: 'row',
  },
  subSection: {
    // paddingTop:10,
    // paddingLeft:22.5,
    // paddingRight:22.5,
    justifyContent: 'center',
    color: COLORS.blue,
    fontFamily: 'Manrope-Semibold',
    fontSize: 14,
    alignItems: 'center',
    textAlign: 'center',
  },

  timeSection: {
    backgroundColor: COLORS.lightBlue,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  serveTitle: {
    fontSize: 14,
    color: COLORS.grey_3,
    lineHeight: 19,
    fontFamily: 'Manrope',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 600,
  },
  item: {
    flex: 1,
    height: 60,
    backgroundColor: COLORS.light_grey,
    justifyContent: 'center',
  },
  healthQuantity: {
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
  },
});
