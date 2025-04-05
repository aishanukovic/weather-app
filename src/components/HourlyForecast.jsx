import { useSelector } from "react-redux";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiWindy } from 'react-icons/wi';
import "../styles/HourlyForecast.css";

const HourlyForecast = () => {
  const { data: hourlyData, loading, error } = useSelector(state => state.hourlyForecast);
  const { temperatureUnit } = useSelector(state => state.unit);

  const getWeatherIcon = (condition) => {
    const mainCondition = condition?.toLowerCase() || '';
    
    if (mainCondition.includes('clear')) {
      return <WiDaySunny size={36} />;
    } else if (mainCondition.includes('cloud')) {
      return <WiCloud size={36} />;
    } else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
      return <WiRain size={36} />;
    } else if (mainCondition.includes('snow')) {
      return <WiSnow size={36} />;
    } else if (mainCondition.includes('wind')) {
      return <WiWindy size={36} />;
    } else {
      return <WiDaySunny size={36} />;
    }
  };

  const convertTemp = (celsius) => {
    if (temperatureUnit === 'fahrenheit') {
      return Math.round(celsius * 9/5 + 32);
    }
    return Math.round(celsius);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="hourly-loading skeleton-container">
      <div className="skeleton-title"></div>
      <div className="skeleton-cards">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-time"></div>
            <div className="skeleton-icon"></div>
            <div className="skeleton-temp"></div>
          </div>
        ))}
      </div>
    </div>;
  }

  if (error) return <div className="hourly-error">Error loading hourly forecast: {error}</div>;
  if (!hourlyData || !hourlyData.list) return <div className="hourly-empty">No hourly forecast available</div>;

  const hourlyForecast = hourlyData.list.slice(0, 24);

  return (
    <div className="hourly-container">
      <h2 className="hourly-title">24-Hour Weather Forecast</h2>
      <div className="hourly-cards">
        {hourlyForecast.map((hour, index) => (
          <div className="hourly-card" key={index}>
            <div className="hourly-time">{formatTime(hour.dt)}</div>
            <div className="hourly-icon">
              {getWeatherIcon(hour.weather[0].main)}
            </div>
            <div className="hourly-temp">
              {convertTemp(hour.main.temp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </div>
            <div className="hourly-condition">{hour.weather[0].description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;