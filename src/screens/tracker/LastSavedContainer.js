import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../common/Constant';
import { ArrowIcon, DeleteIcon, DropdownIcon } from '../../Svg';
import { log } from 'react-native-reanimated';
import { kgToLbs } from '../../utils/helper';

const LastSavedContainer = React.memo(({
  data,
  dropDownItem,
  onDelete,
  getConvertedValue,
  type,
  title,
  selectedUnit,
}) => {
  const [showFullList, setShowFullList] = useState(false);
  const [maxIndex, setMaxIndex] = useState(0)
  const formattedDate = item => {
    return moment(item).format('DD MMM, YYYY');
  };
  
console.log({data});

  const indexOfMax = (arr) => {
    if (arr.length === 0) {
      return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
      if (arr[i]?.weight > max?.weight) {
        maxIndex = i;
        max = arr[i];
      }
    }
    return maxIndex;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.lastSavedTextStyle}>Last Saved</Text>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderContainer}>
          <Text style={[styles.tableHeaderFontStyle,{flex:1}]}>Date</Text>
          {/* <Text
            style={[
              styles.tableHeaderFontStyle,
              {
                flex: type == 2 ? 3 : 2,
                textAlign: 'center',
                alignSelf: 'center',
              },
            ]}>
            {dropDownItem}
          </Text> */}
          {type == 2 || title == 'My Weight' ? null : (
            <Text
              style={[
                styles.tableHeaderFontStyle,
                { flex: 2, textAlign: 'center', alignSelf: 'center' },
              ]}>
              {selectedUnit}
            </Text>
          )}
          <Text
            style={[
              styles.tableHeaderFontStyle,
              { flex: 1, textAlign: 'center' },
            ]}>
            Reps
          </Text>
        </View>
        {data
          ?.filter((_, index) => index <= (showFullList ? data?.length : 2))
          .map((item, index) => {
            return (
              <View style={[styles.tableRowContainer, index == indexOfMax(data) && { backgroundColor: COLORS.blue, borderRadius: 10 }]}>
                <Text style={styles.dateTextStyle}>
                  {formattedDate(item?.savedAt)}
                </Text>
                <Text style={styles.valueTextStyle}>
                  {getConvertedValue(
                    type == 2 || title == 'My Weight'
                      ? item?.value
                      : kgToLbs(item?.weight,selectedUnit) ,
                  )}
                </Text>
                {type == 2 || title == 'My Weight' ? null : (
                  <Text style={{...styles.valueTextStyle,width:10,left:15}}>
                    {type == 2 || title == 'My Weight' ? '' : item?.reps}
                  </Text>
                )}
                {/* <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity onPress={() => onDelete(item)}>
                    <DeleteIcon />
                  </TouchableOpacity>
                </View> */}
              </View>
            );
          })}
      </View>
      {data?.length > 3 ? (
        <TouchableOpacity
          style={styles.moreButtonStyle}
          onPress={() => setShowFullList(!showFullList)}>
          <Text style={styles.moreTextStyle}>
            {showFullList ? 'Less' : 'More'}
          </Text>
          <View style={{ transform: [{ scaleY: showFullList ? -1 : 1 }] }}>
            <DropdownIcon color={COLORS.lightBlue} />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

export default LastSavedContainer;

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  titleContainer: {
    paddingVertical: 10,
    backgroundColor: COLORS.light_grey,
    paddingHorizontal: 15,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  lastSavedTextStyle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
  },
  tableContainer: {
    backgroundColor: COLORS.light_grey,
    // paddingHorizontal: 15,
    marginTop: 2,
    paddingBottom: 10,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 2,
    paddingHorizontal: 15,
  },
  tableHeaderFontStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: COLORS.grey_4,
  },
  tableRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  dateTextStyle: {
    flex: 3,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
  },
  valueTextStyle: {
    flex: 3,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
  },
  deleteButtonContainer: {
    flex: 1.5,
    alignItems: 'center',
  },
  moreButtonStyle: {
    padding: 10,
    backgroundColor: COLORS.light_grey,
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreTextStyle: {
    textAlign: 'center',
    fontFamily: 'Manrope-SemiBold',
    textDecorationLine: 'underline',
    color: COLORS.lightBlue,
    fontSize: 15,
  },
});
