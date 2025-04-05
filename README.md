# Weather Forecast App

Welcome to Weatherly - a weather forecasting app! This app allows users to search for any city and view real-time weather data including:

- Current temperature and conditions  
- Hourly weather forecast  
- 5-day forecast  
- Interactive weather map  
- Clean, responsive UI with dynamic tabs and unit toggling  

This guide walks you through every step to get the app running on your local machine.

---

## Project Structure
```bash
project-root/
├── public/
│   └── index.html        # HTML entry point
│
├── src/
│   ├── components/       # Reusable UI components (e.g., WeatherDisplay, WeatherMap)
│   ├── redux/            # Redux slices and store configuration
│   ├── styles/           # All CSS files
│   ├── App.jsx           # Main application file
│   └── main.jsx          # Renders React app
│
├── public/               # Icons and logos (for branding)
├── package.json          # Project dependencies and scripts
└── README.md             # Guide for running the app on your local machine
```

---

## Breakdown of Features

- Search for any city using OpenWeatherMap API
- View current weather with temperature, feels like, condition, wind, humidity, pressure, sunrise, sunset, cloudiness, visibility
- Toggle units between Celsius and Fahrenheit
- See a 5-day forecast with daily breakdown
- View an hourly forecast in a separate tab
- Interactive Leaflet map overlayed with OpenWeatherMap tile layers
- Clean UI and mobile responsive design

---

## Getting Started

### 1. Prerequisites

Ensure you have these installed, which can be done through the terminal using command prompts:

- [Node.js and npm](https://nodejs.org/) (version 16+ recommended, please read through the documentation for a guide on how to install Node.js)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

### 2. Project Installation

1. **Clone the repository** in your system's terminal using the following commands (or download ZIP and extract):

```bash
#bash

git clone https://github.com/aishanukovic/weather-app.git

cd weather-app
```

Or follow [this link](https://github.com/aishanukovic/weather-app.git) to download the ZIP file.

2. **Install all dependencies in the terminal**:
```bash
#bash

npm install
```

---

### 3. Set up API Key (.env file)

Create a .env file in the root directory of your project using the following terminal commands.
```bash
#bash

touch .env
```

Inside the .env file, paste this line (replace YOUR_API_KEY with your real API key):
``` 
env

VITE_WEATHER_API_KEY=YOUR_API_KEY
```
You can get a free API key by signing up at OpenWeatherMap.

---

### 4. Run the App

To start the project locally:

```bash
#bash

npm run dev
```

Visit http://localhost:5173 in your browser.

---

## Environment Variables

| Variable Name	| Description |
|---------------|-------------|
| VITE_WEATHER_API_KEY | Your personal OpenWeatherMap API key |

---

## External Libraries Used

- [React](https://react.dev/) – Front-end library
- [Redux Toolkit](https://redux-toolkit.js.org/) – State management
- [React Router](https://reactrouter.com/) – Routing between pages
- [Leaflet](https://leafletjs.com/) – Interactive maps
- [OpenWeatherMap API](https://openweathermap.org/api) – Weather data provider

---

## Useful Terminal Commands

```bash
#bash

npm install             # Install all dependencies
npm run dev             # Run the project in development mode
npm run build           # Create optimized production build
npm run preview         # Preview the production build locally
```

---

## Folder Breakdown

- components/ – UI sections like Navbar, Footer, Map, etc.
- redux/ – All your state slices like weatherSlice, unitSlice, etc.
- styles/ – Modular and scoped CSS files for individual components
- .env – Your environment variables (not committed to GitHub)