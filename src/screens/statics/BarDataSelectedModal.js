import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../common/Constant';

const BarDataSelectedModal = (props) => {
    const {  onClose ,day, goal, selectedBarData, type} = props;
    
   
    const customModalView = {
        top:
              selectedBarData.pageY == 0
                ? 0
                : selectedBarData.pageY - scale(130),
            left: selectedBarData.pageX == 0? 0: selectedBarData.pageX - scale(type == 'sleep'? scale(50):scale(40)),
    };

    const getMinutesOutOfHours = (hours) => {
        return Math.round((hours%1)*60)
    }
   
    return (
        <View style={styles.wholeView}>
            <TouchableOpacity 
            onPress={onClose}
            style={styles.transparentView} />
            <View style={[styles.modalStyle,customModalView]}>
                 <Text>Day: {type == 'sleep'? moment(selectedBarData?.date).format('MM/DD'): selectedBarData?.date}</Text>
                <Text>Goal: {goal}{type == 'sleep'?'h':''}</Text>
                {
                    type == 'sleep'?
                    <Text>Sleep: {`${Math.floor(selectedBarData?.barDatavalue)}h ${getMinutesOutOfHours(selectedBarData?.barDatavalue)}min`}</Text>:
                    <Text>Steps: {`${Math.floor(selectedBarData?.barDatavalue)} `}</Text>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    wholeView: {
        ...StyleSheet.absoluteFillObject
    },
    transparentView: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.black,
        opacity: 0.3
    },

    modalStyle: {
       backgroundColor: COLORS.white,
       borderRadius: 5,
       alignSelf: 'flex-start',
       padding: 5,  
       zIndex: 10,
       padding: 5,
       justifyContent: 'center',
       alignItems: 'center'   
    }

})

export { BarDataSelectedModal };