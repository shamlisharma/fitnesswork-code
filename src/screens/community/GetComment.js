import React from 'react';
import { Image, Text, View,StyleSheet } from 'react-native';
import { COLORS } from '../../common/Constant';
import setting from '../../config/settings';
import moment from 'moment';

let GetComment = React.memo(function GetComment(props){
    const {commentList} = props;
    
    let mediaPath = setting.s3Url.url;
    return(
        <View style={{padding: 10}}>
        <View styler={styles.profile}>
          <View
            style={{
              padding: 10,
            }}>
            <View style={styles.profileView}>
              <View
                style={{
                  borderRadius: 50,
                }}>
                <Image
                  source={commentList?.image ? {uri:mediaPath+commentList?.image} :require('../../../assets/Avatar.png')}
                  style={{
                    width: 61,
                    height: 61,
                    borderWidth: 2.5,
                    borderRadius: 50,
                    borderColor: COLORS.lightBlue,
                  }}
                />
              </View>
              <View style={{paddingHorizontal: 8, marginHorizontal: 10}}>
                  <View style={{flexDirection:"row",}}>
                <Text style={styles.paragraph}>{commentList?.name}</Text>
                <Text style={styles.time}>{moment(commentList?.created).format('ll')?.split(',')[0] + ', '}{moment(commentList?.created).format('LT')}</Text>
                </View>
                <Text style={styles.comment}>
                 {commentList?.comment}
                </Text>
               
              </View>
            </View>
            
          </View>
        </View>
      </View>
    )
})
export default GetComment;
const styles = StyleSheet.create({
    comment:{
        fontSize: 15,
        fontFamily: 'Manrope-Regular',
        color: COLORS.grey_2,
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
    //   paddingTop: 5,
    },
    profileView: {
      marginTop: 5,
      flexDirection: 'row',
    },
    time:{
        paddingHorizontal:10,
        fontSize: 14,
    color: COLORS.grey_4,
    fontFamily: 'Manrope',
    }
  });