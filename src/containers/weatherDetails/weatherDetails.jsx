import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, RefreshControl, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { useOpenWeather } from '../../hooks/openWeather';


const WeatherDetails = ({ navigation, route: { params: { city } } }) => {
    const { getForecast } = useOpenWeather();
    const [refreshing, setRefreshing] = useState(false);
    const [forecast, setForecast] = useState([]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleRefresh = () => {
        setRefreshing(true);
        getData();
        setRefreshing(false);
    };

    const getData = async () => {
        const frt = await getForecast(city);
        const forecastByDay = frt.list.reduce((acc, item) => {
            const date = item.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
        setForecast(forecastByDay);

    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={
                Platform.OS === 'ios' ? styles.headerIos : styles.headerAndroid
            }>
                <AntDesign name="left" size={24} color="white" style={styles.backIcon} onPress={handleBack} />
                <Text style={styles.title}>{city}</Text>
            </View>
            <ScrollView style={styles.scrollView} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }>
                {Object.keys(forecast).map((day) => (
                    <View key={day} style={styles.dayContainer}>
                        <Text style={styles.day}>{
                            day.split('-')[2] + '/' +
                            day.split('-')[1] + '/' +
                            day.split('-')[0]
                        }
                        </Text>
                        {forecast[day].map((item) => (
                            <View key={item.dt} style={styles.item}>
                                <Text style={styles.time}>{
                                    item.dt_txt.split(' ')[1].split(':')[0] + 'h'
                                }
                                </Text>
                                <Image style={styles.icon} source={{ uri: `http://openweathermap.org/img/w/${item.weather[0].icon}.png` }} />
                                <Text style={styles.description}>{item.weather[0].description}</Text>
                                <Text style={styles.temperature}>{
                                    Math.round(item.main.temp * 10) / 10
                                }°C</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(34, 34, 34)',
    },
    headerIos: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    headerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginTop: 40,
    },
    backIcon: {
        position: 'absolute',
        left: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollView: {
        flex: 1,
        padding: 10,
    },
    dayContainer: {
        marginBottom: 10,
    },
    day: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    time: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },
    icon: {
        width: 50,
        height: 50,
    },
    description: {
        fontSize: 15,
        color: 'white',
    },
    temperature: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default WeatherDetails;