import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Cookies from 'js-cookie';

jest.mock('axios');

describe('Header', () => {
  let setErrorMessage: jest.Mock;

  beforeEach(() => {
    Cookies.remove('id');
    Cookies.remove('email');
    Cookies.remove('token');
    setErrorMessage = jest.fn();
    (axios.post as jest.Mock).mockReset();
  });

  const renderHeader = () => {
    render(
      <MemoryRouter>
        <Header setErrorMessage={setErrorMessage} />
      </MemoryRouter>
    );
  };

  test('Should render the header component', async () => {
    renderHeader();

    expect(screen.getByText('Funny Movies')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login/Register' })).toBeInTheDocument();
  });

  test('Should login successfully when the login API returns OK', async () => {
    const mockResponse = {
      data: {
        data: {
          id: '123',
          email: 'test@example.com',
          token: 'abc123',
        },
      },
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);
    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Login/Register' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Welcome test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Share Video' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  test('Should not change the UI when the login API responds with a failure', async () => {
    const mockError = {
      response: {
        status: 401,
        data: {
          message: "Login failed"
        }
      }
    };
    (axios.post as jest.Mock).mockRejectedValue(mockError);

    renderHeader();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login/Register' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setErrorMessage).toHaveBeenCalledWith('Login failed');
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login/Register' })).toBeInTheDocument();
    });
  });

  test('Should logout when the logout API response is successful', async () => {
    const mockResponse = {
      response: {
        status: 200,
        data: {
          message: "Login failed"
        }
      }
    };
    (axios.post as jest.Mock).mockResolvedValue(mockResponse);

    Cookies.set('id', '123');
    Cookies.set('email', 'test@example.com');
    Cookies.set('token', 'abc123');

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/');
      expect(setErrorMessage).not.toHaveBeenCalled();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login/Register' })).toBeInTheDocument();
    });
  });

  test('Should not log out when the logout API returns a failure', async () => {
    const mockResponse = {
      response: {
        status: 500,
        data: {
          message: "Internal server error"
        }
      }
    };

    (axios.post as jest.Mock).mockRejectedValue(mockResponse);

    Cookies.set('id', '123');
    Cookies.set('email', 'test@example.com');
    Cookies.set('token', 'abc123');

    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('https://e1dc06b594ce46c98593aca2d663a3b0.api.mockbin.io/');
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Welcome test@example.com')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Share Video' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });
});
