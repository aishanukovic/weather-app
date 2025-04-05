import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import searchReducer from './searchSlice';
import forecastReducer from './forecastSlice';
import hourlyForecastReducer from './hourlyForecastSlice';
import unitReducer from './unitSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    search: searchReducer,
    forecast: forecastReducer,
    hourlyForecast: hourlyForecastReducer,
    unit: unitReducer
  }
});