import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../store/slices/authSlice';
import resumeReducer from '../store/slices/resumeSlice';
import jobsReducer from '../store/slices/jobsSlice';

// Mock store setup
const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    jobs: jobsReducer,
  },
  preloadedState: {
    auth: {
      user: null,
      token: null,
      loading: false,
      error: null,
    },
    resume: {
      resumes: [],
      loading: false,
      error: null,
    },
    jobs: {
      jobs: [],
      loading: false,
      error: null,
    },
  },
});

test('renders app without crashing', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  
  // Verify that the login page content is rendered (since we're not authenticated)
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
