import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  EmptyMinusIcon,
  EmptyPlusIcon,
  HeartFilled,
  HeartOutlined,
  InfoIcon,
} from '../../Svg';
import {COLORS} from '../../common/Constant';
import setting from '../../config/settings';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/core';
import {usersService} from '../../services/ApiServices';
import {useNavigation} from '@react-navigation/core';
import {showMessage, hideMessage} from 'react-native-flash-message';
import AlertModal from '../modal/AlertModal';

const RECIPE_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

const FoodDetailsCard = React.memo(props => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    newFoodPlan,
    setNewFoodPlan,
    item,
    allMeals,
    selectedRecipeTypes,
    mealTypeId,
    selectedMealTypes,
    onAddOrRemoveItem
  } = props;
  const {
    mealImage,
    mealName,
    ingredientInfo,
    ingredientName,
    prepTime,
    calories,
    fats,
    carbohydrates,
    proteins,
    isFavourite,
    mealType,
    description
  } = item;
  
  const [showTooltip, setShowTooltip] = useState(false);
  const [like, setLiked] = useState(isFavourite ? true : false);
  const [addFvrt, setAddFvrt] = useState(false);
  const [remvFvrt, setRemvFvrt] = useState(false);
  const [snack, setSnack] = useState();
  const [dinner, setDinner] = useState();
  const [mealId, setMealId] = useState();
  let mediaPath = setting.cdnUrl.url;
  const {data, loading, favouriteFood, filterKey, searchKey} = useSelector(
    state => state.food.foodList,
  );

  const IngredientFormatter = array => {
    return array?.map((item, index) => {
      let value = `${item?.ingredientName} (${
        item?.qty * item?.count
      } ${unitFormater(item?.unit)})`;
      if (index < array.length - 1) return value + ', ';
      else return value;
    });
  };

  const MealTypeFormater = arr => {
    if (typeof arr !== 'number') {
      return arr?.map((item, index) => {
        let value = `${RECIPE_TYPES[item - 1]}`;
        if (index < arr?.length - 1) return value + ', ';
        else return value;
      });
    } else {
      let value = `${RECIPE_TYPES[arr - 1]}`;
      return value;
    }
  };

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

  function isItemAdded() {
    let id = newFoodPlan.map(data => data?._id);
    let type = newFoodPlan.map(data => data?.mealType);
    let selectedTabmealType = selectedMealTypes[0]?.id;

    if (
      id.includes(item._id) &&
      type.includes(selectedTabmealType) &&
      type.includes(item.mealType)
    ) {
      return true;
    }
    return false;
  }

  const onMealAdd = (mealItem) => {
    console.log('meal item=====',mealItem)
    let tempArray = newFoodPlan || [];
    const indexOfItem = tempArray.indexOf(item);
    const tempArray2 = tempArray.filter(item => item.mealType === mealType);
    const indexOfMealType = tempArray.indexOf(tempArray2[0]);

    if (indexOfMealType !== -1) {
      tempArray = tempArray
        .slice(0, indexOfMealType)
        .concat(tempArray.slice(indexOfMealType + 1));
    }
    if (indexOfItem === -1) {
      tempArray = tempArray.concat(item);
    } else {
      tempArray = tempArray
        .slice(0, indexOfItem)
        .concat(tempArray.slice(indexOfItem + 1));
    }
    setNewFoodPlan(tempArray);
    // mealName
    onAddOrRemoveItem(`${mealItem.mealName} added successfully`);
  };
  const onMealRemove = (mealItem) => {
    let id = newFoodPlan.map(data => data?._id);
    // const indexOfItem = newFoodPlan.map(data => data?._id).indexOf(item?._id);
    const indexOfItem = newFoodPlan.findIndex(a => a._id === item?._id);
    setNewFoodPlan(prevState =>
      prevState.slice(0, indexOfItem).concat(prevState.slice(indexOfItem + 1)),
    );
    onAddOrRemoveItem(`${mealItem.mealName} removed successfully`);
  };

  async function addMealToFavourite() {
    setLiked(true);
    let req = {
      mealId: item._id,
    };
    try {
      await usersService.addMealPlanToFavourite(req);
      setAddFvrt(true);
      showMessage({
        message: 'Add favourite meal',
        description: 'Meal has been added successfully to your favourites',
        type: 'default',
        backgroundColor: COLORS.lightBlue,
        color: COLORS.white,
      });
    } catch (e) {
      
      setLiked(false);
    }
  }

  const alertForRemoveFromFvrt = () => {
    setRemvFvrt(true);
    
  };

  async function removeMealFromFavourite() {
    setLiked(false);
    let req = {
      mealId: item._id,
    };
    try {
      await usersService.removeMealPlanFromFavourite(req);
      setRemvFvrt(false);
      showMessage({
        message: 'Remove favourite',
        description: 'Meal has been removed successfully from favourites.',
        type: 'default',
        backgroundColor: COLORS.lightBlue,
        color: COLORS.white,
      });
    } catch (e) {
      
      setLiked(true);
    }
  }

  return (
    <>
      <AlertModal
        alert={remvFvrt}
        onResume={() => removeMealFromFavourite()}
        headertitle="Remove Favourite Meal"
        content={'Do you want to remove this meal from your favourites?'}
        cancel={()=>setRemvFvrt(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
        opacity={''}
      />

      <TouchableOpacity
        style={styles.container}
        onPress={() =>
            navigation.navigate('FoodDetailsScreen', {
                mealId: item._id,
                itemById: item,
                searchKey: props?.searchKey,
                isFavourite: item?.isFavourite,
                foodType: props?.foodType,
                mealType: props?.mealType,
              })    
        }>
        <View style={styles.imageContainer}>
          <Image
            source={
              {uri: mediaPath + mealImage} ||
              require('assets/carrotPlanItem1.png')
            }
            style={styles.foodImageStyle}
          />
          <Image
            source={require('assets/ShadedRectangle2.png')}
            style={styles.imageShadowStyle}
          />
          {allMeals ? null : (
            <TouchableOpacity
              style={{position: 'absolute', bottom: 5, left: 5}}
              onPress={() => {
                like ? alertForRemoveFromFvrt() : addMealToFavourite();
              }}>
              {like ? <HeartFilled /> : <HeartOutlined />}
            </TouchableOpacity>
          )}
          {route.name === 'Add food' ? (
            <TouchableOpacity
              style={{position: 'absolute', bottom: 5, right: 5}}
              onPress={() =>
                isItemAdded() ? onMealRemove(item) : onMealAdd(item)
              }>
              {isItemAdded() ? <EmptyMinusIcon /> : <EmptyPlusIcon />}
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.detailsContainer}>
          {route.name === 'Add food' ? (
            <Text style={styles.foodCategoryStyle}>
              {MealTypeFormater(mealType)}
            </Text>
          ) : (
            <Text style={styles.foodCategoryStyle}>
              {MealTypeFormater(mealType)}
            </Text>
          )}
          <Text style={styles.foodNameStyle}>
            {`${mealName}` || 'Fried Carrot'}
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.foodIngredientStyle}>
              {/* {IngredientFormatter(ingredientInfo)} */}
              {description}
            </Text>
          </View>
          <View style={styles.durationCaloriesAndInfoContainer}>
            <View style={styles.durationAndCaloriesContainer}>
              <Text style={styles.durationTextStyle}>
                {prepTime ? `${prepTime} min` : '45 min'}
              </Text>
              <Text style={styles.durationTextStyle}>
                {calories ? `${~~calories}Cal` : '367Cal'}
              </Text>
            </View>
            <Tooltip
              isVisible={showTooltip}
              disableShadow
              content={
                <View style={styles.tooltipContentContainer}>
                  <View style={styles.tooltipTextContainerOne}>
                    <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                      Fat
                    </Text>
                    <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                      Carbohydrates
                    </Text>
                    <Text style={styles.durationTextStyle}>Protein</Text>
                  </View>
                  <View style={{padding: 5}} />
                  <View style={styles.tooltipTextContainerTwo}>
                    <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                      {fats ? `${fats?.toFixed(1)}g` : '6.7g'}
                    </Text>
                    <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                      {carbohydrates
                        ? `${carbohydrates?.toFixed(1)}g`
                        : '56.1g'}
                    </Text>
                    <Text style={styles.durationTextStyle}>
                      {proteins ? `${proteins?.toFixed(1)}g` : '1.6g'}
                    </Text>
                  </View>
                </View>
              }
              placement={'left'}
              arrowSize={{width: 15, height: 12}}
              contentStyle={styles.tooltipContentStyle}
              onClose={() => setShowTooltip(false)}>
              <TouchableOpacity onPress={() => setShowTooltip(true)}>
                <InfoIcon />
              </TouchableOpacity>
            </Tooltip>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
});

export default FoodDetailsCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
  },
  imageContainer: {
    width: '42.5%',
  },
  foodImageStyle: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  imageShadowStyle: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 5,
  },
  detailsContainer: {
    width: '57.5%',
    paddingVertical: 15,
    backgroundColor: COLORS.light_grey,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingHorizontal: 10,
  },
  foodCategoryStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.blue,
  },
  foodNameStyle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 17,
    color: COLORS.grey_2,
    textTransform: 'capitalize',
  },
  foodIngredientStyle: {
    flexDirection: 'row',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.grey_4,
    textTransform: 'capitalize',
  },
  durationCaloriesAndInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  durationAndCaloriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 8,
  },
  durationTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.grey_3,
  },
  tooltipContentContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  tooltipTextContainerOne: {
    alignItems: 'flex-start',
  },
  tooltipTextContainerTwo: {
    alignItems: 'flex-end',
  },
  tooltipContentStyle: {
    top: -15,
    borderRadius: 5,
  },
});
