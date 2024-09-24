import React, {useState} from 'react';
import {Text, Pressable, StyleSheet, View, Modal,TouchableOpacity} from 'react-native';
import {COLORS} from '../../common/Constant';
import RadioButton from '../../components/RadioButton';
import {CloseFoodIcon, EmptyMinusIcon, EmptyPlusIcon, StepsCloseIcon} from '../../Svg';
const data = [
    {
      title:"Title Plan that contain it already",
    },
    {
      title:"Title of the Plan to add",
    },
    {
      title:"Plan to add Name of the Plan",
    },
  ];


export const AddMealPlanModal = React.memo(props => {
  const {addMealPlan, closeMealPlan} = props;

  
  const [option, setOption] = useState(null);
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addMealPlan}
      onRequestClose={closeMealPlan}>
      <View style={styles.modalBg}>
        <View style={styles.modalBackground}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: COLORS.grey_2,
                fontSize: 16,
                lineHeight: 20,
                fontFamily: 'Manrope-Bold',
              }}>
              Add this meal to my plan
            </Text>
            <Pressable onPress={closeMealPlan}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </Pressable>
          </View>
          <View style={styles.resultContainer}>
                   {data.map((item)=>{
                       return(
                       
                    <View style={styles.resultItemStyle}>
                      <TouchableOpacity >
                            <EmptyPlusIcon />
                          </TouchableOpacity>
                        
                      <Text style={styles.ingredientNameStyle}>{item.title}</Text>
                    </View>
                     
                     )
                    })}
                </View>
        </View>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#00000040',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    marginTop: 472,
  },

  resultContainer: {
    flex:1
  },
  resultItemStyle: {
      paddingBottom:10,
    flexDirection:'row', 
    alignItems:'center'
  },
  ingredientNameStyle: {
    textTransform:'capitalize', 
    fontSize:16, 
    fontFamily:'Manrope-Regular', 
    paddingLeft:15, 
    color:COLORS.lightGreen
  },
});
