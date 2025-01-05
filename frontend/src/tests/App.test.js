import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  // Verify that the home page content is rendered
  expect(screen.getByText(/Resume Job Matcher/i)).toBeInTheDocument();
});
