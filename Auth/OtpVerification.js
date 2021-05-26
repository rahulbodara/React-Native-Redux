import React from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { Spinner } from "native-base";
import { sendTFACode, userLoginHistory, verifyCode } from "../Service/api";
import { connect } from "react-redux";
import { actions as authActions } from "../Reducers/auth";
import { actions as authLogin } from "../Reducers/authReducer";
import Geolocation from "@react-native-community/geolocation";
import DeviceInfo from "react-native-device-info";
import publicIP from "react-native-public-ip";
import { getAllDeviceInfo } from "../Utils/device_info";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

class OTPVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      keyboardShow: false,
      otpInput: "",
      check: false,
      timer: 5,
      disabled: true,
      latitude: "",
      longitude: "",
      userId: "",
      deviceUDID: "",
      ipAddress: "",
      time: false,
      deviceInfo: [],
      clickCheck: false,
      dataCheck: false,
    };
  }

  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({ longitude: currentLongitude });
        this.setState({ latitude: currentLatitude });
        console.log("Value of latitude in otpIS", this.state.latitude)
      },
      (error) => {
        console.log("Error ", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
      }
    );
  };

  componentDidMount = async () => {
    if (Platform.OS == "ios") {
      this.getOneTimeLocation()
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permission granted");
          this.getOneTimeLocation();
        } else {
          console.log("Permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    publicIP().then((ip) => {
      this.setState({ ipAddress: ip });
    });

    var uuid = DeviceInfo.getUniqueId();
    this.setState({ deviceUDID: uuid });
    var deviceInformation = await getAllDeviceInfo();
    this.setState({ deviceInfo: deviceInformation });
    this.setState({ timer: 60, disabled: true });
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    clearInterval(this.clockCall);
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardShow: false });
  };

  decrementClock = () => {
    if (this.state.timer === 0) {
      console.log("disabled");
      this.setState({ disabled: false });
      clearInterval(this.clockCall);
      this.setState((prevstate) => ({ timer: 0 }));
    } else {
      this.setState((prevstate) => ({ timer: prevstate.timer - 1 }));
    }
  };

  async otpCalled() {
    if (this.state.text == "") {
      Toast.show({
        text: "Please Enter OTP",
        buttonText: "Okay",
      });
    } else if (this.state.text.length < 7) {
      Toast.show({
        text: "Please Enter valid OTP ",
        buttonText: "Okay",
      });
    } else {
      console.log(
        "Valure for user ID IS",
        this.props.route.params.user.user[0].Phone
      );
      const phone = this.props.route.params.user;
      let tokenData = {
        phone: this.props.route.params.phone,
        token: this.state.text,
      };
      this.setState({ dataCheck: true });
      console.log("OTP is calling", tokenData);
      const data = await verifyCode(tokenData);
      console.log("Value of new of data is", data);
      console.log("Value of user from other screen is", this.props.route.params.user)
      var data1 = JSON.stringify(this.state.deviceInfo).toString().replace(/"/g, "'")
      if (data.status == true) {
        var params = {
          UserID: this.props.route.params.user.user[0].UserID,
          LoginType: 1,
          Success: 0,
          IPAddress: this.state.ipAddress,
          uuid: this.state.deviceUDID,
          DeviceFootprint: data1,
          Longitude: this.state.longitude,
          Latitude: this.state.latitude,
        };
        const jsonResponse = await userLoginHistory(params);
        this.setState({ dataCheck: false });
        this.props.loggedin(this.props.route.params.user);
        this.props.navigation.navigate("Home");
      } else {
        this.setState({ dataCheck: true });
        var params2 = {
          UserID: this.props.route.params.UserID.user[0].UserID,
          LoginType: 3,
          Success: 0,
          IPAddress: this.state.ipAddress,
          uuid: this.state.deviceUDID,
          DeviceFootprint: data1,
          Longitude: this.state.longitude,
          Latitude: this.state.latitude,
        };
        this.setState({ dataCheck: false })
        const respose = await userLoginHistory(params2)
        alert("Please Enter valid number");
      }
      this.props.navigation.navigate("Home");

      this.clockCall = setInterval(() => {
        this.decrementClock();
      }, 1000);
      this.setState({ timer: 60, disabled: true });
    }
  }
  async sendOTP() {
    let user = {
      phone: this.props.route.params.phone,
    };
    const response = await sendTFACode(user);
    console.log("Value of send OTP is", response);
    console.log("Value of timer is", this.state.timer)
    this.setState({ timer: 60, disabled: true });
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  }

  render() {
    return (
      <ImageBackground
        style={styles.ImageBackground}
        source={require("../../assets/images/slide1.png")}
      >
        <View
          style={{
            ...styles.container,
            paddingBottom: this.state.keyboardShow ? 0 : 40,
          }}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.96)", "rgba(255, 255, 255, 1)"]}
            style={{ width: "95%" }}
          >
            <View style={styles.subContainer}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 18,
                    width: "100%",
                  }}
                >
                  <View style={{ width: "10%" }}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <View style={{ marginLeft: 15 }}>
                        <Icon
                          type="MaterialIcons"
                          name="arrow-back-ios"
                          color="#EC6531"
                          size={20}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: "80%" }}>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#016295",
                          fontSize: 12,
                        }}
                      >
                        Verification
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: "10%" }}></View>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    marginTop: 88,
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#4A4A4A",
                        lineHeight: 24,
                        fontWeight: "bold",
                      }}
                    >
                      Enter OTP
                    </Text>
                  </View>
                  <View style={{ height: 24 }}></View>
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      maxLength={7}
                      onChangeText={(text) => this.setState({ text })}
                      style={styles.textInput}
                    />
                  </View>
                  <View style={{ height: 100 }}></View>
                  <View style={{ width: "100%", flexDirection: "row" }}>
                    {this.state.check == false && this.state.disabled ? (
                      <View
                        style={{
                          width: "45%",
                          marginLeft: 10,
                        }}
                      >
                        <TouchableOpacity
                          disabled={true}
                        >
                          <LinearGradient
                            colors={["#4a4a4a", "#4a4a4a"]}
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                height: 45,
                                width: "35%",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: "white",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  fontSize: 13
                                }}
                              >
                                Resend
                              </Text>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    ) : (
                        <View style={{ width: "45%", marginLeft: 10 }}>
                          <TouchableOpacity
                            onPress={() => this.sendOTP()}
                          >
                            <LinearGradient
                              colors={["#8ED6F8", "#55ACEE"]}
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  height: 45,
                                  width: "35%",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    fontSize: 13
                                  }}
                                >
                                  Resend
                              </Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                          <Text>
                          </Text>
                        </View>
                      )}
                    <View style={{ width: "45%", marginLeft: 10 }}>
                      <TouchableOpacity
                        onPress={() => this.otpCalled()}
                      >
                        <LinearGradient
                          colors={["#8ED6F8", "#55ACEE"]}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View
                            style={{
                              height: 45,
                              width: "35%",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: 13
                              }}
                            >
                              Submit
                            </Text>
                            {this.state.dataCheck ? (
                              <View style={{ marginLeft: 20 }}>
                                <Spinner color="white" size={25} />
                              </View>
                            ) : null}
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#000",
                      marginTop: 50,
                    }}
                  >
                    {this.state.timer === 0
                      ? ""
                      : "Resend OTP in : " + this.state.timer}

                  </Text>
                </View>
              </ScrollView>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  ImageBackground: {
    flex: 1,
    width: null,
    height: null,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba( 0, 0, 0, 0.6 )",
    paddingLeft: 19,
    paddingRight: 19,
    paddingTop: 40,
  },
  subContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  textInputContainer: {
    marginBottom: 20,
    width: 360,
    height: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
    fontSize: 10,
    height: 42,
    width: 32,
  },
  textInput: {
    height: 40,
    width: "80%",
    borderColor: "#000",
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    letterSpacing: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  disabled: {
    height: 40,
    width: "100%",
    backgroundColor: "grey",
  },
  enabled: {
    height: 40,
    width: "100%",
    backgroundColor: "blue",
  },
});

const mapStateToProps = (state) => {
  return {
    logindata: state.login,
    loggedIn: state.authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loggedin: (val) => {
      dispatch(authActions.signin(val));
    },
    authLogin: (val) => {
      dispatch(authLogin.authlogin(val));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OTPVerification);
