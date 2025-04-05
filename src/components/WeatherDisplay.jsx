import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "../styles/WeatherDisplay.css";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiWindy } from 'react-icons/wi';
import ErrorMessage from './ErrorMessage';
import { fetchWeatherData } from '../redux/weatherSlice';

const WeatherDisplay = () => {
  const { data: weatherData, loading, error, errorType } = useSelector(state => state.weather);
  const { temperatureUnit } = useSelector(state => state.unit);
  const dispatch = useDispatch();
  const location = useSelector(state => state.search.query);

  const handleRetry = () => {
    if (location) {
      dispatch(fetchWeatherData(location));
    }
  };

  const getWeatherIcon = (condition) => {
    const mainCondition = condition?.toLowerCase() || '';
    
    if (mainCondition.includes('clear')) {
      return <WiDaySunny size={50} />;
    } else if (mainCondition.includes('cloud')) {
      return <WiCloud size={50} />;
    } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
      return <WiRain size={50} />;
    } else if (mainCondition.includes('snow')) {
      return <WiSnow size={50} />;
    } else if (mainCondition.includes('wind')) {
      return <WiWindy size={50} />;
    } else {
      return <WiDaySunny size={50} />;
    }
  };

  const convertTemp = (celsius) => {
    if (temperatureUnit === 'fahrenheit') {
      return (celsius * 9/5 + 32).toFixed(1);
    }
    return celsius.toFixed(1);
  };

  if (loading) {
    return (
      <div className="weather-loading">
        <div className="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage 
      message={error} 
      type={errorType || "error"} 
      onRetry={handleRetry} 
    />;
  }
  
  if (!weatherData) {
    return (
      <div className="weather-empty">
        <p>No weather data available. Please search for a location.</p>
      </div>
    );
  }

  const formattedData = {
    temperature: convertTemp(weatherData.main.temp),
    feelsLike: convertTemp(weatherData.main.feels_like),
    pressure: weatherData.main.pressure,
    visibility: (weatherData.visibility / 1000).toFixed(1),
    cloudiness: weatherData.clouds.all,
    sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
    sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
    condition: weatherData.weather[0].description,
    windSpeed: weatherData.wind.speed,
    humidity: weatherData.main.humidity,
    country: weatherData.sys.country,
    city: weatherData.name
  };

  return (
    <div className="weather-display-container">
      <div className="weather-header">
        <div className="weather-icon">{getWeatherIcon(formattedData.condition)}</div>
        <div className="location">
          <h2>{`${formattedData.city}, ${formattedData.country}`}</h2>
        </div>
      </div>

      <div className="weather-stats">
        <div className="weather-card">
          <h3>Temperature</h3>
          <p>{formattedData.temperature}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
        </div>
        <div className="weather-card">
          <h3>Feels Like</h3>
          <p>{formattedData.feelsLike}°{temperatureUnit === 'celsius' ? 'C' : 'F'}</p>
        </div>
        <div className="weather-card">
          <h3>Condition</h3>
          <p>{formattedData.condition}</p>
        </div>
        <div className="weather-card">
          <h3>Visibility</h3>
          <p>{formattedData.visibility} km</p>
        </div>
        <div className="weather-card">
          <h3>Cloudiness</h3>
          <p>{formattedData.cloudiness}%</p>
        </div>
        <div className="weather-card">
          <h3>Sunrise</h3>
          <p>{formattedData.sunrise}</p>
        </div>
        <div className="weather-card">
          <h3>Sunset</h3>
          <p>{formattedData.sunset}</p>
        </div>
        <div className="weather-card">
          <h3>Pressure</h3>
          <p>{formattedData.pressure} hPa</p>
        </div>
        <div className="weather-card">
          <h3>Wind</h3>
          <p>{formattedData.windSpeed} km/h</p>
        </div>
        <div className="weather-card">
          <h3>Humidity</h3>
          <p>{formattedData.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;