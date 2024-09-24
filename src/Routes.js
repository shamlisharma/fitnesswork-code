import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RNCalendarEvents from "react-native-calendar-events";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  StyleSheet,
  LogBox,
  TouchableOpacity,
  Text,
  Linking,
  AppState,
  Platform,
  ActivityIndicator,
  View,
} from "react-native";
import io from "socket.io-client";
import SignupEmail from "./screens/auth/SignupEmail";
import SignupOtp from "./screens/auth/SignupOtp";
import SignupPassword from "./screens/auth/SignupPassword";
import SignupFirstName from "./screens/auth/SignupFirstName";
import SignupLastName from "./screens/auth/SignupLastName";
import SignupAge from "./screens/auth/SignupAge";
import SignupGender from "./screens/auth/SignupGender";
import SignIn from "./screens/auth/SignIn";
import MembershipPlan from "./screens/auth/Membership";
import Home from "./screens/home/Home";
import NoPermission from "./screens/auth/NoPermission";
import Food from "./screens/food/Food";
import Workout from "./screens/workout/Workout";
import Tracker from "./screens/tracker/Tracker";
import Community from "./screens/community/Community";
import Questionnaire from "./screens/questionnaire/Questionnaire";
import Sidebar from "./components/sidebar/Sidebar";
import { COLORS, DeviceScreen } from "./common/Constant";
import ForgotPass from "./screens/auth/ForgotPassword";
import NotificationScreen from "./screens/notification/Notification";
import MembershipScreen from "./screens/membership/Membership";
import Profile from "./screens/profile/Profile";
import {
  ActiveCommunityIcon,
  ActiveFoodIcon,
  ActiveTrackerIcon,
  ActiveWorkOut,
  AddUserIcon,
  BackArrowIcon,
  ChatIcon,
  CloseFoodIcon,
  CommunityIcon,
  FoodTabBarIcon,
  MenuIcon,
  SettingsIcon,
  TabActiveHomeIcon,
  TabHomeIcon,
  TipsIcon,
  TrackerIcon,
  WorkOutIcon,
} from "./Svg";
import FoodPreferences from "./screens/auth/FoodPreferences";
import FitbitConnectivity from "./screens/fitbitDevice/FitbitConnectivity";
import SplashScreen from "react-native-splash-screen";
import Help from "./screens/help/Help";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPassOtp from "./screens/auth/ForgotPassOtp";
import ResetPassword from "./screens/auth/ResetPassword";
import Contact from "./screens/contact/Contact";
import PrivacyPolicy from "./screens/PrivacyPolicy/PrivacyPolicy";
import { useSelector } from "react-redux";
import FitbitLoginPage from "./screens/fitbitDevice/FitbitLoginPage";
import MembershipPlanInfo from "./screens/membership/MembershipPlanInfo";
import MilestoneTrackerScreen from "./screens/tracker/MilestoneTrackerScreen";
import MeasurementTrackerScreen from "./screens/tracker/MeasurementTrackerScreen";
import TrackDataScreen from "./screens/tracker/TrackDataScreen";
import ChatData from "./screens/chat/ChatData";
import AddFoodPlanScreen from "./screens/food/AddFoodPlanScreen";
import FoodPlanViewer from "./screens/food/FoodPlanViewer";
import AddFood from "./screens/food/AddFood";
import FoodTipsScreen from "./screens/food/FoodTipsScreen";
import NoIternet from "./screens/auth/NoInternet";
import { Loader } from "./common/Loader";
import WorkoutPlanSelectorScreen from "./screens/workout/WorkoutPlanSelector/WorkoutPlanSelectorScreen";
import ExercisePatternScreen from "./screens/workout/ExercisePattern/ExercisePatternScreen";
import { useDispatch } from "react-redux";
import { signupTypes } from "./_action/AuthAction";
import ExcerciseScreen from "./screens/workout/Exercise/ExerciseScreen";
import WorkouthiitScreen from "./screens/workout/WorkoutHiit/WorkoutHiitScreen";
import HiitExerciseScreen from "./screens/workout/WorkoutHiit/HiitExerciseScreen";
import CheckInScreen from "./screens/tracker/CheckInScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllWorkOutPlan from "./screens/workout/WorkoutPlanSelector/AllWorkoutPlan";
import WorkoutFilter from "./screens/workout/WorkoutPlanSelector/WorkoutFilter";
import FoodDetailsScreen from "./screens/food/FoodDetailsScreen";
import Shopping from "./screens/shopping/Shopping";
import BuyFromStore from "./screens/shopping/BuyFromStore";
import HiitComplete from "./screens/workout/WorkoutHiit/HiitComplete";
import AllMeals from "./screens/food/AllMeals";
import WorkoutTipsScreen from "./screens/workout/WorkoutTipsScreen";
import ModifyFoodPreferencesModal from "./screens/food/ModifyFoodPreferencesModal";
import FoodFilter from "./screens/food/FoodFilter";
import PhaseCompleteScreen from "./screens/workout/PhaseCompleteScreen";
import MealFilter from "./screens/food/MealsFilter";
import Learn from "./screens/community/Learn";
import CommunityFilter from "./screens/community/CommunityFilter";
import AddFriend from "./screens/community/AddFriend";
import AddFriendByName from "./screens/community/AddFriendByName";
import {
  requestUserPermission,
  notificationListener,
} from "./utils/Notification";
import Comment from "./screens/community/Comment";
import messaging from "@react-native-firebase/messaging";
import { navigationRef } from "../RootNavigation";
import LinkView from "./screens/community/LinkView";
import FromContact from "./screens/community/FromContact";
import * as RootNavigation from "../RootNavigation";
import FriendList from "./screens/community/FriendList";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import FlashMessage from "react-native-flash-message";
import StepsScreen from "./screens/statics/StepsScreen";
import SleepScreen from "./screens/statics/SleepScreen";
import PerformanceScore from "./screens/statics/PerformanceScore";
import FriendRequest from "./screens/community/FriendRequest";
import { workoutLink } from "./utils/FromCalenderLink";
import GoogleFitVerification from "./screens/auth/GoogleFitVerification";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
// import Setting from './screens/settings/Setting';
import { F, get } from "lodash/fp";
import Setting from "./screens/Setting/Setting";
import Settings from "./config/settings";
import Category from "./screens/Setting/Category/Category";
import ExerciseType from "./screens/Exercise/ExerciseType";
import Sign from "./screens/sign/Sign";
import Sign2 from "./screens/sign/Sign2";
import HardWork from "./screens/Hard Work/HardWork";
import MilestonesTrackerScreen from "./screens/tracker/MilestoneTrackerScreen";
import ExerciseFilter from "./screens/workout/ExerciseFilter";
import LiftHistory from "./screens/tracker/LiftHistory";
import * as RNIap from "react-native-iap";
import AlertCancelMembership from "./screens/modal/AlertCancelMembership";
import { usersService } from "./services/ApiServices";
import { getProfileAction } from "./_action/ProfileAction";
import { iapAction } from "./_action/InappPurchaseAction";
import ExpiredModal from "./screens/home/Modal";
import moment from "moment";
import HiitComplete2 from "./screens/workout/WorkoutHiit/HiitComplete2";
import ExcerciseVideo from "./screens/workout/Exercise/ExcerciseVideo";
import UploadPhoto from "./screens/Progress/uploadPhoto";
import Compare from "./screens/Progress/compare";
import ProgressTab from "./ProgressTap";

