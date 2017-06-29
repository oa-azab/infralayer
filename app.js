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
  Image,
  TouchableHighlight,
  Linking,
  NetInfo,
} from 'react-native';
var DOMParser = require('xmldom').DOMParser;

export default class infraLayer extends Component {

  constructor(props) {
    super(props);
    // setup initial data
    this.state = {
      isLoading: true,
      textRespone: "Loading data ...",
      data: []
    }
    console.log(this.state.isLoading)
  }

  render() {
    // show loading indicator till we fetch data from internet
    if(this.state.isLoading){
      return (
        <View style={{flex: 1}}>
          {this.renderAppBar()}
          <View style={styles.container}>
            <ActivityIndicator />
            <Text>{this.state.textRespone}</Text>
          </View>
        </View>
      );
    }
      return (
        <View style={{flex: 1}}>
          {this.renderAppBar()}
          <FlatList
            data={this.state.data}
            renderItem={this.renderItemCard}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            />
        </View>
      );
  }

  // render App bar
  renderAppBar = () => {
    return (
      <View style={{height: 50, backgroundColor: '#757575', alignItems: 'center', flexDirection: 'row'}}>
        <Text style={{color: '#fff', fontSize: 18, paddingLeft: 10}}>infraLayer</Text>
      </View>
    );
  }

  // redner seperator
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  }

  // render item card for the flatlist
  // actually i didn't use card according to material design guide
  // https://material.io/guidelines/components/cards.html#cards-usage
  renderItemCard = ({item}) => {
    return(
      <TouchableHighlight onPress={() => this._onPressItem(item.link)}>
        <View style={styles.card}>
          <View style={styles.card_left_container}>
            <Text style={styles.card_title}
                  numberOfLines={2}>{item.title}</Text>
            <Text numberOfLines={3}>{item.description}</Text>
            <Text style={styles.card_date}>{item.date}</Text>

          </View>
          <View style={styles.card_right_container}>
            <Image
            resizeMode='cover'
            style={{flex: 1}}
            source={{uri: item.img}}
            />
          </View>
        </View>
      </ TouchableHighlight>
    );
  }

  // on item pressed open story url
  _onPressItem = (link) =>{
    Linking.openURL(link).catch(err => console.error('An error occurred', err));
  }

  componentDidMount() {
    // check for internet connection
    NetInfo.isConnected.fetch().then(isConnected => {
    console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    if(!isConnected){
      this.setState({
        textRespone: 'No internet, check your connection and try again please.',
        });
    }
    });
    // fetch data from url and parse it
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
      // default image link
      var imagelink = 'http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder.png';
      // if this entry has an image
      if(entries[i].getElementsByTagName("link")[0].getElementsByTagName("media:content")[0].hasChildNodes()){
        var imagelink = entries[i].getElementsByTagName("link")[0].getElementsByTagName("media:content")[0].getElementsByTagName("media:thumbnail")[0].getAttribute('url');
      }
      objs.push({
      id: i,
      title: entries[i].getElementsByTagName("title")[0].textContent,
      description: entries[i].getElementsByTagName("summary")[0].textContent,
      date: entries[i].getElementsByTagName("published")[0].textContent.substring(0, 10),
      img: imagelink,
      link: entries[i].getElementsByTagName("link")[0].getAttribute('href'),
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
    flex: 4,
    padding: 10,
    justifyContent: 'space-between',
  },
  card_right_container: {
    flex: 2,
  },
  card_title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  card_date: {
    fontSize: 10,
    marginTop: 5
  }
});
