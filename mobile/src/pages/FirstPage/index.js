import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather as Icon  } from '@expo/vector-icons';

export default function FirstPage ({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>credit.ai</Text>
            <TouchableOpacity onPress={ () => navigation.navigate('WelcomeScreen') } style={styles.nextScreen} >
                <Icon name="arrow-right" />
            </TouchableOpacity>

            <StatusBar style="auto" backgroundColor="blue" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dadada',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nextScreen: {
        marginTop: 16
    }
})