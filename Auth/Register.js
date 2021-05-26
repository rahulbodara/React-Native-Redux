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
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon, Toast, Spinner } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { checkEmail, userRegister } from "../Service/api";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      keyboardShow: false,
      showPassword: false,
      dataCheck: false,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

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
    this.setState({ dataCheck: true });
    if (this.state.email !== "") {
      if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)
      ) {
        alert("Please Enter Valid Email ID");
        this.setState({ dataCheck: false })
        return;
      }
    } else {
      alert("Please Enter Your Email ID.");
      this.setState({ dataCheck: false })
      return;
    }
    var response = await checkEmail(this.state.email);
    if (response.status) {
      console.log("Hello console");
      this.setState({ showPassword: true, dataCheck: false });
    } else {
      alert("This Email ID is NOT Available");
      this.setState({ showPassword: false, dataCheck: false });
    }
  };

  registerPressed = async () => {
    this.setState({ dataCheck: true });
    if (this.state.email === "") {
      alert("Please Enter Your Email ID.");
      this.setState({ dataCheck: false })
      return;
    } else if (this.state.password === "") {
      alert("Please Enter Your Password.");
      return;
    }
    console.log("Working register")
    var params = {
      email: this.state.email,
      password: this.state.password,
      isInvite: false,
      country_code: "IN",
    };
    console.log("Value of params is", params)
    var response = await userRegister(params);
    console.log("Register api call response  ", response);
    if (response.status) {
      this.setState({ dataCheck: false });
      this.props.navigation.navigate("Login");
    } else {
      alert("Please check your email and password again.");
      this.setState({ dataCheck: false });
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
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                >
                  <View style={{ marginLeft: 16 }}>
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
                <View
                  style={{
                    marginLeft: 105,
                    marginRight: 145,
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
                    REGISTER
                  </Text>
                </View>
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
                    Let's Get Started
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
                        ? this.registerPressed()
                        : this.checkUser()
                    }
                  >
                    <LinearGradient colors={["#8ED6F8", "#55ACEE"]}>
                      <View
                        style={{
                          height: 50,
                          width: screenWidth - 100,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          {this.state.showPassword ? "REGISTER" : "NEXT"}
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
    paddingTop: 50,
  },
  subContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});

export default Register;
