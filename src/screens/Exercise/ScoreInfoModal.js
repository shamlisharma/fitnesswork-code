import React, { useState,useEffect } from "react";
import { Button, Text, View,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../../components/GradientButton";

function ScoreInfoModal({ visible, onClose }) {
  
    return (
       
            <Modal isVisible={visible}>
                <View style={{ backgroundColor: "white", borderRadius: 10 ,flexDirection:"column",paddingHorizontal:10}}>
                    <View style={{marginVertical:30,}}>
                    <Text style={{ fontSize: 20, fontWeight: "700",color:"#000",textAlign:"center"}}>
                        Score
                    </Text>
                    <Text style={{ fontSize: 13,marginTop:"3%", fontWeight: "700",color:"grey"}}>
                    Score is a measurement of the total weight lifted in any given exercise. Score = Sets x Reps x Weights Used. Eg. 3 sets of 10 reps performed at 100kg = 3 x 10 x 100 = Total Volume of 3,000
                    </Text >
                    <View style={{marginTop:"5%", marginHorizontal:30}}> 
                    <GradientButton title="Got it"  onPress={onClose}/>  
                    </View>
                    </View>
                    </View>
                    
            </Modal>

    );
}

export default ScoreInfoModal;