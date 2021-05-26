import { Icon } from "native-base";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {connect} from 'react-redux'

import { actions as weatherData_Action } from "../Reducers/weather";

const ListComponent = (props) => {
 // console.log("Value in list vierew is",props.weatherData.uweatherData.data.time.includes("AM"),props.type)
  return (
    <TouchableOpacity onPress={props.navi}>
      <View
        style={{
          padding: props.type == "HomeList" ? 16 : 13,
          backgroundColor:
          props.type == "AttractionList"
          ? "rgba(243, 243, 243)"
          :  props.weatherData.uweatherData.data.time.includes("AM") && props.type == "HomeList" ? "rgba(243,243,243,0.6)" : "rgba(7,42,72,0.7)" ,
          borderTopWidth: 1,
          borderTopColor:
          props.type == "AttractionList"
          ? "rgba(151, 151, 151,0.5)" : props.weatherData.uweatherData.data.time.includes("AM") && props.type == "HomeList" ? "rgba(151, 151, 151,0.5)" : "rgba(255,255,255,0.5)",
          flexDirection: "row",
          justifyContent: "flex-start", // main axis
          alignItems: "center", // cross axis
        }}
      >
        {props.dot ? (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#E05206",
            }}
          ></View>
        ) : null}
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View style={{ marginLeft: props.type == "AttractionList" ? 0 : 15 }}>
            <Text
              style={{
                fontSize: props.type == "AttractionList" ? 15 : 12,
                //color: "black",
                fontWeight: "bold",
                color: props.type == "AttractionList" ? "#E05206" :  props.weatherData.uweatherData.data.time.includes("AM") &&  props.type == "HomeList" ? "black" : "white" 
              }}
            >
              {props.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color : props.type == "AttractionList" ? "black" :  props.weatherData.uweatherData.data.time.includes("AM") &&  props.type == "HomeList" ? "grey" : "#b4d8ff"
              }}
            >
              {props.subtitle}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: props.type == "AttractionList" ? "black" :  props.weatherData.uweatherData.data.time.includes("AM") &&  props.type == "HomeList" ? "#016295" : "white" , fontSize: 12, }}>
            {props.day}
          </Text>
          <Icon
            type="MaterialIcons"
            name="arrow-forward-ios"
            style={{ fontSize: 15, color: "#EC6531", marginLeft: 5 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => {
  return {
    weatherData: state.weatherData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    weatherDataAction: (val) => {
      dispatch(weatherData_Action.wetherDataaction(val));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);