import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';

rosen_api_key = '駅すぱあと路線図のAPIキー'

export default class App extends React.Component {

  loadEnd = () => {
    if (this.webview) {
      const data = {
        type: 'init_map',
        api_key: rosen_api_key
      }
      this.webview.postMessage(JSON.stringify(data))
    }
  }

  // 1: メッセージを受け取る関数
  onMessage = e => {
    try {
      // 2: 受け取り側は nativeEvent.data を利用
      const value = JSON.parse(e.nativeEvent.data)
      // 3: 確認だけなので console.log で表示
      if (value.name && value.code) {
        console.log(value.name, value.code)
      }
    } catch (error) {
      console.log('invalid json data')
    }
  }

  render() {
    // 4: onMessageでWebView内から受け取ったメッセージを処理する関数を指定
    return (
      <WebView
        source={require('./index.html')}
        ref={webview => {this.webview = webview}}
        onLoadEnd={this.loadEnd}
        onMessage={this.onMessage}
      />
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