// import MemberShip2 from './screens/membership/MemberShip2';
const PERSISTENCE_KEY = "NAVIGATION_STATE";

const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const DrawerScreen = createDrawerNavigator();
const config = {
  screens: {
    Auth: {
      path: "",
      screens: {
        SignIn: {
          path: "Signin/:id",
          parse: {
            id: (id) => `${id}`,
          },
        },
      },
    },
  },
};

export const AuthStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn" options={{ headerShown: false }}>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{ headerShown: false, animation: "slide_from_left" }}
      />
      <Stack.Screen
        name="ForgotPassOtp"
        component={ForgotPassOtp}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignUpEmail"
        component={SignupEmail} //  SignupEmail
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupOtp"
        component={SignupOtp}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupPass"
        component={SignupPassword}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupFirstName"
        component={SignupFirstName}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupLastName"
        component={SignupLastName}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupAge"
        component={SignupAge}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignupGender"
        component={SignupGender}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="MembershipPlan"
        component={MembershipPlan}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="FoodPreferences"
        component={FoodPreferences}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
};

const screenOptionsForModal = ({ navigation, route }) => ({
  headerTitle: () => (
    <Text style={styles.headerTitleTextStyle}>{route.name}</Text>
  ),

  headerLeft: () => <CloseButton navigation={navigation} route={route} />,
  presentation: "fullScreenModal",
  headerTitleAlign: "center",
  headerBackVisible: false,
});
const screenOptionsForStack = ({ navigation, route }) => ({
  headerTitle: () => (
    <Text style={styles.headerTitleTextStyle}>
      {route?.params?.title || ""}
    </Text>
  ),

  headerLeft: () => <CloseButton navigation={navigation} route={route} />,
  headerTitleAlign: "center",
  headerBackVisible: false,
});

