import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {MainScreen} from '../../common/Screen';
import {EmptyMinusIcon, EmptyPlusIcon, SearchIcon} from '../../Svg';
import Contacts from 'react-native-contacts';
import {AppButton, COLORS} from '../../common/Constant';
import {FlatList} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import dynamicLinks, {firebase} from '@react-native-firebase/dynamic-links';
import { scale } from 'react-native-size-matters';

let FromContact = React.memo(function FromContact() {
  const [contact, setContact] = useState();
  const [selectedContact, setSelectedContact] = useState([]);
  const message = 'Cheers on signing up with us!';
  // const url = `https://play.google.com/store/apps/details?id=com.funavry.fitnessvworkexpo/`
  const userProfile = useSelector(state => {
    return state?.profileReducer?.profile?.data?.responseData?.userProfile;
  });

  const generateLink = async () => {
    try {
      var link = await dynamicLinks().buildShortLink(
        {
          link: `https://fitnessvworkout.page.link/JSMb?id=${userProfile?.userName}`,
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: 'https://fitnessvworkout.page.link',
          android: {
            packageName: 'com.funavry.fitnessvworkexpo',
            minimumVersion: '18',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'com.funavry.fitnessvworkexpo',
            minimumVersion: '18',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      return link;
    } catch (error) {
      console.log('error', error);
    }
  };

  const shareUser = async () => {
    const getLink = await generateLink();

    if (Platform.OS === 'ios') {
      {
        Linking.openURL(
          `sms:/open?addresses=${selectedContact}${getSMSDivider()}body=I am on the Fitnessvwork app. Install the app to work out with me. It's a great fitness app. ${getLink}`,
        );
      }
    } else {
      {
        Linking.openURL(
          `sms:${selectedContact}${getSMSDivider()}body=I am on the Fitnessvwork app. Install the app to work out with me. It's a great fitness app. ${getLink}`,
        );
      }
    }
  };

  const url = `https://fitnessvworkout.page.link/`;
  useEffect(() => {
    try {
      Contacts.checkPermission().then(permission => {
        if (permission === 'undefined') {
          Contacts.requestPermission().then(permission => {});
        }
        if (permission === 'authorized') {
         
          Contacts.getAll()
            .then(contacts => {
              console.log("contacts", contacts)
              contacts.sort((a, b) => a.givenName.localeCompare(b.givenName));
              setContact(contacts);
            })
            .catch(e => {
              console.log(e);
            });
        }
        if (permission === 'undefined' || permission == 'denied') {
          if (Platform.OS == 'android') {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                buttonPositive: 'Please accept bare mortal',
              },
            ).then((res) => {

              
              if(res == "granted"){
                Contacts.getAll()
                .then(contacts => {
                  contacts.sort((a, b) =>
                    a.givenName.localeCompare(b.givenName),
                  );
                  setContact(contacts);
                })
                .catch(e => {
                  console.log(e);
                });
              }
             
            });
          } else {
            Contacts.requestPermission().then(permission => {
              if (permission == 'authorized') {
                Contacts.getAll()
                  .then(contacts => {
                    contacts.sort((a, b) =>
                      a.givenName.localeCompare(b.givenName),
                    );
                    setContact(contacts);
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            });
          }
        }
      });
    } catch (error) {
      console.warn('2nd catch', error);
    }
  }, []);

  function loadContacts() {
    Contacts.getAll()
      .then(contacts => {
        setContact(contacts);
      })
      .catch(e => {
        console.log(e);
      });

    Contacts.checkPermission();
  }

  function onSearch(text) {
    const phoneNumberRegex =
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    const emailAddressRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        setContact(contacts);
      });
    } else if (emailAddressRegex.test(text)) {
      Contacts.getContactsByEmailAddress(text).then(contacts => {
        setContact(contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text.toLowerCase()).then(contacts => {
        setContact(contacts);
      });
    }
  }

  function onAddContact(item) {
    setSelectedContact(prevState => prevState.concat(item?.number));
  }

  const onRemoveContact = item => {
    const index = selectedContact.indexOf(item?.number);
    setSelectedContact(prevState =>
      prevState.slice(0, index).concat(prevState.slice(index + 1)),
    );
  };
  function getSMSDivider() {
    return Platform.OS === 'ios' ? '&' : '?';
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
            placeholder="Search"
            onChangeText={text => onSearch(text)}
          />
        </View>
      </View>
      <View style={{flex:1}}>
         <FlatList
         showsVerticalScrollIndicator={false}
        data={contact}
        extraData={contact}
        ListFooterComponent={() => {
         return  <View 
            style={{
              height: scale(100),
            }}
         />
        }}
        renderItem={item => (
          <>
            {item?.item?.phoneNumbers[0]?.number == null ? null : (
              <View styler={styles.profile}>
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    paddingBottom: 20,
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
                          item?.item?.thumbnailPath
                            ? {uri: item?.item?.thumbnailPath}
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
                        {item?.item?.givenName}
                      </Text>
                      <Text style={styles.paragraph}>
                        {item?.item?.phoneNumbers[0]?.number}
                      </Text>
                    </View>
                  </View>

                  {selectedContact.indexOf(
                    item?.item?.phoneNumbers[0]?.number,
                  ) >= 0 ? (
                    <TouchableOpacity
                      onPress={() =>
                        onRemoveContact(item?.item?.phoneNumbers[0])
                      }>
                      <EmptyMinusIcon />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onAddContact(item?.item?.phoneNumbers[0])}>
                      <EmptyPlusIcon />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      />
      </View>
     
      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          alignSelf: 'center',
          //  marginBottom: 10,
        }}>
        {Platform.OS === 'ios' ? (
          <AppButton title="Invite by sms" onPress={() => shareUser()} />
        ) : (
          <AppButton title="Invite by sms" onPress={() => shareUser()} />
        )}
      </View>
    </MainScreen>
  );
});
export default FromContact;
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
    paddingBottom: 20,
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
  },
  dateView: {
    fontSize: 14,
    color: COLORS.grey_4,
    fontFamily: 'Manrope',
    paddingTop: 5,
  },
  gradientStyle: {
    padding: 15,
    borderRadius: 30,
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
