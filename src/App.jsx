import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import WeatherWrapper from "./components/WeatherWrapper";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/weather/:location" element={<WeatherWrapper />} />
    </Routes>
  );
}

export default App;