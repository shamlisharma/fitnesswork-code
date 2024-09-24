import React from 'react';
import {NavigationContainer, DrawerActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Food from '../screens/food/Food';
import Workout from '../screens/workout/Workout';
import Tracker from '../screens/tracker/Tracker';
import Community from '../screens/community/Community';
const Tab = createBottomTabNavigator();

let TabBar = React.memo(function TabBar() {
  return (
    // <NavigationContainer>
    <>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Food" component={Food} />
        <Tab.Screen name="Workout" component={Workout} />
        <Tab.Screen name="Tracker" component={Tracker} />
        <Tab.Screen name="Community" component={Community} />
      </Tab.Navigator>
    </>
    // </NavigationContainer>
  );
})
export default TabBar;
