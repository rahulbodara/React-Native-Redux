import React from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";

class TourAmenitiesComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.navi}
        style={{
          width: "100%",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(181, 182, 179,0.5)",
          padding: 5,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "flex-start",
            width: "50%",
            flexDirection: "row",
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Image
              source={this.props.data.aimage}
              style={{ height: 40, width: 60 }}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              flexShrink: 1,
            }}
          >
            <Text
              style={{
                marginLeft: 5,
                marginRight: 5,
                color: "#4A4A4A",
                fontSize: 12,
                fontWeight: "bold",
                flexShrink: 1,
              }}
            >
              {this.props.data.atitle}
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", width: "50%" }}>
          <Text style={{ color: "#4A4A4A", fontSize: 12 }}>
            {this.props.data.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default TourAmenitiesComponent;
