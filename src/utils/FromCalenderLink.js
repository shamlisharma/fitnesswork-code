import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usersService } from "../services/ApiServices";
import * as RootNavigation from '../../RootNavigation';

export const workoutLink = async () => {
   
    let wId = await AsyncStorage.getItem('wId');
    let day = await AsyncStorage.getItem('wDay');
    // alert(wId)
    // console.log("id from link",wId);
    if (wId) {
      let params = {
        isFilter: 1,
        workoutId: wId,
      };
      let workData = await usersService.getWorkouts(params);
      if (workData?.data?.responseData?.result[0]?.category === 1) {
        // alert(workData?.data?.responseData?.result[0]?.category)
        RootNavigation.navigate('Push exercises', {
          item: workData?.data?.responseData?.result[0],
          workoutId: workData?.data?.responseData?.result[0]?._id,
          title: workData?.data?.responseData?.result[0]?.title,
          fromDashboard: 'true',
          day:day
        });
      }
      if (workData?.data?.responseData?.result[0]?.category == 2) {
         
        //  alert(workData?.data?.responseData?.result[0]?.category)
        RootNavigation.navigate('Workout Hiit Title', {
          title: workData?.data?.responseData?.result[0]?.title,
          workoutHitData: workData?.data?.responseData?.result[0],
          workoutId: workData?.data?.responseData?.result[0]?._id,
          fromDashboard: 'true',
          category:workData?.data?.responseData?.result[0]?.category,
          day:day,
        });
      }

      // navigation.navigate('Push exercises', {workoutId: wId});
    }
  };