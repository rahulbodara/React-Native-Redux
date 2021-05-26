import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Animated,
  TouchableHighlight,
  BackHandler,
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
  NativeModules
} from "react-native";
import {
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Body,
  Text,
  Right,
  Spinner,
} from "native-base";
import LinearGradient from "react-native-linear-gradient";
import ListComponent from "../Components/ListComponent";
import { actions as upcomingStay_Action } from "../Reducers/upcomingstay";
import { actions as upcomingFeed_Action } from "../Reducers/upcomingfeed";
import { actions as authLogin } from "../Reducers/authReducer";
import { actions as refreshNotification_Action } from "../Reducers/appRefreshNotification";
import { actions as getNewNotificationAction } from "../Reducers/getNewNotificationReducer";
import { actions as getAllNotificationAction } from "../Reducers/getNewNotificationReducer";
import { actions as getFeedDataNotification } from "../Reducers/getNewNotificationReducer";
import { actions as homeControlAction } from "../Reducers/homeControllerReducer";
import {
  upcomingStay,
  upcomingFeed,
  weatherDataAPI,
  appRefreshtoken,
  upcomingGuideitem,
  upcomingFeedListItem,
  clearrefreshNotification,
  getNewnotification,
  setClearNotification,
  HomeControlData
} from "../Service/api";
import { actions as weatherData_Action } from "../Reducers/weather";
import { connect } from "react-redux";
import { Months } from "../Utils/config";
import AlertSidebar from "./AlertSidebar";
import Modal from "react-native-modal";
import Geolocation from "@react-native-community/geolocation";
import { getAllDeviceInfo } from "../Utils/device_info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Alldestination from "../Utils/navigation_config";
import ModalContainer from "../Container/ModalContainer";
import MyStatusBar from "../Components/MyStatusBar";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);

var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var ampm = hours >= 12 ? "PM" : "AM";
var currentTime = `${hours}:${minutes}:${seconds} ${ampm}`


