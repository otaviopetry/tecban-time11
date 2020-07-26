import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import api from './src/services/api';

export default function App() {

  const [acessToken, setAcessToken] = useState('');

  useEffect(() => {
    api.get('/bank1/products').then(response => {
      setAcessToken(response.data.access_token);
    }).catch(err => console.log(err));
  }, [])

  return (
    <View style={styles.container}>
      <Text>{acessToken}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