// drawer screen here
const UserDrawerScreen = () => (
  <DrawerScreen.Navigator
    initialRouteName="No Permission"
    screenOptions={{
      drawerStyle: {
        width: DeviceScreen.width,
      },
    }}
    drawerPosition="left"
    drawerContent={(props) => <Sidebar {...props} />}
  >
    <DrawerScreen.Group screenOptions={{ headerShown: false }}>
      <DrawerScreen.Screen name="No Permission" component={NoPermission} />
      <DrawerScreen.Screen name="Tabs" component={BottomTabScreenStack} />

      <DrawerScreen.Screen name="Profile" component={Profile} />

      <DrawerScreen.Screen name="Membership" component={MembershipScreen} />
      {/* <DrawerScreen.Screen name="Lift" options={{headerTitle:"Lift History"}} component={LiftHistory} /> */}
      <DrawerScreen.Screen name="Notification" component={NotificationScreen} />
      <DrawerScreen.Screen name="Questionnaire" component={Questionnaire} />
      <DrawerScreen.Screen
        name="FitbitConnectivity"
        component={FitbitConnectivity}
      />
      <DrawerScreen.Screen name="help" component={Help} />
      <DrawerScreen.Screen name="Contact" component={Contact} />
      <DrawerScreen.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <DrawerScreen.Screen name="FitbitLoginPage" component={FitbitLoginPage} />
      <DrawerScreen.Screen
        name="MembershipInfo"
        component={MembershipPlanInfo}
      />
    </DrawerScreen.Group>
  </DrawerScreen.Navigator>
);

// Tab screen here
const BottomTabScreenStack = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    screenOptions={({ route, navigation }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        if (route.name === "HomeTab") {
          return focused ? <TabActiveHomeIcon /> : <TabHomeIcon />;
        } else if (route.name === "FoodTab") {
          return focused ? <ActiveFoodIcon /> : <FoodTabBarIcon />;
        } else if (route.name === "WorkoutTab") {
          return focused ? <ActiveWorkOut /> : <WorkOutIcon />;
        } else if (route.name === "TrackerTab") {
          return focused ? <ActiveTrackerIcon /> : <TrackerIcon />;
        } else if (route.name === "CommunityTab") {
          return focused ? <ActiveCommunityIcon /> : <CommunityIcon />;
        }
      },
      tabBarActiveTintColor: COLORS.lightGreen,
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeTabScreenStack}
      options={{ tabBarLabel: "Home" }}
    />
    <Tab.Screen
      name="FoodTab"
      component={FoodTabScreenStack}
      options={{ tabBarLabel: "Food" }}
    />
    <Tab.Screen
      name="WorkoutTab"
      component={WorkoutTabScreenStack}
      options={{ tabBarLabel: "Workout" }}
    />
    <Tab.Screen
      name="TrackerTab"
      component={TrackerTabScreenStack}
      options={{ tabBarLabel: "Tracker" }}
    />
    <Tab.Screen
      name="CommunityTab"
      component={CommunityTabScreenStack}
      options={{ tabBarLabel: "Community" }}
    />

    {/* <Tab.Screen
      name="Exercise"
      component={ExerciseType}
      options={{ tabBarLabel: 'Exercise' }}
    />
    <Tab.Screen
      name="Category"
      component={Category}
      options={{ tabBarLabel: 'Category' }}
    /> */}
  </Tab.Navigator>
);

// Top tab bar

const TopTabScreenStack = () => (
  <TopTab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 16,
        fontFamily: "Manrope-SemiBold",
        textTransform: "capitalize",
      },
      tabBarActiveTintColor: "#0DB8DA",
      tabBarInactiveTintColor: "grey",
      tabBarIndicatorStyle: { backgroundColor: "#0DB8DA" },
    }}
  >
    <TopTab.Screen name="Programmes" component={WorkoutPlanSelectorScreen} />
    <TopTab.Screen name="All Workouts" component={AllWorkOutPlan} />
  </TopTab.Navigator>
);

const ProgressTopTabStack = () =>{
 return  <TopTab.Navigator 
 tabBar={props => <ProgressTab {...props} />}
    screenOptions={{
      swipeEnabled: false,
      tabBarLabelStyle: {
        fontSize: 16,
        fontFamily: "Manrope-SemiBold",
        textTransform: "capitalize",
      },
      tabBarActiveTintColor: "#0DB8DA",
      tabBarInactiveTintColor: "grey",
      tabBarIndicatorStyle: { backgroundColor: "#0DB8DA" },
    }}
  >
    <TopTab.Screen name="Upload photos" component={UploadPhoto} />
    <TopTab.Screen name="Compare" component={Compare} />
  </TopTab.Navigator>
}

// Community tab bar

const CommunityTopTabScreen = () => (
  <TopTab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 16,
        fontFamily: "Manrope-SemiBold",
        textTransform: "capitalize",
      },
      tabBarActiveTintColor: "#0DB8DA",
      tabBarInactiveTintColor: "grey",
      tabBarIndicatorStyle: { backgroundColor: "#0DB8DA" },
    }}
  >
    <TopTab.Screen name="Feed" component={Community} />
    <TopTab.Screen name="Learn" component={Learn} />
  </TopTab.Navigator>
);

