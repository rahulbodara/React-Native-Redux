import React from "react";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  NativeModules,
} from "react-native";
import { Icon, Left, Body, Right } from "native-base";
import { connect } from "react-redux";
import { actions as animationActions } from "../Reducers/animation";
import MyStatusBar from "../Components/MyStatusBar";
import { Platform } from "react-native";

const screenHeight = Math.round(Dimensions.get("window").height);
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules

class BookingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedData: [],
      title: "",
      isVisible: false,
    };
  }

  componentDidMount() { }

  goTopScreen = async () => {
    await this.props.setAnimation("0");
    this.props.navigation.popToTop();
  };

  goOneBack = async () => {
    await this.props.setAnimation("1");
    this.props.navigation.goBack();
  };

  showList = (value) => { };

  render() {
    const data = this.props.route.params.data;
    console.log("dATAT", data);
    return (
      <View style={{ flex: 1 }}>
        <MyStatusBar
          backgroundColor="black" barStyle="light-content"
        />
        <View
          style={{
            marginTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT - 25 : StatusBarManager.HEIGHT - 15,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Left></Left>
          <Body
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1.8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "rgb(236,101,49)",
                fontWeight: "bold",
                textAlign: "center",
                paddingBottom: 5
              }}
            >
              Your Upcoming Stay
            </Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon
                type="Ionicons"
                name="ios-close-sharp"
                style={{
                  fontSize: 30,
                  color: "black",
                  marginRight: 10,
                  paddingBottom: 5
                }}
              />
            </TouchableOpacity>
          </Right>
        </View>
        <ScrollView>
          <View
            style={{
              height: 268,
              width: "100%",
            }}
          >
            <ImageBackground
              style={{ ...styles.container }}
              source={require("../../assets/images/house2.png")}
            >
              <View style={styles.bottomView}>
                <View
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 7,
                    paddingBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {data.PropertyName}
                    </Text>
                    <View style={{ flexDirection: "row", marginLeft: 15 }}>
                      {[...Array(data.StarsRating)].map(() => (
                        <Icon
                          type="FontAwesome"
                          name="star"
                          style={{
                            fontSize: 12,
                            paddingLeft: 5,
                            color: "#FAF282",
                            paddingTop: 8,
                          }}
                        />
                      ))}
                    </View>
                  </View>
                  <Text
                    style={{
                      color: "#B4D8FF",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    BIG BEAR LAKE, CA
                  </Text>
                  <Text
                    style={{
                      color: "#FCD8D4",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    1232 MOON
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          ></View>
          <View
            style={{
              height: 84,
              borderBottomColor: "#cdcdcd",
              borderBottomWidth: 0.5,
              marginTop: 20,
              justifyContent: "space-around",
              flexDirection: "row",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/bedroomIcons/group.png")}
                style={{ height: 20, width: 36, resizeMode: 'contain', }}
              />
              <Text
                style={{
                  color: "#4a4a4a",
                  fontSize: 10,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                16-25 guests
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/bedroomIcons/singlebed.png")}
                style={{ height: 18, width: 30, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: "#4a4a4a",
                  fontSize: 10,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                16 beds
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/bedroomIcons/shower4.png")}
                style={{ height: 20, width: 25, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: "#4a4a4a",
                  fontSize: 10,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                4 Full Bath
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/bedroomIcons/shower3.png")}
                style={{ height: 20, width: 25, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  color: "#4a4a4a",
                  fontSize: 10,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                1 Half Bath
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 27, marginTop: 19 }}>
            <Text
              style={{ color: "#ec6531", fontSize: 14, fontWeight: "bold" }}
            >
              The Place
            </Text>
            <View style={{ marginTop: 8, paddingRight: 27 }}>
              <Text style={{ fontSize: 14 }}>
                Ridgecrest Lodge is moments from Big Bear Lake, Bear Mountain,
                and close to Snow Summit, the Village, and everything Big Bear
                offers! Hike, fish, bike, & relax. With 6 bedrooms, a fireplace,
                game room, and 7 person hot tub you.
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <Text style={{ color: "black", fontSize: 12 }}>
                See a detailed list of all our amenities in
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("HGMain")}
              >
                <Text style={{ color: "#55acee", fontSize: 12, marginLeft: 5 }}>
                  Home Guides
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 22 }}>
              <Text
                style={{ fontSize: 12, color: "#ec6531", fontWeight: "bold" }}
              >
                Included
              </Text>
              <View
                style={{
                  width: "100%",
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                  marginBottom: 20
                }}
              >
                <View style={{ width: "50%", justifyContent: "flex-start" }}>
                  <Text style={{ fontSize: 12, marginTop: 5 }}>
                    • Clothes Dryer
                  </Text>
                  <Text style={{ fontSize: 12 }}>• Fireplace</Text>
                  <Text style={{ fontSize: 12 }}>• Garage </Text>
                  <Text style={{ fontSize: 12 }}>• Hair Dryer</Text>
                  <Text style={{ fontSize: 12 }}>• Heating</Text>
                  <Text style={{ fontSize: 12 }}>• Internet</Text>
                </View>
                <View style={{ width: "50%", justifyContent: "flex-start" }}>
                  <Text style={{ fontSize: 12, marginTop: 5 }}>
                    • Iron & Board
                  </Text>
                  <Text style={{ fontSize: 12 }}>• Linens Provided</Text>
                  <Text style={{ fontSize: 12 }}>• Parking </Text>
                  <Text style={{ fontSize: 12 }}>• Telephone</Text>
                  <Text style={{ fontSize: 12 }}>• Towels Provided</Text>
                  <Text style={{ fontSize: 12 }}>• Washing Machine </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAnimation: (val) => {
      dispatch(animationActions.setanimation(val));
    },
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    width: "100%",
    height: 80,
    backgroundColor: "rgba(0, 47, 95,0.7)",
    position: "absolute",
    bottom: 0,
  },
  modal: {
    backgroundColor: "#ffffff",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    paddingBottom: 20,
    borderRadius: 2,
  },
});

export default connect(null, mapDispatchToProps)(BookingDetail);
