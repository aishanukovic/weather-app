import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import "../styles/WeatherMap.css";

const WeatherMap = () => {
  const [mapType, setMapType] = useState('temp_new');
  const weatherData = useSelector(state => state.weather.data);
  const mapRef = useRef(null);
  const weatherLayerRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const [mapError, setMapError] = useState(null);

  const updateMap = useCallback(() => {
    if (!weatherData?.coord || !window.L) return;
    
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const { lat, lon } = weatherData.coord;
    const zoom = 8;
    const L = window.L;

    try {
      if (!mapRef.current) {
        mapRef.current = L.map('weather-map', {
          fadeAnimation: true,
          preferCanvas: true,
          zoomControl: true,
          minZoom: 3,
          maxZoom: 18
        }).setView([lat, lon], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          subdomains: ['a', 'b', 'c']
        }).addTo(mapRef.current);
        
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 100);
      } else {
        mapRef.current.setView([lat, lon], zoom);
        mapRef.current.invalidateSize();
      }

      if (weatherLayerRef.current && mapRef.current.hasLayer(weatherLayerRef.current)) {
        mapRef.current.removeLayer(weatherLayerRef.current);
      }

      setMapError(null);

      weatherLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${apiKey}`, 
        {
          opacity: 0.7,
          attribution: 'Weather data &copy; OpenWeatherMap',
          updateWhenIdle: false,
          updateWhenZooming: false,
          keepBuffer: 2,
          maxZoom: 18,
          tileSize: 256
        }
      );

      weatherLayerRef.current.on('tileerror', function(error) {
        console.error('Tile error:', error);
        setMapError('Failed to load weather tiles. Please check your API key and network connection.');
      });

      weatherLayerRef.current.addTo(mapRef.current);

      L.marker([lat, lon])
        .addTo(mapRef.current)
        .bindPopup(`<b>${weatherData.name}, ${weatherData.sys.country}</b>`)
        .openPopup();

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map: ' + error.message);
    }
  }, [weatherData, mapType]);

  useEffect(() => {
    if (!window.L && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const linkElem = document.createElement('link');
        linkElem.rel = 'stylesheet';
        linkElem.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(linkElem);
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.async = true;
      
      script.onload = () => {
        updateMap();
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
  }, [updateMap]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (weatherData?.coord && window.L) {
      const timer = setTimeout(() => {
        updateMap();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [weatherData, updateMap]);

  useEffect(() => {
    if (mapRef.current && window.L) {
      updateMap();
    }
  }, [mapType, updateMap]);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mapTypes = [
    { value: 'temp_new', label: 'Temperature' },
    { value: 'precipitation_new', label: 'Precipitation' },
    { value: 'clouds_new', label: 'Clouds' },
    { value: 'wind_new', label: 'Wind' }
  ];

  if (!weatherData || !weatherData.coord) {
    return <div className="map-loading">Loading map data...</div>;
  }

  return (
    <div className="weather-map-container">
      <h2 className="map-title">Weather Map</h2>

      <div className="map-controls">
        <div className="map-type-selector">
          {mapTypes.map(type => (
            <button 
              key={type.value}
              className={`map-type-btn ${mapType === type.value ? 'active' : ''}`}
              onClick={() => setMapType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div id="weather-map" className="map-display"></div>
      
      {mapError && (
        <div className="map-error alert">
          {mapError}
        </div>
      )}

      <div className="map-footer">
        <small>Data provided by OpenWeatherMap</small>
      </div>
    </div>
  );
};

export default WeatherMap;