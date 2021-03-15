import React, { Component } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import uberx from "../assets/uberx.png";

export default class Details extends Component {

  constructor(props){
      super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>UberX</Text>
        <Image style={styles.image} source={uberx} />

        
        <Text style={styles.description}>{this.props.price} €</Text>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText} >COMMANDER MON UBER X</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 275,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height:0},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 20,
        color: '#222'
    },
    description: {
        fontSize: 25,
        color: '#666',
        padding: 2,
        marginBottom: 10
    },
    image: {
        height: 80,
        margin: 10,
    },
    button: {
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        alignSelf: 'stretch',
        marginTop: 2
    },
    buttonText: {
        fontSize: 18,
        fontWeight:'bold',
        color: '#fff'
    },
  })
  