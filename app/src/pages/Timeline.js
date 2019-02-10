import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import socket from 'socket.io-client'
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';
import Tweet from '../components/Tweet';


export default class Timeline extends Component {
    static navigationOptions = ({navigation}) => ({
        title: "Inicio",
        handleRight: (
            <TouchableOpacity>
                <Icon style={{marginRight: 20}} name="add-circle-outline" size={24} color="#5BB0EE" onPress={navigation.nagate('New')} />
            </TouchableOpacity>
        )
    })

    state = {
        tweets: []
    }

    subscribeToEvents = () => {
        const io = socket("http://localhost:3000");

        io.on('tweet', data => {
            this.setState({ tweets: [data, ...this.state.tweets]})
        })
        io.on('like', data => {
            this.setState({ tweets: this.state.tweets.map(tweet => {
                return tweet._id === data._id ? data : tweet
            })  })
        })
    }

    async componentDidMount() {
        this.subscribeToEvents();
        const response = await api.get('tweets')

        this.setState({ tweets: response.data })
    }
    

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    keyExtractor={tweet => tweet._id}
                    renderItem={({item}) => <Tweet tweet={item} />}
                />
            </View>        
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF"
    }
  });
  