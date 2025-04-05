import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData, clearWeatherError } from '../redux/weatherSlice';
import { fetchForecastData } from '../redux/forecastSlice';
import { fetchHourlyForecastData } from '../redux/hourlyForecastSlice';
import WeatherDisplay from "./WeatherDisplay";
import WeatherNavbar from "./WeatherNavbar";
import WeatherTabs, { Tab } from "./WeatherTabs";
import WeatherForecast from "./WeatherForecast";
import WeatherMap from "./WeatherMap";
import HourlyForecast from "./HourlyForecast";
import { UnitToggle } from "./UnitToggle";
import "../styles/WeatherWrapper.css";
import Footer from "./Footer";
import ErrorMessage from './ErrorMessage';

const WeatherWrapper = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading, errorType } = useSelector(state => state.weather);
  const forecastLoading = useSelector(state => state.forecast.loading);
  const forecastError = useSelector(state => state.forecast.error);
  const hourlyLoading = useSelector(state => state.hourlyForecast.loading);
  const hourlyError = useSelector(state => state.hourlyForecast.error);
  const [retryCount, setRetryCount] = useState(0);
  
  const hasError = error || forecastError || hourlyError;
  const errorMessage = error || forecastError || hourlyError;

  useEffect(() => {
    return () => {
      dispatch(clearWeatherError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      try {
        const decodedLocation = decodeURIComponent(location);
        
        dispatch(fetchWeatherData(decodedLocation));
        dispatch(fetchForecastData(decodedLocation));
        dispatch(fetchHourlyForecastData(decodedLocation));
      } catch (error) {
        console.error("Error decoding location:", error);
        navigate('/');
      }
    }
  }, [dispatch, location, navigate]);

  const isLoading = loading || forecastLoading || hourlyLoading;
  
  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    if (location) {
      const decodedLocation = decodeURIComponent(location);
      dispatch(fetchWeatherData(decodedLocation));
      dispatch(fetchForecastData(decodedLocation));
      dispatch(fetchHourlyForecastData(decodedLocation));
    }
  };
  
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="weather-page">
      <WeatherNavbar />
      
      <div className="weather-content">
        {hasError ? (
          <div className="error-container">
            <ErrorMessage 
              message={errorMessage} 
              type={errorType || "error"}
              onRetry={handleRetry} 
            />
            {retryCount >= 2 && (
              <button className="go-home-button" onClick={handleGoHome}>
                Go back to home
              </button>
            )}
          </div>
        ) : isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : (
          <>
            <div className="weather-header">
              <h1 className="city-name">Current Forecast</h1>
              <UnitToggle />
            </div>
            
            <WeatherDisplay />
            
            <WeatherTabs defaultTab={0}>
              <Tab label="Hourly Forecast">
                <HourlyForecast />
              </Tab>
              <Tab label="5-Day Forecast">
                <WeatherForecast />
              </Tab>
              <Tab label="Weather Map">
                <WeatherMap />
              </Tab>
            </WeatherTabs>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WeatherWrapper;