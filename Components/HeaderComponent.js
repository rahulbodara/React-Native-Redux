import React from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Icon, Left, Body, Right } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { actions as authActions } from "../Reducers/auth";
import { actions as animationActions } from "../Reducers/animation";

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  goTopScreen = async () => {
    await this.props.setAnimation("0");
    this.props.navigation.popToTop();
  };

  render() {
    return (
      <LinearGradient colors={["#539CD6", "#1B4F79"]}>
        <View
          style={{
            height: 50,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Left></Left>
          <Body style={{ alignItems: "center", justifyContent: "center" }}>
            <View>
              <Image
                source={this.props.image}
                style={{ height: 20, width: 15 ,resizeMode :'contain' }}
              />
            </View>
            <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
              {this.props.title}
            </Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.goTopScreen()}>
              <Icon
                type="MaterialIcons"
                name="keyboard-arrow-down"
                style={{
                  fontSize: 50,
                  color: "white",
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </Right>
        </View>
      </LinearGradient>
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

export default connect(null, mapDispatchToProps)(HeaderComponent);
