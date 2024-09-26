// Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login'; // Adjust the path as needed
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import { Context } from '../App'; // Mock Context for testing

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = useNavigate();
  const mockSetLogin = jest.fn();
  
  const mockContextValue = [false, mockSetLogin]; // [login, setLogin]

  beforeEach(() => {
    render(
      <Context.Provider value={mockContextValue}>
        <Login />
      </Context.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders email and password fields', () => {
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('allows typing in email and password fields', () => {
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);

    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    expect(emailInput.value).toBe('test@mail.com');
    expect(passwordInput.value).toBe('12345');
  });

  test('displays an alert when email and password are not filled properly', () => {
    window.alert = jest.fn(); // Mock alert

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith('Please fill properly');
  });

  test('submits the form and logs in successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { email: 'test@mail.com', _id: '1' } }),
      })
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);

    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockSetLogin).toHaveBeenCalledWith(true));

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/users/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(localStorage.getItem('user')).toBe(JSON.stringify({ email: 'test@mail.com', _id: '1' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows an alert when login fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Login failed' }),
      })
    );

    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);

    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    window.alert = jest.fn(); // Mock alert

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Login failed:', expect.anything()));
  });

  test('redirects to home page if already logged in', () => {
    // Mocking that user is already logged in
    render(
      <Context.Provider value={[true, mockSetLogin]}>
        <Login />
      </Context.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
