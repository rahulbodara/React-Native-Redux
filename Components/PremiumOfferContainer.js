import { Body, Left, Right } from "native-base";
import React, { Component } from "react";
import { Text, View, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default class PremiumOfferContainer extends Component {
  render() {
    return (
      <View>
        <Image
          source={this.props.imgUrlleft}
          style={{
            height: 100,
            width: "90%",
            marginLeft: 15,
            resizeMode :'contain'
          }}
        />
        <View
          style={{
            height: 48,
            width: "90%",
            backgroundColor: "white",
            marginLeft: 15,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <LinearGradient
            style={{
              height: 48,
              width: "90%",
              marginLeft: 15,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
            colors={["#ffffff", "#ffffff"]}
          >
          <Left style={{width:"50%",justifyContent:'flex-start'}}>
          <Text
              style={{
                textAlignVertical: "center",
                fontSize: 11,
                color: "#072a48",
              }}
            >
              {this.props.Containerlefttext}
            </Text>
          </Left>
          <Right style={{width:"50%",justifyContent:'flex-start'}}>
          <Text
              style={{
                fontSize: 12,
                color: "#55acee",
               // textAlignVertical: "center",
                paddingRight: 5,
              }}
            >
              {this.props.containerlefttextPrice}
            </Text> 
          </Right>
            {/* <Text
              style={{
               // textAlignVertical: "center",
                fontSize: 14,
                color: "#072a48",
              }}
            >
              {this.props.Containerlefttext}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#55acee",
               // textAlignVertical: "center",
                paddingRight: 5,
              }}
            >
              {this.props.containerlefttextPrice}
            </Text> */}
          
          </LinearGradient>
        </View>
      </View>
    );
  }
}
