import React, { useState,useEffect } from "react";
import { Button, Text, View,TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import GradientButton from "../../components/GradientButton";

function ModalTester2({ visible, onClose }) {
    const [isModalVisible, setModalVisible] = useState(true);
const [time, setTime] = useState(90)
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    useEffect(() => {
      setTime(90)
    }, [visible])
    useEffect(() => {
      if(time<1){
        setTime(90)
        onClose()
      }
    }, [time])
    const formattedTime = (time) => {
        let minutes = parseInt(time / 60);
        let seconds = time % 60;
        return `${minutes.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
        })}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2})}`;
      };
    useEffect(() => {
        // BackgroundTimer.start();
        const timeInterval = setInterval(() => {
          if (visible) {
            setTime(prevState => prevState - 1);
          }
        }, 1000);
        // timer = BackgroundTimer.setInterval(() => {
        //   if (playVideo) {
        //     setTime(prevState => prevState + 1);
        //   }
        // }, 1000);
        return () => {
          //updateDuration();
          //clearInterval(timer);
          clearInterval(timeInterval);
          // BackgroundTimer.stop();
        };
      }, [time,visible]);
    return (
       
            <Modal isVisible={visible}>
                <View style={{ backgroundColor: "white", height: 200, borderRadius: 10 ,flexDirection:"column",}}>
                    <View style={{marginTop:30,alignItems:"center"}}>
                    <Text style={{ fontSize: 20, fontWeight: "700",color:"#000"}}>
                        Rest Complete!
                    </Text >
                    <Text style={{ fontSize: 13,marginTop:"3%", fontWeight: "700",color:"grey"}}>
                    Get back to work 👊🏾
                    </Text >
                    </View>
                    <View style={{marginTop:"5%",marginHorizontal:30}}> 
                    <GradientButton title="Finish"  onPress={onClose}/>  
                    </View>

                      
                    
                    </View>
                    
            </Modal>

    );
}

export default ModalTester2;