import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import SearchBar from "./SearchBar";
import { useDispatch } from 'react-redux';
import { clearSuggestions } from '../redux/searchSlice';
import { resetWeather } from '../redux/weatherSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (city) => {
    if (city.trim()) {
      dispatch(clearSuggestions());
      dispatch(resetWeather());
      navigate(`/weather/${encodeURIComponent(city)}`);
    }
  };

  return (
    <div className="background">
      <div className="overlay">
        <img src="/weatherly-logo.png" alt="Weatherly Logo" className="logo" />

        <h2 className="tagline">
          Easily search the weather conditions in any city around the world directly from your device.
        </h2>

        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default Home;