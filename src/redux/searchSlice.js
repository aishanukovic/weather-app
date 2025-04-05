import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchLocationSuggestions = createAsyncThunk(
  'search/fetchLocationSuggestions',
  async (input, { rejectWithValue }) => {
    try {
      if (input.length <= 1) return [];
      
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!apiKey) {
        throw new Error("Weather API key is missing");
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error("Invalid API key");
        } else if (response.status === 404) {
          throw new Error("Location not found");
        } else if (response.status === 429) {
          throw new Error("Too many requests, please try again later");
        } else {
          throw new Error(errorData.message || `Error ${response.status}: Failed to fetch suggestions`);
        }
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        return [];
      }
      
      return data.map((city) => `${city.name}, ${city.country}`);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch suggestions");
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    suggestions: [],
    highlightedIndex: -1,
    loading: false,
    error: null
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
      state.highlightedIndex = -1;
    },
    setHighlightedIndex: (state, action) => {
      state.highlightedIndex = action.payload;
    },
    setSearchError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchLocationSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.suggestions = [];
      });
  }
});

export const { setQuery, clearSuggestions, setHighlightedIndex, setSearchError } = searchSlice.actions;
export default searchSlice.reducer;