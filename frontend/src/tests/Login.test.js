import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Login from '../pages/Login';
import { login } from '../store/slices/authSlice';

const mockStore = configureStore([thunk]);
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    });
    store.dispatch = jest.fn();
  });

  const renderLogin = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  test('displays error message', () => {
    store = mockStore({
      auth: {
        loading: false,
        error: 'Invalid credentials',
        isAuthenticated: false,
      },
    });

    renderLogin();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('redirects when authenticated', () => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        isAuthenticated: true,
      },
    });

    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
