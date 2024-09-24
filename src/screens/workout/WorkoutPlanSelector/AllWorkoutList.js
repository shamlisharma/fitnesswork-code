import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../common/Constant';
import {scale} from 'react-native-size-matters';
import ImageCarousel from '../../../components/ImageCarousel';
import {RightHiitIcon} from '../../../Svg';
import setting from '../../../config/settings';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import Imageb from 'react-native-image-progress';
export const AllWorkout = React.memo(props => {
  const {data, navigation, planName} = props;
  let mediaPath = setting.cdnUrl.url;

  const changeMemershipModal = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access more workouts please upgrade your account.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const moveToNextScreen = item => {
    if (item.category === 1) {
    
      navigation.navigate('Push exercises', {
        title: item.title,
        workoutId: item._id,
        item: item,
        type: 'individual',
        category: item.category,
      });
    }
    if (item.category === 2) {
     
      navigation.navigate('Workout Hiit Title', {
        title: item.title,
        workoutId: item._id,
        workoutHitData: item,
        category: item.category,
      });
    }
  };

  const workoutScreen = item => {
    if (planName == 'Free' && item.isPaid == 0) {
      moveToNextScreen(item);
    } else if (planName == 'Free' && item.isPaid == 1) {
      changeMemershipModal();
    } else {
      moveToNextScreen(item);
    }
  };

  useEffect(() => {
    onNewTag();
  }, [navigation]);

  const onNewTag = item => {
    // if (
    //   moment(item?.createdAt).format('l') <=
    //   moment(item?.createdAt).add(4, 'days').format('l')
    // ) {
    return (
      <View style={{width: '30%', height: '18%', backgroundColor: COLORS.blue}}>
        <Text
          style={{
            color: COLORS.white,
            textAlign: 'center',
            paddingTop: 3,
            fontFamily: 'Manrope-Semibold',
          }}>
          New
        </Text>
      </View>
    );
    //  }
  };

  const stopWorkoutAccesible = item => {
    if (
      (planName == 'Free') &&
      item.isPaid == 1
    ) {
      return true;
    }
    return false;
  };

  return (
    <View style={{marginLeft: 12}}>
      <ImageCarousel
        data={data[0]?.workoutInfo}
        height={195}
        cardComponent={({item}) => (
          <TouchableOpacity
            style={[
              styles.cardContainerStyle,
              {opacity: stopWorkoutAccesible(item) ? 0.3 : 1},
            ]}
            onPress={() => workoutScreen(item)}>
            <View style={styles.imageWrapper}>
              {/* <ImageBackground
                source={{uri: mediaPath + item.workoutImage}}
                borderRadius={10}
                loadingIndicatorSource={
                  <ActivityIndicator size={'large'} color={COLORS.lightGreen} />
                }
                style={styles.cardImageStyle}>
                {onNewTag(item)}
              </ImageBackground> */}
              <Imageb
                source={{uri: mediaPath + item.workoutImage}}
                indicator={
                  <ActivityIndicator size={'large'} color={COLORS.lightGreen} />
                }
                style={styles.cardImageStyle}
              />
              {onNewTag(item)}
              {stopWorkoutAccesible(item) ? (
                <Image
                  source={require('assets/ShadedRectangle2.png')}
                  style={styles.imageShadowStyle}
                />
              ) : (
                <View />
              )}
            </View>
            {/* <Text>{mediaPath + item.workoutImage+".jpeg"}</Text> */}
            <Text style={styles.cardTitleTextStyle}>
              {`${Math.ceil(item?.time)} min`}
            </Text>
            <Text style={styles.cardSubtitleTextStyle}>{item.title}</Text>
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.cardDescription}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
});

export const RatingWorkout = ({data, planName}) => {
  let mediaPath = setting.cdnUrl.url;
  const navigation = useNavigation();
  console.log('data of rating work out', data, '--', planName);

  const changeMemershipModal = () => {
    Alert.alert(
      'Upgrade Plan',
      'To access more workouts please upgrade your account.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Membership')},
      ],
      {
        cancelable: false,
      },
    );
  };

  const stopWorkoutAccesible = item => {
    if (planName == 'Free' && item.isPaid == 1) {
      return true;
    } else if (item.isPaid === 1) {
      //return true;
    } else {
      return false;
    }
  };

  const workoutScreen = item => {
    if (
      (planName == 'Free' ) &&
      item.isPaid == 0
    ) {
      moveToNextScreen(item);
    } else if ((planName == 'Free') && item.isPaid == 1) {
      changeMemershipModal();
    } else {
      moveToNextScreen(item);
    }
  };
  return (
    <>
      {data?.map(item => {
        if (
          (item?.title?.length != 0 || item?.title?.length != undefined) &&
          item?.time != null
        ) {
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.ratingListContainer,
                {opacity: stopWorkoutAccesible(item) ? 0.3 : 1},
              ]}
              onPress={() => {
                if ((planName == 'Free' ) && item.isPaid == 1) {
                  changeMemershipModal();
                } else if (item.category === 1) {
                  navigation.navigate('Push exercises', {
                    title: item.title,
                    workoutId: item._id,
                    item: item,
                    type: 'individual',
                    category: item.category,
                  });
                }
                if (item.category === 2) {
                  navigation.navigate('Workout Hiit Title', {
                    title: item.title,
                    workoutId: item._id,
                    workoutHitData: item,
                    category: item.category,
                  });
                } else {
                  // console.log("else of workout list",item.category,"-----",item.isPaid, item.isPaid != 1)
                }
              }}>
              <View style={styles.FlexDirection}>
                <View style={styles.ratingImg}>
                  <Image
                    source={{uri: mediaPath + item.workoutImage}}
                    style={styles.ratingSubView}
                  />
                </View>
                <View
                  style={{
                    flex: 6.5,
                    marginLeft: 10,
                  }}>
                  <Text numberOfLines={2} style={styles.ratingTitletText}>
                    {item.title}
                  </Text>
                  <Text style={styles.ratingTitletText2}>
                    {`${Math.ceil(item?.time)} min`}
                  </Text>
                </View>
                <View style={{flex: 0.5}}>
                  <RightHiitIcon />
                </View>
              </View>
            </TouchableOpacity>
          );
        } else {
        }
      })}
    </>
  );
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    marginTop: 10,
    flex: 1,
    marginRight: 10,
    width: 225,
  },

  cardTitleTextStyle: {
    color: '#BDBDBD',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    marginTop: 7,
  },
  cardSubtitleTextStyle: {
    color: '#4F4F4F',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    textTransform: 'capitalize',
    width: 160,
  },
  cardDescription: {
    color: COLORS.grey_3,
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    textTransform: 'capitalize',
    width: 160,
  },
  ratingListContainer: {
    marginVertical: 7,
    height: scale(85),
    backgroundColor: 'rgb(249,249,249)',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  FlexDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingImg: {
    // flex: 3,
    height: scale(85),
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: scale(5),
  },
  ratingSubView: {
    height: scale(85),
    width: scale(85),
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  ratingTitletText: {
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    color: '#4F4F4F',
    fontWeight: '600',
    width: '80%',
    textTransform: 'capitalize',
  },
  ratingTitletText2: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#BDBDBD',
    top: 3,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    borderRadius: 10,
    //backgroundColor:'red'
  },
  cardImageStyle: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    //backgroundColor:'blue'
  },
  imageShadowStyle: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 5,
  },
});
