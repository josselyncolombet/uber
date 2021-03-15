import React, { Component, Fragment } from "react";
import { View, Dimensions, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import markerImage from "./assets/marker.png";
import backImage from "./assets/back.png";

import Search from "./components/Search";
import Directions from "./components/Directions";
import Details from "./components/Details";

import config from "./config";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;

Geocoder.init(config.maps_api_key);

export default class Map extends Component {
  state = {
    region: null,
    destination: null,
    duration: 0,
    address: 'Ma Position',
    travelPrice: null
  };
  async componentDidMount() {

    let {status} = await Permissions.askAsync(Permissions.LOCATION)
    if(status !== 'granted') console.log('not permission to access location')

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy:true}) 
    /*const response = await Geocoder.from({ latitude: location.coords.latitude, longitude: location.coords.longitude}).catch(
      error => console.error(error)
    );
    const address = response.results[0].formatted_address.substring(0, address.indexOf(","));*/
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045
    }
    console.log(status, region)

    this.setState({region:region})
  }

  handleLocationSelected = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;
    console.log(latitude, longitude)
    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    }, () => console.log(this.state));
  };
  handleBack = () => {
    this.setState({ destination: null });
  };
  render() {
    const { region, destination, duration, address } = this.state;
    return (
      <View keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.mapView = el)}
        >
          {destination && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination}
                onReady={result => {
                  const d = Math.floor(result.duration);
                  const price = (d * 1.23).toFixed(2);
                  this.setState({ duration: d, travelPrice: price }, () => console.log(this.state));
                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 50,
                      bottom: 50,
                      left: 50,
                      right: 50
                    }
                  });
                }}
              />
              <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                <View style={styles.locationBox}>
                  <Text style={styles.locationText}>{address}</Text>
                </View>
              </Marker>
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <View style={styles.locationBox}>
                <View style={styles.locationTimeBox}>
                    <Text style={styles.locationTimeText}>{duration}</Text>
                    <Text style={styles.LocationTimeTextSmall}>MIN</Text>
                  </View>
                  <Text style={styles.locationText}>{destination.title}</Text>
                </View>
              </Marker>
            </Fragment>
          )}
        </MapView>
        {destination ? (
          <Fragment>
            <TouchableOpacity style={styles.back} onPress={this.handleBack}>
              <Image source={backImage} />
            </TouchableOpacity>
            <Details price={this.state.travelPrice} />
          </Fragment>
        ) : (
          <Search onLocationSelected={this.handleLocationSelected} />
        )}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  locationBox: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    elevation: 1,
    
    borderRadius: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20,
    marginLeft:20
  },

  locationText: {
    padding: 3,
    fontSize:14,
    color:'#333333',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8
  },

  locationTimeBox:{
    backgroundColor: '#222',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8
  },

  locationTimeText: {
    padding: 3,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center'
  },

  LocationTimeTextSmall: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center'
  },

  back: {
    position: 'absolute',
    top: 50,
    marginLeft: 20
  }
});
