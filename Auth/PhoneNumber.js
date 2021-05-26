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
import { Body, Icon, Left, Right, Spinner } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import { sendTFACode, userLoginHistory } from "../Service/api";
import { connect } from "react-redux";
import { actions as authActions } from "../Reducers/auth";
import { actions as authLogin } from "../Reducers/authReducer";
import Geolocation from "@react-native-community/geolocation";
import DeviceInfo from "react-native-device-info";
import publicIP from "react-native-public-ip";
import { getAllDeviceInfo } from "../Utils/device_info";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

class PhoneNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      keyboardShow: false,
      latitude: "",
      longitude: "",
      mobilevalidate: true,
      userId: "",
      deviceUDID: "",
      ipAddress: "",
      deviceInfo: [],
      dataCheck: false,
    };
  }

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    if (Platform.OS == "ios") {
      this.getOneTimeLocation()
    }
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
    var ipaddress = await DeviceInfo.getIpAddress();
    console.log("Value check for IPaddress is ", ipaddress);
    this.setState({ ipAddress: ipaddress });

    var uuid = DeviceInfo.getUniqueId();
    this.setState({ deviceUDID: uuid });

    var deviceInformation = await getAllDeviceInfo();

    this.setState({ deviceInfo: deviceInformation });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardShow: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardShow: false });
  };

  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        this.setState({ longitude: currentLongitude });
        this.setState({ latitude: currentLatitude });
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

  async sendOTP() {
    if (this.state.text == "" || this.state.text !== "+91" + this.state.text &&
      this.state.text.length <= 10) {
      alert("Please enter valid number", this.state.text.length)
      this.setState({ dataCheck: false })
    }
    else {
      this.setState({ dataCheck: true });
      let user = {
        phone: this.state.text,
        UserID: this.props.route.params.UserID.user[0].UserID,
      };
      const data = await sendTFACode(user);
      console.log("Valu of data is", data);

      if (data.status == true) {
        this.setState({ dataCheck: false });
        this.props.navigation.navigate("Otpverification", {
          user: this.props.route.params.UserID,
          phone: user.phone
        });
      } else {
        var data1 = JSON.stringify(this.state.deviceInfo).toString().replace(/"/g, "'")
        this.setState({ dataCheck: false });
        const userID = this.props.route.params.UserID.user[0].UserID;
        var tempData = {
          UserID: this.props.route.params.UserID.user[0].UserID,
          LoginType: 2,
          Success: 0,
          IPAddress: this.state.ipAddress,
          uuid: this.state.deviceUDID,
          DeviceFootprint: data1,
          Longitude: this.state.longitude,
          Latitude: this.state.latitude,
        };
        var respo2 = await userLoginHistory(tempData);
        alert("Please Enter valid number");
      }
    }
  }

  render() {
    const userID = this.props.route.params.UserID.user[0].UserID;
    console.log("Value of user is is", userID);
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
                  }}
                >
                  <Left>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <View style={{ marginLeft: 15 }}>
                        <Icon
                          type="MaterialIcons"
                          name="arrow-back-ios"
                          color="#EC6531"
                          size={10}
                          style={{
                            color: "#EC6531",
                            width: 12,
                            height: 20,
                            fontSize: 20,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </Left>
                  <Body>
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
                  </Body>
                  <Right></Right>
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
                      Welcome
                    </Text>
                  </View>
                  <View style={{ height: 24 }}></View>
                  <View>
                    <TextInput
                      style={{
                        height: 45,
                        width: screenWidth - 85,
                        borderColor: "gray",
                        borderRadius: 2,
                        borderWidth: 0.5,
                      }}
                      textAlign={"center"}
                      keyboardType="phone-pad"
                      placeholder={"Your Mobile Number"}
                      onChangeText={(text) => this.setState({ text })}
                      value={this.state.number}
                    />
                  </View>
                  <View style={{ height: 100 }}></View>
                  <View style={{}}>
                    <TouchableOpacity onPress={() => this.sendOTP()}>
                      <LinearGradient colors={["#8ED6F8", "#55ACEE"]}>
                        <View
                          style={{
                            height: 45,
                            width: 265,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumber);
