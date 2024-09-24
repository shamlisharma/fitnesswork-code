import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async value => {
  try {
    await AsyncStorage.setItem('calender', JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('calender');
    if (value !== null) {
      return JSON.parse(value);
    }
    return undefined;
  } catch (e) {
    console.log(e);
  }
};

const removeValue = async () => {
  try {
    await AsyncStorage.removeItem('calender');
  } catch (e) {
    console.log(e);
  }
};

export {storeData, getData, removeValue};
