import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/core';
import {MainScreen} from '../../common/Screen';
import {getFeedByUser, getLearnAction} from '../../_action/CommunityAction';
import FeedTab from './FeedTab';
import {ScrollView} from 'react-native-gesture-handler';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import {AppButton, COLORS} from '../../common/Constant';
import GradientButton from '../../components/GradientButton';
import {useNavigation} from '@react-navigation/native';
import AlertModal from '../modal/AlertModal';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

let Community = React.memo(function Community(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = React.useState(false);
  const feed = useSelector(state => state?.community?.getFeedByUser);
  console.log('feed data=======',feed)


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getFeedByUser());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getFeedByUser());
    }, []),
  );

 

  return (
    <MainScreen>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.addFriendCard}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Manrope-Bold',
              fontSize: 18,
              paddingVertical: 15,
            }}>
            Get Fit Together
          </Text>
          <Text
            style={{
              textAlign: 'center',
              paddingHorizontal: 20,
              fontFamily: 'Manrope',
              color: COLORS.grey_3,
            }}>
            {' '}
            Add friends to join your community, you will be able to keep them up
            to date, share workouts and your daily activity.
          </Text>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <GradientButton
              title="ADD FRIENDS"
              onPress={() => navigation.navigate('Add friends')}
            />
          </View>
        </View>
        {feed?.map(item => (
          <FeedTab feedData={item} />
        ))}
      </ScrollView>
    </MainScreen>
  );
});

export default Community;

const styles = StyleSheet.create({
  addFriendCard: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: COLORS.grey_4,
    shadowOffset: {width: 4, height: -5},
    shadowOpacity: 0.2,
  },
});
