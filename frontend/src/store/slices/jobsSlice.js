import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const searchJobs = createAsyncThunk(
  'jobs/search',
  async ({ resumeId, location, jobType }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_URL}/search-jobs`,
        {
          resume_id: resumeId,
          location,
          job_type: jobType,
        },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  filters: {
    location: '',
    jobType: '',
  },
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobsError: (state) => {
      state.error = null;
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to search jobs';
      });
  },
});

export const { clearJobsError, updateFilters, clearJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
