import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {COLORS} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import GradientContainer from '../../components/GradientContainer';
import {usersService} from '../../services/ApiServices';
import {SearchIcon} from '../../Svg';
import setting from '../../config/settings';
import {Loader} from '../../common/Loader';
import moment from 'moment';
import {scale} from 'react-native-size-matters';
import AlertModal from '../modal/AlertModal';

let FriendRequest = React.memo(function FriendRequest(props) {
  let mediaPath = setting.s3Url.url;
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState([]);
  const [friendReq, setFriendReq] = useState([]);
  const [searchText, setSearchText] = useState();
  const [loader, setLoader] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [confirmationPopupData, setConfirmationPopupData] = useState({});
  const [resultPopup, setResultPopup] = useState({ content: '' });

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    let req = {
      friends: 1,
    };
    try {
      setLoader(true);
      await usersService.userList(req).then(res => {
        console.log('res neeraj===',res?.data?.responseData?.result)
        let userData = res?.data?.responseData?.result
        ?.filter(
          item => item?.status == 3,
        );
        setUser(res?.data?.responseData?.result);
        setFriendReq(userData);
        setLoader(false);
      });
    } catch (e) {
      setLoader(false);
    }
  };
  useEffect(() => {
    // onSearch();
  }, []);
  const onSearch = async text => {
    let req = {
      friends: 1,
      search: text ? text.toLowerCase() : '',
    };
    await usersService.userList(req).then(res => {
      const newData = res?.data?.responseData?.result.filter(function (item) {
        const itemData = item.fname
          ? item?.fname?.toUpperCase()
          : ''?.toUpperCase();
        const textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setUser(newData);
      setSearchText(text);
    });
  };

  const onRemoveValidate = item => {
    Alert.alert(
      'Remove from friend list',
      'Are you sure you want to remove?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => onRemove(item)},
      ],
      {
        cancelable: false,
      },
    );
  };

  async function onRemove(item) {
    const index = selectedUser.indexOf(item?._id);
    setSelectedUser(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
    let req = {
      friendId: item._id,
      status: 4,
    };
    let res = await usersService.addFriend(req);
    getUserList();
  }

  const onAccept = async item => {
    setConfirmationPopupData({})
    setSelectedUser(prevState => prevState.concat(item?._id));
    let req = {
      friendId: item._id,
      status: 2,
    };
    let res = await usersService.addFriend(req);
    getUserList();

    // onSearch();
    
    setTimeout(() => {
      setResultPopup({
        content: 'Friend requests accepted successfully'
      });
    }, 1500);
      
  };

  const onReject = async item => {
    setConfirmationPopupData({});
    setSelectedUser(prevState => prevState.concat(item?._id));
    let req = {
      friendId: item._id,
      status: 3,
    };
    let res = await usersService.addFriend(req);
    getUserList();
    // onSearch();
    setTimeout(() => {
      setResultPopup({content: 'Friend requests rejected successfully'});
    }, 1500);
  };
  console.log('result popup=====',resultPopup);
  return (
    <MainScreen>
      {loader ? <Loader loading={true} /> : null}

      {/* Contacts details */}
      {friendReq?.length == 0 ? (
        <View
          style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
          <Text style={{fontFamily: 'Manrope-Semibold', color: COLORS.grey_4}}>
            There are no friend request
          </Text>
        </View>
      ) : null}
      <View  style={{ marginBottom: 15 }}/>
      <FlatList
        data={user}
        renderItem={({item}) => (
          <View
          // style={styles.profile}
          >
            {item?.status == 3 ? (
              <View
                style={{
                  marginBottom: 15,
                  marginHorizontal: 15,
                  backgroundColor: COLORS.white,
                  borderWidth: 0.6,
                  paddingBottom: scale(10),
                  paddingHorizontal: scale(10),
                  paddingTop: scale(5),
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  // backgroundColor: 'red'
                  // flexDirection: 'row',
                  // justifyContent: 'space-evenly',
                  // alignItems: 'center',
                }}>
                <View style={styles.profileView}>
                  <View
                    style={{
                      borderRadius: 50,
                    }}>
                    <Image
                      source={
                        item?.profileImage
                          ? {uri: mediaPath + item?.profileImage}
                          : require('../../../assets/Avatar.png')
                      }
                      style={{
                        width: 61,
                        height: 61,
                        borderWidth: 2.5,
                        borderRadius: 50,
                        borderColor: COLORS.lightBlue,
                      }}
                    />
                  </View>
                  <View style={{padding: 8, marginHorizontal: 10}}>
                    <Text style={styles.paragraph}>
                      {item?.fname + ' ' + item.lname}
                    </Text>
                    <Text style={styles.dateView}>{`${moment().diff(
                      moment(item?.age, 'DD-MM-YYYY'),
                      'years',
                    )} y.o.`}</Text>
                  </View>
                </View>
                {item?.status == 3? (
                  accepted ? (
                    <TouchableOpacity
                      onPress={() => onRemoveValidate(item)}
                      >
                      <GradientContainer
                      style={[
                        styles.gradientStyle,
                        {padding: 0, overflow: 'hidden', height: scale(43),},
                      ]}
                      // style={[styles.gradientStyle]}
                      
                      >
                        <Text style={[styles.titleTextStyle]}>Remove</Text>
                      </GradientContainer>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flexDirection: 'row',alignItems: 'center', flex: 1 }}>
                          <TouchableOpacity 
                       onPress={() => {
                        setConfirmationPopupData({
                          title: 'Reject Request',
                          type: 'Reject',
                          content: `Do you want to reject "${item?.fname+ ' ' +item.lname}" request?`,
                          onConfirmation: () => onReject(item)            
                        });
                      
                      }}
                      style={{ flex: 0.8, marginRight: 3 }}
                      // onPress={() => onReject(item)}
                      
                      >
                        <GradientContainer
                          style={[
                            styles.gradientStyle,
                            {
                              padding: 0,
                              overflow: 'hidden',
                              // marginTop: 5,
                              height: scale(35),

                            },
                          ]}
                          // style={[styles.gradientStyle]}
                        >
                          <Text style={[styles.titleTextStyle]}>Reject</Text>
                        </GradientContainer>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          onAccept(item)
                        }}
                        style={{ flex: 0.8 }}
                        // style={[
                        //   styles.gradientStyle,
                        //   {padding: 0, overflow: 'hidden', height: scale(62), backgroundColor: 'yellow' },
                        // ]}
                      >
                        <GradientContainer
                          style={[
                            styles.gradientStyle,
                            {padding: 0, overflow: 'hidden', height: scale(35),}
                            
                          ]}
                          // style={[styles.gradientStyle]}
                        >
                          <Text style={[styles.titleTextStyle]}>Accept</Text>
                        </GradientContainer>
                      </TouchableOpacity>
                  
                    </View>
                  )
                ) : null}
              </View>
            ) : null}
          </View>
        )}
      />
      {
        confirmationPopupData?.title?
       <AlertModal 
        alert={confirmationPopupData?.title? true: false} 
        onResume={() =>confirmationPopupData?.onConfirmation()} 
        headertitle={confirmationPopupData?.title} 
        content={confirmationPopupData?.content}
        cancel={()=>setConfirmationPopupData({ })} 
        cancelBtn="Cancel" 
        saveBtn={confirmationPopupData?.type} 
        width={100} 
        opacity={''}
      />: <View />
}
{
  (resultPopup?.content)?
       <AlertModal 
        alert={resultPopup?.content? true: false} 
        onResume={() => props.navigation.goBack()} 
        headertitle={'Friend Request'} 
        content={resultPopup?.content}
        cancelBtn="" 
        saveBtn={'Ok'} 
        width={100} 
        opacity={''}
      />: <View />}
    </MainScreen>
  );
});
export default FriendRequest;

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 12,
  },
  profile: {
    flexDirection: 'row',
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 5,
    borderColor: COLORS.grey_5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    paddingVertical: 12,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },
  profileView: {
    marginTop: 5,
    flexDirection: 'row',
    marginBottom: scale(10),
  },
  feedImage: {
    height: 207,
    width: '100%',
  },
  linkOnImage: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 10,
    marginLeft: 10,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Manrope-Semibold',
    lineHeight: 20,
    color: COLORS.grey_2,
    width: 150,
  },
  dateView: {
    fontSize: 14,
    color: COLORS.grey_4,
    fontFamily: 'Manrope',
    paddingTop: 5,
  },
  gradientStyle: {
    padding: 8,
    borderRadius: 30,
    marginLeft: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: 'white',
    fontSize: scale(15),
    textAlign: 'center',
  },
});
