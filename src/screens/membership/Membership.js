import React, { useEffect, useReducer, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import GradientButton from "../../components/GradientButton";
import { COLORS } from "../../common/Constant";
import Header from "../../components/header/Header";
import { getProfileAction } from "../../_action/ProfileAction";
import { useDispatch, connect } from "react-redux";
import { getMembershipPlan } from "../../_action/MembershipActions";
import setting from "../../config/settings";
import { ProfileInfoIcon } from "../../Svg";
import { Loader } from "../../common/Loader";
import { MembershipModal } from "../modal/MembershipModal";
import MembershipPlanUpgrade from "../modal/MembershipPlanUpgradeModal";
import AlertModal from "../modal/AlertModal";
import * as RNIap from "react-native-iap";
import { iapAction } from "../../_action/InappPurchaseAction";
import SuccessAlertModal from "../modal/SuccessAlertModal";
import AlertCancelMembership from "../modal/AlertCancelMembership";
import moment from "moment";
import { usersService } from "../../services/ApiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
const itemSkus = Platform.select({
  ios: ["003", "005", "000"],
  android: ["001", "002", "009"],
});
let MembershipScreen = React.memo(function MembershipScreen(props) {
  const getProfileData = props?.getProfileData;

  const fromExpireModal = props?.route?.params?.fromExpireModal;
  const dispatch = useDispatch();
  const [cancelMembershipVisibility, setCancelMembershipVisibility] =
    useState(false);
  const [contactCustomerSupport, setcontactCustomerSupport] = useState(false);
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      iapProducts: "",
      memberShipPlan: [],
      mediaPath: "",
      membershipInfoPlanById: "",
    }
  );
  const [inactiveMembershipModal, setInactiveMembershipModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [infoModel, setInfoModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState();
  const [selectedPlanName, setSelectedPlanName] = useState();
  const [activePlan, setActivePlan] = useState(false);
  const [standardPrce, setStandardPrice] = useState(0);
  const [premiumPrce, setPremiumPrice] = useState(0);
  const [content, setContent] = useState();

  let purchaseUpdatedListener;
  let purchaseErrorListener;
  let mediaPath = setting.s3Url.url;
  console.log("getProfileData", getProfileData);
  useEffect(() => {
    getMembership();
    // dispatch(getProfileAction());
    try {
      setLoading(true);
      RNIap.initConnection()

        .then(() => {
          console.log("success");
          // getPurchaseHistory();
          RNIap.getSubscriptions(itemSkus)
            .catch((error) => {
              setLoading(false);
              console.log("error getSubscription", error.message);
            })
            .then((res) => {
              console.log("res neeraj getSubscription==================", res);
              setLoading(false);
              let standard = res.filter(
                (item) => item?.productId == "005" || item?.productId == "001"
              );
              console.log("eaassasa", res);
              setStandardPrice(standard[0]?.localizedPrice); // price
              let premium = res.filter(
                (item) => item?.productId == "000" || item?.productId == "009"
              );
              setPremiumPrice(premium[0]?.localizedPrice);
              setUserInput({ iapProducts: res });
            })
            .catch((err) => {
              setLoader(false);
            });
        })
        .catch(() => {
          setLoading(false);
          console.log("error connecting to store");
        });
    } catch (error) {
      setLoading(false);
    }
  }, []);
  // console.log('heya', getProfileData);
  async function getMembership() {
    setLoader(true);
    let req = {
      userId: getProfileData?._id,
    };

    dispatch(getMembershipPlan(req))
      .then((res) => {
        if (res.data.statusCode === 1) {
          console.log("membership data.....", res.data.responseData.result);
          setUserInput({ memberShipPlan: res.data.responseData.result });
          setLoader(false);
        } else {
          setLoader(false);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  }

  function planInfoData(item) {
    setUserInput({ membershipInfoPlanById: item });
    setInfoModal(true);
  }

  function confirmationPopup(item) {
    // console.log({item,getProfileData});
    //   if (getProfileData.downgraded==true){
    // Alert.alert(
    //   'Alert',
    //   'Please contact administrator to upgrade your membership!',
    //   [
    //     {
    //       text: 'Close',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     // {text: 'Close', onPress: () => onChallange()},
    //   ],
    //   {
    //     cancelable: false,
    //   },
    // );
    //   }
    if (true) {
      if (item?.planName.toLowerCase() === "free") {
        setCancelMembershipVisibility(true);
      } else if (getProfileData?.planId !== item?._id) {
        setSelectedPlanId(item._id);
        setSelectedPlanName(item.planName);
        if (item?.planName.toLowerCase() !== "free") {
          setConfirmation(true);
        }
      }
    }
  }

  const onAlert = (item) => {
    setActivePlan(true);
    if (item == "Standard") {
      setContent(
        "Standard user entry has been stopped by admin, please stay tuned. "
      );
    } else {
      setContent(
        "Premium user entry has been stopped by admin, please stay tuned. "
      );
    }
  };

  const onCancelButtonPressed = () => {
    if (Platform.OS == "android") {
      Linking.openURL(
        "https://play.google.com/store/account/subscriptions?package=com.funavry.fitnessvworkexpo&sku=YOUR_PRODUCT_ID"
      );
    } else {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    }
  };

  const onOkay = () => {
    setActivePlan(false);
  };
  useEffect(() => {
    if (standardPrce == undefined || premiumPrce == undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [standardPrce, premiumPrce]);
  const downgradeToFreeUser = (planId) => {
    let req = {
      userId: getProfileData?._id,
      iap_prod_id: "0",
      planId: "6309dadbc2dacd0014060335", //"6309dadbc2dacd0014060335", //'6309da0e7de542001b93a996',
      transactionId: "downgrade",
      startDate: new Date(),
      endDate: new Date(),
      isPremium: 0,
    };
    // console.log("downgrade to fre");
    dispatch(iapAction(req))
      .then((res) => {
        console.log("res from downgrade", res);
        if (res.data.statusCode === 1) {
          dispatch(getProfileAction());
          props.navigation.navigate("No Permission");
        }
      })
      .catch((err) => {
        console.log("in downgrade error", { err });
        //  alert(err);
        // props.navigation.navigate('No Permission');
        props.setLoader(false);
      });
  };

  useEffect(() => {
   

    // purchaseUpdatedListener = RNIap.purchaseUpdatedListener(purchase => {
    //   try {
    //     const receipt = purchase.transactionReceipt;
    //     setPurchase(true);
    //   } catch {}
    // });
    purchaseErrorListener = RNIap.purchaseErrorListener((error) => {
      if (error["responseCode"] === "2") {
        alert("The operation couldn’t be completed");
      } else {
        // alert(
        //   'There has been an error with your purchase, error code = ' +
        //     error['code'],
        // );
        console.log("error[coojgggg]", error["code"]);
      }
      console.log("cancel", error);
    });

    purchaseUpdatedListener = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        try {
          const receipt = purchase.transactionReceipt;
          console.log("=======================>>>>> ",receipt);
          const id = await AsyncStorage.getItem("user_id");
          let pl =Platform.OS === "ios"?"ios":"android"
            usersService.createSubscriptionReceipt({
              platform:pl, receipt:receipt, userId:id
            }).then(res=>{
              console.log("status of receipt",res);
            }).catch(e=>{console.log("error in receipt",e);})
          if (Platform.OS === "android") {
            const ackResult = await RNIap.finishTransaction(purchase);
            const result = await RNIap.acknowledgePurchaseAndroid(
              purchase.purchaseToken
            );
            console.log("ackResult", ackResult);
            console.log(result, "NEW_PURCHASE_RESULT");
            var pur = JSON.parse(receipt);
            const res = await usersService.validatePayment(
              pur.productId,
              pur.purchaseToken
            );

            console.log("PAYMENT_SUCCESSFULL", res);
          } else {
            const ackResult = await RNIap.finishTransaction(purchase);
            console.log("NEW_STATUS", ackResult);
            const receiptBody = {
              "receipt-data": receipt,
              password: "c589d4eb53334fd2a44574ed2b907cf9",
            };
            const result = await RNIap.validateReceiptIos(receiptBody, false);

            console.log(result, "PURCHASE_VERIFIED");
          }
        
        } catch (err) {
          console.log("ERROR", err);
        }
      }
    );

     return () => {
      purchaseUpdatedListener.remove()
    }
   
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="Membership"
        hideBack={fromExpireModal}
        status={props.route.params?.filter}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        {/* {loader ? <Loader loading={true} /> : null} */}
        {/* {loading ? <Loader loading={true} /> : null} */}
        {infoModel ? (
          <MembershipModal
            loading={true}
            close={() => setInfoModal(false)}
            infoData={userInput.membershipInfoPlanById}
          />
        ) : null}
        {confirmation ? (
          <MembershipPlanUpgrade
            visible={confirmation}
            membershipList={userInput.memberShipPlan}
            close={() => setConfirmation(false)}
            getProfileData={getProfileData}
            selectedPlanId={selectedPlanId}
            selectedPlanName={selectedPlanName}
            planSelectFromTracker={props.route.params}
            setLoader={setLoader}
          />
        ) : null}
        <AlertModal
          alert={activePlan}
          onResume={() => onOkay()}
          headertitle="Membership Plan"
          content={content}
          cancelBtn=""
          saveBtn="Ok"
          width={100}
          opacity={"#000000cf"}
        />

        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.Container}>
          {console.log({ userInput: JSON.stringify(userInput) })}
          {userInput.memberShipPlan.length !== 0 ? (
            <FlatList
              data={userInput.memberShipPlan}
              keyExtractor={({ id }) => id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) =>
                item.status == 1 && (
                  <View style={styles.cardView}>
                    <TouchableOpacity
                      // activeOpacity={0.7}
                      onPress={() => {
                        if (
                          getProfileData?.planName.toLowerCase() !== "free" &&
                          userInput.memberShipPlan.length
                        ) {
                          setCancelMembershipVisibility(true);
                        } else if (
                          premiumPrce &&
                          standardPrce &&
                          item?.status == 1
                        ) {
                          confirmationPopup(item);
                          // if (
                          //   item?.status === 0 &&
                          //   getProfileData?.planName === 'Free'
                          // ) {
                          //   onAlert(item?.planName);
                          // } else {
                          //   confirmationPopup(item);
                          // }
                        } else if (item?.status == 0) {
                          setInactiveMembershipModal(true);
                        }
                      }}
                      style={
                        getProfileData?.planId === item?._id
                          ? styles.cardViewSelected
                          : styles.card(item?.status)
                      }
                    >
                      <>
                        <View style={styles.dataView}>
                          <View
                            style={{
                              backgroundColor: COLORS.inputTxtColor,
                              padding: 10,
                              borderRadius: 15,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text style={styles.planTxt}>
                                {item.planName}
                              </Text>
                              {/* <Pressable onPress={() => planInfoData(item)}>
                            <ProfileInfoIcon />
                          </Pressable> */}
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                paddingVertical: 10,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Text style={styles.planCostTxt}>
                                  {item.planName === "Free"
                                    ? ""
                                    : item.planName == "Standard"
                                    ? standardPrce || 0
                                    : premiumPrce || 0}
                                </Text>
                              </View>
                              <Text style={styles.planDescTxt}>
                                {" "}
                                / {item.description}
                              </Text>
                            </View>
                            {getProfileData?.planName.toLowerCase() !==
                              "free" && userInput.memberShipPlan.length ? (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  paddingVertical: 15,
                                }}
                              >
                                {/* <TouchableOpacity
                                  style={styles.cancelButtonView}
                                  onPress={() =>
                                    setCancelMembershipVisibility(true)
                                  }>
                                  <Text style={{color: '#0CDD99',}}>
                                    Cancel Subscription
                                  </Text>
                                </TouchableOpacity>  */}
                              </View>
                            ) : (
                              <GradientButton
                                title={"Activate the plan"}
                                onPress={() => {
                                  console.log("pressed");
                                  // return downgradeToFreeUser()
                                  if (
                                    premiumPrce &&
                                    standardPrce &&
                                    item?.status == 1
                                  ) {
                                    console.log("in if");
                                    confirmationPopup(item);
                                    // if (
                                    //   item?.status === 0 &&
                                    //   getProfileData?.planName === 'Free'
                                    // ) {
                                    //   onAlert(item?.planName);
                                    // } else {
                                    //   confirmationPopup(item);
                                    // }
                                  } else if (item?.status == 0) {
                                    console.log("in else");
                                    setInactiveMembershipModal(true);
                                  }
                                }}
                                style={{
                                  padding: 6,
                                  paddingHorizontal: 10,
                                  paddingVertical: 15,
                                }}
                                textStyle={{ fontSize: 13 }}
                              />
                            )}
                          </View>
                          <View style={{ margin: 10 }}>
                            <Text style={styles.planTxt}>
                              The plan includes
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                setCancelMembershipVisibility(false)
                              }
                            >
                              <View style={{}}>
                                {item.planInfo.map((i) => (
                                  <View style={styles.planIncludesContainer}>
                                    <Image
                                      source={require("../../../assets/done.png")}
                                      style={styles.doneIcon}
                                    />
                                    <Text
                                      style={{
                                        color: COLORS.black,
                                        paddingLeft: 10,
                                      }}
                                    >
                                      {i}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    </TouchableOpacity>
                  </View>
                )
              }
            />
          ) : loader ? (
            <></>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 20 }}>Unable to Fetch Data</Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* <AlertModal
        alert={cancelMembershipVisibility}
        onResume={() => {
          setCancelMembershipVisibility(false);
        }}
        headertitle={'Cancel Membership'}
        content={
          'You can’t downgrade to free membership once you upgrdae to standard or premium!'
        }
        cancel={() => setCancelMembershipVisibility(false)}
        cancelBtn={'No'}
        saveBtn={'Yes'}
        width={100}
        opacity={''}
      /> */}

      {/* <SuccessAlertModal
        alert={cancelMembershipVisibility}
        onResume={() => {
          setCancelMembershipVisibility(false);
        }}
        headertitle={'Cancel Membership'}
        content={
          'You can’t downgrade to free membership once you have upgraded to standard or premium!'
        }
        cancel={() => setCancelMembershipVisibility(false)}
        cancelBtn="Close"
        saveBtn="Close"
        width={100}
        opacity={''}
      /> */}

      {/* <AlertModal
        alert={cancelMembershipVisibility}
        onResume={async () => {
          setCancelMembershipVisibility(false);
          // setcontactCustomerSupport(true);
          // uncomment these below methods to cancel subscrition
          downgradeToFreeUser();
          onCancelButtonPressed();
        }}
        headertitle={'Your subscription will be automatically renew'}
        content={
          'Next update is 22 Aug 2023.'
        }
        cancel={() => setCancelMembershipVisibility(false)}
        cancelBtn={'No'}
        saveBtn={'Yes'}
        width={100}
        opacity={''}
        
      /> */}
      <AlertCancelMembership
        alert={cancelMembershipVisibility}
        onResume={async () => {
          setCancelMembershipVisibility(false);
          // setcontactCustomerSupport(true);
          // uncomment these below methods to cancel subscrition
          downgradeToFreeUser();
          onCancelButtonPressed();
        }}
        headertitle={"Your subscription will be automatically renew"}
        content={`Next update is  ${moment(
          getProfileData?.subscriptionEnd
        ).format("YYYY-MM-DD")}`}
        cancel={() => setCancelMembershipVisibility(false)}
        cancelBtn={"No"}
        saveBtn={"Yes"}
        width={100}
        opacity={""}
      />

      <SuccessAlertModal
        alert={contactCustomerSupport}
        onResume={() => {
          setcontactCustomerSupport(false);
          //uncomment these below methods to cancel subscrition
          // downgradeToFreeUser();
          // onCancelButtonPressed();
          // setCancelMembershipVisibility(false);
        }}
        headertitle={"Cancel Membership"}
        content={"Please contact administrator, to cancel your membership"}
        cancel={() => setcontactCustomerSupport(false)}
        cancelBtn={"No"}
        saveBtn={"Close"}
        width={100}
        opacity={""}
      />

      <AlertModal
        alert={inactiveMembershipModal}
        onResume={() => {
          setInactiveMembershipModal(false);
        }}
        headertitle={"Membership Plan"}
        content={
          "Not taking on any more members at the moment. I’ll reopen this again soon 🙏🏾"
        }
        cancelBtn={""}
        saveBtn={"Ok"}
        width={100}
        opacity={""}
      />
      {loader ? (
        <View
          style={styles.loader}
        >
          <ActivityIndicator
            size={"large"}
            color={COLORS.lightGreen}
            animating
          />
        </View>
      ) : null}
    </View>
  );
});
const styles = StyleSheet.create({
  Container: {
    //  flex: 1,
    padding: 10,
  },
  cancelButtonView: {
    alignSelf: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 10,
  },
  cardView: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  card: (status) => ({
    flexDirection: "row",
    width: "100%",
    opacity: status ? 1 : 0.2,
    borderRadius: 10,
  }),
  loader:{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000066",
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    width: "40%",
    padding: 2,
  },
  dataView: {
    width: "100%",
    // padding: 14,
    backgroundColor: "white",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  img: {
    width: "100%",
    flex: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  planTxt: {
    color: COLORS.black,
    fontSize: 18,
  },
  planDescTxt: {
    color: COLORS.lightGrey,
    fontSize: 15,
    flex: 1,
    // top: 3,
  },
  planCostTxt: {
    color: COLORS.lightGreen,
    fontSize: 15,
    // top: 8,
  },
  item: {
    backgroundColor: COLORS.inputTxtColor,
    marginVertical: 2,
    marginHorizontal: 2,
    padding: 15,
  },
  title: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: COLORS.lightGrey,
    marginTop: 3,
  },
  paymentCard: {
    backgroundColor: COLORS.inputTxtColor,
    top: 10,
    padding: 15,
  },
  cardViewSelected: {
    flexDirection: "row",
    width: "100%",
    opacity: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
  },
  planIncludesContainer: {
    flexDirection: "row",
    marginVertical: 5,
    backgroundColor: COLORS.inputTxtColor,
    padding: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    getProfileData:
      state?.profileReducer?.profile?.data?.responseData?.userProfile,
  };
};
export default connect(mapStateToProps)(MembershipScreen);
// export default MembershipScreen;
