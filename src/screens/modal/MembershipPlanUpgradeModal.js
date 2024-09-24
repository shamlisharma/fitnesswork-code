import React, { useState, useEffect, useReducer } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Modal,
  Image,
  Pressable,
} from "react-native";
import { showMessage } from "react-native-flash-message";

import { TouchableOpacity } from "react-native-gesture-handler";
import * as RNIap from "react-native-iap";
import { AppButton, COLORS } from "../../common/Constant";
import { iapAction } from "../../_action/InappPurchaseAction";
import { getProfileAction } from "../../_action/ProfileAction";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { usersService } from "../../services/ApiServices";
import { getWorkoutProgramme } from "../../_action/WorkoutAction";
import GradientButton from "../../components/GradientButton";

const itemSkus = Platform.select({
  ios: ["003", "005", "000"],
  android: ["001", "002", "009"],
});

let MembershipPlanUpgrade = React.memo(function MembershipPlanUpgrade(props) {
  const {
    visible,
    close,
    getProfileData,
    selectedPlanId,
    selectedPlanName,
    planSelectFromTracker,
    membershipList,
  } = props;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  let purchaseUpdatedListener;
  let purchaseErrorListener;
  const [purchased, setPurchase] = useState(false);
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      iapProducts: "",
      memberShipPlan: [],
      mediaPath: "",
      membershipInfoPlanById: "",
    }
  );

  var myCurrentDate = new Date();
  var myFutureDate = new Date(myCurrentDate);
  myFutureDate.setDate(myFutureDate.getDate() + 29);

  useEffect(() => {
    RNIap.initConnection()
      .catch(() => {
        console.log("error connecting to store");
      })
      .then(() => {
        console.log("connected to store");
        RNIap.getSubscriptions(itemSkus)
          .catch(() => {})
          .then((res) => {
            setUserInput({ iapProducts: res });
          });
      });

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
          const ackResult = await RNIap.finishTransaction(purchase);
            console.log("=======================>>>>> ",receipt);
          if (Platform.OS === "android") {
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
          setPurchase(true);
        } catch (err) {
          console.log("ERROR", err);
        }
      }
    );

    // return () => purchaseUpdatedListener.
    if (purchaseUpdatedListener) {
      purchaseUpdatedListener.remove();
    }
  }, []);

  const subscribefun = (productid, planId) => {
    close();
    props.setLoader(true);
    RNIap.requestSubscription(productid)
      .then((result) => {
        props.setLoader(false);
        let req = {
          userId: getProfileData._id,
          iap_prod_id: productid,
          planId: planId,
          transactionId: result?.transactionId,
          startDate: result?.transactionDate,
          endDate: myFutureDate,
          isPremium: selectedPlanName === "Premium" ? 1 : 0,
        };
        dispatch(iapAction(req))
          .then((res) => {
            if (res.data.statusCode === 1) {
              props.setLoader(false);
              const premiumList = membershipList.filter(
                (item) => item.planName.toLowerCase() == "premium"
              );
              const freeList = membershipList.filter(
                (item) => item.planName.toLowerCase() == "free"
              );

              if (getProfileData?.planName.toLowerCase() === "standard") {
                if (planId == premiumList[0]._id) {
                  showMessage({
                    message: "Membership plan",
                    description: "Congrats 🎉 You have upgraded your account.",
                    type: "default",
                    backgroundColor: COLORS.lightGreen,
                    color: COLORS.white,
                  });
                  navigation.goBack();
                } else if (planId == freeList[0]._id) {
                  showMessage({
                    message: "Membership plan",
                    description: "You have downgraded your account.",
                    type: "default",
                    backgroundColor: COLORS.lightGreen,
                    color: COLORS.white,
                  });
                }
              } else if (getProfileData?.planName.toLowerCase() === "premium") {
                showMessage({
                  message: "Membership plan",
                  description: "You have downgraded your account.",
                  type: "default",
                  backgroundColor: COLORS.lightGreen,
                  color: COLORS.white,
                });
              } else if (getProfileData?.planName.toLowerCase() === "free") {
                showMessage({
                  message: "Membership plan",
                  description: "Congrats 🎉 You have upgraded your account.",
                  type: "default",
                  backgroundColor: COLORS.lightGreen,
                  color: COLORS.white,
                });
              }

              dispatch(getProfileAction());
              _selectWorkoutPlan();
              navigation.goBack();
              if (planSelectFromTracker?.setPlan === "changePlan") {
                navigation.navigate("Tracker");
              }
            }
          })
          .catch((err) => {
            alert("err");
            props.setLoader(false);
          });
      })
      .catch((err) => {
        props.setLoader(false);
      });
  };

  function onPlanSelection() {
    const list = membershipList.filter(
      (item) => item.planName.toLowerCase() == "free"
    );

    if (selectedPlanId === list[0]._id) {
      close();
      props.setLoader(true);
      let req = {
        userId: getProfileData._id,
        iap_prod_id: "",
        planId: selectedPlanId,
        transactionId: "",
        startDate: "",
        endDate: "",
        isPremium: 0,
      };

      dispatch(iapAction(req))
        .then((res) => {
          if (res.data.statusCode === 1) {
            props.setLoader(false);
            showMessage({
              message: "Membership plan",
              description: "You have downgraded your account.",
              type: "default",
              backgroundColor: COLORS.lightGreen,
              color: COLORS.white,
            });

            dispatch(getProfileAction());
            _selectWorkoutPlan();

            if (planSelectFromTracker?.setPlan === "changePlan") {
              navigation.navigate("Tracker");
            }
          }
        })
        .catch((err) => {
          alert(err);
          props.setLoader(false);
        });
    } else {
      if (
        Platform.OS === "ios" &&
        selectedPlanName === "7 Days Free Trial / Standard"
      ) {
        return subscribefun("000", selectedPlanId);
      } else if (Platform.OS === "ios" && selectedPlanName === "Premium") {
        return subscribefun(
          userInput.iapProducts[0]?.productId,
          selectedPlanId
        );
      } else if (
        Platform.OS === "android" &&
        selectedPlanName === "7 Days Free Trial / Standard"
      ) {
        return subscribefun(
          userInput.iapProducts[0]?.productId,
          selectedPlanId
        );
      } else if (Platform.OS === "android" && selectedPlanName === "Premium") {
        return subscribefun(
          userInput.iapProducts[1]?.productId,
          selectedPlanId
        );
      }
    }
  }

  const getWorkoutProgrammes = async () => {
    try {
      const res = await usersService.getWorkoutProgrammes();
    } catch (e) {
      console.error("error ", e);
    }
  };

  const _selectWorkoutPlan = async () => {
    if (planSelectFromTracker.programmeId) {
      try {
        var param = {
          programmeId: planSelectFromTracker.programmeId,
        };
        const res = await usersService.setMyWorkoutProgrammes(param);
        if (res.data.statusCode === 1) {
          dispatch(getWorkoutProgramme());
          getWorkoutProgrammes();
          dispatch(getProfileAction());
          navigation.navigate("Workout");
        }
      } catch (error) {
        console.error("error ", error);
      }
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          <View style={styles.titleView}>
            <Text style={styles.title}>Are you sure?</Text>
          </View>
          <View style={styles.descView}>
            <Text style={styles.warningMsg}>Change your membership plan?</Text>
          </View>
          <View style={styles.buttonView}>
            <GradientButton
              title={"Cancel"}
              onPress={close}
              style={{
                padding: 6,
                paddingHorizontal: 40,
                marginHorizontal: 10,
              }}
              textStyle={{ fontSize: 13 }}
            />
            <GradientButton
              title={"Confirm"}
              style={{
                padding: 6,
                paddingHorizontal: 40,
                marginHorizontal: 10,
              }}
              textStyle={{ fontSize: 13 }}
              onPress={() => onPlanSelection()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000040",
  },
  modalWrapper: {
    backgroundColor: "#fff",
    height: "auto",
    width: "90%",
    paddingBottom: 30,
    borderRadius: 10,
  },
  logoImage: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 25,
  },
  descView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  questLogoImage: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },
  warningMsg: {
    fontFamily: "Manrope-regular",
    fontSize: 14,
    paddingTop: 6,
  },
  confirmButton: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
    paddingTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Manrope-Semibold",
    color: COLORS.white,
  },
});
export default MembershipPlanUpgrade;
