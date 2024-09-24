import React, { useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  ImageBackground,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getMembershipPlan,
  storeMembershipPriceData,
} from "../../_action/MembershipActions";
import { useNavigation } from "@react-navigation/native";
import { AppButton, COLORS, SignupStepsNum } from "../../common/Constant";
import AuthHeader from "../../components/header/AuthHeader";
import { InfoCircleIcon, InfoIcon } from "../../Svg";
import setting from "../../config/settings";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../common/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAction } from "../../_action/AuthAction";
import { MembershipModal } from "../modal/MembershipModal";
import { Screen } from "../../common/Screen";
import * as RNIap from "react-native-iap";
import { iapAction } from "../../_action/InappPurchaseAction";
import { usersService } from "../../services/ApiServices";

const PERSISTENCE_KEY = "NAVIGATION_STATE";
const itemSkus = Platform.select({
  ios: ["000", "003", "005"],
  android: ["009", "003", "001"],
});

function MembershipPlan(props) {
  const navigation = useNavigation();
  const membershipData = useSelector(
    (state) =>
      state?.membershipReducer?.membershipData?.data?.responseData?.result
  );
  const membershipPriceData = useSelector(
    (state) => state?.membershipReducer?.membershipPriceData
  );

  let dispatch = useDispatch();
  let purchaseUpdatedListener;
  let purchaseErrorListener;
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      choosePlan: "",
      choosePlanName: "",
      outerCardView1: false,
      outerCardView2: false,
      outerCardView3: false,
      index: "",
      mediaPath: "",
      membershipInfoPlanById: "",
      iapProducts: "",
      loader: true,
      infoModel: false,
      purchased: false,
    }
  );

  const getMembershipPlanData = async () => {
    let userId = await AsyncStorage.getItem("userId");
    let req = {
      userId: userId,
    };
    dispatch(getMembershipPlan(req));
  };

  useEffect(() => {
    setUserInput({
      loader: true,
    });
    RNIap.initConnection()
      .then(() => {
        RNIap.getSubscriptions(itemSkus)
          .then((res) => {
            console.log({ res });
            let standard = res.filter(
              (item) => item?.productId == "005" || item?.productId == "001"
            );

            let premium = res.filter(
              (item) => item?.productId == "003" || item?.productId == "002"
            );
            let freeTrial = res.filter(
              (item) => item?.productId == "000" || item?.productId == "009"
            );
            setUserInput({ loader: false });
            dispatch(
              storeMembershipPriceData({
                standardPrice: standard[0]?.localizedPrice,
                premiumPrice: premium[0]?.localizedPrice,
                freeTrialPrice: freeTrial[0].localizedPrice,
                iapProducts: res,
              })
            );

            getMembershipPlanData();
          })
          .catch(() => {
            setUserInput({ loader: false });
          });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      membershipData?.length &&
      membershipPriceData?.standardPrice &&
      membershipPriceData?.premiumPrice
    ) {
      setUserInput({
        loader: false,
      });
    }
  }, [
    membershipData,
    membershipPriceData?.standardPrice && membershipPriceData?.premiumPrice,
  ]);

  // const [loading, setLoading] = useState(false);
  const [infoModel, setInfoModal] = useState(false);
  // const [purchased, setPurchase] = useState(false);

  function stdPlan(item) {
    if (
      membershipPriceData?.standardPrice &&
      membershipPriceData?.premiumPrice
    ) {
      setUserInput({
        choosePlan: item.item._id,
        choosePlanName: item.item.planName,
        outerCardView1: true,
        outerCardView2: false,
        outerCardView3: false,
        index: item.item._id,
      });
    }
  }

  const validateIOSReceipt = async (transactionReceipt) => {
    const receiptBody = {
      "receipt-data": transactionReceipt,
      password: "c589d4eb53334fd2a44574ed2b907cf9", // app shared secret, can be found in App Store Connect
    };
    const result = await RNIap.validateReceiptIos(receiptBody, false);
    if(result.status === 0 || result.status === 21007){
  
       }
    console.log(result, "NEW_RESULT_FOUND");
    // 
  };

  useEffect(() => {
    try {
      // RNIap.initConnection()
      //   .catch(() => {
      //   })
      //   .then(() => {

      //         setLoading(false);
      //   });

      purchaseErrorListener = RNIap.purchaseErrorListener((error) => {
        if (error["responseCode"] === "2") {
          alert("The operation couldn’t be completed");
        } else {
          // alert(
          //   'There has been an error with your purchase, error code = ' +
          //     error['code'],
          // );
        }
      });


      purchaseUpdatedListener = RNIap.purchaseUpdatedListener(
        async (purchase) => {
          try {
            const receipt = purchase.transactionReceipt;
            const id = await AsyncStorage.getItem("userId");
            let pl =Platform.OS === "ios"?"ios":"android"
              usersService.createSubscriptionReceipt({
                platform:pl, receipt:receipt, userId:id
              }).then(res=>{
                console.log("status of receipt",res);
              }).catch(e=>{console.log("error in receipt",e);})
            if (Platform.OS == "android") {
              if (receipt) {
                try {
                  const ackResult = await RNIap.finishTransaction(purchase);
                  RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
                  console.warn('ackResult', ackResult);
                } catch (ackErr) {
                   console.warn('ackErr', ackErr);
                }
                var pur = JSON.parse(receipt);
                const result = await usersService.validatePayment(
                  pur.productId,
                  pur.purchaseToken
                );
                console.log({ result });
              }
            }else{
              const ackResult = await RNIap.finishTransaction(purchase);
              console.log(ackResult,"PURCHASE_SUCESSFULL")
              validateIOSReceipt(receipt);
             
            }

            if (
              userInput?.choosePlanName == "Premium" ||
              userInput?.choosePlanName == "Standard"
            ) {
            }

            setUserInput({
              purchased: true,
            });
          } catch {}
        }
      );
    } catch (error) {
      // setUserInput({
      //   loader: false
      // })
    }
  }, []);

  var myCurrentDate = new Date();
  var myFutureDate = new Date(myCurrentDate);
  myFutureDate.setDate(myFutureDate.getDate() + 29);

  async function membershipPlan(productid) {
    let userId = await AsyncStorage.getItem("userId");
    if (userInput?.choosePlan == "") {
      alert("Please choose the plan");
    } else {
      if (
        userInput?.choosePlanName === "Premium" ||
        userInput?.choosePlanName === "7 Days Free Trial / Standard" ||
        userInput?.choosePlanName === "Free"
      ) {
        setUserInput({
          loader: true,
        });

        console.log("product id ", productid);
        RNIap.requestSubscription(productid)
          .then((result) => {
            let req = {
              userId: userId,
              iap_prod_id: productid,
              planId:
                userInput?.choosePlan == "6309da0e7de542001b93a996"
                  ? "6309dadbc2dacd0014060335"
                  : userInput?.choosePlan,
              transactionId: result?.transactionId,
              startDate: result?.transactionDate,
              endDate: myFutureDate,
              isPremium: userInput?.choosePlanName === "Premium" ? 1 : 0,
            };
            dispatch(iapAction(req))
              .then((res) => {
                if (
                  res.data.statusCode === 1
                  // && userInput.purchased
                ) {
                  if (userInput?.choosePlanName === "Premium") {
                    navigation.navigate("FoodPreferences", {
                      password: props.route.params.password,
                      firstName: props.route.params.firstName,
                      lastName: props.route.params.lastName,
                      age: props.route.params.age,
                      gender: props.route.params.gender,
                      planId: userInput?.choosePlan,
                    });
                  } else {
                    handleSignup("6309dadbc2dacd0014060335");
                  }
                  setUserInput({
                    loader: false,
                  });
                }
              })
              .catch((err) => {
                alert(err);
                setUserInput({
                  loader: false,
                });
              });
          })
          .catch((err) => {
            setUserInput({
              loader: false,
            });
          });

        // navigation.navigate('FoodPreferences', {
        //   password: props.route.params.password,
        //   firstName: props.route.params.firstName,
        //   lastName: props.route.params.lastName,
        //   age: props.route.params.age,
        //   gender: props.route.params.gender,
        //   planId: userInput?.choosePlan,
        //   planName: userInput?.choosePlanName,
        // });
      } else if (userInput?.choosePlanName === "Free") {
        handleSignup(userInput?.choosePlan);
      }
    }
  }

  const handleSignup = async (planId) => {
    let userId = await AsyncStorage.getItem("userId");
    let token = await AsyncStorage.getItem("nToken");
    let userName = await AsyncStorage.getItem("userName");
    let req = {
      userId: userId,
      password: props.route.params.password,
      fname: props.route.params.firstName,
      lname: props.route.params.lastName,
      age: props.route.params.age,
      gender: props.route.params.gender,
      excludeIngredients: [],
      favouriteIngredients: [],
      foodType: "",
      planId,
      incompleteSignUp: false,
      deviceToken: token,
      userName: userName,
      deviceId: Platform.OS == "android" ? "android" : "ios",
    };

    setUserInput({
      loader: true,
    });
    dispatch(authAction(req))
      .then(async (res) => {
        setUserInput({
          loader: false,
        });

        if (res.data.statusCode === 1) {
          setUserInput({
            loader: false,
          });
          await AsyncStorage.removeItem(PERSISTENCE_KEY);

          await AsyncStorage.setItem(
            "accessToken",
            res.data.responseData.accessToken
          );

        } else {
          setUserInput({
            loader: false,
          });
        }
      })
      .catch((error) => {
        setUserInput({
          loader: false,
        });
        alert(error.message);
      });
  };

  function infoModelView(item) {
    setInfoModal(true);
    setUserInput({ membershipInfoPlanById: item });
  }

  return (
    <Screen auth={"true"}>
      <ImageBackground
        source={require("../../../assets/bgSignin.png")}
        style={{ flex: 1 }}
      >
        <AuthHeader title="Sign up" onPress={() => navigation.goBack()} />
        {infoModel ? (
          <MembershipModal
            loading={true}
            close={() => setInfoModal(false)}
            infoData={userInput?.membershipInfoPlanById}
          />
        ) : null}
        <View
          style={styles.container}
          // showsVerticalScrollIndicator={false}
          // contentContainerStyle={{paddingHorizontal: 25}}
          // bounces={false}
        >
          {
            <View style={{ paddingTop: 25 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.white,
                  fontFamily: "Manrope",
                  fontWeight: "bold",
                  paddingLeft: 10,
                }}
              >
                Try the app for free
              </Text>
            </View>
          }
          <View style={{ flex: 1, marginTop: 5 }}>
            <FlatList
              data={membershipData}
              keyExtractor={({ id }, index) => id}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <>
                  {item?.status === 1 && (
                    <TouchableOpacity onPress={() => stdPlan({ item })}>
                      <View style={styles.cardView}>
                        <View
                          style={
                            userInput?.index === item._id
                              ? styles.outerCardColor
                              : styles.card
                          }
                        >
                          {/* <View style={styles.imageView}>
                            <Image
                              source={{uri: mediaPath + item.planImage}}
                              style={styles.img}
                            />
                          </View> */}
                          <View style={styles.dataView}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text style={styles.planTxt}>
                                {item.planName}
                              </Text>
                              {/* <Pressable onPress={() => infoModelView(item)}>
                                <InfoCircleIcon />
                              </Pressable> */}
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                paddingVertical: 10,
                              }}
                            >
                              {item.planName != "Free" && (
                                <Text style={styles.planCostTxt}>
                                  {item.planName ==
                                  "7 Days Free Trial / Standard"
                                    ? membershipPriceData?.standardPrice || 0
                                    : membershipPriceData?.premiumPrice || 0}
                                </Text>
                              )}
                              <Text style={styles.planDescTxt}>
                                / {item.description}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={{ paddingTop: 15 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: COLORS.white,
                            fontFamily: "Manrope",
                            fontWeight: "bold",
                            paddingLeft: 10,
                          }}
                        >
                          The plan includes
                        </Text>

                        {item.planInfo.map((i) => (
                          <View style={styles.planIncludesContainer}>
                            <Image
                              source={require("../../../assets/done.png")}
                              style={styles.doneIcon}
                            />
                            <Text
                              style={{ color: COLORS.white, paddingLeft: 10 }}
                            >
                              {i}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  )}
                  {/* )} */}
                </>
              )}
            />
          </View>
          {userInput?.loader == false ? (
            <AppButton
              title="Choose the plan"
              onPress={() => {
                console.log({
                  "userInput?.choosePlanName": userInput?.choosePlanName,
                });
                if (!userInput?.loader) {
                  Platform.OS === "ios"
                    ? userInput?.choosePlanName ===
                      "7 Days Free Trial / Standard"
                      ? membershipPlan("000")
                      : userInput?.choosePlanName === "Premium"
                      ? membershipPlan("003")
                      : membershipPlan("000")
                    : userInput?.choosePlanName ===
                      "7 Days Free Trial / Standard"
                    ? membershipPlan(
                        membershipPriceData?.iapProducts[0]?.productId
                      )
                    : userInput?.choosePlanName === "Premium"
                    ? membershipPlan(
                        membershipPriceData?.iapProducts[1]?.productId
                      )
                    : membershipPlan("009");
                }
              }}
            />
          ) : (
            <></>
          )}
          <View></View>
          {userInput?.loader == false ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
                marginTop: "10%",
              }}
            >
              <SignupStepsNum num1="8" />
            </View>
          ) : (
            <></>
          )}
        </View>
      </ImageBackground>
      {userInput?.loader && (
        <View style={styles.loadingWholeView}>
          <View style={styles.transparentsheetView} />
          <ActivityIndicator size={"large"} color="#0DB8DA" />
        </View>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(7,7,7,0.4)",
    padding: 10,
  },
  cardView: {
    alignItems: "center",
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    opacity: 1,
    borderRadius: 6,
  },
  imageView: {
    width: "40%",
    padding: 2,
    backgroundColor: "#2a2929",
  },
  dataView: {
    width: "100%",
    padding: 14,
    backgroundColor: "#2a2929",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  img: {
    width: "100%",
    flex: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  planTxt: {
    color: COLORS.lightBlue,
    fontSize: 18,
  },
  planDescTxt: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  planCostTxt: {
    color: COLORS.lightGreen,
    fontSize: 14,
    // paddingTop: 3,
    textTransform: "capitalize",
    paddingRight: 10,
  },
  outerCardColor: {
    flexDirection: "row",
    width: "100%",
    opacity: 1,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: COLORS.lightGreen,
  },

  loadingWholeView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000040",
  },

  transparentsheetView: {
    backgroundColor: COLORS.black,
    opacity: 0.5,
  },
  doneIcon: {
    width: 20,
    height: 20,
  },
  planIncludesContainer: {
    flexDirection: "row",
    marginVertical: 5,
    backgroundColor: "rgba(52, 52, 52, 0.4)",
    padding: 10,
  },
});
export default MembershipPlan;
