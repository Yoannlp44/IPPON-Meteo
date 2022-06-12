import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WeatherCard = ({ city, weather, temperature, onPress, onLongPress, iconId }) => {
    return (
        <TouchableOpacity onLongPress={onLongPress} onPress={onPress} style={styles.card}>
            <View style={styles.iconContainer}>
                <Image style={styles.icon} source={{ uri: `http://openweathermap.org/img/w/${iconId}.png` }} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.weather}>{weather}</Text>
                <Text style={styles.temperature}>{
                    Math.round(temperature * 10) / 10
                }°C</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'rgb(75, 121, 186)',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'row',
    },
    iconContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 0.5,
        justifyContent: 'space-around',
    },
    icon: {
        width: 50,
        height: 50,
    },
    city: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    weather: {
        fontSize: 15,
    },
    temperature: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default WeatherCard;