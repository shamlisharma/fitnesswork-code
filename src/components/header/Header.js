import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity, Platform, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BackArrowIcon } from '../../Svg';
import { COLORS } from '../../common/Constant';


let Header = React.memo(function Header({ onPress, title, status ,hideBack,top}) {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView>
      <View style={[styles.header,{marginTop:top}]}>
        <View style={{flex:1,justifyContent:'center'}}>
          

       { !hideBack &&  <Pressable style={[Platform.OS === "ios" ? styles.iosHeader : styles.andHeader]} onPress={() => {
            
         
            { status == "drawer" ? navigation.openDrawer(): navigation.goBack()}
          }}>
            <BackArrowIcon />
          </Pressable>}
          
          <View style={[{ alignItems: 'center',},hideBack&&{flex:1,justifyContent:"center" }]}>
            <Text style={[styles.title,hideBack&&{bottom:0}]}>{title}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
})

const styles = StyleSheet.create({
  header: {
    height: Platform.OS == "ios" ? 60 : 70,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_6,
    
  },
  mainHeader: {
    flexDirection: 'row',
    top: 16,
    right: 40,
  },
  userIconImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderColor: '#4567D3',
    borderWidth: 1,
  },
  userIconButton: {
    top: 16,
    left: 40,
  },
  iosHeader: {
    marginTop: 20,
    marginLeft: 20,
  },
  andHeader: {
    left: 20,
    top: 20,
  },
  title: {
    textAlign: 'center',
    bottom: Platform.OS === "ios" ? 20 : 0,
    fontSize: 20,
    color: COLORS.black
  }
});
export default Header;
