import React, {useReducer, useLayoutEffect, useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Pressable, Platform} from 'react-native';
import {MainScreen} from '../../common/Screen';
import CheckBox from '@react-native-community/checkbox';
import {COLORS} from '../../common/Constant';
import {DeleteIcon, PlusIcon, ThreeDot} from '../../Svg';
import {useNavigation} from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';
import RenameFoodTitle from './RenameFoodTitle';
import {captureScreen} from "react-native-view-shot";
import RNImageToPdf from 'react-native-image-to-pdf';
import { findLastKey } from 'lodash';


const Data = [
  {
    id:1,
    ingredient: 'Tofu',
    quantity: '150 g, cut into 1.5 cm slices',
    checked: false,
  },
  {
    id:2,
    ingredient: 'Blue Mould Cheese',
    quantity: '110 g',
    checked: false
  },
  {
    id:3,
    ingredient: 'Miso Paste',
    quantity: '1 tsp',
    checked: false
  },
  {
    id:4,
    ingredient: 'Rice Wine Vinegar',
    quantity: '1/2 tsp',
    checked: false
  },
  {
    id:5,
    ingredient: 'Sea Salt',
    quantity: '1 tsp',
    checked: false,
  },
  {
    id:6,
    ingredient: 'Brown Sugar',
    quantity: '1/2 tsp',
    checked: false
  },
];

