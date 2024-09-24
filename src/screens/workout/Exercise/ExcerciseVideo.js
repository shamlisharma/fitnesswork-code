// import {
//   ActivityIndicator,
//   BackHandler,
//   Dimensions,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React, { useReducer, useState } from "react";
// import Video from "react-native-video";
// import Orientation from "react-native-orientation-locker";
// import { CrossIcon } from "../../../Svg";
// import settings from "../../../config/settings";
// import Octicons from "react-native-vector-icons/Octicons";
// import { COLORS } from "../../../common/Constant";
// let cdnPath = settings.cdnUrl.url;
// const ExcerciseVideo = ({ navigation, route }) => {
//   // const [mute, toggleMute] = useReducer((e) => !e, false);
//   // React.useEffect(() => {
//   //   Orientation.lockToLandscape();
//   // }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={[styles.container]}>
//       <View
//               style={styles.loader}
//             >
//               <ActivityIndicator
//                 size="large"
//                 animating={true}
//                 color={COLORS.lightGreen}
//               />
//             </View>
//         <Video
//           // poster={cdnPath + route.params.poster}
//           style={{ flex: 1,position:"absolute",height:"100%",width:'100%' }}
//           source={{ uri: cdnPath + route.params.uri }}
//           controls={true}
//           onLoad={(data) => {
            
//             // if (data.naturalSize.width > 1000) {
//             //   Orientation.lockToLandscape();
//             // } else {
//             //   Orientation.lockToPortrait();
//             // }
//           }}
//           // resizeMode="cover"
//           // fullscreenOrientation="landscape"
//         />
//       </View>
//       <Pressable
//         style={[styles.back, { left: 20, width: 30 }]}
//         onPress={() => {
//           Orientation.lockToPortrait();
//           navigation.goBack();
//         }}
//       >
//         <CrossIcon />
//       </Pressable>
//       {/* <Pressable onPress={toggleMute}
//         style={[styles.back, {width: 30 }]}
       
//       >
//         <Octicons name={mute ? "mute" : "unmute"} size={25} color={"#fff"} />
//       </Pressable> */}
//     </SafeAreaView>
//   );
// };

// export default ExcerciseVideo;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
  
//   },
//   back: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//   },
//   loader:{
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   }
// });
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ExcerciseVideo = () => {
  return (
    <View>
      <Text>ExcerciseVideo</Text>
    </View>
  )
}

export default ExcerciseVideo

const styles = StyleSheet.create({})