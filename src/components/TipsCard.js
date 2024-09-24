import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Pressable, Linking} from 'react-native';
import {COLORS} from '../common/Constant';
import {DropdownIcon} from '../Svg';

const TipsCard = React.memo(({
  title,
  textContent,
  backgroundColor,
  textContentColor,
  titleColor,
  dropdownIconColor,
  calTarget,
  proTarget
}) => {
  const navigation = useNavigation()
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.titleTextContainer,
          {
            backgroundColor: open
              ? backgroundColor || COLORS.lightGreen
              : COLORS.light_grey,
            borderBottomLeftRadius: open ? 0 : 5,
            borderBottomRightRadius: open ? 0 : 5,
          },
        ]}
        onPress={() => setOpen(!open)}>
        <View style={{width: '90%'}}>
          <Text
            style={[
              styles.titleTextStyle(open),
              {
                fontFamily: 'Manrope-Regular',
                color: open ? titleColor || 'white' : COLORS.grey_2,
              },
            ]}>
            {title || 'you are seeing this because you did not enter any title'}
          </Text>
        </View>
        <View style={{transform: [{scaleY: open ? -1 : 1}]}}>
          <DropdownIcon
            color={open ? dropdownIconColor || 'white' : COLORS.lightGrey}
          />
        </View>
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.textContentContainer,
            {backgroundColor: backgroundColor || COLORS.lightGreen},
          ]}>
            {textContent ?
            textContent == 1 ?
            <Text  style={[
              styles.textContentStyle,
              {color: textContentColor || 'white'},
            ]}>Yes you can ;-) . If you choose to track and log your meals on my fitness pal, remember to track it carefully. Watch my video on nutrition here {" "}<Pressable style={{alignItems:"center",marginRight:6,marginTop:-2}} onPress={()=>navigation.navigate("CommunityTab")}><Text style={[
              {color: 'white',fontFamily: 'Manrope-Regular',
              fontSize: 16,textDecorationLine:"underline"}
            ]}>Learn</Text></Pressable>for guidance.</Text>
            :
          <Text
            style={[
              styles.textContentStyle,
              {color: textContentColor || 'white'},
            ]}>
            {textContent ||
              "Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type"}
          </Text>:
          <Text style={[
            styles.textContentStyle,
            {color: textContentColor || 'white'},
          ]}>No. You can use my meals as a guide to help with nutritious meal planning. Just make sure you hit your protein target and don’t exceed calories target of {calTarget} and meet your protein target {proTarget}. Add these stats to <Pressable onPress={() => Linking.openURL("https://apps.apple.com/gb/app/myfitnesspal-calorie-counter/id341232718")}><Text style={[
            styles.textContentStyle,
            {color: "white",textDecorationLine:"underline",marginRight:6,marginTop:-4},
          ]}>my fitness pal </Text></Pressable>and you can track daily from there.</Text>
            }
        </View>
      )}
    </View>
  );
});

export default TipsCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  titleTextContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titleTextStyle: open => ({
    fontSize: open ? 18 : 16,
    fontWeight: open ? 'bold' : '',
  }),
  textContentContainer: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.lightGreen,
    paddingBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  textContentStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    paddingHorizontal: 5,
  },
});
