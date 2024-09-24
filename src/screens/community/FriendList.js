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

let FriendList = React.memo(function FriendList() {
  let mediaPath = setting.s3Url.url;
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState([]);
  const [searchText, setSearchText] = useState();
  const [loader, setLoader] = useState(false);
  const [accepted,setAccepted] = useState(false)
  const [confirmationPopupData, setConfirmationPopupData] = useState({});
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
        console.log('res caught neeraj====',res?.data?.responseData?.result);
        let userdata = res?.data?.responseData?.result?.filter(
          item => item?.status == 1,
        );
        setUser(userdata);
        setLoader(false);
      });
    } catch (e) {
      setLoader(false);
    }
  };

  const onSearch = async text => {
    let req = {
      friends: 1,
      search: text ? text.toLowerCase() : '',
    };
    await usersService.userList(req).then(res => {
      const newData = res?.data?.responseData?.result.filter(function (item) {
        const itemData = item.fname
          ? item.fname.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setUser(newData);
      setSearchText(text);
    });
  };

const onRemoveValidate = (item) =>{
  Alert.alert(
    'Remove from friend list',
    'Are you sure you want to remove this friend?',
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
  )
}

  async function onRemove(item) {
    const index = selectedUser.indexOf(item?._id);
    setSelectedUser(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
    let req = {
      friendId: item._id,
      status:4
    };
    let res = await usersService.addFriend(req);
    getUserList();
  }

  const onAccept = async(item) =>{
      setSelectedUser(prevState => prevState.concat(item?._id));
      let req={
        friendId:item._id,
        status:2
      }
      let res = await usersService.addFriend(req)
      setAccepted(true)
      onSearch()
     }

     const onReject =async(item)=>{
      setSelectedUser(prevState => prevState.concat(item?._id));
      let req={
        friendId:item._id,
        status:3
      }
      let res = await usersService.addFriend(req)
      onSearch()
      console.log("reject friend list",res);
     }
 
  return (
    <MainScreen>
      <View style={styles.headerContainer}>
        <View style={styles.textInputContainer}>
          <View style={{paddingHorizontal: 10}}>
            <SearchIcon />
          </View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Type full name of the user"
            onSubmitEditing={onSearch}
            returnKeyType={'search'}
            onChangeText={text => onSearch(text)}
          />
        </View>
      </View>
      {loader ? <Loader loading={true} /> : null}
      {!loader && (user?.length === 0 || user == undefined) ? (
        <Text
          style={{
            color: COLORS.grey_4,
            fontFamily: 'Manrope',
            fontSize: 16,
            padding: 10,
          }}>
          No user found for your search.
        </Text>
      ) : null}
      {/* Contacts details */}

      <FlatList
        data={user}
        renderItem={({item}) => (
          <View styler={styles.profile}>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
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
                  <Text style={styles.dateView}>{`${moment().diff(moment(item?.age,'DD-MM-YYYY'),"years")} y.o.`}</Text>
                </View>
              </View>
             
              <TouchableOpacity
                onPress={() => {
                  // setConfirmationPopupData({
                  //   title: 'Remove friend',
                  //   content: `Do you want to remove "${item?.fname + ' ' + item.lname}" from your friend list?`,
                  //   onConfirmation: () => onRemoveValidate(item)
                  // })
                  onRemoveValidate(item)
                }}
                style={[
                  styles.gradientStyle,
                  {padding: 0, overflow: 'hidden', height: 32, },
                ]}>
                <GradientContainer style={[styles.gradientStyle]}>
                  <Text style={[styles.titleTextStyle]}>Remove</Text>
                </GradientContainer>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
        {/* <AlertModal 
          alert={confirmationPopupData?.title? true: false} 
          onResume={() =>confirmationPopupData?.onConfirmation()} 
          headertitle={confirmationPopupData?.title} 
          content={confirmationPopupData?.content}
          cancel={()=>setConfirmationPopupData({ })} 
          cancelBtn="Cancel" 
          saveBtn={confirmationPopupData?.type} 
          width={100} 
          opacity={''}
        /> */}
    </MainScreen>
  );
})
export default FriendList;

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
    backgroundColor: 'red'
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
    width:150
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
    marginLeft:2
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});
