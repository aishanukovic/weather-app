import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHourlyForecastData = createAsyncThunk(
  'hourlyForecast/fetchHourlyForecastData',
  async (location, { rejectWithValue }) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${decodeURIComponent(location)}&appid=${apiKey}&units=metric&cnt=24`
      );
      
      if (!response.ok) throw new Error("Hourly forecast data not found");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const hourlyForecastSlice = createSlice({
  name: 'hourlyForecast',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    resetHourlyForecast: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHourlyForecastData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHourlyForecastData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHourlyForecastData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetHourlyForecast } = hourlyForecastSlice.actions;
export default hourlyForecastSlice.reducer;