import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (location, { rejectWithValue }) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error("Weather API key is missing");
      }
      
      if (!location || location.trim() === '') {
        throw new Error("Please enter a valid location");
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 401) {
            throw new Error("Invalid API key");
          } else if (response.status === 404) {
            throw new Error(`"${location}" not found. Please check the city name and try again.`);
          } else if (response.status === 429) {
            throw new Error("Too many requests, please try again later");
          } else {
            throw new Error(errorData.message || `Error ${response.status}: Failed to fetch weather data`);
          }
        }
        
        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error("Request timed out. Check your network connection and try again.");
        }
        throw error;
      }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch weather data");
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
    errorType: null
  },
  reducers: {
    resetWeather: (state) => {
      state.data = null;
      state.error = null;
      state.errorType = null;
    },
    clearWeatherError: (state) => {
      state.error = null;
      state.errorType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorType = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        if (action.payload.includes("network") || action.payload.includes("timed out")) {
          state.errorType = "network";
        } else if (action.payload.includes("not found") || action.payload.includes("valid location")) {
          state.errorType = "validation";
        } else {
          state.errorType = "api";
        }
      });
  }
});

export const { resetWeather, clearWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;