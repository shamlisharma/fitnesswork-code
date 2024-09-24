import React, { useState } from "react";
import { Button, Text, View,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../../components/GradientButton";

function WorkModal({ visible, onClose }) {
    const [isModalVisible, setModalVisible] = useState(true);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={{ flex: 1, }}>
            <Button title="Show modal" />
            <Modal isVisible={visible}>
                <View style={{ backgroundColor: "white", height: 200, borderRadius: 10 ,flexDirection:"column",}}>
                    <View style={{flexDirection:"row",marginTop:30,alignItems:"center"}}>
                    <Text style={{ fontSize: 16, fontWeight: "700",marginLeft:70,color:"grey"}}>
                        Take a rest
                    </Text >
                    <Text style={{marginLeft:"15%",fontSize:24,color:"rgba(13, 184, 218, 1)"}}>
                  04.37
                    </Text>
                    </View>
                    <View style={{marginTop:"10%",marginHorizontal:30}}> 
                    <GradientButton title="Finish"  onPress={onClose}/>  
                    </View>

                      
                    
                    </View>
                    
            </Modal>

        </View>
    );
}

export default WorkModal;