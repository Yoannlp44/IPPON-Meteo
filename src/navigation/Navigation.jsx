import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import Home from '../containers/homePage/homePage';
import WeatherDetails from '../containers/weatherDetails/weatherDetails';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="WeatherDetails" component={WeatherDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;