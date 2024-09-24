import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../common/Constant';
import setting from '../../config/settings';
import {usersService} from '../../services/ApiServices';
import {CommentIcon, LikeIcon, LinkIcon} from '../../Svg';
import {getCommentAction, getFeedByUser} from '../../_action/CommunityAction';

let FeedTab = React.memo(function FeedTab(props) {
  const {feedData} = props;
  const getComment = useSelector(state => state?.community);
  const userProfile = useSelector(
    state => state?.profileReducer?.profile?.data?.responseData?.userProfile,
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  let mediaPath = setting.s3Url.url;
  var like;
  function onSetLike() {
    if (feedData?.like?.length > 0) {
      if (feedData?.like?.includes(userProfile?._id)) {
        like = 0;
      } else {
        like = 1;
      }
    } else {
      like = 1;
    }
  }

  const onMembershipChange = () => {
    Alert.alert(
      'Alert',
      'To access to this feature, please upgrade your membership plan to premuim.',
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

  const renderFeedContent = () => {
    let descp = feedData?.description;

    if (descp?.toLowerCase()?.includes('completed')) {
      descp = descp.replace('Completed ', '');
    }
    return (
      <Text
        style={{
          fontSize: 15,
          fontFamily: 'Manrope-Regular',
          paddingTop: 10,
          color: COLORS.grey_2,
        }}>
        {feedData?.fname?.charAt(0)?.toUpperCase() + feedData?.fname?.slice(1)}{' '}
        completed{' '}
        <Text style={{fontFamily: 'Manrope-Bold', color: COLORS.black}}>
          {descp}
        </Text>
      </Text>
    );
  };

  const onAddLike = async () => {
    onSetLike();
    let req = {
      postId: feedData?._id,
      like: like,
    };
    let res = await usersService.addLike(req);
    dispatch(getFeedByUser());
  };

  const onComment = item => {
    let req = {
      postId: item._id,
    };
    dispatch(getCommentAction(req));
    navigation.navigate('Comments', {commentData: item});
  };

  const renderPosts = () => {
    return (
      <>
        {feedData?.isAdmin == 1 ? (
          <>
            <View style={styles.tipsPara}>
              <View style={styles.tipsParaView}>
                <Text style={styles.paragraph}>
                  {feedData?.heading || feedData?.metaData?.title}
                </Text>
                <Text style={styles.dateView}>
                  {moment(feedData?.created).format('ll') + ' '}{' '}
                  {moment(feedData?.created).format('LT')}
                </Text>
                <Text style={styles.points}>
                  {feedData?.description || feedData?.metaData?.description}
                </Text>
              </View>
            </View>
            {feedData?.image == null &&
            (feedData?.metaData?.image == null ||
              feedData?.metaData?.image == '') ? (
              <>
                {feedData?.link == null || feedData?.link == '' ? null : (
                  // <View
                  //   style={{
                  //     flexDirection: 'row',
                  //     alignItems: 'center',
                  //     paddingBottom: 10,
                  //     backgroundColor: COLORS.light_grey,
                  //   }}>
                  //   {/* <LinkIcon /> */}
                  //   {/* <Text
                  //     style={[
                  //       styles.linkText,
                  //       {
                  //         color:
                  //           feedData?.image == null &&
                  //           (feedData.metaData.image == null ||
                  //             feedData?.metaData?.image == '')
                  //             ? COLORS.black
                  //             : COLORS.white,
                  //       },
                  //     ]}> */}
                  //   {/* Read more{' '} */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingBottom: 10,
                      backgroundColor: COLORS.light_grey,
                    }}
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('Web Link', {
                        url: feedData?.link,
                        title: feedData?.heading,
                      })
                    }>
                    <LinkIcon />
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        color:
                          feedData?.image == null ? COLORS.black : COLORS.white,
                        paddingHorizontal: 6,
                      }}>
                      {'Read more'}
                    </Text>
                  </TouchableOpacity>
                  //   {/* </Text>
                  // </View> */}
                )}
              </>
            ) : (
              <View style={styles.communityImageView}>
                <View style={styles.overlay} />

                <ImageBackground
                  resizeMode="cover"
                  source={{
                    uri:
                      feedData?.image == null || feedData?.image == ''
                        ? feedData?.metaData?.image
                        : mediaPath + feedData?.image,
                  }}
                  style={styles.feedImage}>
                  {feedData?.link == null || feedData?.link == '' ? null : (
                    // // <View style={styles.linkOnImage}>
                    //   {/* <Text
                    //     style={[
                    //       styles.linkText,
                    //       {
                    //         color:
                    //           feedData.image == null &&
                    //           (feedData.metaData.image == null ||
                    //             feedData?.metaData?.image == '')
                    //             ? COLORS.black
                    //             : COLORS.white,
                    //       },
                    //     ]}> */}
                    //   // {/* Read more{' '} */}
                    <TouchableOpacity
                      style={styles.linkOnImage}
                      activeOpacity={0.9}
                      onPress={() =>
                        navigation.navigate('Web Link', {
                          url: feedData?.link,
                          title: feedData?.heading,
                        })
                      }>
                      <LinkIcon />
                      <Text
                        style={{
                          // textDecorationLine: 'underline',
                          color:
                            feedData.image == null &&
                            (feedData.metaData.image == null ||
                              feedData?.metaData?.image == '')
                              ? COLORS.black
                              : COLORS.white,
                          paddingHorizontal: 6,
                        }}>
                        {'Read more'}
                      </Text>
                    </TouchableOpacity>
                    //   {/* </Text> */}
                    // // </View>
                  )}
                </ImageBackground>
              </View>
            )}
          </>
        ) : null}

        {feedData?.isAdmin === 0 ? (
          // && userProfile?.planName != 'Free'
          <View
            styler={[
              styles.profile,
              {
                opacity:
                  userProfile?.planName == 'Free' &&
                  feedData.userId === userProfile._id
                    ? 1
                    : userProfile?.planName == 'Free' &&
                      feedData.userId != userProfile._id
                    ? 0.3
                    : 1,
              },
            ]}>
            <View
              style={{
                backgroundColor: COLORS.light_grey,
                padding: 15,
                marginTop: 10,
                opacity:
                  userProfile?.planName == 'Free' &&
                  feedData.userId === userProfile._id
                    ? 1
                    : userProfile?.planName == 'Free' &&
                      feedData.userId != userProfile._id
                    ? 0.3
                    : 1,
              }}>
              <View style={styles.profileView}>
                <View
                  style={{
                    borderRadius: 50,
                  }}>
                  <Image
                    source={
                      feedData?.image || feedData?.profileImage !== null
                        ? {uri: mediaPath + feedData?.profileImage}
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
                    {feedData?.fname + ' ' + feedData?.lname}
                  </Text>
                  <Text style={styles.dateView}>
                    {' '}
                    {moment(feedData?.created).format('ll') + ' '}{' '}
                    {moment(feedData?.created).format('LT')}
                  </Text>
                </View>
              </View>
              {renderFeedContent()}
            </View>
          </View>
        ) : null}
        {feedData?.isAdmin === 0 ? (
          // && userProfile?.planName != 'Free'
          <View
            style={[
              styles.likeCommentTab,
              {
                opacity:
                  userProfile?.planName == 'Free' &&
                  feedData.userId === userProfile._id
                    ? 1
                    : userProfile?.planName == 'Free' &&
                      feedData.userId != userProfile._id
                    ? 0.3
                    : 1,
              },
            ]}>
            <TouchableOpacity
              style={styles.iconLikeFlex}
              onPress={() =>
                (userProfile?.planName == 'Free') &&
                feedData.userId === userProfile._id
                  ? onAddLike()
                  : (userProfile?.planName == 'Free' ) &&
                    feedData.userId != userProfile._id
                  ? onMembershipChange()
                  : onAddLike()
              }>
              <LikeIcon
                color={
                  feedData?.like?.includes(userProfile?._id) ? COLORS.blue : ''
                }
              />
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontFamily: 'Manrope-Regular',
                  fontSize: 14,
                  color: COLORS.grey_4,
                }}>
                {feedData?.like?.length || 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconCommentFlex}
              onPress={() =>
               ( userProfile?.planName == 'Free' ) &&
                feedData.userId === userProfile._id
                  ? onComment(feedData)
                  : (userProfile?.planName == 'Free' ) &&
                    feedData.userId != userProfile._id
                  ? onMembershipChange()
                  : onComment(feedData)
              }>
              <View style={{paddingTop: 5}}>
                <CommentIcon />
              </View>
              <Text
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontFamily: 'Manrope-Regular',
                  fontSize: 14,
                  color: COLORS.grey_4,
                }}>
                {feedData?.commentCount}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </>
    );
  };

  return <View style={[styles.communityContainer]}>{renderPosts()}</View>;
});

const styles = StyleSheet.create({
  communityContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },

  tipsParaView: {
    backgroundColor: COLORS.light_grey,
    padding: 15,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    lineHeight: 20,
    color: COLORS.black,
  },
  dateView: {
    fontSize: 14,
    color: COLORS.grey_4,
    fontFamily: 'Manrope',
    paddingTop: 5,
  },
  points: {
    fontSize: 15,
    fontFamily: 'Manrope',
    color: COLORS.grey_2,
    fontWeight: '400',
    paddingTop: 5,
  },
  communityImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // marginBottom: 10,
    // marginLeft: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 50,
  },
  linkText: {
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    paddingLeft: 5,
    maxWidth: '75%',
  },
  likeCommentTab: {
    marginVertical: 5,
    flexDirection: 'row',
    //   justifyContent:"space-around",
    //   alignItems:"center"
  },
  iconLikeFlex: {
    backgroundColor: COLORS.light_grey,
    borderEndWidth: 4,
    borderEndColor: COLORS.white,
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconCommentFlex: {
    backgroundColor: COLORS.light_grey,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default FeedTab;
