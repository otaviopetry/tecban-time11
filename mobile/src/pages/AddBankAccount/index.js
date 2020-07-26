import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { Feather as Icon  } from '@expo/vector-icons';

import api from '../../services/api';

export default function AddBankAccount ({ navigation }) {

    const [token, setToken] = useState();
    const [consentId, setConsentId] = useState();
    const [bankURL, setBankURL] = useState();

    useEffect(() => {
        api.get('/bank1/get-token')
            .then(response => {
                setToken(response.data);
            }).catch(err => console.log(err));
    }, [])

    useEffect(() => {
        api.get('/bank1/create-consent-request')
            .then(response => {
                setConsentId(response.data);
            }).catch(err => console.log(err));
    }, [token])

    useEffect(() => {
        api.get('/bank1/get-bank-url')
            .then(response => {
                setBankURL(response.data)
            })
            .catch(err => console.log(err));
    }, [consentId])

    function handleOpenBankApp () {
        Linking.openURL(bankURL);
    }

    return (
        <View style={styles.container}>
            <Text>Token: {token}</Text>
            <Text>Consent: {consentId}</Text>
            <TouchableOpacity onPress={handleOpenBankApp} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Autenticar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => navigation.navigate('ReturnFromConsent') } style={styles.nextScreen} >
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
    primaryButton: {
        marginVertical: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: 'blue'
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 20
    },
    nextScreen: {
        marginTop: 16
    }
})