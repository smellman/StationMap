import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';

// 1: 駅すぱあと路線図のAPIキーをセット
rosen_api_key = '駅すぱあと路線図のAPIキー'

export default class App extends React.Component {

  // 2: WebViewを読み込んだあとの処理を実装
  loadEnd = () => {
    if (this.webview) {
      // 3: 初期化を行うために必要な情報を作成
      const data = {
        type: 'init_map',
        api_key: rosen_api_key
      }
      // 4: postMessageで文字列型にしてWebViewに処理を投げる
      this.webview.postMessage(JSON.stringify(data))
    }
  }

  render() {
    // 5: refでWebView自体をthis.webviewでアクセス可能にし、onLoadEndで読み込み後の処理を渡す
    return (
      <WebView
        source={require('./index.html')}
        ref={webview => {this.webview = webview}}
        onLoadEnd={this.loadEnd}
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
