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
  ActivityIndicator
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
          <Text>{this.state.textRespone}</Text>
        </View>
      );
  }

  componentDidMount() {
    return fetch('http://www.bbc.com/arabic/worldnews/index.xml')
      .then((response) => response.text())
      .then((response) => {
        this.setState({
          isLoading: false,
          textRespone: response,
        }, function() {
          // do something with new state
          //this.parseResponse(response);
        });
      })
      .catch((error) => {
        console.error(error);
      });
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
