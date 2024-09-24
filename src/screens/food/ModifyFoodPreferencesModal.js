import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../common/Constant';
import { onToggleCollapsableStatus } from '../../_action/CommonAction'
import { MainScreen } from '../../common/Screen';
import CollapsableContainer from '../../components/CollapsableContainer';
import CustomModal from '../../components/CustomModal';
import GradientButton from '../../components/GradientButton';
import RadioButton from '../../components/RadioButton';
import { EmptyMinusIcon, PlusIcon } from '../../Svg';
import { updateFoodPreferences } from '../../_action/FoodAction';
import IngredientSelectorModal from './IngredientSelectorModal';


const ModifyFoodPreferencesModal = React.memo(props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showIngrdientSelector, setShowIngredientSelector] = useState(false)
  const [dietType, setDietType] = useState(1)
  const [excluded, setExcluded] = useState(false)
  const foodPreferences = useSelector(state => state.food?.foodPreferences)
  const [excludeIngredients, setExcludeIngredients] = useState([])
  const [favouriteIngredients, setFavouriteIngredients] = useState([])
  const getCollapsableData = useSelector(
    state => state?.commonReducer?.collapsibleData,
  );


  useEffect(()=> {
    setExcludeIngredients(foodPreferences?.excludeIngredients)
    setFavouriteIngredients(foodPreferences?.favouriteIngredients)
    setDietType(foodPreferences?.foodType)
  },[])
  
  const onItemRemove = (index, favourite) => {
    if(favourite) {
      setFavouriteIngredients(prevState => prevState.slice(0,index).concat(prevState.slice(index+1)))
    }
    else {
      setExcludeIngredients(prevState => prevState.slice(0,index).concat(prevState.slice(index+1)))
    }
  }

  const onUpdate = () => {
    let request = {
      foodType:dietType,
      favouriteIngredients: favouriteIngredients,
      excludeIngredients: excludeIngredients
    }
    console.log('requesr ocming==',request)
    dispatch(updateFoodPreferences(request));
    navigation.goBack()
  }


  const Ingredient = prop => {
    const {itemName, index, favourite} = prop
    return(
      <View style={{paddingVertical:2, flexDirection:'row', alignItems:'center'}}>
        <TouchableOpacity onPress={() => onItemRemove(index, favourite)}>
          <EmptyMinusIcon />
        </TouchableOpacity>
        <Text style={{textTransform:'capitalize', fontSize:16, fontFamily:'Manrope-Regular', paddingLeft:5, color:COLORS.lightGreen}}>{itemName}</Text>
      </View>
    )
  }
  
  return (
    <MainScreen>

         <IngredientSelectorModal 
          visible={showIngrdientSelector} 
          setModalVisible={setShowIngredientSelector}
          excluded={excluded}
          updateExcludeIngredientsList = {setExcludeIngredients}
          updateFavouriteIngredientsList = {setFavouriteIngredients}
          excludeIngredients = {excludeIngredients}
          favouriteIngredients= {favouriteIngredients} 
          />
        
          <FlatList contentContainerStyle={{padding:10}}
            bounces={false}
            listKey="diettypeList"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
            <>
            <CollapsableContainer 
              onToggle={(value) => dispatch(onToggleCollapsableStatus('dietTypeContainer',value))}
              title='My diet type'
              expanded={getCollapsableData.dietTypeContainer}
            >
              <View style={{backgroundColor:COLORS.light_grey, padding:15}}>
                <View style={{flexDirection:'row', paddingBottom:20}}>
                  <RadioButton name='Standard' style={styles.radioButtonStyle} onSelect={()=>setDietType(1)} selected={dietType===1}/>
                  <RadioButton name='Pescatarian' style={styles.radioButtonStyle} onSelect={()=>setDietType(3)} selected={dietType===3}/>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <RadioButton name='Vegetarian' style={styles.radioButtonStyle} onSelect={()=>setDietType(4)} selected={dietType===4}/>
                  <RadioButton name='Vegan' style={styles.radioButtonStyle} onSelect={()=>setDietType(2)} selected={dietType===2}/>
                </View>
              </View>
            </CollapsableContainer>
            <View style={{padding:5}} />
            <CollapsableContainer 
              title='My food preferences'
              onToggle={(value) => dispatch(onToggleCollapsableStatus('foodPrefrencesContainer',value))}
              expanded={getCollapsableData.foodPrefrencesContainer}
            >
            <View style={styles.ingredientContainer}>
              <Text style={styles.ingredientTypeTextStyle}>
                Exclude ingredients: {!excludeIngredients || excludeIngredients?.length===0 ? <Text style={styles.noIngredientTextStyle}>None</Text>:null }</Text>
              <TouchableOpacity onPress={()=>{
                  setExcluded(true)
                  setShowIngredientSelector(true)}}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
            <FlatList
                listKey="excludeIngredientList"
                style={styles.flatListStyle}
                contentContainerStyle={{paddingBottom:5}}
                data={excludeIngredients}
                bounces={false}
                renderItem={({item, index}) => <Ingredient itemName={item} index={index} />}
              />
            <View style={[styles.ingredientContainer,{marginTop:2}]}>
              <Text style={styles.ingredientTypeTextStyle}>
                Favorite ingredients: {!favouriteIngredients || favouriteIngredients?.length===0 ? <Text style={styles.noIngredientTextStyle}>None</Text>:null }</Text>
              <TouchableOpacity onPress={()=>{
                setExcluded(false)
                setShowIngredientSelector(true)}}>
                <PlusIcon />
              </TouchableOpacity>
            </View>
              <FlatList
                listKey="IngredientList"
                style={styles.flatListStyle}
                data={favouriteIngredients}
                bounces={false}
                contentContainerStyle={{paddingBottom:5}}
                renderItem={({item, index}) => <Ingredient itemName={item} index={index} favourite/>}
              />
            </CollapsableContainer>
            <View style={styles.buttonTextStyle}>
              <GradientButton 
                // disabled={excludeIngredients?.length===0 &&  favouriteIngredients?.length===0} 
                title='Update' 
                onPress={onUpdate} 
              />
            </View>
            </>} />
      </MainScreen>
  )
})

export default ModifyFoodPreferencesModal

const styles = StyleSheet.create({
  textInputStyle: {
    borderBottomWidth:1, 
    borderColor: COLORS.lightGrey,
    paddingLeft:5, 
    paddingVertical:3,
    fontSize:16,
    marginHorizontal:20,
    fontFamily:'Manrope-Medium'
  },
  textStyle: {
    fontFamily:'Manrope-Regular', 
    fontSize:16,
    color: COLORS.grey_2,
    marginHorizontal:20
  },
  subTextStyle: {
    fontFamily:'Manrope-Bold', 
    fontSize:16, 
    color:COLORS.grey_2, 
    paddingHorizontal:5
  },
  ingredientContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    padding:10, 
    alignItems:'center',
    backgroundColor:COLORS.light_grey
  },
  ingredientTypeTextStyle: {
    fontFamily:'Manrope-Regular', 
    fontSize:14
  },
  noIngredientTextStyle: {
    color:COLORS.lightGreen, 
    fontFamily:'Manrope-Medium'
  },
  buttonTextStyle: {
    paddingHorizontal:15, 
    justifyContent:'center', 
    paddingTop:20
  },
  radioButtonStyle: {
    width:'50%',
    paddingLeft:'5%'
  },
  flatListStyle: {
    backgroundColor:COLORS.light_grey,
    paddingLeft:10,
  }
})