let BuyFromStore = React.memo(function BuyFromStore() {
  const [data, setData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      email: '',
      emailError: '',
      isSelected1: false,
      isLoader: false,
      commonError: '',
     snapUri:"",
    },
  );

  const [tempArray,setTempArray] = useState(
    [
      {
        id:1,
        ingredient: 'Tofu',
        quantity: '150 g, cut into 1.5 cm slices',
        checked: false,
      },
      {
        id:2,
        ingredient: 'Blue Mould Cheese',
        quantity: '110 g',
        checked: false,
      },
      {
        id:3,
        ingredient: 'Miso Paste',
        quantity: '1 tsp',
        checked: false,
      },
      {
        id:4,
        ingredient: 'Rice Wine Vinegar',
        quantity: '1/2 tsp',
        checked: false,
      },
      {
        id:5,
        ingredient: 'Sea Salt',
        quantity: '1 tsp',
        checked: false,
      },
      {
        id:6,
        ingredient: 'Brown Sugar',
        quantity: '1/2 tsp',
        checked: false,
      },
    ]
  )
  
  const [showTooltip, setShowTooltip] = useState(false);
  const [rename,setRename] = useState(false);
  const [deleteIng,setDeleteIng] = useState(false);
  const navigation = useNavigation();
  function onRename(){
    setRename(true);
    setShowTooltip(false)
  }

  async function exportToPdf(){
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => setData({snapUri:uri.replace("file://", "////")}),
      error => console.error("Oops, snapshot failed", error)
    );
    if(data.snapUri){
    try {
      const options = {
        imagePaths:[data.snapUri],
        name:'PDFName',
        maxSize: { // optional maximum image dimension - larger images will be resized
          width: 900,
          
        },
        // quality: .7, // optional compression paramter
        targetPathRN: "/storage/emulated/0/Download/", // only for android version 9 and lower
        //for versions higher than 9 it is stored in (Download/img-to-pdf/)
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);
      
    } catch(e) {
      console.log("catch error",e);
    }
  }
  }
  
  useEffect(()=>{

  },[tempArray])

  const onCheckChanged = (id) =>{
    const data = tempArray;
    const index = data.findIndex(x => x.id === id);
    data[index].checked = !data[index].checked;
    setTempArray(data);
}
const onDelete = () =>{
  setDeleteIng(true)
  setShowTooltip(false)
}
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Tooltip
          isVisible={showTooltip}
          disableShadow
          content={
            <View style={styles.tooltipContentContainer}>
              <View style={styles.tooltipTextContainerOne}>
                <Pressable onPress={()=>exportToPdf()}>
                <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                  Export to PDF
                </Text>
                </Pressable>
                <Pressable onPress={()=>onRename()}>
                <Text style={[styles.durationTextStyle, {marginBottom: 5}]}>
                  Rename
                </Text>
                </Pressable>
                <Pressable onPress={()=>onDelete()}>
                <Text style={styles.durationTextStyle}>Delete</Text>
                </Pressable>
              </View>
            </View>
          }
          placement={'left'}
          arrowSize={{width: 15, height: 12}}
          contentStyle={styles.tooltipContentStyle}
          backgroundColor='#00000040'
          onClose={() => setShowTooltip(false)}>
          <TouchableOpacity onPress={() => setShowTooltip(true)}>
            {showTooltip ?
            <ThreeDot color={COLORS.white}/>
            :
            <ThreeDot/>
          }
          </TouchableOpacity>
        </Tooltip>
      ),
    });
  }, [showTooltip]);

  
  return (
    <MainScreen>
     {rename  ?<RenameFoodTitle rename={true} close={()=>setRename(false)}/>:null}
      {tempArray?.map((item,key) => {
        return (
          <View style={styles.container}>
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
             <View style={styles.checkboxContainer}>
             
              {deleteIng ? null :
              <View style={item.checked == true ?
                    (Platform.OS === 'ios'
                    ? styles.squareCheckedCheckBox
                    : styles.squareCheckedCheckBoxAndroid)
               :Platform.OS === 'ios'
               ? styles.squareCheckBox
               : styles.squareCheckBoxAndroid
               }>
                 
                <TouchableOpacity key={key} onPress={()=>onCheckChanged(item.id)}>
                <CheckBox
                value={item.checked}
                onValueChange={()=>onCheckChanged(item.id)}
                  tintColors={{
                    true: COLORS.lightGreen,
                    false: COLORS.white,
                  }}
                  onFillColor={'#08ae7e'}
                  onCheckColor={'#08ae7e'}
                  boxType="square"
                  tintColor={COLORS.white}
                  onTintColor={'#08ae7e'}
                  style={
                    Platform.OS === 'ios'
                      ? styles.checkbox
                      : styles.checkboxAndroid
                  }
                />
                </TouchableOpacity>
               
              </View>
               }
              <View style={{padding:10}}>
                <Text style={styles.descTitle}>{item.ingredient}</Text>
                <Text style={styles.title}>{item.quantity}</Text>
              </View>
            
            </View>
            {deleteIng ? 
            <View style={{padding:25}}>
              <DeleteIcon />
              </View>
              :null}
          </View>
          
          </View>
        );
      })}
      <View style={styles.container}>
      <View style={{flexDirection:"row",alignItems:"center",padding:15}}>
      <PlusIcon/>
      <Text style={{paddingHorizontal:15,color:COLORS.lightGreen,fontSize:15,fontFamily:"Manrope-Regular"}}>New Item</Text>
      </View>
      </View>
    </MainScreen>
  );
})
export default BuyFromStore;
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputTxtColor,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 0,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"space-between",
    padding:10
  },
  descTitle: {
    color: COLORS.grey_2,
    fontSize: 15,
    lineHeight: 20,
    
  },
  
  squareCheckBox: {
    borderWidth: 1.5,
    borderColor: COLORS.white,
    width: 26,
    height: 26,
  },
  squareCheckedCheckBox: {
    borderWidth: 1.5,
    borderColor: COLORS.lightGreen,
    width: 26,
    height: 26,
  },
  squareCheckBoxAndroid: {
    borderWidth: 1.5,
    borderColor: COLORS.white,
    width: 30,
    height: 30,
   
  },
  squareCheckedCheckBoxAndroid: {
    borderWidth: 1.5,
    borderColor: COLORS.lightGreen,
    width: 30,
    height: 30,
   
  },
  checkbox: {
    width: 12.89,
    height: 12.89,
    marginTop: 4.5,
    marginLeft: 4.5,
  },
  checkboxAndroid: {
    bottom: 3,
    right: 3,
  },
  title: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.grey_3,
  },
  tooltipContentContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },

  tooltipContentStyle: {
    borderRadius: 5,
    height: 140,
    width: 133,
  },
  durationTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.grey_3,
    paddingBottom: 10,
  },
  tooltipContentStyle: {
    top: Platform.OS == "ios"? 28 :-8,
    borderRadius: 5,
  },
});