const { StatusBarManager } = NativeModules

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
      loading: false,
      startdate: "",
      enddate: "",
      isSideMenuVisible: false,
      latitude: "",
      longitude: "",
      newData: [],
      checkUpdate: true,
      dataCheck: true,
      isVisible: false,
      modalCheck: true,
    };
  }

  showList = (value) => {
    var id = Alldestination;
    var destination = Alldestination.filter((data, index) => {
      if (data.id == value.DestinationID) {
        this.props.navigation.navigate(data.screenName, { data: value });
      }
    });
  };

  appRefreshData = async () => {
    console.log("APp data is refresh")
    var propertyId = this.props.upcomingstay_data.upcoming_stay[0].PropertyID;
    console.log("Value of reducer props data is", this.props.refresh.data.PropertyInfoUpdate)
    if (this.props.refresh.data.PropertyInfoUpdate == 1) {
      await upcomingStay(this.props.logindata.UserID);
      console.log("Value of upComing data is called after getting 1")
    }
    if (this.props.refresh.data.FeedUpdate == 1) {
      const responsedata = await upcomingFeed(propertyId);
      let temp = responsedata.data.filter((data) => {
        return data.GenerateNotification == 1;
      });
      const tempremaining = newTemp.filter(
        ({ id: id1 }) => !temp.some(({ id: id2 }) => id2 === id1)
      );
      const newTempremaining = temp.filter(
        ({ id: id1 }) => !newTemp.some(({ id: id2 }) => id2 === id1)
      );
      const samedata = temp.filter(({ id: id1 }) =>
        newTemp.some(({ id: id2 }) => id2 === id1)
      );
      var finalTempData = [
        ...samedata,
        ...tempremaining,
        ...newTempremaining,
      ];
      this.props.getFeedDataNotificationAction(finalTempData);
      console.log("Value of newTemp data is", finalTempData);
    }
    if (this.props.refresh.data.GuidesUpdate == 1) {
      await upcomingGuideitem(propertyId);
      console.log("Home Guide is called");
    }
    if (this.props.refresh.data.ListItemsUpdate == 1) {
      await upcomingFeedListItem(marketID);
    }
  }
  apiCall = async () => {
    if (Platform.OS === "ios") {
      this.getOneTimeLocation();
    } else {
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
    const deviceinfo = await getAllDeviceInfo();
    const response = await upcomingStay(this.props.logindata.user[0].UserID);
    console.log("Value of response in upcoming is", response)
    console.log("value of property ID is",)
    if (response.status) {
      this.props.upcomingstay(response.data);
      var propertyId = this.props.upcomingstay_data.upcoming_stay[0].PropertyID;
      var marketID = this.props.upcomingstay_data.upcoming_stay[0].MarketID;
      var zipCode = this.props.upcomingstay_data.upcoming_stay[0].ZIPCode;
      console.log("Value of zipcode is",zipCode)
      // upcoming feedAPI
      const feed_response = await upcomingFeed(propertyId);
      if (feed_response.status) {
        this.props.upcomingfeed(feed_response.data);
      }
      let newTemp = feed_response.data.filter((data) => {
        return data.GenerateNotification === 1;
      });
      //[{},{}]
      let addfeedflag = newTemp.reduce((acc, cur, index) => {
        let d = { ...cur, feed: true };
        acc.push(d);
        return acc;
      }, []);
      this.props.getFeedDataNotificationAction(addfeedflag);
      const refreshNotificationResponse = await appRefreshtoken(
        propertyId,
        this.props.logindata.user[0].UserID
      );
      this.props.appRefreshNotificationData(refreshNotificationResponse);
      const clearNotification = await clearrefreshNotification(
        propertyId,
        this.props.logindata.UserID
      );
      const getNewNotification = await getNewnotification(
        this.props.logindata.user[0].UserID
      );

      let addNewFlag = getNewNotification.data.reduce((acc, cur, ind) => {
        let data = { ...cur, feed: false };
        acc.push(data);
        return acc;
      }, []);

      var final = [...this.props.feedData, ...addNewFlag];
      this.props.getNewNotificationAction(final);
      const setNotification = await setClearNotification(
        this.props.logindata.user[0].UserID
      );
      const wheatherAPIdata = await weatherDataAPI(zipCode);
      console.log("Value of weather data is",wheatherAPIdata,zipCode)
      this.props.weatherDataAction(wheatherAPIdata);
      this.setState({ dataCheck: false, modalCheck: true });
    } else {
      this.setState({ modalCheck: false, dataCheck: false });
      console.log("Hello Else part");
    }
  };

  setThankModalVisible = (visible) => {
    console.log("visible ", visible);
    this.setState({ isThankVisible: false });
    alert("We will contact you soon");
  };

  componentDidMount = async () => {
    // console.log("Value of notification data is in componentDidMount",this.props.getNewNotification.length)
    if (this.props.getNewNotification.length === 0) {
      console.log("Helllo Blank array")
      this.apiCall()
    }
    else {
      //console.log("Please call API")
      this.setState({ dataCheck: false })
    }
    // this.apiCall()
    // this.appRefreshData()
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this.appRefreshData()
      console.log("Hello subscriber")
    });
  };


  componentWillUnmount() {
    this._unsubscribe();
  }

  getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);

        const currentLatitude = JSON.stringify(position.coords.latitude);

        this.setState({ longitude: currentLongitude });
        this.setState({ longitude: currentLatitude });
      },
      (error) => {
        console.log("Error ", error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  nth = (d) => {
    if (d > 3 && d < 21) return "TH";
    switch (d % 10) {
      case 1:
        return "ST";
      case 2:
        return "ND";
      case 3:
        return "RD";
      default:
        return "TH";
    }
  };



  toggleSideMenu = () => {
    console.log("backdrop");
    this.setState({ isSideMenuVisible: !this.state.isSideMenuVisible });
    this.appRefreshData();
  };

  render() {
    if (this.state.dataCheck) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner color="green" />
        </View>
      );
    } else {
      let startdate = new Date(
        this.props.upcomingstay_data.upcoming_stay[0] == undefined
          ? ""
          : this.props.upcomingstay_data.upcoming_stay[0].StartDate
      );

      let enddate = new Date(
        this.props.upcomingstay_data.upcoming_stay[0] == undefined
          ? ""
          : this.props.upcomingstay_data.upcoming_stay[0].EndDate
      );
      {
        this.props.upcomingstay_data.upcoming_stay[0] == undefined
          ? ""
          : this.props.upcomingstay_data.upcoming_stay[0].EndDate;
      }
      let smonth = Months[startdate.getMonth()];
      let emonth = Months[enddate.getMonth()];
      let sdate = `${startdate.getDate()}${this.nth(startdate.getDate())}`;
      let edate = `${enddate.getDate()}${this.nth(enddate.getDate())}`;
      var zipCode = this.props.upcomingstay_data.upcoming_stay[0].ZIPCode;
      console.log("Value of zipcode is",zipCode)
      if (this.state.modalCheck) {
        console.log("Value of weather is in small letter", this.props.weatherData.uweatherData.data.city)
        switch (this.props.weatherData.uweatherData.data.weather.toLowerCase()) {
          case "clear":
            {
              console.log("Value of switch is", this.props.weatherData.uweatherData.data.time)
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/Clear.png")
                console.log("Value of image link is", imagLink)
              }
              else {
                console.log("Value of date time isx", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/ClearNight.png")
                console.log("Value of image link is in else", niImage)
              }
              break
            }
          case "clouds":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/cloudy.png")
              }
              else {
                console.log("Value of date time isx", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/cloudyNi.png")
              }
              break
            }
          case "rain":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/showerRain.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/showerRainNi.png")
              }
              break
            }
          case "shower":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/hShower.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/hShowerNg.png")
              }
              break
            }
          case "thunderstorm":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/thunderstromeGM.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/thunderstrome.png")
              }
              break
            }
          case "snow":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/snow.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/snowNG.png")
              }
              break
            }
          case "haze":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/hazeGM.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/haze.png")
              }
              break
            }
          case "fog":
            {
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/fog.png")
              }
              else {
                console.log("Value of date", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/fogNG.png")
              }
              break
            }
          case "windy":
            {
              console.log("Value of switch is", this.props.weatherData.uweatherData.data.weather.toLowerCase())
              if (this.props.weatherData.uweatherData.data.time.includes("AM")) {
                console.log("Value of greterThan 12 AM Morning Image", this.props.weatherData.uweatherData.data.time)
                var imagLink = require("../../assets/images/backgroundImages/windy.png")
              }
              else {
                console.log("Value of date in windy", this.props.weatherData.uweatherData.data.time)
                var niImage = require("../../assets/images/backgroundImages/winyNG.png")
              }
              break
            }
        }
        console.log("Value of image link is", this.props.weatherData.uweatherData.data.time, imagLink)
        return (
          <ImageBackground
            style={{ ...styles.container, width: null, height: null }}
            source={this.props.weatherData.uweatherData.data.time.includes("AM") ? imagLink : niImage}
          >
            <MyStatusBar
              backgroundColor="black" barStyle="light-content"
            />
            <ScrollView>
              <Modal
                isVisible={this.state.isSideMenuVisible}
                onBackdropPress={this.toggleSideMenu}
                onSwipeComplete={this.toggleSideMenu}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                swipeDirection="right"
                useNativeDriver
                hideModalContentWhileAnimating
                propagateSwipe
                style={styles.sideMenuStyle}
              >
                <AlertSidebar toggleSideMenu={this.toggleSideMenu} />
              </Modal>
              <View
                style={{
                  marginTop: Platform.OS == 'ios' ? StatusBarManager.HEIGHT - 10 : StatusBarManager.HEIGHT - 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Left style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.toggleDrawer()}
                  >
                    <Icon
                      type="SimpleLineIcons"
                      name="menu"
                      style={{
                        fontSize: 20,
                        paddingLeft: 10,
                        color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#072a48" : "white",
                      }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body style={{ flex: 1, alignItems: "center" }}>
                  <Title style={{ color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#072a48" : "white" }}>Wanderhome</Title>
                </Body>
                <Right style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ isSideMenuVisible: true })}
                  >
                    <Icon
                      type="Ionicons"
                      name="notifications"
                      style={{
                        fontSize: 22,
                        paddingRight: 10,
                        color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#072a48" : "white",
                      }}
                    />
                  </TouchableOpacity>
                </Right>
              </View>

              <View style={{ height: 54 }}></View>
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#F66C40" : "white" }}
                >
                  WELCOME
                </Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 40, color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#000000" : "white" }}>
                  {this.props.logindata == undefined
                    ? ""
                    : this.props.logindata.user[0].FirstName}
                </Text>
              </View>
              <View style={{ height: 22 }}></View>
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#F66C40" : "white" }}
                >
                  YOUR UPCOMING STAY
                </Text>
              </View>
              <View style={{ height: 5 }}></View>
              <View
                style={{
                  width: "100%",
                }}
              >
                <View
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  {/* <LinearGradient
                    colors={[
                      "rgba(250, 250, 250, 0.5)",
                      "rgba(239, 241, 244,0.5)",
                    ]}
                    style={{
                      height: 115,
                      width: "49%",
                      borderWidth: 1,
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  > */}
                  <View style={{
                    height: 115,
                    width: "49%",
                    borderWidth: 1,
                    borderColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.4)"
                  }}>
                    <View style={{ ...styles.weatherContainer, borderBottomColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0, 47, 95,0.2)" : "white" }}>
                      <Text style={{ fontSize: 30, color: this.props.weatherData.uweatherData.data.time.includes("AM") ? 'black' : "white" }}>
                        {this.props.weatherData.uweatherData.data == undefined
                          ? ""
                          : this.props.weatherData.uweatherData.data.temp.toFixed(
                            2
                          )}
                          °
                        </Text>
                      <Text style={{ ...styles.weatherCityText, color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#4A4A4A" : "white" }}>
                        {" "}
                        {this.props.weatherData.uweatherData.data == undefined
                          ? ""
                          : this.props.weatherData.uweatherData.data.city}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingLeft: 10,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingRight: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#4A4A4A" : "white",
                        }}
                      >
                        Today :{" "}
                        {this.props.weatherData.uweatherData.data == undefined
                          ? ""
                          : this.props.weatherData.uweatherData.data.weather}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingTop: 3
                        }}
                      >
                        <Icon
                          type="Entypo"
                          name="arrow-long-up"
                          style={{ fontSize: 12, color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#F66C40" : "white" , paddingTop : 2 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#4A4A4A" : "white",
                            //paddingBottom : 20
                          }}
                        >
                          High {" "}
                          {this.props.weatherData.uweatherData.data ==
                            undefined
                            ? ""
                            : this.props.weatherData.uweatherData.data.temp_max.toFixed(
                              2
                            )}
                        </Text>
                        <Icon
                          type="Entypo"
                          name="arrow-long-down"
                          style={{ fontSize: 12, color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#F66C40" : "white",paddingTop : 2 }}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#4A4A4A" : "white",
                            //paddingBottom : 10
                          }}
                        >
                          Low{" "}
                          {this.props.weatherData.uweatherData.data ==
                            undefined
                            ? ""
                            : this.props.weatherData.uweatherData.data.temp_min.toFixed(
                              2
                            )}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* </LinearGradient> */}
                  <View style={{ width: "2%" }}></View>
                  <View
                    style={{
                      height: 115,
                      width: "49%",
                      borderWidth: 1,
                      borderColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <ImageBackground
                      style={styles.container}
                      source={require("../../assets/images/house2.png")}
                    >
                      {/* <TouchableOpacity> */}

                      <View style={{ ...styles.overlay, backgroundColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)" }}>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("BookingDetail", {
                              data: this.props.upcomingstay_data
                                .upcoming_stay[0],
                            })
                            // this.props.navigation.navigate("HGHomeRules")
                          }
                          activeOpacity={0.7}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <View style={{ ...styles.topView, backgroundColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)" }}></View>

                          <View
                            style={{
                              position: "absolute",
                              right: 4,
                              top: 5,
                            }}
                          >
                            <Icon
                              type="MaterialIcons"
                              name="zoom-out-map"
                              style={{ fontSize: 15, color: "white" }}
                            />

                          </View>
                        </TouchableOpacity>
                        <View style={styles.bottomView}>
                          <View
                            style={{ flexDirection: "row", marginLeft: 10 }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: 12,
                                fontWeight: "bold",
                              }}
                            >
                              {this.props.upcomingstay_data.upcoming_stay[0] ==
                                undefined
                                ? ""
                                : this.props.upcomingstay_data.upcoming_stay[0]
                                  .PropertyName}
                            </Text>
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 10,
                                flexDirection: "row",
                              }}
                            >
                              {this.props.upcomingstay_data.upcoming_stay[0] ==
                                undefined
                                ? null
                                : [
                                  ...Array(
                                    this.props.upcomingstay_data
                                      .upcoming_stay[0].StarsRating
                                  ),
                                ].map(() => (
                                  <Icon
                                    type="FontAwesome"
                                    name="star"
                                    style={{
                                      fontSize: 9,
                                      marginLeft: 2,
                                      color: "#FAF282",
                                    }}
                                  />
                                ))}
                            </View>
                          </View>
                          <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 11, color: "#B4D8FF" }}>
                              {smonth} {sdate} - {emonth} {edate}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {/* </TouchableOpacity> */}
                    </ImageBackground>

                  </View>
                </View>
              </View>

              <View style={{ marginLeft: 10, marginTop: 5 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "bold", color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#F66C40" : "white" }}
                >
                  FEED
                </Text>
              </View>

              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {this.props.upcomingfeed_data.feed_list == null
                  ? null
                  : this.props.upcomingfeed_data.feed_list.map(
                    (data, index) => {
                      const date1 = new Date(data.AddedToFeed);
                      const removeDate = new Date(data.RemoveFromFeed)
                      //console.log("Value of remove date is", removeDate)
                      const date2 = new Date();
                      // console.log("Value of date is",date2)
                      const diffTime = Math.abs(date2 - date1);
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
                      //console.log("Value of difference date is",diffDays)
                      var weeksDiff = Math.floor(diffDays / 7);
                      //console.log("Value of weekDays is",weeksDiff)
                      let yearsDiff =
                        date2.getFullYear() - date1.getFullYear();
                      let monthsDiff =
                        yearsDiff * 12 +
                        (date2.getMonth() - date1.getMonth());
                      // console.log("Value of months difference",monthsDiff)
                      const days =
                        isNaN(diffDays) == true ? "Today" :
                          diffDays <= 7
                            ? `${diffDays} days ago`
                            : diffDays <= 30 || diffDays <= 31
                              ? `${weeksDiff} weeks ago`
                              : `${monthsDiff} months ago`
                      //date1 == removeDate ? this.props.upcomingfeed(removeDate) : ""  

                      return (
                        <ListComponent
                          title={data.Title}
                          subtitle={data.Caption}
                          day={days}
                          dot={true}
                          type="HomeList"
                          navi={() => this.showList(data)}
                        />
                      );
                    }
                  )}
              </ScrollView>
            </ScrollView>
            <View style={{ height: 55 }}>
              <View style={{ flexDirection: "row" }}>

                <LinearGradient
                  style={{
                    height: 55,
                    width: "33%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  colors={["#539CD6", "#1B4F79"]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("AttractionMain")
                    }
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        source={require("../../assets/images/location.png")}
                        style={{ height: 20, width: 15 }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      ATTRACTIONS
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>

                <LinearGradient
                  style={{
                    height: 55,
                    width: "34%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  colors={["#4DA8F5", "#1B69AB"]}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("HCMain")}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        source={require("../../assets/images/home_control.png")}
                        style={{ height: 20, width: 15 }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      HOME CONTROL
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  style={{
                    height: 55,
                    width: "33%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  colors={["#74BFFF", "#307FC2"]}
                >
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("HGMain")}
                  >
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <Image
                        source={require("../../assets/images/home_guide.png")}
                        style={{ height: 20, width: 15 }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      HOME GUIDE
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </ImageBackground>
        );
      } else {
        return (
          <View style={{ backgroundColor: "rgba( 7,42,72,0.7)", flex: 1 }}>
            <ModalContainer
              setModalVisible={(data) => this.setThankModalVisible()}
              isVisible={this.state.isThankVisible}
            >
              <View
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ color: "#EC6531", fontSize: 20, fontWeight: "bold" }}
                >
                  Hello!
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "rgba(155, 155, 155,0.5)",
                }}
              ></View>
              <View
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "center",
                      color: "rgba(74, 74, 74, 1)",
                    }}
                  >
                    You are not currently associated with a booking. The app can
                    be used in this state for demonstration purposes only.
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => this.setThankModalVisible()}
                  style={{ marginTop: 20 }}
                >
                  <LinearGradient
                    style={{
                      width: 265,
                      height: 45,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    colors={["#8ED6F8", "#55ACEE"]}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      OKAY
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => alert("We will contact you soon")}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#016295",
                        textDecorationLine: "underline",
                      }}
                    >
                      I Am Associated with a booking
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ModalContainer>
          </View>
        );
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    logindata: state.login,
    upcomingstay_data: state.upcoming_stay,
    upcomingfeed_data: state.upcoming_feed,
    loggedIn: state.authReducer,
    weatherData: state.weatherData,
    refresh: state.refreshNotification.refresh,
    getNewNotification: state.getNewNotificationReducer.getNewNotification,
    feedData: state.getNewNotificationReducer.feedData,
    homeControl: state.homeControlReducer.homeControl
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    upcomingstay: (val) => {
      dispatch(upcomingStay_Action.setUpcomingStay(val));
    },
    upcomingfeed: (val) => {
      dispatch(upcomingFeed_Action.setUpcomingFeed(val));
    },
    authLogin: (val) => {
      dispatch(authLogin.authlogin(val));
    },
    weatherDataAction: (val) => {
      dispatch(weatherData_Action.wetherDataaction(val));
    },
    appRefreshNotificationData: (val) => {
      dispatch(refreshNotification_Action.refreshNotificationaction(val));
    },
    getNewNotificationAction: (val) => {
      dispatch(getNewNotificationAction.getNewNotificationAction(val));
    },
    getAllNotificationAction: (val) => {
      dispatch(getAllNotificationAction.getAllNotificationAction(val));
    },
    getFeedDataNotificationAction: (val) => {
      dispatch(getFeedDataNotification.getFeedDataNotification(val));
    },
    homeControlAction: (val) => {
      dispatch(homeControlAction.homeControlAction(val));
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    // backgroundColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
    width: "100%",
    height: "100%",
  },
  topView: {
    width: 0,
    height: 0,
    borderRightWidth: 40,
    borderTopWidth: 40,
    borderRightColor: "transparent",
    // backgroundColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
    transform: [{ rotate: "90deg" }],
    position: "absolute",
    borderTopColor: "rgba(0, 47, 95,0.7)",
    right: 0,
  },
  sideMenuStyle: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    margin: 0,
    width: screenWidth * 0.93,
  },
  bottomView: {
    width: "100%",
    height: 40,
    backgroundColor: "rgba(0, 47, 95,0.7)",
    position: "absolute",
    bottom: 0,
  },
  weatherContainer: {
    //borderBottomColor: this.props.weatherData.uweatherData.data.time.includes("AM") ? "rgba(0, 47, 95,0.2)" : "white",
    borderBottomWidth: 2,
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 5,
    paddingRight: 10,
  },

  weatherCityText: {
    fontSize: 14,
    fontWeight: "bold",
    // color: this.props.weatherData.uweatherData.data.time.includes("AM") ? "#4A4A4A" : "white",
    marginTop: -5,
  },
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    minHeight: Dimensions.get("window").height - 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
