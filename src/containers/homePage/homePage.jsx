import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Modal, RefreshControl, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

import { useOpenWeather } from '../../hooks/openWeather';
import config from '../../../config';
import WeatherCard from '../../components/weatherCard/weatherCard';

const HomePage = () => {
    const navigation = useNavigation();
    const { getWeather } = useOpenWeather();
    const [citiesList, setCitiesList] = useState([]);
    const [cityInput, setCityInput] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalCity, setModalCity] = useState('');

    const getCityList = async () => {
        try {
            const cityList = await AsyncStorage.getItem(config.cityListKey);
            if (cityList) {
                setCitiesList(JSON.parse(cityList));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCity = async (city) => {
        try {
            const cityList = await AsyncStorage.getItem(config.cityListKey);
            if (cityList) {
                const newCityList = JSON.parse(cityList).filter(item => item.name !== city.name);
                await AsyncStorage.setItem(config.cityListKey, JSON.stringify(newCityList));
                setCitiesList(newCityList);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addCity = async (city) => {
        try {
            const cityList = await AsyncStorage.getItem(config.cityListKey);
            if (cityList) {
                const newCityList = JSON.parse(cityList).concat(city);
                await AsyncStorage.setItem(config.cityListKey, JSON.stringify(newCityList));
                setCitiesList(newCityList);
            } else {
                await AsyncStorage.setItem(config.cityListKey, JSON.stringify([city]));
                setCitiesList([city]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const HandleAdd = () => {
        if (cityInput) {
            getWeather(cityInput).then(data => {
                if (data && data.cod === 200) {
                    addCity(data);
                    Alert.alert(
                        'Ajout réussi',
                        'Votre ville a bien été ajoutée',
                        [
                            {
                                text: 'OK',
                                onPress: () => { },
                            },
                        ],
                        { cancelable: false },
                    );
                } else {
                    Alert.alert(
                        'Erreur',
                        'La ville n\'existe pas',
                        [
                            {
                                text: 'OK',
                                onPress: () => { },
                            },
                        ],
                        { cancelable: false },
                    );
                }
            });
        } else {
            Alert.alert(
                'Erreur',
                'Merci de renseigner une ville',
                [
                    {
                        text: 'OK',
                        onPress: () => { },
                    },
                ],
                { cancelable: false },
            );
        }
        setCityInput('');
    };

    const HandleDelete = (city) => {
        deleteCity(city);
    };

    const HandleSelect = (city) => {
        navigation.navigate('WeatherDetails', { city: city.name });
    };

    const handleOnLongPress = (city) => {
        setModalVisible(true);
        setModalCity(city);
    };

    const HandleRefresh = async () => {
        setRefreshing(true);

        const newCitiesList = citiesList.map(async (city) => {
            const data = await getWeather(city.name + ' ');
            return data;
        });
        Promise.all(newCitiesList).then(data => {
            setCitiesList(data);
            setRefreshing(false);
        });
        removeData();
        await AsyncStorage.setItem(config.cityListKey, JSON.stringify(citiesList));
        setRefreshing(false);
    };


    const removeData = async () => {
        await AsyncStorage.removeItem(config.cityListKey);
    }

    useState(() => {
        getCityList();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={
                Platform.OS === 'ios' ? styles.headerIos : styles.headerAndroid
            }>
                <Text style={styles.headerText}>Bienvenue sur {config.appName}</Text>
                <TouchableOpacity style={styles.addButton} onPress={HandleAdd} >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Entrer le nom d'une ville et l'ajouter" placeholderTextColor="grey" onChangeText={(text) => setCityInput(text)} value={cityInput} />
            <ScrollView style={styles.scrollView} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={HandleRefresh}
                />
            }>
                <View>
                    {citiesList.length === 0 ?
                        <Text style={styles.emptyText}>Pas de ville dans la liste</Text>
                        : citiesList.map((city) => {
                            return (
                                <WeatherCard
                                    key={city.id}
                                    city={city.name}
                                    weather={city.weather[0].description}
                                    temperature={city.main.temp}
                                    iconId={city.weather[0].icon}
                                    onPress={() => HandleSelect(city)}
                                    onLongPress={() => handleOnLongPress(city)}
                                />
                            );
                        })}
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>{modalCity.name}</Text>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.modalFooterButton} onPress={() => {
                            setModalVisible(false);
                            HandleDelete(modalCity);
                        }}>
                            <Text style={styles.modalFooterButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(34, 34, 34)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIos: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    headerAndroid: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        position: 'absolute',
        right: 5,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 25,
        paddingLeft: 20,
        marginTop: 10,
    },
    scrollView: {
        flex: 0.9,
        width: '100%',
    },
    emptyText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgb(34, 34, 34)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeader: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    modalHeaderText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        position: 'absolute',
        left: 5,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalFooter: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    modalFooterButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderColor: 'white',
        borderWidth: 2,
    },
    modalFooterButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default HomePage;