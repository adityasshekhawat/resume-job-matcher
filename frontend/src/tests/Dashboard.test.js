import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Dashboard from '../pages/Dashboard';
import { uploadResume } from '../store/slices/resumeSlice';

const mockStore = configureStore([thunk]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      resume: {
        currentResume: null,
        parsedData: null,
        loading: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  const renderDashboard = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders upload button', () => {
    renderDashboard();
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
  });

  test('handles file upload', async () => {
    renderDashboard();
    
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  test('displays parsed resume data', () => {
    store = mockStore({
      resume: {
        currentResume: {
          id: 1,
          filename: 'resume.pdf',
        },
        parsedData: {
          skills: ['JavaScript', 'React'],
          experience: [
            {
              company: 'Tech Corp',
              position: 'Developer',
              period: '2020-2022',
            },
          ],
          education: [
            {
              degree: 'BS Computer Science',
              institution: 'University',
              year: '2020',
            },
          ],
        },
        loading: false,
        error: null,
      },
    });

    renderDashboard();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('BS Computer Science')).toBeInTheDocument();
  });

  test('displays error message', () => {
    store = mockStore({
      resume: {
        currentResume: null,
        parsedData: null,
        loading: false,
        error: 'Failed to upload resume',
      },
    });

    renderDashboard();
    expect(screen.getByText('Failed to upload resume')).toBeInTheDocument();
  });
});
