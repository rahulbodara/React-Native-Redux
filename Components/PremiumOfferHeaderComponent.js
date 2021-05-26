import React, { Component } from "react";
import { Text, View, TouchableOpacity, NativeModules } from "react-native";
import { Left, Right, Body, Icon } from "native-base";
import MyStatusBar from "./MyStatusBar";
const { StatusBarManager } = NativeModules
export default class PremiumOfferHeaderComponent extends Component {
  render() {
    return (
      <View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            backgroundColor: "#fff",
          }}
        >
          <Left>
            <TouchableOpacity onPress={this.props.nav}>
              <Icon
                type="MaterialIcons"
                name="chevron-left"
                style={{
                  fontSize: 50,
                  color: "#000",
                  marginRight: 10,
                }}
              />
            </TouchableOpacity>
          </Left>
          <Body style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 14,
                color: "rgb(74, 74, 74)",
                fontWeight: "bold",
              }}
            >
              Premium Offer
            </Text>
          </Body>
          <Right></Right>
        </View>
      </View>
    );
  }
}
