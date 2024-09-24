import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../common/Constant';
import {usersService} from '../../services/ApiServices';
import {
  CloseFoodIcon,
  EmptyMinusIcon,
  EmptyPlusIcon,
  FoodTapIcon,
  SearchIcon,
} from '../../Svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IngredientSelectorModal = React.memo(props => {
  const {
    visible,
    setModalVisible,
    excluded,
    updateExcludeIngredientsList,
    updateFavouriteIngredientsList,
    favouriteIngredients,
    excludeIngredients,
  } = props;
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  useEffect(() => {
    if (excluded) {
      setSelectedIngredients(Array.from(new Set(excludeIngredients)));
    } else {
      setSelectedIngredients(Array.from(new Set(favouriteIngredients)));
    }
   if (visible) {
      onSearch('');
    }
  }, [visible]);
  
  const onSearch = async text => {
    let request;
    if (text?.length) {
      request = {
        userId: getProfileData?._id,
        ingredientName: text.length && text,
      };
    } else {
      request = {
        userId: getProfileData?._id,
      };
    }

    let response = await usersService.getIngredientList(request);

    let tempArr = (await excluded) ? favouriteIngredients : excludeIngredients;
    let data = response.data.responseData.result.filter(
      item => tempArr.indexOf(item.ingredientName) < 0,
    );
    setIngredientsList(data);
  };

  const onAddIngredient = item => {
    setSelectedIngredients(prevState => prevState.concat(item.ingredientName));
  };

  const onRemoveIngredient = item => {
    const index = selectedIngredients.indexOf(item.ingredientName);
    setSelectedIngredients(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
  };

  const onCloseModal = async () => {
    if (excluded) {
      await updateExcludeIngredientsList(selectedIngredients);
    } else {
      await updateFavouriteIngredientsList(selectedIngredients);
    }
    setSelectedIngredients([]);
    setIngredientsList([]);
    setModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      transparent={true}
      statusBarTranslucent={true}>
      <TouchableOpacity activeOpacity={0.9} style={styles.modalView} disabled> 
       <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleTextStyle}>
              Add {excluded ? 'Exclude' : 'Favourite'} Ingredients
            </Text>
            <TouchableOpacity onPress={onCloseModal}>
              <CloseFoodIcon color={COLORS.grey_1} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBoxContainer}>
            <SearchIcon />
            <TextInput
              placeholder="Enter product name"
              style={styles.searchTextInputStyle}
              onChangeText={onSearch}
            />
          </View>
          {ingredientsList.length === 0 ? (
            <View style={styles.emptyResultContainer}>
              <FoodTapIcon color={'black'} />
              <Text style={{fontFamily: 'Manrope-SemiBold'}}>
                No {excluded ? 'Exclude' : 'Favourite'} Ingredients yet
              </Text>
              <Text style={{fontFamily: 'Manrope-Light'}}>
                Add Ingredients you would like to{' '}
                {excluded ? 'exclude' : 'favourite'}
              </Text>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <FlatList
                data={ingredientsList}
                renderItem={({item}) => (
                  <View style={styles.resultItemStyle}>
                    {selectedIngredients.indexOf(item.ingredientName) >= 0 ? (
                      <TouchableOpacity
                        onPress={() => onRemoveIngredient(item)}>
                        <EmptyMinusIcon />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => onAddIngredient(item)}>
                        <EmptyPlusIcon />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.ingredientNameStyle}>
                      {item.ingredientName}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </View>
       </View>
      </TouchableOpacity> 
    </Modal>
  );
});

export default IngredientSelectorModal;

const styles = StyleSheet.create({
  modalView:{
      flex:1,
      backgroundColor:'#000000AA',
      justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  subContainer: {
    flex: 0.8,
    backgroundColor: 'white',
    paddingTop: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  titleTextStyle: {
    fontSize: 16,
    fontFamily: 'Manrope-Medium',
  },
  searchBoxContainer: {
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  searchTextInputStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    paddingLeft: 10,
    width: '100%',
    paddingVertical: 0,
  },
  emptyResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    flex: 1,
  },
  resultItemStyle: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientNameStyle: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
    paddingLeft: 5,
    color: COLORS.lightGreen,
  },
});
