import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (file, { rejectWithValue, getState }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${API_URL}/upload`, formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  currentResume: null,
  parsedData: null,
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    clearResumeError: (state) => {
      state.error = null;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
      state.parsedData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = {
          id: action.payload.resume_id,
          filename: action.payload.filename,
        };
        state.parsedData = action.payload.parsed_data;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload resume';
      });
  },
});

export const { clearResumeError, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
