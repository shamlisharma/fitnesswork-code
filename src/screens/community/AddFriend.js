import {useNavigation} from '@react-navigation/native';
import React, { useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Linking, TouchableWithoutFeedback, Platform} from 'react-native';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {
  AddContactIcon,
  CommunityEyeIcon,
  GradientUserIcon,
  PassEyeIcon,
  RightArrowIcon,
  ShareIcon,
  WhatsappIcon,
} from '../../Svg';
import Share, {Social} from 'react-native-share';
import { useSelector } from 'react-redux';
import dynamicLinks,{firebase} from '@react-native-firebase/dynamic-links';
import AlertModal from '../modal/AlertModal';


let AddFriend = React.memo(function AddFriend() {
  const navigation = useNavigation();
  const [membershipModel, setMembershipModel] = useState(false);
  const getProfileData = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );
  const userProfile = useSelector(
    state =>{
      return state?.profileReducer?.profile?.data?.responseData?.userProfile 
    }
  );

  const generateLink = async () =>{
    try{
      var link = await dynamicLinks().buildShortLink({
        link: `https://fitnessvworkout.page.link/JSMb?id=${userProfile?.userName}`,
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://fitnessvworkout.page.link',
        android:{
          packageName:'com.funavry.fitnessvworkexpo',
          minimumVersion:'18'
        },
        ios:{
          appStoreId:'123456789',
          bundleId:"com.funavry.fitnessvworkexpo",
          minimumVersion:'18'
        }
      },
      dynamicLinks.ShortLinkType.DEFAULT
      );
      return link
    }catch(error){
console.log("error",error);
    }
  }

  const onWhatsapp = async() =>{
    
    const getLink = await generateLink()
try {
//    Linking.canOpenURL(`whatsapp://app`).then(supported => {
 
//  if (true) {
//       Linking.openURL(`whatsapp://send?text=I am on the Fitnessvwork app. Install the app to work out with me. It's a great fitness app. ${getLink}`);
//     } else {
     
//       if(Platform.OS == 'android') {
//         Linking.openURL('https://play.google.com/store/apps/details?id=com.whatsapp');
//       }
//       else {
//         Linking.openURL('https://apps.apple.com/in/app/whatsapp-messenger/id310633997')
//       }
//     }
//   });
  Linking.openURL(`whatsapp://send?text=I am on the Fitnessvwork app. Install the app to work out with me. It's a great fitness app. ${getLink}`);
  
} catch (error) {
  
  console.log("error",error);
}
   
  }
  
  const socialShare = async () => {
    const getLink = await generateLink()
    const shareOption = {
      message:"I am on the Fitnessvwork app. Install the app to work out with me. It's a great fitness app.",
      url: getLink
    };
    try {
      const ShareResponse = await Share.open(shareOption);

    } catch (e) {
      console.log('Error =>', e);
    }
  };

  return (
    <MainScreen>
      <View style={{padding: 10}}>
        <TouchableOpacity
          style={styles.componentContainerStyle}
          onPress={() => navigation.navigate('Add friends by full name')}>
          <View style={styles.componentStyle}>
            <GradientUserIcon />
            <Text style={styles.componentTextStyle}>Add by full name</Text>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentContainerStyle}
          onPress={() =>
            navigation.navigate('ByContact', {
              title: 'Add friends from contacts',
            })
          }>
          <View style={styles.componentStyle}>
            <AddContactIcon />
            <Text style={styles.componentTextStyle}>Add from Contacts</Text>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentContainerStyle}
          onPress={() =>
            navigation.navigate('FriendList', {title: 'Friend List'})
          }>
          <View style={styles.componentStyle}>
            <View style={{marginTop:2}}>
            <CommunityEyeIcon 
              color={COLORS.lightGreen}
              size={"25"}  
            />
            </View>
            <Text style={styles.componentTextStyle}>Friend List</Text>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentContainerStyle}
          onPress={() =>
            navigation.navigate('FriendRequest', {title: 'Friend'})
          }>
          <View style={styles.componentStyle}>
          <GradientUserIcon />
            <Text style={styles.componentTextStyle}>Friend Request</Text>
          </View>
          <RightArrowIcon />
        </TouchableOpacity>
        <View style={styles.invite}>
          <Text style={styles.inviteText}>Invite more friends</Text>
        </View>
        <View style={styles.social}>
          <TouchableOpacity
            onPress={() =>onWhatsapp()}>
            <WhatsappIcon />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={()=>{
            Linking.openURL(`instagram://send?text=${message}`);
          }}>
          <InstaIcon />
          </TouchableOpacity> */}
          {/* <FbIcon /> */}
          <TouchableOpacity onPress={() => socialShare()}>
            <ShareIcon />
          </TouchableOpacity>
        </View>
      </View>
      {
        getProfileData?.planName == 'Free'&&
      <TouchableWithoutFeedback 
        activeOpacity={0.3}
        onPress={() => setMembershipModel(true)}
        style={{
          flex: 1
        }}
      >
        <View 
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: COLORS.white,
            opacity: 0.7
          }}
        />
        </TouchableWithoutFeedback>
      }
       {
        membershipModel&&
      <AlertModal
        alert={membershipModel}
        onResume={() => { 
          navigation.navigate('Membership')
          setMembershipModel(false);
        }}
        headertitle={'Upgrade Plan'}
        content={'To access friend list feature, please upgrade your account'}
        cancel={() => setMembershipModel(false)}
        cancelBtn={'Cancel'}
        saveBtn={'Ok'}
        width={100}
        opacity={''}
      />
}
    </MainScreen>
  );
})
export default AddFriend;

const styles = StyleSheet.create({
  componentContainerStyle: {
    backgroundColor: COLORS.light_grey,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  componentStyle: {
    flexDirection: 'row',
  },
  componentTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.grey_2,
  },
  invite: {
    paddingVertical: 20,
  },
  inviteText: {
    fontFamily: 'Manrope-Semibold',
    fontSize: 16,
    color: COLORS.grey_2,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // paddingHorizontal: 10,
  },
});
