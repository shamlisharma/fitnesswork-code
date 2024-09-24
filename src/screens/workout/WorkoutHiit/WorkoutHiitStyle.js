import { StyleSheet, Dimensions, Platform } from "react-native";
import { hasNotch } from 'react-native-device-info';
import { scale } from "react-native-size-matters";
import { COLORS } from "../../../common/Constant";
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingTop: hasNotch() ? scale(30) : scale(20),
    alignItems: 'flex-end',
    top: 10,

    // paddingHorizontal: 15,
    zIndex: 4,
  },

  startWorkoutButtonView: {
    position: 'absolute',
    alignSelf: 'center',
    height: scale(48),
    width: width - scale(20),
    bottom: scale(10),
    borderRadius: scale(25),

    overflow: 'hidden',
  },

  startButtonTitleLabel: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: 'Manrope-Regular',
  },

  blackSheetOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
    opacity: 0.5,
  },
  activityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    height: height * 0.375,
    width: width,
    // justifyContent: 'space-between'
    // alignSelf: 'center',
    // position: 'absolute',
    // height: scale(280),
    backgroundColor: '#FFFFFF',
  },

  eyeButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  headerTextStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  itemsInCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  excerciseDetailStyle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: 'black',
    // flex: 1,
    textAlign: 'center',
  },
  excerciseDetailStyle2: {
    fontFamily: 'Manrope-Regular',
    fontSize: 17,
    color: COLORS.grey_3,
    // flex: 1,
    // textAlign: 'center',
  },

  excercsieContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(3),
    paddingHorizontal: 15,
  },
  playbtnText: {
    fontSize: 22,
    fontFamily: 'Manrope-Regular',
    color: '#0CDD99',
    fontWeight: '500',
  },
  playcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  flexDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subContainer: {
    top: height * 0.375,
    height: height * 0.5,
    // padding:10,
    position: 'absolute',
    width: '100%',
    //    paddingBottom: scale(48),

    // position:'absolute',top:height*0.375, padding:10, width:'100%', bottom:0
  },
  listContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTxt: {
    color: '#4F4F4F',
    fontSize: 17,
    fontFamily: 'Manrope-Bold',
  },
  setTimeTxt: {
    color: '#BDBDBD',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    paddingHorizontal: 7,
  },
  circuitTitletText: {
    fontSize: 15,
    fontFamily: 'Manrope-Bold',
    color: '#4F4F4F',

    textTransform: 'capitalize',
  },
  circuitTitletText2: {
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    color: '#BDBDBD',
    top: 3,
  },
  circuitListContainer: {
    height: 90,
    backgroundColor: COLORS.white,
    overflow: 'hidden',

    borderBottomWidth: 0.3,
    paddingVertical: 8,
    borderColor: COLORS.grey_5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 15,
  },
  excerciseCardStyle: {
    flexDirection: 'row',

    overflow: 'hidden',
  },
  CircuitImg: {
    // flex: 0.25,
    backgroundColor: '#faf5f3',
    // backgroundColor: '#edefee',
    borderWidth: 1,
    borderColor: COLORS.light_grey,
    overflow: 'hidden',
    borderRadius: 15,
    height: 90,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Hiitheader: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey_6,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 0 : '10%',
  },
  iosHeader: {
    marginLeft: 10,
    flex: 1,
  },
  andHeader: {
    left: 10,
    flex: 1,
  },
  HiitHeaderTitle: {
    color: '#828282',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
  },
  hiitTimer: {
    fontSize: 24,
    color: '#0DB8DA',
    fontFamily: 'Manrope-Bold',
  },
  hiitTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timerContainer: {
    flex: 1,
    marginRight: 10,
    alignItems: 'flex-end',
  },
  upnextTitle: {
    fontSize: 14,
    fontFamily: 'Manrope-SemiBold',
    color: '#4F4F4F',
    textTransform: 'capitalize',
  },
  excerciseTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#4F4F4F',
    textTransform: 'capitalize',
  },
  excerciseTitle1: {
    color: '#BDBDBD',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
    textAlign: 'center',
    marginTop: 2,
  },
  dayTxt: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#4F4F4F',
  },
  dayView: {
    backgroundColor: 'rgb(249,249,249)',
    height: 45,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progessView: {
    height: 80,
    backgroundColor: 'rgb(249,249,249)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressIndicatorContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  scrollContentStyle: {
    width: '100%',
  },
  btnStyle: {
    height: 50,
    borderColor: 'rgb(95,205,175)',
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1.5,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontFamily: 'Manrope-Bold',
    color: '#0CDD99',
    fontSize: 15,
    textAlign: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#4F4F4F',
  },
  itemTitle1: {
    color: '#BDBDBD',
    fontSize: 14,
    fontFamily: 'Manrope-Regular',
  },
  itemText: {
    color: '#828282',
    fontSize: 15,
    fontFamily: 'Manrope-Regular',
    textTransform: 'capitalize',
  },
  hiitCompleteItemView: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  hiitCompleteItemSubContainer: {
    height: 105,
    width: 120,
    marginHorizontal: 8,
  },
  hiitCompleteIImg: {
    height: 75,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#F9F9F9',
  },
  hiitCompleteTitle: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});