// Top food tab bar
const FoodTopTabStack = () => (
  <TopTab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 16,
        fontFamily: "Manrope-Regular",
        textTransform: "capitalize",
      },
      tabBarActiveTintColor: "#0DB8DA",
      tabBarInactiveTintColor: "#BDBDBD",
      tabBarIndicatorStyle: { backgroundColor: "#0DB8DA" },
    }}
  >
    <TopTab.Screen name="Plans" component={AddFoodPlanScreen} />
    <TopTab.Screen name="All meals" component={AllMeals} />
  </TopTab.Navigator>
);

//Navigation screen here

const headerTitle = (text) => {
  if (text.length > 50) {
    return `${text.slice(0, 50)}...`;
    //return text
  } else {
    return text;
  }
};

const handleSocket = (navigation) => {
  //socketRef.current.disconnect()
  navigation.goBack();
};

const CloseButton = ({ navigation, route }) => (
  <TouchableOpacity
    style={{ padding: 10 }}
    onPress={() =>
      route?.name == "Chat with Coach"
        ? handleSocket(navigation)
        : navigation.goBack()
    }
  >
    {route?.name == "ByContact" ||
    route?.name == "Chat with Coach" ||
    route?.name == "Workout tips" ||
    route?.name == "Food tips" ? (
      <BackArrowIcon />
    ) : (
      <CloseFoodIcon color={COLORS.grey_3} width={30} height={30} />
    )}
  </TouchableOpacity>
);

const screenOptions = ({ navigation, route }) => ({
  headerTitle: () => (
    <Text
      style={[
        styles.headerTitleTextStyle,
        {
          flexWrap: "wrap",
          textAlign: "center",
          width: 225,
          fontSize: route.params?.title ? 17 : 18,
        },
      ]}
    >
      {route.params?.title ? headerTitle(route.params.title) : route.name}
    </Text>
  ),
  headerLeft: () =>
    route.name === "Home" ? (
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => navigation.openDrawer()}
      >
        <MenuIcon />
      </TouchableOpacity>
    ) : route.name === "Food" ||
      route.name === "Workout" ||
      route.name === "Tracker" ||
      route.name === "Community" ? null : (
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => navigation.goBack()}
      >
        <BackArrowIcon />
      </TouchableOpacity>
    ),
  headerTitleAlign: "center",
  headerBackVisible: false,
});
const HomeTabScreenStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen
      name="FoodDetailsScreen"
      component={FoodDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Steps"
      component={StepsScreen}
      options={({ navigation }) => ({
        headerTitle: "Steps",
        headerTitleStyle: {
          fontFamily: "Manrope-Regular",
          fontSize: 20,
        },
      })}
    />
    <Stack.Screen
      name="Score"
      component={PerformanceScore}
      options={({ navigation }) => ({
        headerTitle: "Score",
        headerTitleStyle: {
          fontFamily: "Manrope-Regular",
          fontSize: 20,
        },
      })}
    />

    <Stack.Screen
      name="Sleep"
      component={SleepScreen}
      options={({ navigation }) => ({
        headerTitle: "Sleep",
        headerTitleStyle: {
          fontFamily: "Manrope-Regular",
          fontSize: 20,
        },
      })}
    />
  </Stack.Navigator>
);

