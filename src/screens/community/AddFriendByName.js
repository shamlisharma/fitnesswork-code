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
import GradientButton from '../../components/GradientButton';
import GradientContainer from '../../components/GradientContainer';
import {usersService} from '../../services/ApiServices';
import {SearchIcon} from '../../Svg';
import setting from '../../config/settings';
import InlineError from '../../common/InlineError';
import moment from 'moment';
import AlertModal from '../modal/AlertModal';
import {ScrollView} from 'react-native';

let AddFriendByName = React.memo(function AddFriendByName() {
  const [addFriend, setAddFriend] = useState(false);
  let mediaPath = setting.s3Url.url;
  const [disable, setDisable] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState([]);
  const [searchText, setSearchText] = useState();
  const [onRemoveFriend, setOnRemoveFriend] = useState(false);
  const [friendStatus, setFriendStatus] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchText?.length <= 0) {
      setUser([]);
      setAddFriend(false);
    }
    if (searchText?.length > 0) {
      setError('');
    }
  }, [searchText]);

  const onSearch = async () => {
    if (searchText?.length > 0) {
      setError('');
      let req = {
        friends: 0,
        search: searchText ? searchText.toLowerCase() : '',
      };
      await usersService.userList(req).then(res => {
        console.log('search result coming====', res);
        setUser(res?.data?.responseData?.result);
        setDisable(true);
      });

      setAddFriend(true);
    } else {
      setError('Please enter the name of user');
    }
  };

  async function onAdd(item) {
    setSelectedUser(prevState => prevState.concat(item?._id));
    let req = {
      friendId: item._id,
      status: 1,
    };
    let res = await usersService.addFriend(req);
    console.log({res});
    onSearch();
  }

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
    setOnRemoveFriend(false);
    onSearch();
  }

  const onRemoveValidate = item => {
    // setOnRemoveFriend(true)
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
    );
  };
  // const onOkay=(item)=>{
  //   onRemove(item)
  // }
  console.log('user coming neeraj---,', user);
  return (
    <MainScreen>
      <AlertModal
        alert={onRemoveFriend}
        onResume={() => onOkay()}
        headertitle="Remove from friend list"
        content={'Are you sure you want to remove this friend'}
        cancel={() => setOnRemoveFriend(false)}
        cancelBtn="Cancel"
        saveBtn="Yes"
        width={100}
        opacity={'#000000cf'}
      />
      {/* <ScrollView> */}
        <View style={{paddingHorizontal: 10, paddingTop: 10}}>
          <Text
            style={{
              fontFamily: 'Manrope',
              color: COLORS.lightGreen,
              fontSize: 15,
              textAlign: 'auto',
            }}>
            Find friends already using the app, by typing their name
          </Text>
        </View>
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
              onChangeText={text => setSearchText(text)}
            />
          </View>
        </View>
        <InlineError style={styles.inlineErrorStyle} errorMessage={error} />
        
        {addFriend && (user?.length === 0 || user == undefined) ? (
          <Text
            style={{
              color: COLORS.grey_4,
              fontFamily: 'Manrope',
              fontSize: 16,
              padding: 10,
            }}>
            No user found.
          </Text>
        ) : null}
        <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
          <GradientButton title="Search" onPress={() => onSearch()} />
        </View>
        {/* </ScrollView> */}
        {/* Contacts details */}
        {addFriend ? (
          <FlatList
            data={user}
            renderItem={({item}) => (
              <View styler={styles.profile}>
                <View
                  style={{
                    padding: 15,
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
                      <Text style={styles.dateView}>{`${moment().diff(
                        moment(item?.age, 'DD-MM-YYYY'),
                        'years',
                      )} y.o.`}</Text>
                    </View>
                  </View>
                  {
                    // selectedUser.indexOf(item?._id) >=
                    //     0 || item?.isFriend == 1
                    item?.status ? (
                      <TouchableOpacity
                        onPress={() => onRemoveValidate(item)}
                        style={[
                          styles.gradientStyle,
                          {
                            padding: 0,
                            overflow: 'hidden',
                            height: 48,
                            width: 97,
                          },
                        ]}>
                        <GradientContainer style={[styles.gradientStyle]}>
                          <Text style={[styles.titleTextStyle]}>
                            {item?.status == 2
                              ? 'Requested'
                              : item?.status == 1
                              ? 'Remove'
                              : 'Requested'}
                          </Text>
                        </GradientContainer>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => onAdd(item)}
                        style={[
                          styles.gradientStyle,
                          {
                            padding: 0,
                            overflow: 'hidden',
                            height: 48,
                            width: 97,
                          },
                        ]}>
                        <GradientContainer style={[styles.gradientStyle]}>
                          <Text style={[styles.titleTextStyle]}>
                            {item?.status == 2 ? 'Requested' : 'Add'}
                          </Text>
                        </GradientContainer>
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>
            )}
          />
        ) : null}
  
    </MainScreen>
  );
});
export default AddFriendByName;

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
    justifyContent: 'space-evenly',
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
    padding: 10,
    borderRadius: 30,
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  inlineErrorStyle: {
    paddingHorizontal: 10,
  },
});
