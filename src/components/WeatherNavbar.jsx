import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useDispatch } from 'react-redux';
import { clearSuggestions } from '../redux/searchSlice';
import { resetWeather } from '../redux/weatherSlice';
import "../styles/WeatherNavbar.css";

const WeatherNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (city) => {
    if (city.trim()) {
      dispatch(clearSuggestions());
      dispatch(resetWeather());
      navigate(`/weather/${encodeURIComponent(city)}`);
    }
  };

  const handleLogoClick = () => {
    dispatch(clearSuggestions());
    dispatch(resetWeather());
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <img 
            src="/navbar-logo.png" 
            alt="Weatherly Logo" 
            className="navbar-logo" 
            onClick={handleLogoClick}
          />
        </div>
        <div className="navbar-search">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
};

export default WeatherNavbar;