import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React from "react";

import { scale } from "react-native-size-matters";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { COLORS } from "../common/Constant";

const ImagePicker = ({ visible, onCancel, onPhotoClick, onCameraClick }) => {
  const chooseImage = async () => {
    let options = {
      maxHeight: 512,
      maxWidth: 512,
      quality: 0.7,
      mediaType: "photo",
    };
    const result = await launchImageLibrary(options);

    if (result.errorCode || result.didCancel || result.errorMessage) {
    } else {
      onPhotoClick(result);
    }
  };

  const chooseCamera = async () => {
    let options = {
      maxHeight: 512,
      maxWidth: 512,
      quality: 0.7,
      mediaType: "photo",
    };
    const result = await launchCamera(options);
    if (result.errorCode || result.didCancel || result.errorMessage) {
    } else {
      onCameraClick(result);
    }
  };
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "#00000066" }}>
        <View style={styles.container} />
        <View style={styles.bottomSheet}>
          <View style={styles.bottonView}>
            <Label
              label="Select Avatar"
              size={scale(11)}
              color={COLORS.grey_3}
            />
          </View>
          <View style={styles.line} />
          <TouchableOpacity
            onPress={chooseCamera}
            activeOpacity={1}
            style={styles.bottonView}
          >
            <Label
              label="Take Photo"
              size={scale(15)}
              color={"#068FFF"}
           
            />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            onPress={chooseImage}
            activeOpacity={1}
            style={[
              styles.bottonView,
              { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
            ]}
          >
            <Label
              label="Choose from Library"
              size={scale(15)}
              color={"#068FFF"}
            
            />
          </TouchableOpacity>

          <View style={[styles.line, { height: 10 }]} />
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.bottonView, { borderRadius: 5 }]}
            onPress={onCancel}
          >
            <Label label="Cancel" size={scale(15)} color={"#D71313"}  />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePicker;


const Label = ({color,size,label}) =>{
    return <Text style={{fontSize:size, fontFamily:"Manrope-Medium",color }}>{label}</Text>
} 

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomSheet: {
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 40,
    overflow: "hidden",
    
  },
  bottonView: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  line: { height: 2, width: "100%" },
});