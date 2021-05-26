import React from "react";
import DeviceInfo from "react-native-device-info";

var baseOS = "";
var device = "";
var devicename = "";
var devicetoken = "";

export const getAllDeviceInfo = async () => {
  const androidID = await DeviceInfo.getAndroidId();
  let appName = DeviceInfo.getApplicationName();
  await DeviceInfo.getBaseOs().then((baseOs) => {
    baseOS = baseOs;
  });
  let brand = DeviceInfo.getBrand();
  let bundleId = DeviceInfo.getBundleId();
  await DeviceInfo.getDevice().then((data) => {
    device = data;
  });
  let deviceId = DeviceInfo.getDeviceId();
  await DeviceInfo.getDeviceName().then((data) => {
    devicename = data;
  });
  await DeviceInfo.getDeviceToken().then((data) => {
    devicetoken = data;
  });
  let uniqueId = DeviceInfo.getUniqueId();
  return [
    { androidID: androidID },
    { appname: appName },
    { baseOS: baseOS },
    { brand: brand },
    { bundleId: bundleId },
    { device: device },
    { deviceID: deviceId },
    { devicename: devicename },
    { deviceToken: devicetoken },
    { uniqueId: uniqueId },
  ];
};
