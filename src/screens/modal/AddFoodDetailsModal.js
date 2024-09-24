import React, {useState} from 'react';
import {Text, Pressable, StyleSheet, View, Modal} from 'react-native';
import {COLORS} from '../../common/Constant';
import RadioButton from '../../components/RadioButton';
import {CloseFoodIcon, StepsCloseIcon} from '../../Svg';

export const AddFoodDetailsModal = React.memo(props => {
  const {addFood, close} = props;

  const PROP = [
    {
      key: 'Shopping list title',
      text: 'Shopping list title',
    },
    {
      key: 'Products for new diet',
      text: 'Products for new diet',
    },
    {
      key: 'To buy in Eco store',
      text: 'To buy in Eco store',
    },
  ];
  const [option, setOption] = useState(null);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addFood}
      onRequestClose={close}>
      <View style={styles.modalBg}>
        <View style={styles.modalBackground}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: COLORS.grey_2,
                fontSize: 16,
                lineHeight: 20,
                fontFamily: 'Manrope-Semibold',
              }}>
              Add to shopping list
            </Text>
            <Pressable onPress={close}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </Pressable>
          </View>

          <RadioButton PROP={PROP} />
        </View>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: '#00000040',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    marginTop: 372,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#fff',
    height: 'auto',
    width: '90%',
    paddingBottom: 30,
  },
});
