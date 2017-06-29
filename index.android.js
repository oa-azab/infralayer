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
  FlatList,
  Image
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
          <FlatList
            data={this.state.data}
            renderItem={this.renderItemCard}
            keyExtractor={item => item.id}
            />
      );
  }

  renderItemCard = ({item}) => {
    return(
      <View style={styles.card}>
        <View style={styles.card_left_container}>
          <Text>{item.date}</Text>
          <Text style={styles.cover_title}
                numberOfLines={2}>{item.title}</Text>
          <Text numberOfLines={3}>{item.description}</Text>
        </View>
        <View style={styles.card_right_container}>
          <Image
          resizeMode='cover'
          style={{flex: 1}}
          source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
          />
        </View>
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
      img: entries[i].getElementsByTagName("summary")[0].textContent,
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
  card: {
    flex: 1,
    flexDirection: 'row',
    height: 150,
    padding: 5,
  },
  card_left_container: {
    flex: 3,
    padding: 10,
  },
  card_right_container: {
    flex: 1,
  },
  cover_title: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

AppRegistry.registerComponent('infraLayer', () => infraLayer);