export const FoodTabScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Food" screenOptions={screenOptions}>
      <Stack.Screen
        name="Food"
        // children={()=><Food fromHome={false}/>}
        component={Food}
        options={({ navigation }) => ({
          headerTitle: "Foods",
          title: "Foods",
          headerTitleStyle: {
            fontFamily: "Manrope-Regular",
            fontSize: 20,
          },
        })}
      />
      <Stack.Screen name="Meals" component={FoodTopTabStack} />
      <Stack.Screen name="Foods" component={AddFoodPlanScreen} />
      <Stack.Screen name="Carrot daily plan" component={FoodPlanViewer} />
      <Stack.Screen name="Add food" component={AddFood} />
      <Stack.Screen name="Shopping" component={Shopping} />
      <Stack.Screen
        name="FoodDetailsScreen"
        component={FoodDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit food preferences"
        component={ModifyFoodPreferencesModal}
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="To buy in Eco store"
        component={BuyFromStore}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export const WorkoutTabScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Workout" screenOptions={screenOptions}>
      <Stack.Screen
        name="Workout"
        component={Workout}
        options={{
          headerTitle: "Workouts",
          title: "Workouts",
          headerTitleStyle: {
            fontFamily: "Manrope-Regular",
            fontSize: 20,
          },
          // headerRight: () => (
          //   <TouchableOpacity
          //     onPress={() =>
          //       navigation.navigate('Workout tips', { title: 'Workout tips' })
          //     }>
          //     <TipsIcon />
          //   </TouchableOpacity>
          // ),
        }}
      />
      <Stack.Screen
        name="Workouts"
        component={TopTabScreenStack}
        options={({ navigation, route }) => ({
          // headerRight:()=> <TouchableOpacity
          //       style={{ padding: 5 }}
          //       // onPress={() => navigation.goBack()}
          //       onPress={() => {
          //         navigation.push('Setting');
          //       }}>
          //       <SettingsIcon/>
          //     </TouchableOpacity>,
          headerLeft: () =>
            route?.params?.programmeId === "null" ? (
              // <TouchableOpacity
              //   style={{padding: 15}}
              //   onPress={() => navigation.openDrawer()}>
              //   <MenuIcon />
              // </TouchableOpacity>
              <></>
            ) : (
              <TouchableOpacity
                style={{ padding: 5 }}
                // onPress={() => navigation.goBack()}
                onPress={() => {
                  navigation.push("Workout");
                }}
              >
                <BackArrowIcon />
              </TouchableOpacity>
            ),
        })}
      />
      <Stack.Screen
        name="Push exercises"
        component={ExercisePatternScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Excercise"
        component={ExcerciseScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="Workout Hiit Title"
        component={WorkouthiitScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Hiit complete"
        component={HiitComplete}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Phase complete"
        component={PhaseCompleteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Hiit Exercise"
        component={HiitExerciseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="WorkoutTips" component={WorkoutTipsScreen} />
    </Stack.Navigator>
  );
};

export const WorkoutTabScreenStackFromCalender = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Push exercises"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Workout"
        component={Workout}
        options={{
          headerTitle: "Workouts",
          headerTitleStyle: {
            fontFamily: "Manrope-Regular",
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Workout tips", { title: "Workout tips" })
              }
            >
              <TipsIcon />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Workouts"
        component={TopTabScreenStack}
        options={({ navigation, route }) => ({
          headerLeft: () =>
            route?.params?.programmeId === "null" ? (
              <TouchableOpacity
                style={{ padding: 15 }}
                onPress={() => navigation.openDrawer()}
              >
                <MenuIcon />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => navigation.navigate("Workout")}
              >
                <BackArrowIcon />
              </TouchableOpacity>
            ),
        })}
      />
      <Stack.Screen
        name="Push exercises"
        component={ExercisePatternScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Excercise"
        component={ExcerciseScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseFoodIcon color={COLORS.grey_3} />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen name="WorkoutTips" component={WorkoutTipsScreen} />
    </Stack.Navigator>
  );
};

export const WorkoutHiitTabScreenStackFromCalender = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Workout Hiit Title"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="Workout"
        component={Workout}
        options={{
          headerTitle: "Workouts",
          headerTitleStyle: {
            fontFamily: "Manrope-Regular",
            fontSize: 20,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Workout tips", { title: "Workout tips" })
              }
            >
              <TipsIcon />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Workouts"
        component={TopTabScreenStack}
        options={({ navigation, route }) => ({
          headerLeft: () =>
            route?.params?.programmeId === "null" ? (
              <TouchableOpacity
                style={{ padding: 15 }}
                onPress={() => navigation.openDrawer()}
              >
                <MenuIcon />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => navigation.navigate("Workout")}
              >
                <BackArrowIcon />
              </TouchableOpacity>
            ),
        })}
      />
      <Stack.Screen
        name="Workout Hiit Title"
        component={WorkouthiitScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Hiit Exercise"
        component={HiitExerciseScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Hiit complete"
        component={HiitComplete}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exrcise"
        component={ExerciseType}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sign"
        component={Sign}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sign2"
        component={Sign2}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="WorkoutTips" component={WorkoutTipsScreen} />
    </Stack.Navigator>
  );
};

export const TrackerTabScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tracker" screenOptions={screenOptions}>
      <Stack.Screen name="Tracker" component={Tracker} />
      <Stack.Screen
        name="Measurements Tracker"
        component={MeasurementTrackerScreen}
      />
      <Stack.Screen
        name="Milestones Tracker"
        component={MilestoneTrackerScreen}
      />
      <Stack.Screen name="TrackDataScreen" component={TrackDataScreen} />
      <Stack.Screen name="Check In" component={CheckInScreen} />
      <Stack.Screen
        name="Lift"
        options={{ headerTitle: "Lift History" }}
        component={LiftHistory}
      />
       <Stack.Screen
        name="Progress"
        options={{ headerTitle: "Progress Photos" }}
        component={ProgressTopTabStack}
      />
    </Stack.Navigator>
  );
};

export const CommunityTabScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName="Community" screenOptions={screenOptions}>
      <Stack.Screen
        name="Community"
        component={CommunityTopTabScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("Add friends")}
            >
              <AddUserIcon />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Add friends" component={AddFriend} />
      <Stack.Screen
        name="Add friends by full name"
        component={AddFriendByName}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseFoodIcon color={COLORS.grey_3} width={30} height={30} />
            </TouchableOpacity>
          ),
        })}
      />

      {/* <Stack.Screen
        name="Web Link"
        component={LinkView}
        options={({route}) => ({title: route.params.name})}
      /> */}
    </Stack.Navigator>
  );
};

