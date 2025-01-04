import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumeReducer from './slices/resumeSlice';
import jobsReducer from './slices/jobsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    jobs: jobsReducer,
  },
});

export default store;
