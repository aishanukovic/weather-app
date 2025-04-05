import { useSelector } from 'react-redux';
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiWindy } from 'react-icons/wi';
import "../styles/WeatherForecast.css";

const WeatherForecast = () => {
  const { data: forecastData, loading, error } = useSelector(state => state.forecast);
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
      return (celsius * 9/5 + 32).toFixed(1);
    }
    return celsius.toFixed(1);
  };

  const groupForecastByDay = (forecastList) => {
    if (!forecastList) return [];

    const groupedData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!groupedData[day]) {
        groupedData[day] = {
          date: day,
          temps: [],
          icons: [],
          conditions: []
        };
      }
      
      groupedData[day].temps.push(item.main.temp);
      groupedData[day].icons.push(item.weather[0].main);
      groupedData[day].conditions.push(item.weather[0].description);
    });
    
    const result = Object.values(groupedData).map(day => {
      const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
      
      const conditionCounts = {};
      day.conditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      
      let mainCondition = '';
      let maxCount = 0;
      
      Object.entries(conditionCounts).forEach(([condition, count]) => {
        if (count > maxCount) {
          maxCount = count;
          mainCondition = condition;
        }
      });
      
      return {
        day: day.date,
        avgTemp,
        condition: mainCondition
      };
    });
    
    return result.slice(0, 5);
  };

  if (loading) {
    return <div className="forecast-loading skeleton-container">
      <div className="skeleton-title"></div>
      <div className="skeleton-forecast-cards">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-forecast-card">
            <div className="skeleton-day"></div>
            <div className="skeleton-icon"></div>
            <div className="skeleton-temp"></div>
          </div>
        ))}
      </div>
    </div>;
  }
  
  if (error) return <div className="forecast-error">Error loading forecast: {error}</div>;
  if (!forecastData) return <div className="forecast-empty">No forecast data available</div>;

  const dailyForecast = groupForecastByDay(forecastData.list);

  return (
    <div className="forecast-container">
      <h2 className="forecast-title">5-Day Weather Forecast</h2>
      <div className="forecast-cards">
        {dailyForecast.map((day, index) => (
          <div className="forecast-card" key={index}>
            <div className="forecast-day">{day.day}</div>
            <div className="forecast-icon">{getWeatherIcon(day.condition)}</div>
            <div className="forecast-temp">
              {convertTemp(day.avgTemp)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
            </div>
            <div className="forecast-condition">{day.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;