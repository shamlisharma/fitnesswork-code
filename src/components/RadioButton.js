// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
// import { AppButton, COLORS } from '../common/Constant';


// export default function RadioButton(props) {
//     const { PROP } = props;
//   const [userOption, setUserOption] = useState(null);
//   const { value } = userOption ? userOption :"";
//   return (
//     <View>
//       {PROP.map(res => {
// 					return (
//             <View key={res.key} style={styles.container}>
//             <TouchableOpacity
//                 style={styles.radioCircle}
//                 onPress={() => {
//                     setUserOption({
//                         value: res.key,
//                     });
//                 }}>
//                   {value === res.key && <View style={styles.selectedRb} />}
//             </TouchableOpacity>
//             <Text style={styles.radioText}>{res.text}</Text>
//         </View>
//        );
//     })}
        
//       <AppButton title="Save"/>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//     container: {
//         marginBottom: 25,
//         alignItems: 'center',
//         flexDirection: 'row',
		
// 	},
//     radioText: {
//         marginRight: 35,
//         fontSize: 15,
//         color: COLORS.grey_2,
//         paddingLeft:13
        
//     },
// 	radioCircle: {
// 		height: 23,
// 		width: 23,
// 		borderRadius: 30,
// 		borderWidth: 1,
// 		borderColor: COLORS.lightGreen,
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 	},
// 	selectedRb: {
// 		width: 15,
// 		height: 15,
// 		borderRadius: 50,
// 		backgroundColor: COLORS.lightGreen,
//     },
   
//   });
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { COLORS } from '../common/Constant'
import GradientContainer from './GradientContainer';

const RadioButton = React.memo((props) => {
  const {name, selected, style, onSelect} = props;


  return (
    <Pressable style={{flexDirection:'row', alignItems:'center',...style}} onPress={onSelect}>
      <View style={{backgroundColor:'white', height:25, width:25, borderRadius:12.5, borderWidth:1, borderColor:(selected?COLORS.lightGreen:'#E0E0E0'), alignItems:'center', justifyContent:'center'}}>
        {selected ? <GradientContainer style={{width:13, height:13, borderRadius:10, backgroundColor:COLORS.lightGreen}} /> : null}
      </View>
      <Text style={{fontFamily:'Manrope-Regular', color:COLORS.grey_2, fontSize:15, paddingLeft:10}}>{name}</Text>
    </Pressable>
  )
})

export default RadioButton
