import React from 'react';
// 1: WebViewを追加
import { StyleSheet, Text, View, WebView } from 'react-native';

export default class App extends React.Component {
  render() {
    // 2: WebViewのみを一旦返す
    return (
      <WebView source={require('./index.html')} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
