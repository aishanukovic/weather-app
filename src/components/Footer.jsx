import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Weatherly App. All Rights Reserved. Made by Aisha Nukovic.</p>
        <p>Data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a></p>
      </div>
    </footer>
  );
};

export default Footer;