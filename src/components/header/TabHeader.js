import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {ChatIcon, MenuIcon} from '../../Svg';
import {COLORS} from '../../common/Constant';

let TabHeader = React.memo(function TabHeader({title, icon, planInfo}) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View style={icon == true && icon !== undefined ? styles.head : ''}>
        <TouchableOpacity
          style={Platform.OS === 'ios' ? styles.iosHeader : styles.andHeader}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <MenuIcon />
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text
            style={
              icon == true && icon !== undefined
                ? styles.homeTitle
                : styles.title
            }>
            {title}
          </Text>
        </View>
        {icon == true && icon !== undefined ? (
          <TouchableOpacity
            disabled
            style={styles.chatIcon}
            onPress={() =>
              planInfo?.planName === 'Premium'
                ? navigation.navigate('Chat')
                : alert('Only available to premium users')
            }>
            {/* <ChatIcon /> */}
            <Text> </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_6,
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
    bottom: Platform.OS === 'ios' ? 20 : 4,
    fontSize: 20,
    color: COLORS.black,
  },
  homeTitle: {
    textAlign: 'center',
    marginTop: Platform.OS === 'ios' ? 17 : 17,
    fontSize: 20,
    color: COLORS.black,
  },
  chatIcon: {
    right: 10,
    marginTop: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default TabHeader;
