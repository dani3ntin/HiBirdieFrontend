import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const HeaderBar = (props) => {
    return (
        <View style={styles.container}>
          <Image
            source={props.userAvatar}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{props.userName}</Text>
        </View>
    );
  };
  
export default HeaderBar

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#f2f2f2',
      width: '100%',
      height: '100%'
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 100,
      marginLeft: 10
    },
    userName: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: 'bold',
    },
});
  