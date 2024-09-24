import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {COLORS, DeviceScreen} from '../../common/Constant';
import {MainScreen} from '../../common/Screen';
import {SendIcon, SendIconDisable} from '../../Svg';
import setting from '../../config/settings';
import moment from 'moment';
import GetComment from './GetComment';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {
  addCommentAction,
  getCommentAction,
  getFeedByUser,
} from '../../_action/CommunityAction';
import {usersService} from '../../services/ApiServices';
import {isEmpty} from 'lodash';

let Comment = React.memo(function Comment(props) {
  const dispatch = useDispatch();
  let feedComment = props.route.params.commentData;
  const getComment = useSelector(state => state?.community.getCommentData);
  let mediaPath = setting.s3Url.url;
  const [comment, setComments] = useState();
  const [count, setCounts] = useState(feedComment?.commentCount || 0);

  const onCommentSend = () => {
    if (comment == '') {
    } else {
      let date = new Date();
      let req = {
        created: moment(date).utc(),
        postId: feedComment._id,
        comment: comment,
        commentCount: count + 1,
      };
      usersService.addComment(req).then(res => {
        if (res?.data?.statusCode === 1) {
          let data = {
            postId: feedComment._id,
          };
          let commentCount = count + 1;
          setCounts(commentCount);
          dispatch(getCommentAction(data));
          dispatch(getFeedByUser());
          setComments('');
        }
      });
    }
  };

  return (
    <MainScreen>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' && 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' && 100}>
        <View style={{flex: 1}}>
          <View style={{padding: 10}}>
            <View styler={styles.profile}>
              <View
                style={{
                  backgroundColor: COLORS.light_grey,
                  padding: 15,
                  marginTop: 10,
                }}>
                <View style={styles.profileView}>
                  <View
                    style={{
                      borderRadius: 50,
                    }}>
                    <Image
                      source={
                        feedComment?.profileImage
                          ? {uri: mediaPath + feedComment?.profileImage}
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
                      {feedComment.fname + ' ' + feedComment.lname}
                    </Text>
                    <Text style={styles.dateView}>
                      {moment(feedComment?.created).format('ll') + ' '}{' '}
                      {moment(feedComment?.created).format('LT')}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Manrope-Regular',
                    paddingTop: 10,
                    color: COLORS.grey_2,
                  }}>
                  {feedComment?.description}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView style={{marginBottom: 70}}>
            {getComment?.result?.length > 0 ? (
              <FlatList
                data={getComment?.result}
                bounces={false}
                renderItem={({item}) => <GetComment commentList={item} />}
              />
            ) : // getComment?.result?.map((item)=><GetComment commentList={item}/>)
            null}
          </ScrollView>
          <View style={styles.commentContainer}>
            <View style={styles.commentInputSection}>
              <TextInput
                value={comment}
                onChangeText={comment => setComments(comment)}
                style={styles.input}
                placeholder="Type here"
                multiline
              />

              {isEmpty(comment) && (
                <View style={styles.icons}>
                  <SendIconDisable />
                </View>
              )}
              {!isEmpty(comment) && <TouchableOpacity
                style={styles.icons}
                onPress={() => onCommentSend()}>
                <SendIcon />
              </TouchableOpacity>}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainScreen>
  );
});
const styles = StyleSheet.create({
  commentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
  },

  commentInputSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.grey_6,
    padding: 10,
    flexGrow: 1,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    // flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: COLORS.black,
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    flexGrow: 1,
  },
  icons: {
    paddingHorizontal: 8,
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
});
export default Comment;
