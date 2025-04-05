import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchForecastData = createAsyncThunk(
    'forecast/fetchForecastData',
    async (location, { rejectWithValue }) => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${decodeURIComponent(location)}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) throw new Error("Forecast data not found");
        return await response.json();
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
);
  
export const forecastSlice = createSlice({
    name: 'forecast',
    initialState: {
      data: null,
      loading: false,
      error: null
    },
    reducers: {
      resetForecast: (state) => {
        state.data = null;
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchForecastData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchForecastData.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchForecastData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
});
  
export const { resetForecast } = forecastSlice.actions;
export default forecastSlice.reducer;