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
  Alert,
  Platform,

} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon, Toast, Left, Body, Right, Spinner } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { actions as authActions } from "../Reducers/auth";
import { actions as authLogin } from "../Reducers/authReducer";
import { actions as upcomingStay_Action } from "../Reducers/upcomingstay";
import {
  checkEmail,
  userLogin,
  userLoginHistory,
} from "../Service/api";
//import Geolocation from "@react-native-community/geolocation";
import Geolocation from 'react-native-geolocation-service'
import DeviceInfo from "react-native-device-info";
import publicIP from "react-native-public-ip";
import { getAllDeviceInfo } from "../Utils/device_info";
import { openSettings } from 'react-native-permissions'
import { LOCATIONERROR } from "../Reducers/actionTypes";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      keyboardShow: false,
      showPassword: false,
      latitude: "",
      longitude: "",
      userId: "",
      deviceUDID: "",
      ipAddress: "",
      error: "",
      deviceInfo: [],
      dataCheck: false,
      locationFlage: '0'
    };
  }

  componentDidMount = async () => {
    console.log("login screen ", this.props.authLogin);
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    var ipaddress = await DeviceInfo.getIpAddress();
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

  checkUser = async () => {
    var data = JSON.stringify(this.state.deviceInfo).toString()
    console.log("Value of device information is", data)
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    this.setState({ dataCheck: true });
    if (this.state.email !== "") {
      if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
      ) {
        this.setState({ dataCheck: false });
        alert("Please Enter Valid Email ID");
        return;
      }
    } else {
      this.setState({ dataCheck: false });
      alert("Please Enter Your Email ID");
      return;
    }
    var response = await checkEmail(this.state.email);
    console.log("Value check for response is", response);
    if (response.status == true) {
      this.setState({ showPassword: true, dataCheck: false });
    } else {
      alert("This Email ID is NOT Available");
      this.setState({ showPassword: false, dataCheck: false });
    }
    var newresponse = this.setState({ userId: response.data.id });
  };

  getOneTimeLocation = async () => {
    console.log("Value of location is")
    return await new Promise((resolve, reject) => Geolocation.getCurrentPosition(
      (position) => {
        console.log("Location alert____+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_")
        const currentLongitude = JSON.stringify(position.coords.longitude);
        console.log("Value of latitude is in getLatitude", position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);
        let latlong = {
          lat: currentLatitude,
          long: currentLongitude
        }
        resolve(latlong);
        return latlong;
      },
      (error) => {
        console.log("Error ", error.message);
        reject(error);
        this.setState({ dataCheck: false })
        openSettings().catch(() => console.warn('cannot open settings'));

      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        //maximumAge: 1000 * 60 * 3,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    ));
   
  };

  cameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Example App Camera Permission',
          message: 'Example App needs access to your camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        proceed();
      } else {
        //this.props.navigation.navigate("Login");
        openSettings().catch(() => console.log('cannot open settings'))
      }
    } else {
      proceed();
    }
  };
  loginPressed = async () => {
    if (this.state.email === "") {
      Toast.show({
        text: "Please Enter Your Email ID.",
        buttonText: "Okay",
      });
      return;
    } else if (this.state.password === "") {
      Toast.show({
        text: "Please Enter Your Password.",
        buttonText: "Okay",
      });
      return;
    }

    this.setState({ dataCheck: true });
    var data = JSON.stringify(this.state.deviceInfo).toString().replace(/"/g, "'")
    console.log("Device FootPrint value ", typeof data);
    var params = {
      email: this.state.email,
      password: this.state.password,
      DeviceFootprint: data
    };

    var response = await userLogin(params);
    if (response == false) {
      console.log("=======================================");
      this.setState({ dataCheck: false });
      alert("Please check your email and password again");
      var reduxdata = {
        token: "",
        user: [],
        checksumdata: "",
      };
      this.props.loggedin(reduxdata);
      this.props.navigation.navigate("Login");
    }
    response.checksumdata = "";

    if (response.status == true) {
      this.props.loggedin(response);
      if (Platform.OS === "ios") {
        var latlongdata = await this.getOneTimeLocation();
        this.cameraPermission()
        var result = true;
      } else {
        var result = true;
        //var latlongdata = await this.getOneTimeLocation();
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Wanderhome App",
              message: "The Wanderhome app uses your location",
              buttonNeutral: "Allow once",
              buttonNegative: "Denied",
              buttonPositive: "Allow",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            var result = true;
            console.log("Permission granted", granted);
            var latlongdata = await this.getOneTimeLocation();
            console.log("Value of latlong dtata issssssss",latlongdata)
            //this.cameraPermission()
          } else {
            this.setState({ dataCheck: false })
            openSettings().catch(() => console.warn('cannot open settings'));
            console.log("Permission denied");
            Alert.alert("Wanderhome require location for login");
            response.checksumdata = "";
            this.props.loggedin(response);
            this.setState({ dataCheck: false });
            this.props.navigation.navigate("Login");
          }
        } catch (err) {
          console.warn(err);
        }
        // this.cameraPermission()
      }

      await AsyncStorage.setItem("@user_token", response.token);
      await AsyncStorage.setItem("@user_data", JSON.stringify(response.user));
      console.log("Value of isFTA is check here", response.isTFA);
      if (
        response.isTFA == false &&
        response.user[0].DeviceChecksums != null &&
        result == true
      ) {
        var reduxdata = {
          token: response.token,
          user: response.user,
          checksumdata: response.user[0].DeviceChecksums,
        };
        console.log("Valu of latititude in login is", this.state.latitude);
        console.log("Value of error is for lat", this.state.error)
        var params1 = {
          UserID: this.state.userId,
          LoginType: 1,
          Success: 1,
          IPAddress: this.state.ipAddress,
          uuid: this.state.deviceUDID,
          DeviceFootprint: data,
          Longitude: latlongdata.long,
          Latitude: latlongdata.lat
        };
        console.log("Value of param1 is", params1);
        var respo = await userLoginHistory(params1);
        if (respo == false) {
          alert("Something went to wrong");
          this.setState({ dataCheck: false })
        } else {
          this.props.loggedin(reduxdata);
          this.props.authLogin(true);
          console.log("Value of auth login is", respo);
          this.setState({ dataCheck: false });
          this.props.navigation.navigate("Home");
        }
      } else {
        console.log("Value of data in else part of login history", data)
        if (
          response.isTFA == true ||
          response.user[0].DeviceChecksums == null
        ) {
          var params2 = {
            UserID: this.state.userId,
            LoginType: 2,
            Success: 0,
            IPAddress: this.state.ipAddress,
            uuid: this.state.deviceUDID,
            DeviceFootprint: data,
            Longitude: latlongdata.long,
            Latitude: latlongdata.lat
          };
          console.log("Value of response of data is", params2);
          var respo2 = await userLoginHistory(params2);
          console.log("Value of respo2 is", respo2);
          if (respo2.status == true) {
            this.props.loggedin(response);
            console.log("Value of props data is", response);
            var reduxdata = {
              token: response.token,
              user: response.user,
              deviceCheckSum: "",
            };
            this.setState({ dataCheck: false });
            this.props.navigation.navigate("PhoneNumber", {
              UserID: reduxdata,
            });
          }
        }
      }
    }
  };

  login = async () => {
    try {
      await AsyncStorage.setItem("@login_data", "1");
      this.props.loggedin("1");
      console.log(this.props);
      this.props.navigation.navigate("Home");
    } catch (e) {
    }
  };

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
                      LOG IN
                    </Text>
                  </View>
                </Body>
                <Right></Right>
              </View>

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 88,
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
                    Welcome Back
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
                    placeholder={"Email Address"}
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                  />
                  <View style={{ height: 20 }}></View>
                  {this.state.showPassword ? (
                    <TextInput
                      style={{
                        height: 45,
                        width: screenWidth - 85,
                        borderColor: "gray",
                        borderRadius: 2,
                        borderWidth: 0.5,
                      }}
                      textAlign={"center"}
                      secureTextEntry={true}
                      placeholder={"Password"}
                      onChangeText={(text) => this.setState({ password: text })}
                      value={this.state.password}
                    />
                  ) : null}
                </View>
                <View style={{ height: 100 }}></View>
                <View style={{}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.state.showPassword
                        ? this.loginPressed()
                        //? this.getOneTimeLocation()
                        : this.checkUser()
                    }
                  >
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
                          {this.state.showPassword ? "LOG IN" : "NEXT"}
                        </Text>
                        {this.state.dataCheck ? (
                          <View style={{ marginLeft: 20 }}>
                            <Spinner color="white" size={25} />
                          </View>
                        ) : null}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ForgetPassword")
                    }
                  >
                    <View
                      style={{
                        marginTop: 13,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        height: 19,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: "#0A6395", fontSize: 10 }}>
                        I FORGOT MY LOGIN EMAIL
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logindata: state.login,
    loggedIn: state.authReducer,
    upcomingstay_data: state.upcoming_stay,
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
    upcomingstay: (val) => {
      dispatch(upcomingStay_Action.setUpcomingStay(val));
    },
  };
};

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
    paddingTop: 50,
  },
  subContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
