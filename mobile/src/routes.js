import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();

import FirstPage from './pages/FirstPage';
import WelcomeScreen from './pages/WelcomeScreen';
import AddBankAccount from './pages/AddBankAccount';
import ReturnFromConsent from './pages/ReturnFromConsent';
import RunningAlgorithm from './pages/RunningAlgorithm';
import Dashboard from './pages/Dashboard';

export default function Routes() {
    return (
        <NavigationContainer>
            <AppStack.Navigator screenOptions={{ headerShown: false }}>
                <AppStack.Screen name="FirstPage" component={FirstPage} />
                <AppStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <AppStack.Screen name="AddBankAccount" component={AddBankAccount} />
                <AppStack.Screen name="ReturnFromConsent" component={ReturnFromConsent} />
                <AppStack.Screen name="RunningAlgorithm" component={RunningAlgorithm} />
                <AppStack.Screen name="Dashboard" component={Dashboard} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}