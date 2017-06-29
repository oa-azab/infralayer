/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
var DOMParser = require('xmldom').DOMParser;

export default class infraLayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      textRespone: "loading data ...",
      data: []
    }
    console.log(this.state.isLoading)
  }

  render() {
    if(this.state.isLoading){
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <Text>{this.state.textRespone}</Text>
        </View>
      );
    }
      return (
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => <Text>{item.title}</Text>}
            />
        </View>
      );
  }

  componentDidMount() {
    return fetch('http://www.bbc.com/arabic/worldnews/index.xml')
      .then((response) => response.text())
      .then((response) => {
        var data = this.parseResponse(response);
        this.setState({
          isLoading: false,
          textRespone: response,
          data: data
        }, function() {
          // do something with new state
          console.log(this.state.data);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Parse xml respone
  parseResponse = ( textResponse ) => {
    console.log('Got feed with length ' + textResponse.length );
    var doc = new DOMParser().parseFromString(textResponse, 'text/xml');
    var objs = [];
    var entries = doc.getElementsByTagName('entry');
    console.log('number of entries' + entries.length)
    for (var i=0; i < entries.length; i++) {
      console.log('title'+entries[i].getElementsByTagName("title")[0].textContent);
      objs.push({
      id: i,
      title: entries[i].getElementsByTagName("title")[0].textContent,
      description: entries[i].getElementsByTagName("summary")[0].textContent,
      date: entries[i].getElementsByTagName("published")[0].textContent.substring(0, 10),
      })
    }
    return objs;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('infraLayer', () => infraLayer);
