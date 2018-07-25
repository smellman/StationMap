import React from 'react';
// 1: TouchableOpacityを追加
import { StyleSheet, Text, View, WebView, TouchableOpacity } from 'react-native';

rosen_api_key = '駅すぱあと路線図のAPIキー'

export default class App extends React.Component {

  // 2; stateに出発駅と到着駅の情報を保持
  constructor(props) {
    super(props)
    this.state = {
      start_station_name: "",
      start_station_code: null,
      via_station_name: "",
      via_station_code: null,
      select_mode: 'start'
    }
  }

  loadEnd = () => {
    if (this.webview) {
      const data = {
        type: 'init_map',
        api_key: rosen_api_key
      }
      this.webview.postMessage(JSON.stringify(data))
    }
  }

  onMessage = e => {
    try {
      const value = JSON.parse(e.nativeEvent.data)
      if (value.name && value.code) {
        if (this.state.select_mode === 'start') {
          // 3: 出発駅を保持
          this.setState({
            start_station_name: value.name,
            start_station_code: value.code,
            select_mode: 'via'
          })
        } else {
          // 4: 到着駅を保持
          this.setState({
            via_station_name: value.name,
            via_station_code: value.code,
            select_mode: 'start'
          })
        }
      }
    } catch (error) {
      console.log('invalid json data')
    }
  }

  // 5: 検索ボタンのロジック(今はまだ空)
  search = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        { /* 6: WebView の領域を確保 */ }
        <View style={{flex: 12}}>
          <WebView
            source={{uri: "https://smellman.github.io/StationMapWeb/"}}
            ref={webview => {this.webview = webview}}
            onLoadEnd={this.loadEnd}
            onMessage={this.onMessage}
          />
        </View>
        { /* 7: 画面下に出発駅、到着駅、検索ボタンを追加 */ }
        <View style={styles.stationNameAndButtonContainer}>
          <View style={styles.stationNameLines}>
            <View style={styles.stationName}>
              <Text>出発駅: {this.state.start_station_name}</Text>
            </View>
            <View style={styles.stationName}>
              <Text>到着駅: {this.state.via_station_name}</Text>
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={() => this.search()}>
              <Text>検索</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

// 8: renderで利用するスタイルを追加
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stationNameAndButtonContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  stationNameLines: {
    flex: 3
  },
  stationName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
