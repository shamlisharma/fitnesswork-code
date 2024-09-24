import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity, Platform, Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackArrowIcon, WhiteBackArrow} from '../../Svg';
import {COLORS} from '../../common/Constant';

let AuthHeader = React.memo(function AuthHeader({onPress, title}) {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View>
          <Pressable style={Platform.OS === "ios" ? styles.iosHeader : styles.andHeader} onPress={onPress}>
            <WhiteBackArrow />
          </Pressable>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>
              {title}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
})

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'rgba(7,7,7,0.4)',
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
  iosHeader:{
    marginTop:20,
    marginLeft:20
  },
  andHeader:{
    left:20,
    top:20,
  },
  title:{
    textAlign: 'center',
    bottom:Platform.OS === "ios" ? 34 :20,
    fontSize: 30,
    color:COLORS.lightBlue
  }
});
export default AuthHeader;