const Routes = (props) => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isConnected, setisConnected] = useState(true);
  // const [initialRoute, setInitialRoute] = useState('Drawer');
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthEnable = useSelector((state) => state.authReducer?.loggedIn);
  const [profileData, setProfileData] = useState(null);
  const [showExpireModal, setExpireModal] = useState(false);
  const isAuthGoogleFit = useSelector(
    (state) => state.authReducer.googleLoggedIn
  );
  const getProfileData = useSelector(
    (state) => state?.profileReducer?.profile?.data?.responseData
  );
  const netInfo = useNetInfo();
  console.log("getProfileData?.userProfile", getProfileData?.userProfile);
  useEffect(() => {
   
    NetInfo.fetch().then((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setisConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setisConnected(state.isConnected);
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const linkingListener = dynamicLinks().onLink(handleDynamicLink);
        return () => {
          linkingListener();
        };
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [appStateVisible]);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        handleDynamicLink(link);
      });
    const linkingListener = dynamicLinks().onLink(handleDynamicLink);

    // Calender Permission for android
    RNCalendarEvents.requestPermissions()
      .then()
      .catch((error) => {});
    return () => {
      linkingListener();
    };
  }, []);

  const persistenceKey = "navigationStatePersistenceKey";

  const persistNavigationState = async (navState) => {
    try {
      await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState));
    } catch (err) {
      // handle error
    }
  };
  const loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(persistenceKey);
    return JSON.parse(jsonString);
  };

  const handleDynamicLink = async (link) => {
    // alert("link",link)
    if (!!link?.url) {
      let getId = link.url?.split("=").pop();
      await AsyncStorage.setItem("userName", getId);
      if (link?.url?.match("workout") == "workout") {
        let getWorkoutId = link.url?.split("=");
        let day = link.url?.split("=").pop();
        let getWorkoutId2 = getWorkoutId[1]?.split(",");
        await AsyncStorage.setItem("wId", getWorkoutId2[0]);
        await AsyncStorage.setItem("wDay", getWorkoutId2[1]);
        workoutLink();
      }
    }
  };

  useEffect(() => {
    detectLogin();
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      try {
        // const initialUrl = await Linking.getInitialURL();

        // if (Platform.OS !== 'web' && initialUrl == null) {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== "web" && initialUrl == null) {
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
            // }
            // }
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
    requestUserPermission();
    notificationListener();
    workoutLink();
  }, [isReady]);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    workoutLink();
    detectLogin();
  }, [isAuthEnable]);

  useEffect(() => {
    RNIap.initConnection();
    console.log(getProfileData, "API_RESPONSE__DATA");
    if (getProfileData != null) {
      setProfileData(getProfileData);
    }
  }, [getProfileData]);

  const detectLogin = async () => {
    // setIsLoading(true);
    const token = await AsyncStorage.getItem("accessToken");
    const getGoogleAuthTokenn = await AsyncStorage.getItem(
      "googleAuthStatus",
      (err, value) => {
        if (err) {
          console.log(err);
        } else {
          JSON.parse(value);
        }
      }
    );
    // throw Error("test")
    console.log("dad000000", token);
    if (token != null) {
      // getAvailable();
      setIsLoading(false);
      dispatch({ type: signupTypes.SIGNIN_SUCCESS });

      console.log("NEW_LOGIN_HIT");
    } else {
      setIsLoading(false);
      dispatch({ type: signupTypes.USER_LOGOUT_SUCCESS });
      console.log("NEW_LOGOUT_HIT");
    }

    if (getGoogleAuthTokenn) {
      dispatch({ type: signupTypes.GOOGLE_SIGNIN });
    }
    setIsLoading(false);
  };

  const getAvailable = async () => {
    // console.log("in get profile",getProfileData?.userProfile);
    const id = await AsyncStorage.getItem("user_id");
    console.log("user id is");
    usersService
      .getSubscriptionReceipt(id)
      .then((res) => {
        console.log("res is ", res);
        if (res?.data?.responseData?.receipt) {
          if (res?.data?.responseData?.platform === "ios") {
            validateIOSReceipt(res.data.responseData.receipt);
          } else {
            validateAndroidReceipt(res.data.responseData.receipt);
          }
        } else {
          // alert("cc")
          setExpireModal(true)
          // downgradeToFreeUser();
        }
      })
      .catch((e) => {
        console.log("error is", e);
      });
    // RNIap.initConnection()
    //   .then(() => {
    // RNIap.getAvailablePurchases()
    //   .then((res) => {
    //     // alert("getted")
    //     console.log("NEW_RESULT_FOUND", res);
    //     if (res.length > 0) {
    //       if (Platform.OS == "android") {
    //         validateAndroidReceipt(res);
    //       } else {
    //         validateIOSReceipt(res[0].transactionReceipt);
    //       }
    //     } else {
    //       // setShowModal(true)
    //       // upgradePlan()
    //       downgradeToFreeUser();
    //     }
    //   })
    //   .catch((err) => {
    //     alert(JSON.stringify(err))
    //     console.log("AVAILABLE_ERROR", err);
    //     downgradeToFreeUser();
    //   });
    // })
    // .catch((err) => {
    //   console.log("INIT_ERROR", err);
    // });
  };

  const validateAndroidReceipt = async (res) => {
    usersService
      .validatePayment(res[0].productId, res[0].purchaseToken)
      .then((res) => {
        if (res.data.statusCode === 1) {
          console.log(
            res.data.responseData.receipt.payload.expiryTimeMillis,
            "NEW_API_RESULT"
          );
          console.log(new Date().valueOf(), "NEW_API_RESULT");
          if (
            res.data.responseData.receipt.payload.expiryTimeMillis >
            new Date().valueOf()
          ) {
          } else {
            // downgradeToFreeUser();
            setExpireModal(true)
          }
          console.log("SUCCESS");
        } else {
          console.log("'FAILURE");
          // downgradeToFreeUser();
          setExpireModal(true)
        }
      })
      .catch((err) => {
        console.log("API_ERROR", err);
      });
  };

  const validateIOSReceipt = async (transactionReceipt) => {
    try {
      const receiptBody = {
        "receipt-data": transactionReceipt,
        password: "c589d4eb53334fd2a44574ed2b907cf9", // app shared secret, can be found in App Store Connect
      };
      const result = await RNIap.validateReceiptIos(receiptBody, false);
      console.log(result?.latest_receipt_info[0], "NEW_API_RESPONSE");
      if (result?.status === 0) {
        if (
          result?.latest_receipt_info[0].expires_date_ms > new Date().valueOf()
        ) {

        } else {
          // downgradeToFreeUser();
          setExpireModal(true)
        }
        //  alert("Your subscription is expired");
      } else {
        // downgradeToFreeUser();
        setExpireModal(true)
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const downgradeToFreeUser = async (planId) => {
    const id = await AsyncStorage.getItem("user_id");
    let req = {
      userId: id,
      iap_prod_id: "0",
      planId: "6309da0e7de542001b93a996", //"6309dadbc2dacd0014060335", //'6309da0e7de542001b93a996',
      transactionId: "downgrade",
      startDate: new Date(),
      endDate: new Date(),
      isPremium: 0,
    };
    console.log("downgrade to fre", req);
    dispatch(iapAction(req))
      .then((res) => {
        console.log("res from downgrade", res.data);
        if (res.data.statusCode === 1) {
          dispatch(getProfileAction());
          setTimeout(() => {
            setExpireModal(true);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("in downgrade error", { err });
        //  alert(err);
        // props.navigation.navigate('No Permission');
        // props.setLoader(false);
      });
  };

  LogBox.ignoreAllLogs();
  if (!isReady) {
    return <Loader loading={isReady} />;
  }

  return (
    <>
      {isLoading === true ? (
        <Loader loading={true} />
      ) : (
        <NavigationContainer
          // linking={linking}
          ref={navigationRef}
          initialState={isAuthEnable ? null : initialState}
          persistNavigationState={persistNavigationState}
          loadNavigationState={loadNavigationState}
          onStateChange={(state) => {
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          }}
        >
          <Stack.Navigator>
            {isAuthEnable ? (
              <>
                {isConnected ? (
                  <>
                    <>
                      <Stack.Group screenOptions={{ headerShown: false }}>
                        {Platform.OS === "android" && isAuthGoogleFit ? (
                          <Stack.Screen
                            name="googlefit"
                            component={GoogleFitVerification}
                            options={{ animation: "slide_from_left" }}
                          />
                        ) : (
                          <Stack.Screen
                            name="Drawer"
                            component={UserDrawerScreen}
                            options={{ animation: "slide_from_left" }}
                          />
                        )}
                      </Stack.Group>

                      <Stack.Screen
                        name="Web Link"
                        component={LinkView}
                        options={({ route }) => ({
                          headerBackTitleVisible: false,
                          headerTintColor: "black",
                          title: route.params.title,
                        })}
                      />

                      <Stack.Group screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                          name="WorkoutTab"
                          component={WorkoutTabScreenStack}
                          options={{ animation: "slide_from_left" }}
                        />
                      </Stack.Group>


                    
                      <Stack.Group screenOptions={screenOptionsForStack}>
                        {/* <Stack.Screen
                 name="WorkoutPhase"
                 component={WorkoutTabScreenStackFromCalender}
                 options={{animation: 'slide_from_left'}}
               />
               <Stack.Screen
                 name="WorkoutHiitPhase"
                 component={WorkoutHiitTabScreenStackFromCalender}
                 options={{animation: 'slide_from_left'}}
               /> */}
                        <Stack.Screen
                          name="Push exercises"
                          component={ExercisePatternScreen}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="Excercise"
                          component={ExcerciseScreen}
                          options={({ navigation }) => ({
                            headerLeft: () => (
                              <TouchableOpacity
                                onPress={() => navigation.goBack()}
                              >
                                <CloseFoodIcon color={COLORS.grey_3} />
                              </TouchableOpacity>
                            ),
                          })}
                        />

                        <Stack.Screen
                          name="ExcerciseVideo"
                          component={ExcerciseVideo}
                          options={{ headerShown: false }}
                        />

                        <Stack.Screen
                          name="Membership"
                          component={MembershipScreen}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="Workout Hiit Title"
                          component={WorkouthiitScreen}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="Hiit Exercise"
                          component={HiitExerciseScreen}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="Hiit complete"
                          component={HiitComplete}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="Hiit complete 2"
                          component={HiitComplete2}
                          options={{ headerShown: false }}
                        />
                      </Stack.Group>
                      <Stack.Screen
                        name="Add Friends"
                        options={{
                          headerBackTitleVisible: false,
                          headerTintColor: "black",
                        }}
                        component={AddFriend}
                      />
                      <Stack.Group screenOptions={screenOptionsForModal}>
                        <Stack.Screen name="Filter" component={WorkoutFilter} />
                        <Stack.Screen
                          name="exerciseFilter"
                          options={{ headerTitle: "Filter" }}
                          component={ExerciseFilter}
                        />
                        <Stack.Screen name="filter" component={FoodFilter} />
                        <Stack.Screen name=" filter" component={MealFilter} />

                        <Stack.Screen
                          name="filter "
                          component={CommunityFilter}
                        />
                        {/* <Stack.Screen name="Chat with Coach" component={ChatData} /> */}
                        <Stack.Group
                          screenOptions={{
                            headerShown: false,
                          }}
                        >
                          <Stack.Screen
                            name="Chat with Coach"
                            component={ChatData}
                          />
                        </Stack.Group>
                        <Stack.Screen name="Comments" component={Comment} />
                      </Stack.Group>

                      <Stack.Group screenOptions={screenOptionsForStack}>
                        <Stack.Screen
                          name="ByContact"
                          component={FromContact}
                        />
                        <Stack.Screen
                          name="FriendList"
                          component={FriendList}
                        />
                        <Stack.Screen
                          name="FriendRequest"
                          component={FriendRequest}
                        />
                        <Stack.Screen
                          name="Workout tips"
                          component={WorkoutTipsScreen}
                        />

                        <Stack.Screen
                          name="Food tips"
                          component={FoodTipsScreen}
                        />
                        <Stack.Screen
                          name="https://play.google.com/store/apps/details?id=com.funavry.fitnessvworkexpo/:id"
                          component={SignIn}
                          options={{
                            animation: "slide_from_right",
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="Setting"
                          component={Setting}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />

                        <Stack.Screen
                          name="Category"
                          component={Category}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="ExerciseType"
                          component={ExerciseType}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="Sign"
                          component={Sign}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="Sign2"
                          component={Sign2}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="HardWork"
                          component={HardWork}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="TrackDataScreen"
                          component={TrackDataScreen}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="MilestonesTrackerScreen"
                          component={MilestonesTrackerScreen}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                      </Stack.Group>
                    </>
                    {/* ) : (
                      <>
                        <Stack.Screen
                          name="No Permission"
                          component={NoPermission}
                          options={{
                            animation: 'slide_from_right',
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="Membership"
                          component={MembershipScreen}
                        />
                      </>
                    )} */}
                  </>
                ) : (
                  <Stack.Screen
                    name="Internet Connection"
                    component={NoIternet}
                    options={{
                      headerShown: false,
                    }}
                  />
                )}
              </>
            ) : (
              <Stack.Screen
                name="Auth"
                component={AuthStackScreen}
                options={{ animation: "slide_from_right", headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}

      <FlashMessage position="top" />

      <ExpiredModal
        visible={showExpireModal}
        onClick={() => {
          setExpireModal(false);
          navigationRef.navigate("Membership", { fromExpireModal: true });
        }}
        isDowngrade={true}
        type={
          getProfileData?.userProfile.planName == "Free"
            ? "Free"
            : getProfileData?.planName
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  headerTitleTextStyle: {
    fontFamily: "Manrope-Regular",
    fontSize: 17,
    textTransform: "capitalize",
    color: COLORS.grey_1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default Routes;
