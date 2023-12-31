import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { ActivityIndicator } from 'react-native'

function MapInputComponent(props) {
  const [selectedLocation, setSelectedLocation] = useState(setCoordinates())

  function setCoordinates(){
    if(props.latUser !== null && props.lonUser !== null)
      return {latitude: props.latUser, longitude: props.lonUser}
    return undefined
  }

  const handleMapPress = (event) => {
    if(props.enablePressing === true){
      const { coordinate } = event.nativeEvent
      setSelectedLocation(coordinate)
      props.sendLocation(coordinate)
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: props.latUser,
          longitude: props.lonUser,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
  },
  locationInfo: {
    marginTop: 10,
  },
});

export default MapInputComponent;
