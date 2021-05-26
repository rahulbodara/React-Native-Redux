import React from 'react';
import { Platform } from 'react-native';
import {View, SafeAreaView, StatusBar, StyleSheet} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar hidden={false} backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS == "ios" ? STATUSBAR_HEIGHT : 0,
  },
});

export default MyStatusBar;