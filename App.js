import React from 'react';
import { StyleSheet, Text, View, WebView, TouchableOpacity } from 'react-native';

rosen_api_key = '駅すぱあと路線図のAPIキー'
// 1: 駅すぱあとWebサービスのAPIキーとエントリーポイントをセット
ekispert_web_api_key = '駅すぱあとWebサービスのAPIキー'
ekispert_web_entry_point = 'http://api.ekispert.jp/v1/json/search/course/extreme'

// 2: 返り値が単一であった場合でも配列として扱うよう変換するユーティリティ関数
convertToArray = (obj) => {
  if (!Array.isArray(obj)) {
    return [obj]
  }
  return obj
}

export default class App extends React.Component {

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
          this.setState({
            start_station_name: value.name,
            start_station_code: value.code,
            select_mode: 'via'
          })
        } else {
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

  // 3: fetch関数を使うので async キーワードを追加
  search = async () => {
    if (!this.state.start_station_code || !this.state.via_station_code) {
      return
    }
    // 4: 駅すぱあとWebサービスの検索に使うパラメータをセット
    const params = [
      "key=" + ekispert_web_api_key,
      "viaList=" + this.state.start_station_code + ":" + this.state.via_station_code,
      // 5: 経路表示に使う路線を取得するために必要なパラメータ
      "addOperationLinePattern=true"
    ]
    const url = ekispert_web_entry_point + "?" + params.join("&")
    try {
      const response = await fetch(url)
      const json = await response.json()
      if (!json.ResultSet.Course || !json.ResultSet.Course[0]) {
        return
      }
      // 6: 経路を表示する前に既存のハイライトなどを消去する
      this.webview.postMessage(JSON.stringify({type: 'clear_all'}))
      // 7: 検索結果が一つでも路線でも配列として処理するように変換する
      const operationLinePatterns = convertToArray(json.ResultSet.Course[0].OperationLinePattern)
      let stations = []
      // 8: 路線ごとの処理
      operationLinePatterns.forEach(op => {
        const lines = convertToArray(op.Line)
        const points = convertToArray(op.Point)
        // 9: ハイライトするためのデータの処理
        for (var i = 0; i < lines.length; i++) {
          const line_code = lines[i].code
          const station_code1 = points[i].Station.code
          const station_code2 = points[i + 1].Station.code
          stations.push(station_code1)
          stations.push(station_code2)
          // 10: 駅すぱあと路線図側で区間をハイライトするためのデータを用意
          const data = {
            type: 'highlight_section',
            line_code: line_code,
            station_code1: station_code1,
            station_code2: station_code2,
          }
          this.webview.postMessage(JSON.stringify(data))
        }
      })
      // 11: 区間ごとで乗り換えを行う駅をuniqなものにする
      stations = stations.filter((value, i, self) => self.indexOf(value) === i)
      const data = {
        type: 'set_station_markers',
        stations: stations
      }
      // 12: 乗換駅にピンを立てる
      this.webview.postMessage(JSON.stringify(data))
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 12}}>
          <WebView
            source={require('./index.html')}
            ref={webview => {this.webview = webview}}
            onLoadEnd={this.loadEnd}
            onMessage={this.onMessage}
          />
        </View>
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
