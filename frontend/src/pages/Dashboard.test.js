// Dashboard.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard'; // Adjust the path as needed
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Dashboard Component', () => {
  const mockGetApps = jest.fn();
  const user = { _id: '1', name: 'Test User' };
  
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(user)); // Mocking user in local storage
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clearing mocks after each test
    localStorage.clear(); // Clearing local storage after each test
  });

  test('renders loading spinner when loading is true', () => {
    render(<Dashboard apps={[]} loading={true} getApps={mockGetApps} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner has role="status"
  });

  test('renders "No Apps Found" when no apps are present', () => {
    render(<Dashboard apps={[]} loading={false} getApps={mockGetApps} />);
    
    expect(screen.getByText('No Apps Found')).toBeInTheDocument();
  });

  test('renders app list when apps are present', () => {
    const apps = [
      { _id: '1', name: 'App One', type: 'Type A', creator: '1' },
      { _id: '2', name: 'App Two', type: 'Type B', creator: '1' },
    ];

    render(<Dashboard apps={apps} loading={false} getApps={mockGetApps} />);
    
    expect(screen.getByText('My Apps')).toBeInTheDocument();
    expect(screen.getByText('App One')).toBeInTheDocument();
    expect(screen.getByText('App Two')).toBeInTheDocument();
  });

  test('opens the modal when "Create App" button is clicked', () => {
    const apps = [];
    
    render(<Dashboard apps={apps} loading={false} getApps={mockGetApps} />);
    
    fireEvent.click(screen.getByText('Create App'));
    
    expect(screen.getByText('Create App')).toBeInTheDocument();
  });

  test('handles delete action correctly', async () => {
    const apps = [
      { _id: '1', name: 'App One', type: 'Type A', creator: '1' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'App deleted' }),
      })
    );

    render(<Dashboard apps={apps} loading={false} getApps={mockGetApps} />);

    fireEvent.click(screen.getByText('Delete'));
    
    await waitFor(() => expect(screen.queryByText('App One')).not.toBeInTheDocument());
    expect(mockGetApps).toHaveBeenCalled(); // Ensure getApps is called after deletion
  });

  test('prevents deletion if user is not the creator', async () => {
    const apps = [
      { _id: '1', name: 'App One', type: 'Type A', creator: '2' }, // Different creator ID
    ];

    render(<Dashboard apps={apps} loading={false} getApps={mockGetApps} />);

    window.alert = jest.fn(); // Mocking alert

    fireEvent.click(screen.getByText('Delete'));
    
    expect(window.alert).toHaveBeenCalledWith('You Cannot delete this app');
    expect(screen.getByText('App One')).toBeInTheDocument(); // Ensure app is still present
  });

  test('redirects to login if user is not logged in', () => {
    localStorage.removeItem('user'); // Remove user from local storage
    
    render(<Dashboard apps={[]} loading={false} getApps={mockGetApps} />);
    
    expect(useNavigate).toHaveBeenCalledWith('/login');
  });

  test('filters apps based on search input', () => {
    const apps = [
      { _id: '1', name: 'App One', type: 'Type A', creator: '1' },
      { _id: '2', name: 'App Two', type: 'Type B', creator: '1' },
    ];

    render(<Dashboard apps={apps} loading={false} getApps={mockGetApps} />);
    
    const searchInput = screen.getByPlaceholderText('Find your Apps');
    fireEvent.change(searchInput, { target: { value: 'One' } });

    expect(screen.getByText('App One')).toBeInTheDocument();
    expect(screen.queryByText('App Two')).not.toBeInTheDocument();
  });
});
