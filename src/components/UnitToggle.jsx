import { toggleTemperatureUnit } from '../redux/unitSlice';
import "../styles/UnitToggle.css";
import { useDispatch, useSelector } from 'react-redux';

export const UnitToggle = () => {
  const dispatch = useDispatch();
  const { temperatureUnit } = useSelector(state => state.unit);

  const handleToggle = () => {
    dispatch(toggleTemperatureUnit());
  };

  return (
    <div className="unit-toggle">
      <span className={`unit ${temperatureUnit === 'celsius' ? 'active' : ''}`}>°C</span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={temperatureUnit === 'fahrenheit'}
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
      <span className={`unit ${temperatureUnit === 'fahrenheit' ? 'active' : ''}`}>°F</span>
    </div>
  );
};