import { useState, useEffect } from 'react';
import axios from 'axios';

import config from '../../config';


const axiosInstance = axios.create({
    baseURL: config.openWeather.baseURL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.openWeather.apiKey,
    },
});

export const useOpenWeather = () => {

    const request = async (method, url) => {
        try {
            const response = await axiosInstance({
                method,
                url,
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const getWeather = async (city) => {
        const url = `/weather?q=${city}&units=metric&lang=fr`;
        return await request('get', url);
    };

    const getForecast = async (city) => {
        // get french response
        const url = `/forecast?q=${city}&units=metric&lang=fr`;
        return await request('get', url);
    };

    return {
        request,
        getWeather,
        getForecast,
    };
};

